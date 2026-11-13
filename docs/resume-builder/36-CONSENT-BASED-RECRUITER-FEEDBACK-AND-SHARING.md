# Resume Builder Capability 11: Consent-Based Recruiter Feedback and Sharing

> Part of the reusable Resume & Career Intelligence capability set for X Cron. This specification is independently scoped but follows the shared platform architecture in [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md#19-cross-capability-architecture-rules).

# Consent-Based Recruiter Feedback and Sharing

**Goal:** Let candidates share a specific resume version and receive useful feedback without giving recruiters control of their profile.

- Sharing is private by default and requires an explicit candidate action.
- Scope each share to one resume version, recipient, permission set and expiry.
- Allow contact-field visibility controls and immediate revocation.
- Recruiter view is read-only; feedback is structured around clarity, relevance, evidence and presentation.
- Candidate decides whether to accept feedback and create a new resume version.
- Use high-entropy, hashed share tokens, access logs, rate limits and anti-enumeration protections.
- Acceptance: recruiters cannot mutate candidate facts or access other resume versions.
