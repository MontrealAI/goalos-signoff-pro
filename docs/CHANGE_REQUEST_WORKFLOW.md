# Change-request Workflow

The core commercial workflow is not just upload → accept. It must support revision loops.

1. Reviewer or client requests changes.
2. Change request names missing evidence, criterion gap, or limitation.
3. Builder submits a new revision.
4. Prior revision remains preserved.
5. Client accepts one exact version.
6. Mission Receipt binds that accepted version only.

The SQL tables in `SUPABASE_PRO_ADDONS.sql` model this workflow.
