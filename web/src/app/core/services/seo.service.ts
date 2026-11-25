import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import type { Job } from '../models/job.model';
import type { PortfolioDocument } from '../models/portfolio.model';
import { localizedValue } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  setPage(input: {
    title: string;
    description: string;
    path: string;
    robots?: string;
  }): void {
    const fullTitle =
      input.title && input.title !== environment.siteName
        ? `${environment.siteName} · ${input.title}`
        : environment.siteName;
    const url = `${environment.siteUrl}${input.path}`;
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: input.description });
    this.meta.updateTag({ name: 'robots', content: input.robots ?? 'index,follow' });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: input.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.setCanonical(url);
    this.clearJsonLd();
  }

  setJob(job: Job): void {
    const path = `/jobs/${job.slug}`;
    const location = [job.location.locality, job.location.city, job.location.state]
      .filter(Boolean)
      .join(', ');
    const description = `${job.title} at ${job.employerName} in ${location}. ${job.description.about}`.slice(
      0,
      160,
    );
    this.setPage({
      title: `${job.title} in ${job.location.city}`,
      description,
      path,
    });
    this.setJsonLd(this.jobPostingSchema(job, `${environment.siteUrl}${path}`));
  }

  /** Set SEO metadata for a portfolio site from its document. */
  setPortfolio(document: PortfolioDocument, slug: string): void {
    const path = `/p/${slug}`;
    const defaultLocale = document.site.defaultLocale;
    const activeLocale = document.site.locales?.[0] ?? defaultLocale;
    const page = document.pages[0];
    const title =
      localizedValue(page?.seo.title, activeLocale, defaultLocale) ||
      `${environment.siteName} · Portfolio`;
    const description =
      localizedValue(page?.seo.description, activeLocale, defaultLocale) ||
      `Portfolio of ${document.site.name}`;
    this.setPage({
      title,
      description,
      path,
      robots: 'index,follow',
    });
    this.setStructuredData(this.portfolioJsonLd(document, `${environment.siteUrl}${path}`));
  }

  /** Replace the page JSON-LD block. Additive — existing job SEO is unchanged. */
  setStructuredData(data: Record<string, unknown>): void {
    this.setJsonLd(data);
  }

  /** Update just the social-share image without touching the rest of the tags. */
  setSocialImage(url: string): void {
    if (!url) return;
    this.meta.updateTag({ property: 'og:image', content: url });
    this.meta.updateTag({ name: 'twitter:image', content: url });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private clearJsonLd(): void {
    this.document
      .querySelectorAll('script[data-xcron-jsonld="1"]')
      .forEach((node) => node.remove());
  }

  private setJsonLd(data: Record<string, unknown>): void {
    this.clearJsonLd();
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-xcron-jsonld', '1');
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  private jobPostingSchema(job: Job, url: string): Record<string, unknown> {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.title,
      description: job.description.about,
      datePosted: job.publishedAt,
      validThrough: job.expiresAt,
      employmentType: this.mapEmploymentType(job.jobType),
      hiringOrganization: {
        '@type': 'Organization',
        name: job.employerName,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: job.location.city,
          addressRegion: job.location.state,
          addressCountry: job.location.country,
        },
      },
      url,
      identifier: job.id,
      // Keep contact phone/email out of JSON-LD even though detail UI shows them
    };

    if (job.salary?.min != null || job.salary?.max != null) {
      schema['baseSalary'] = {
        '@type': 'MonetaryAmount',
        currency: job.salary.currency || 'INR',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salary.min,
          maxValue: job.salary.max ?? job.salary.min,
          unitText: job.salary.period === 'daily' ? 'DAY' : 'MONTH',
        },
      };
    }

    return schema;
  }

  private mapEmploymentType(jobType: string): string {
    switch (jobType) {
      case 'full-time':
        return 'FULL_TIME';
      case 'part-time':
        return 'PART_TIME';
      case 'contract':
        return 'CONTRACTOR';
      case 'temporary':
        return 'TEMPORARY';
      case 'internship':
        return 'INTERN';
      default:
        return 'OTHER';
    }
  }

  /** Build JSON-LD structured data for a portfolio page. */
  private portfolioJsonLd(document: PortfolioDocument, canonicalUrl: string): Record<string, unknown> {
    const defaultLocale = document.site.defaultLocale;
    const activeLocale = document.site.locales?.[0] ?? defaultLocale;
    const map = (key: 'title' | 'description') => {
      const localized = document.pages[0]?.seo?.[key];
      if (!localized) return undefined;
      return localized[activeLocale] ?? localized[defaultLocale] ?? '';
    };
    const title = map('title');
    const description = map('description');
    const hero = document.pages[0]?.sections?.find((s) => s.type === 'hero');
    const imageUrl = hero?.props?.['imageUrl'] ?? '';
    const navigation = document.navigation ?? [];
    const skillsSection = document.pages[0]?.sections?.find((s) => s.type === 'skills');
    const rawSkills = skillsSection?.props?.['items'];
    const skillItems = Array.isArray(rawSkills) ? rawSkills : [];
    const sameAs = navigation
      .filter((item) => item.target.startsWith('http'))
      .map((item) => item.target);
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: document.site.name,
        description,
        ...(document.site.locales && document.site.locales.length > 1
          ? { availableLanguage: document.site.locales.map((l: string) => l.replace('-', '_')) }
          : {}),
      },
    };
    if (title) schema['name'] = title;
    if (description) schema['description'] = description;
    if (imageUrl) schema['image'] = imageUrl;
    if (skillItems.length > 0) {
      schema['skills'] = skillItems;
    }
    if (sameAs.length > 0) {
      schema['sameAs'] = sameAs;
    }
    return {
      ...schema,
      '@type': 'ProfilePage',
      url: canonicalUrl,
      identifier: document.site.slug,
    };
  }
}
