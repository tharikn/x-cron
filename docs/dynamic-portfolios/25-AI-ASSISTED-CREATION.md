# AI-Assisted Creation

## Principle
AI accelerates content preparation and design exploration. It is not the source of truth for professional identity.

## Optional capabilities
- Generate first draft from supplied profile data
- Suggest section order
- Rewrite for clarity/tone
- Suggest project descriptions
- Generate SEO metadata
- Suggest template
- Detect missing sections
- Suggest accessibility improvements
- Suggest visual style

## Grounding
AI input is limited to user-provided data, existing portfolio JSON and selected template/component metadata.

AI must not invent employment, education, clients, awards, metrics, skills, certifications or URLs.

## Output
AI returns structured proposals, not executable HTML.

Example:
{
  "proposalType": "updateComponent",
  "targetId": "hero-1",
  "changes": {
    "headline": {
      "en-IN": "..."
    }
  },
  "reason": "..."
}

User must accept/reject proposals.

## Cost and safety
AI is asynchronous where possible. Repeated suggestions can be cached. Ordinary save/render/publish never calls AI. Provider adapters and quotas are required.

Imported portfolio content is untrusted data and must never control platform tools or system instructions.

## Acceptance
A complete portfolio can be created and published when all AI providers are disabled.
