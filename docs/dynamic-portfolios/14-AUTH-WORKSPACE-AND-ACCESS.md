# Authentication, Workspace and Access

## Identity

Reuse X Cron identity where practical. Do not duplicate the core password/authentication system.

## Workspace

Workspace owns portfolios, templates/entitlements, domains, media, analytics and plan state.

## Roles

OWNER, EDITOR and VIEWER. Additional specialized roles can be added later.

## Authorization

Every editor API checks authentication, workspace membership, role, resource ownership and site state.

## Public access

Published sites are public unless explicitly configured as private/unpublished.

## Preview

Preview tokens are short-lived, scoped to site/version, revocable and never equivalent to editor authorization.

## Audit events

Record create, edit, publish, unpublish, rollback, domain changes and collaborator changes.
