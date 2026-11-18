# Module 04 — Profile & Vehicle Onboarding UI/UX Prompt

## Goal

Create a simple, mobile-first onboarding flow suitable for drivers and lorry owners who may have limited technical familiarity.

## Flow

### Step 1 — Account
- Mobile/username
- Password
- Confirm password

### Step 2 — Role
- Driver
- Vehicle Owner
- Book Transport

### Step 3 — Profile
Show only fields relevant to the selected role.

### Step 4 — Vehicle
Only for owners.
- registration number
- vehicle details
- documents

### Step 5 — Verification
Show:
- Verification in progress
- Verified
- Needs correction
- Manual review
- Provider temporarily unavailable

### Step 6 — Completion
Show profile completeness and what the user can do next.

## UX rules

- One primary action per screen.
- Use progressive disclosure.
- Avoid large forms where possible.
- Save draft automatically.
- Show step progress.
- Never clear valid fields because another field failed.
- Preserve user input after network failures.
- Use clear Indian number/date formats.
- Use camera/document upload on mobile.
- Compress images before upload where appropriate.
- Show document expiry prominently.
- Provide "Why do we need this?" for sensitive information.
- Do not use technical provider errors in user-facing messages.

## Validation messages

Bad:
- "Invalid input."

Good:
- "Enter a valid vehicle registration number, for example TN38AB1234."

Bad:
- "Verification failed: 422."

Good:
- "We could not verify this vehicle right now. Check the registration number or try again later."

## Accessibility

- keyboard accessible;
- screen-reader labels;
- adequate touch targets;
- visible focus;
- error summary for long forms;
- no color-only status indicators;
- support localization from the beginning.

## Document upload

For each document:
- accepted formats configurable;
- maximum file size configurable;
- preview;
- replace;
- remove;
- expiry date;
- verification state.

Reject:
- executable files;
- unsupported formats;
- oversized files;
- obviously invalid/empty files.

## Client/server validation contract

Every form should have a shared validation schema where practical, but server validation remains authoritative.

Test:
- empty values;
- whitespace;
- Unicode;
- very long values;
- invalid dates;
- duplicate registration number;
- duplicate mobile;
- malformed vehicle number;
- expired documents;
- provider timeout;
- retry after failure.

## Acceptance criteria

A non-technical user should be able to complete onboarding without understanding RTO/API terminology.
