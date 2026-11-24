# Publishing, Versioning and Rollback

## State machine

DRAFT -> VALIDATING -> READY -> PUBLISHING -> PUBLISHED

Failure returns to a safe ready/error state while the current public version remains intact.

## Published version

Every publish creates an immutable:
- version ID
- site ID
- JSON snapshot
- template version
- schema version
- SEO snapshot
- asset references
- timestamp
- actor
- checksum

## Transaction

1. Claim publish operation.
2. Validate schema.
3. Validate components.
4. Validate assets.
5. Validate locale fallback.
6. Validate routes.
7. Validate SEO.
8. Create immutable version.
9. Generate derived artifacts.
10. Update routing/cache.
11. Warm important URLs.
12. Mark successful.

## Idempotency

Publish requires an idempotency key. Retrying the same operation cannot create duplicate publishes.

## Rollback

Rollback creates a new publish version from the selected historical snapshot. History is immutable.

## Unpublish

Remove public routing while retaining versions according to retention policy.

## Draft recovery

Keep autosave revisions or a revision log so accidental refreshes do not lose committed edits.
