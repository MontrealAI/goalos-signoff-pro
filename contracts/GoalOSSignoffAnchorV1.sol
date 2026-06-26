// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

/// @title GoalOS Signoff Anchor V1
/// @notice Non-custodial registry for anchoring GoalOS Mission Receipts.
/// @dev Stores receipt hashes and public CIDs only. It does not hold ETH, ERC20s, AGIALPHA, escrow, or user funds.
contract GoalOSSignoffAnchorV1 {
    struct AnchorRecord {
        bytes32 publicIdHash;
        bytes32 receiptHash;
        bytes32 receiptCidHash;
        bytes32 evidenceRoot;
        address serviceSigner;
        address anchoredBy;
        uint64 acceptedAt;
        uint64 anchoredAt;
        uint64 revokedAt;
        string receiptCid;
        string evidenceCid;
        bytes32 revocationReasonHash;
    }

    address public owner;
    address public pendingOwner;
    uint256 public immutable deployedChainId;
    bytes32 public immutable deploymentSalt;
    bool public paused;

    mapping(address => bool) public serviceSigner;
    mapping(address => bool) public registrarAllowed;
    mapping(bytes32 => AnchorRecord) private _anchors;
    uint256 public totalAnchors;

    event OwnershipTransferStarted(address indexed previousOwner, address indexed pendingOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event ServiceSignerUpdated(address indexed signer, bool allowed);
    event PausedUpdated(bool paused);
    event RegistrarAllowed(address indexed registrar, bool allowed);
    event Paused(bool paused);
    event ReceiptAnchored(bytes32 indexed receiptHash, bytes32 indexed publicIdHash, address indexed serviceSigner, string receiptCid, string evidenceCid, uint64 acceptedAt, address anchoredBy);
    event ReceiptRevoked(bytes32 indexed receiptHash, bytes32 indexed reasonHash, address indexed serviceSigner, uint64 revokedAt);

    error GoalOSNotOwner();
    error GoalOSZeroAddress();
    error GoalOSZeroHash();
    error GoalOSBadSignature();
    error GoalOSSignerNotAllowed();
    error GoalOSAlreadyAnchored();
    error GoalOSNotAnchored();
    error GoalOSAlreadyRevoked();
    error GoalOSUriTooLong();
    error GoalOSNativeFundsRejected();
    error GoalOSPaused();
    error GoalOSRegistrarNotAllowed();

    modifier onlyOwner() {
        if (msg.sender != owner) revert GoalOSNotOwner();
        _;
    }

    modifier onlyRegistrar() {
        if (msg.sender != owner && !registrarAllowed[msg.sender]) revert GoalOSRegistrarNotAllowed();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert GoalOSPaused();
        _;
    }

    constructor(address initialOwner, address initialServiceSigner, bytes32 salt_) {
        if (initialOwner == address(0) || initialServiceSigner == address(0)) revert GoalOSZeroAddress();
        owner = initialOwner;
        serviceSigner[initialServiceSigner] = true;
        registrarAllowed[initialServiceSigner] = true;
        deployedChainId = block.chainid;
        deploymentSalt = salt_;
        emit OwnershipTransferred(address(0), initialOwner);
        emit ServiceSignerUpdated(initialServiceSigner, true);
        emit RegistrarAllowed(initialServiceSigner, true);
    }

    receive() external payable { revert GoalOSNativeFundsRejected(); }
    fallback() external payable { revert GoalOSNativeFundsRejected(); }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert GoalOSZeroAddress();
        pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner, newOwner);
    }

    function acceptOwnership() external {
        if (msg.sender != pendingOwner) revert GoalOSNotOwner();
        address previous = owner;
        owner = pendingOwner;
        pendingOwner = address(0);
        emit OwnershipTransferred(previous, owner);
    }

    function setServiceSigner(address signer, bool allowed) external onlyOwner {
        if (signer == address(0)) revert GoalOSZeroAddress();
        serviceSigner[signer] = allowed;
        emit ServiceSignerUpdated(signer, allowed);
    }

    function setRegistrarAllowed(address registrar, bool allowed) external onlyOwner {
        if (registrar == address(0)) revert GoalOSZeroAddress();
        registrarAllowed[registrar] = allowed;
        emit RegistrarAllowed(registrar, allowed);
    }

    function setPaused(bool paused_) external onlyOwner {
        paused = paused_;
        emit Paused(paused_);
    }

    function anchorReceipt(
        bytes32 receiptHash,
        bytes32 publicIdHash,
        bytes32 evidenceRoot,
        string calldata receiptCid,
        string calldata evidenceCid,
        uint64 acceptedAt,
        bytes calldata signature
    ) external onlyRegistrar whenNotPaused returns (bytes32 anchorId) {
        if (receiptHash == bytes32(0) || publicIdHash == bytes32(0) || evidenceRoot == bytes32(0)) revert GoalOSZeroHash();
        if (bytes(receiptCid).length > 256 || bytes(evidenceCid).length > 256) revert GoalOSUriTooLong();
        if (_anchors[receiptHash].anchoredAt != 0) revert GoalOSAlreadyAnchored();
        address signer = _recoverAnchorSigner(receiptHash, publicIdHash, evidenceRoot, receiptCid, evidenceCid, acceptedAt, signature);
        AnchorRecord storage record = _anchors[receiptHash];
        record.publicIdHash = publicIdHash;
        record.receiptHash = receiptHash;
        record.receiptCidHash = keccak256(bytes(receiptCid));
        record.evidenceRoot = evidenceRoot;
        record.serviceSigner = signer;
        record.anchoredBy = msg.sender;
        record.acceptedAt = acceptedAt;
        record.anchoredAt = uint64(block.timestamp);
        record.receiptCid = receiptCid;
        record.evidenceCid = evidenceCid;
        totalAnchors += 1;
        emit ReceiptAnchored(receiptHash, publicIdHash, signer, receiptCid, evidenceCid, acceptedAt, msg.sender);
        return receiptHash;
    }

    function revokeReceipt(bytes32 receiptHash, bytes32 reasonHash, bytes calldata signature) external onlyRegistrar whenNotPaused {
        if (receiptHash == bytes32(0) || reasonHash == bytes32(0)) revert GoalOSZeroHash();
        AnchorRecord storage record = _anchors[receiptHash];
        if (record.anchoredAt == 0) revert GoalOSNotAnchored();
        if (record.revokedAt != 0) revert GoalOSAlreadyRevoked();
        bytes32 payload = revocationPayloadHash(receiptHash, reasonHash);
        address signer = _recover(_ethSignedMessageHash(payload), signature);
        if (!serviceSigner[signer]) revert GoalOSSignerNotAllowed();
        record.revokedAt = uint64(block.timestamp);
        record.revocationReasonHash = reasonHash;
        emit ReceiptRevoked(receiptHash, reasonHash, signer, uint64(block.timestamp));
    }

    function anchorOf(bytes32 receiptHash) external view returns (AnchorRecord memory) {
        return _anchors[receiptHash];
    }

    function isAnchored(bytes32 receiptHash) external view returns (bool) {
        return _anchors[receiptHash].anchoredAt != 0 && _anchors[receiptHash].revokedAt == 0;
    }

    function _recoverAnchorSigner(bytes32 receiptHash, bytes32 publicIdHash, bytes32 evidenceRoot, string calldata receiptCid, string calldata evidenceCid, uint64 acceptedAt, bytes calldata signature) internal view returns (address signer) {
        bytes32 payload = anchorPayloadHash(receiptHash, publicIdHash, evidenceRoot, keccak256(bytes(receiptCid)), keccak256(bytes(evidenceCid)), acceptedAt);
        signer = _recover(_ethSignedMessageHash(payload), signature);
        if (!serviceSigner[signer]) revert GoalOSSignerNotAllowed();
    }

    function anchorPayloadHash(bytes32 receiptHash, bytes32 publicIdHash, bytes32 evidenceRoot, bytes32 receiptCidHash, bytes32 evidenceCidHash, uint64 acceptedAt) public view returns (bytes32) {
        return keccak256(abi.encode("GOALOS_SIGNOFF_ANCHOR_V1", block.chainid, address(this), deploymentSalt, receiptHash, publicIdHash, evidenceRoot, receiptCidHash, evidenceCidHash, acceptedAt));
    }

    function revocationPayloadHash(bytes32 receiptHash, bytes32 reasonHash) public view returns (bytes32) {
        return keccak256(abi.encode("GOALOS_SIGNOFF_REVOKE_V1", block.chainid, address(this), deploymentSalt, receiptHash, reasonHash));
    }

    function _ethSignedMessageHash(bytes32 payload) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", payload));
    }

    function _recover(bytes32 digest, bytes calldata sig) internal pure returns (address) {
        if (sig.length != 65) revert GoalOSBadSignature();
        bytes32 r; bytes32 s; uint8 v;
        assembly {
            r := calldataload(sig.offset)
            s := calldataload(add(sig.offset, 32))
            v := byte(0, calldataload(add(sig.offset, 64)))
        }
        if (v < 27) v += 27;
        if (v != 27 && v != 28) revert GoalOSBadSignature();
        bytes32 maxS = 0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0;
        if (uint256(s) > uint256(maxS)) revert GoalOSBadSignature();
        address recovered = ecrecover(digest, v, r, s);
        if (recovered == address(0)) revert GoalOSBadSignature();
        return recovered;
    }


    }