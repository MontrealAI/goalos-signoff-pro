# Receipt Verification Guide

A Mission Receipt records the accepted version of a work package.

The public verifier page accepts demo receipt JSON and checks:

- required fields;
- receipt public ID;
- decision state;
- hash field shape;
- replay-ready structure.

Production receipt verification can connect the same public interface to the signed receipt backend and optional verification anchors.
