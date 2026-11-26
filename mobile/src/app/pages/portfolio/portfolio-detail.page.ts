import type { OnInit } from '@angular/core';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';

import type {
  PortfolioComponentDefinition,
  PortfolioDocument,
  PortfolioSection,
  PortfolioSiteSummary,
  PortfolioTheme,
  PortfolioValidationIssue,
} from '../../core/models/portfolio.model';
import { PortfolioService } from '../../core/services/portfolio.service';
import { friendlyHttpMessage } from '../../core/utils/friendly-http-message';
import { PortfolioRendererComponent } from '../../shared/portfolio-renderer/portfolio-renderer.component';
import { ListSkeletonComponent } from '../../shared/skeleton/list-skeleton.component';

import {
  cloneDocument,
  createSection,
  editorId,
  localizedForEdit,
  moveItem,
  sectionIssueMap,
  setLocalizedValue,
} from './portfolio-editor.utils';
import { PortfolioLayersSheetComponent } from './portfolio-layers-sheet.component';
import { PortfolioPropsSheetComponent } from './portfolio-props-sheet.component';
import { PortfolioSectionPickerComponent } from './portfolio-section-picker.component';
import { PortfolioThemeSheetComponent } from './portfolio-theme-sheet.component';

type EditorMode = 'canvas' | 'preview';

@Component({
  selector: 'app-portfolio-detail',
  imports: [
    FormsModule,
    IonBackButton,
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonModal,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar,
    PortfolioRendererComponent,
    ListSkeletonComponent,
    PortfolioPropsSheetComponent,
    PortfolioThemeSheetComponent,
    PortfolioSectionPickerComponent,
    PortfolioLayersSheetComponent,
  ],
  templateUrl: './portfolio-detail.page.html',
  styleUrl: './portfolio-detail.page.scss',
})
export class PortfolioDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly portfolio = inject(PortfolioService);
  private readonly toastCtrl = inject(ToastController);

  private siteId = '';
  private readonly history = signal<PortfolioDocument[]>([]);
  private readonly future = signal<PortfolioDocument[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly publishing = signal(false);
  readonly validating = signal(false);
  readonly dirty = signal(false);
  readonly site = signal<PortfolioSiteSummary | null>(null);
  readonly draft = signal<PortfolioDocument | null>(null);
  readonly components = signal<PortfolioComponentDefinition[]>([]);
  readonly mode = signal<EditorMode>('canvas');
  readonly selectedId = signal<string | null>(null);
  readonly activeLocale = signal('en-IN');
  readonly issues = signal<PortfolioValidationIssue[]>([]);

  readonly showProps = signal(false);
  readonly showTheme = signal(false);
  readonly showPicker = signal(false);
  readonly showLayers = signal(false);
  private readonly insertAt = signal<number | null>(null);

  readonly sections = computed(() => this.draft()?.pages[0]?.sections ?? []);
  readonly selectedSection = computed(
    () => this.sections().find((section) => section.id === this.selectedId()) ?? null,
  );
  readonly selectedDefinition = computed(() => {
    const type = this.selectedSection()?.type;
    return this.components().find((component) => component.type === type) ?? null;
  });
  readonly localeOptions = computed(() => this.draft()?.site.locales ?? []);
  readonly issueMap = computed(() => sectionIssueMap(this.issues()));
  readonly errorCount = computed(() => this.issues().filter((issue) => issue.severity === 'error').length);
  readonly canUndo = computed(() => this.history().length > 0);
  readonly canRedo = computed(() => this.future().length > 0);

  async ngOnInit(): Promise<void> {
    this.siteId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.siteId) {
      this.loading.set(false);
      return;
    }
    const [definitions] = await Promise.all([
      this.portfolio.listComponents().catch(() => [] as PortfolioComponentDefinition[]),
      this.load(false),
    ]);
    this.components.set(definitions);
  }

  async load(resetSelection = true): Promise<void> {
    this.loading.set(true);
    try {
      const res = await this.portfolio.loadDraft(this.siteId);
      this.site.set(res.site);
      this.draft.set(res.document);
      this.activeLocale.set(res.document.site.defaultLocale || 'en-IN');
      if (resetSelection) {
        this.selectedId.set(res.document.pages[0]?.sections?.[0]?.id ?? null);
      }
      this.dirty.set(false);
      this.issues.set([]);
      this.history.set([]);
      this.future.set([]);
    } catch (err) {
      await this.toast(friendlyHttpMessage(err, 'Could not load portfolio.'), true);
    } finally {
      this.loading.set(false);
    }
  }

  private mutate(update: (document: PortfolioDocument) => void): void {
    const current = this.draft();
    if (!current) return;
    const previous = cloneDocument(current);
    const next = cloneDocument(current);
    update(next);
    this.history.set([...this.history().slice(-39), previous]);
    this.future.set([]);
    this.draft.set(next);
    this.dirty.set(true);
    this.issues.set([]);
  }

  undo(): void {
    const previous = this.history().at(-1);
    const current = this.draft();
    if (!previous || !current) return;
    this.future.set([...this.future(), cloneDocument(current)]);
    this.history.set(this.history().slice(0, -1));
    this.draft.set(previous);
    this.dirty.set(true);
  }

  redo(): void {
    const next = this.future().at(-1);
    const current = this.draft();
    if (!next || !current) return;
    this.history.set([...this.history(), cloneDocument(current)]);
    this.future.set(this.future().slice(0, -1));
    this.draft.set(next);
    this.dirty.set(true);
  }

  async save(): Promise<boolean> {
    const current = this.draft();
    const site = this.site();
    if (!current || !site || !this.dirty()) return true;
    this.saving.set(true);
    try {
      const result = await this.portfolio.saveDraft(this.siteId, current, site.revision);
      this.site.set(result.site);
      this.dirty.set(false);
      await this.toast('Draft saved.');
      return true;
    } catch (err) {
      const status = (err as { status?: number })?.status;
      await this.toast(
        status === 409
          ? 'This draft changed elsewhere. Reload before saving.'
          : friendlyHttpMessage(err, 'Save failed. Please try again.'),
        true,
      );
      return false;
    } finally {
      this.saving.set(false);
    }
  }

  async validate(showToast = true): Promise<boolean> {
    const current = this.draft();
    if (!current) return false;
    this.validating.set(true);
    try {
      const result = await this.portfolio.validateDraft(this.siteId, current);
      this.issues.set([...result.errors, ...result.warnings, ...result.suggestions]);
      if (showToast) {
        await this.toast(
          result.ok
            ? 'No blocking issues found.'
            : `${result.errors.length} issue${result.errors.length === 1 ? '' : 's'} to fix before publishing.`,
          !result.ok,
        );
      }
      return result.ok;
    } catch (err) {
      await this.toast(friendlyHttpMessage(err, 'Validation failed.'), true);
      return false;
    } finally {
      this.validating.set(false);
    }
  }

  async publish(): Promise<void> {
    if (!(await this.save())) return;
    if (!(await this.validate(false))) return;
    this.publishing.set(true);
    try {
      await this.portfolio.publish(this.siteId);
      await this.load(false);
      await this.toast('Portfolio published!');
    } catch (err) {
      await this.toast(friendlyHttpMessage(err, 'Publish failed. Fix validation issues first.'), true);
    } finally {
      this.publishing.set(false);
    }
  }

  openPicker(index?: number): void {
    this.insertAt.set(index ?? this.sections().length);
    this.showPicker.set(true);
  }

  onPickSection(type: string): void {
    const definition = this.components().find((component) => component.type === type);
    if (!definition) return;
    const section = createSection(definition, this.activeLocale());
    const index = this.insertAt() ?? this.sections().length;
    this.mutate((document) => {
      const sections = document.pages[0]?.sections ?? [];
      sections.splice(index, 0, section);
      if (type !== 'hero' && type !== 'custom-code') {
        document.navigation.push({
          id: editorId('nav'),
          label: setLocalizedValue(undefined, this.activeLocale(), definition.label),
          target: `#${section.id}`,
        });
      }
    });
    this.selectedId.set(section.id);
    this.showPicker.set(false);
    this.showProps.set(true);
  }

  openProps(sectionId: string): void {
    this.selectedId.set(sectionId);
    this.showProps.set(true);
  }

  onPropsSave(section: PortfolioSection): void {
    this.mutate((document) => {
      const sections = document.pages[0]?.sections ?? [];
      const index = sections.findIndex((item) => item.id === section.id);
      if (index >= 0) sections[index] = section;
    });
    this.showProps.set(false);
  }

  onThemeApply(theme: PortfolioTheme): void {
    this.mutate((document) => {
      document.theme = theme;
    });
    this.showTheme.set(false);
  }

  onSectionSelect(sectionId: string): void {
    this.selectedId.set(sectionId);
  }

  onReorder(event: { fromIndex: number; toIndex: number }): void {
    this.mutate((document) => {
      const page = document.pages[0];
      if (!page) return;
      page.sections = moveItem(page.sections, event.fromIndex, event.toIndex);
    });
  }

  moveSelected(offset: number): void {
    const index = this.sections().findIndex((item) => item.id === this.selectedId());
    if (index < 0) return;
    const target = index + offset;
    if (target < 0 || target >= this.sections().length) return;
    this.onReorder({ fromIndex: index, toIndex: target });
  }

  duplicateSelected(): void {
    const section = this.selectedSection();
    if (!section) return;
    const copy: PortfolioSection = JSON.parse(JSON.stringify(section)) as PortfolioSection;
    copy.id = editorId(section.type);
    const index = this.sections().findIndex((item) => item.id === section.id);
    this.mutate((document) => {
      const sections = document.pages[0]?.sections ?? [];
      sections.splice(index + 1, 0, copy);
      if (copy.type !== 'hero' && copy.type !== 'custom-code') {
        document.navigation.push({
          id: editorId('nav'),
          label: setLocalizedValue(undefined, this.activeLocale(), copy.type),
          target: `#${copy.id}`,
        });
      }
    });
    this.selectedId.set(copy.id);
  }

  deleteSelected(): void {
    const id = this.selectedId();
    if (!id) return;
    this.mutate((document) => {
      const page = document.pages[0];
      if (!page) return;
      page.sections = page.sections.filter((section) => section.id !== id);
      document.navigation = document.navigation.filter((item) => item.target !== `#${id}`);
    });
    this.selectedId.set(this.sections()[0]?.id ?? null);
  }

  toggleSelectedHidden(): void {
    const id = this.selectedId();
    if (id) this.toggleSectionHidden(id);
  }

  toggleSectionHidden(id: string): void {
    this.mutate((document) => {
      const section = document.pages[0]?.sections?.find((item) => item.id === id);
      if (section) section.hidden = !section.hidden;
    });
  }

  onLayerMove(event: { index: number; offset: number }): void {
    this.mutate((document) => {
      const page = document.pages[0];
      if (!page) return;
      page.sections = moveItem(page.sections, event.index, event.index + event.offset);
    });
  }

  onLayersPick(sectionId: string): void {
    this.showLayers.set(false);
    this.openProps(sectionId);
  }

  onEditRequest(event: { sectionId: string; propKey: string; value: string }): void {
    this.mutate((document) => {
      const section = document.pages[0]?.sections?.find((item) => item.id === event.sectionId);
      if (!section) return;
      const current = section.props[event.propKey];
      section.props[event.propKey] =
        current && typeof current === 'object' && !Array.isArray(current)
          ? setLocalizedValue(current, this.activeLocale(), event.value)
          : event.value;
    });
  }

  onRowEditRequest(event: {
    sectionId: string;
    fieldKey: string;
    rowIndex: number;
    propKey: string;
    value: string;
  }): void {
    this.mutate((document) => {
      const section = document.pages[0]?.sections?.find((item) => item.id === event.sectionId);
      if (!section) return;
      const rows = section.props[event.fieldKey];
      if (!Array.isArray(rows)) return;
      const row = rows[event.rowIndex] as Record<string, unknown> | undefined;
      if (!row) return;
      const current = row[event.propKey];
      row[event.propKey] =
        current && typeof current === 'object' && !Array.isArray(current)
          ? setLocalizedValue(current, this.activeLocale(), event.value)
          : event.value;
    });
  }

  onListEditRequest(event: { sectionId: string; fieldKey: string; index: number; value: string }): void {
    this.mutate((document) => {
      const section = document.pages[0]?.sections?.find((item) => item.id === event.sectionId);
      if (!section) return;
      const items = section.props[event.fieldKey];
      if (!Array.isArray(items)) return;
      items[event.index] = event.value;
    });
  }

  onNavEditRequest(event: { id: string; label: string }): void {
    this.mutate((document) => {
      const item = document.navigation.find((nav) => nav.id === event.id);
      if (!item) return;
      item.label = setLocalizedValue(item.label, this.activeLocale(), event.label);
    });
  }

  async onBrandEdit(event: { name: string }): Promise<void> {
    if (!event.name.trim()) return;
    const current = this.draft();
    if (!current) return;
    this.mutate((document) => {
      document.site = { ...document.site, name: event.name };
    });
    try {
      this.site.set(await this.portfolio.updateSite(this.siteId, { name: event.name }));
    } catch (err) {
      await this.toast(friendlyHttpMessage(err, 'Could not rename portfolio.'), true);
    }
  }

  localeValue(value: unknown): string {
    return localizedForEdit(value, this.activeLocale());
  }

  private async toast(message: string, error = false): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2600,
      position: 'bottom',
      cssClass: error ? ['xcron-toast', 'xcron-toast--error'] : ['xcron-toast', 'xcron-toast--success'],
    });
    await toast.present();
  }
}
