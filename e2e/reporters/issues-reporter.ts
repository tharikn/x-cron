import fs from 'node:fs';
import path from 'node:path';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

type Issue = {
  title: string;
  project: string;
  status: string;
  error?: string;
  file: string;
};

/** Traditional apps ship a failure digest — this writes e2e/test-results/ISSUES.md */
class IssuesReporter implements Reporter {
  private issues: Issue[] = [];
  private passed = 0;
  private skipped = 0;
  private outDir = path.join(__dirname, '..', 'test-results');

  onBegin(_config: FullConfig, _suite: Suite): void {
    fs.mkdirSync(this.outDir, { recursive: true });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status === 'passed') {
      this.passed += 1;
      return;
    }
    if (result.status === 'skipped') {
      this.skipped += 1;
      return;
    }
    this.issues.push({
      title: test.title,
      project: test.parent.project()?.name || 'unknown',
      status: result.status,
      error: result.error?.message?.split('\n')[0] || result.error?.value,
      file: test.location.file.replace(/\\/g, '/'),
    });
  }

  onEnd(_result: FullResult): void {
    const lines: string[] = [
      '# X Cron Playwright — issues digest',
      '',
      `Generated: ${new Date().toISOString()}`,
      '',
      `| Metric | Count |`,
      `| --- | ---: |`,
      `| Passed | ${this.passed} |`,
      `| Failed / timed out / interrupted | ${this.issues.length} |`,
      `| Skipped | ${this.skipped} |`,
      '',
    ];

    if (!this.issues.length) {
      lines.push('No failing journeys. Open `playwright-report/index.html` for the full run.');
    } else {
      lines.push('## Failures');
      lines.push('');
      lines.push(
        'Traditional handling: triage these like a QA defect list — reopen traces under `test-results/`, fix product or selector, re-run `npm run test:e2e`.',
      );
      lines.push('');
      for (const [i, issue] of this.issues.entries()) {
        lines.push(`### ${i + 1}. [${issue.project}] ${issue.title}`);
        lines.push(`- **Status:** ${issue.status}`);
        lines.push(`- **Spec:** \`${issue.file}\``);
        if (issue.error) lines.push(`- **Error:** ${issue.error}`);
        lines.push('');
      }
    }

    lines.push('## How traditional apps use this');
    lines.push('');
    lines.push('- **Smoke on PR** — `@smoke` / critical path only.');
    lines.push('- **Nightly full journeys** — this suite (option C).');
    lines.push('- **Artifacts** — HTML report + trace/screenshot/video on failure.');
    lines.push('- **Defect list** — this ISSUES.md (or Jira import from JSON).');
    lines.push('');

    const out = path.join(this.outDir, 'ISSUES.md');
    fs.writeFileSync(out, lines.join('\n'), 'utf8');
    // eslint-disable-next-line no-console
    console.log(`\nIssues digest → ${out}\n`);
  }
}

export default IssuesReporter;
