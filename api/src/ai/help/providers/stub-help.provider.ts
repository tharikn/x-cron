import { HelpChatProvider, HelpChatTurn } from '../help-chat.types';
import { HELP_CHAT_WELCOME } from '../prompts/help-chat.prompt';

/** Zero-cost canned replies when LLM is off — still auth + rate limited. */
export class StubHelpProvider implements HelpChatProvider {
  readonly id = 'stub';

  async chat(input: {
    system: string;
    history: HelpChatTurn[];
    message: string;
    maxTokens: number;
  }): Promise<{ reply: string; tokensUsed: number; provider: string }> {
    const q = input.message.toLowerCase();
    let reply = HELP_CHAT_WELCOME;

    if (/sign.?in|login|account|register|password|google/.test(q)) {
      reply =
        'Open Sign in (web drawer or mobile Profile tab). Create account with username + password (Job Seeker or Recruiter), or use Google. Guests can browse jobs without signing in.';
    } else if (/apply|application|profile|skill|cv|resume/.test(q)) {
      reply =
        'Sign in, build an Apply profile (skills badges — no CV), then open a job and use Easy apply. Track progress under Applied jobs / Activity.';
    } else if (/save|saved|bookmark/.test(q)) {
      reply =
        'On a job, tap Save. Signed-in users find Saved jobs in the drawer (web) or Settings → Saved (mobile).';
    } else if (/post|recruit|employer|hire|publish/.test(q)) {
      reply =
        'Create/sign in as Recruiter, then open Post. Fill the form, preview, and publish. Review applicants from My Jobs / employer applications.';
    } else if (/notif|alert|push|bell/.test(q)) {
      reply =
        'After sign-in, open Notifications for your inbox. Alert channel toggles live under Settings → Preferences.';
    } else if (/language|tamil|prefs|preference|setting/.test(q)) {
      reply =
        'Open Settings for Language and (when signed in) Preferences. Sync needs a signed-in account.';
    } else if (/app|android|apk|download|install/.test(q)) {
      reply =
        'Use Get the app on the site (or drawer) to download the Android APK from GitHub Releases and sideload it.';
    } else if (/search|discover|filter|remote|salary|job/.test(q)) {
      reply =
        'On Home / Discover, search by keyword and filters (salary, remote, posted within, walk-in). Job cards open full detail with employer contact.';
    } else if (/help|hi|hello|hey|what can/.test(q)) {
      reply = HELP_CHAT_WELCOME;
    } else {
      reply =
        'I only help with using X Cron Jobs — try asking about search, apply, posting jobs, notifications, or settings.';
    }

    const tokensUsed = Math.ceil((input.message.length + reply.length) / 4);
    return { reply, tokensUsed, provider: this.id };
  }
}
