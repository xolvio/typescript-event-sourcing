# Optimistic Client

The optimistic client attempts to keep a set of projections up-to-date with locally executed commands (which are also sent to the server)

Parts:

  1. The set of projections & their subscriptions
  2. A mechanism for executing commands locally
  3. A mechanism for notifying consumers of the projections that they have changed