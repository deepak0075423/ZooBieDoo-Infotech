# ZooBieDoo Infotech — Website

Frontend-only website: plain HTML, CSS and vanilla JavaScript. No framework, no backend.

Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

---

## Pages (142)

| Section | Files |
| --- | --- |
| Home | `index.html` |
| About Us | `about.html` |
| Services | `services.html` + 10 pages in `services/` |
| Solutions | `solutions/index.html` + 6 pages in `solutions/` |
| Insights | `insights.html` |
| — Blogs | `blogs/` — 100 posts, 7 paginated index pages, 10 category pages |
| — FAQs | `faqs.html` |
| Careers | `careers.html` |
| Contact Us | `contact.html` |
| Privacy Policy | `privacy-policy.html` |
| SEO / AI | `sitemap.xml`, `robots.txt`, `llms.txt` |

### Blog structure

```
blogs/
├── index.html          page 1 of the listing (16 per page)
├── page-2..7.html      remaining pages, real crawlable URLs
├── category-<topic>.html   one indexable page per topic (10)
└── <slug>.html         100 articles
```

Each article carries: a key-takeaways block, five sections, a three-question FAQ
with `FAQPage` structured data, a topic-specific featured graphic, a canonical URL,
a keywords meta tag, internal links to the related service and solution, and a CTA.

### SEO and AI discoverability

- `sitemap.xml` — all 142 pages with `lastmod`, `changefreq` and `priority`.
- `llms.txt` — structured summary at the root for language models, with sections for
  Company, Services, Solutions, Case studies, Blogs (every post, grouped by topic).
- Every page has a unique title, unique meta description, a single `h1` and a canonical URL.
- Verified: sitemap, `llms.txt` and the files on disk match exactly, with no duplicates
  and no broken or missing URLs.

**Services (10):** Web Development, **Drupal Development & Services**, Mobile App Development,
Software Development, UI/UX Design, Cloud Solutions, AI & Machine Learning, DevOps,
Quality Assurance & Testing, IT Consulting.

## Contact details

Set in one place — the constants at the top of `tools/build.py`:

```
PHONE_DISPLAY  +91 75959 63707
ADDRESS        4, Bishop Lefroy Road, Kolkata – 700020
EMAIL          info@zoobiedoo.com        ← confirm this mailbox exists
```

They appear in the header, footer, contact page, careers page, privacy policy and the
structured-data block on every page.

## Content policy — please read

This site makes **no claims about named clients, project results, headcount, revenue,
founding date or testimonials**, because none of that was supplied and inventing it on a
live commercial site would be dishonest — and easy for a prospect to catch.

Everything published describes capability, method and technology, all of which the company
can stand behind. Specifically:

- `solution-*.html` pages describe **problem spaces and architecture**, not client
  engagements. Each carries a visible note saying so.
- Blog articles are technical guidance and avoid first-person claims about past projects.
- The careers page lists **disciplines we hire for** rather than specific vacancies, so no
  candidate applies for a role that does not exist.

**To add real proof once you have client approval:** add entries to `SOLUTIONS` in
`tools/build.py` with real metrics and client names, or create a `CASE_STUDIES` list using
the same structure and re-enable a "Case Studies" nav entry.

## Images

Every visual is a **purpose-built SVG generated in `tools/build.py`** — Drupal admin screens,
CI/CD pipelines, cloud topologies, dashboards, sync diagrams, forecast charts and so on.
There are 25 distinct compositions and none is reused as generic filler.

This was a deliberate choice under a constraint: Unsplash and Pexels both require an API key,
and the free CC0 pools available without one return archive photography that would not meet a
professional standard. Purpose-built vectors are also sharper, a few KB each, need no CDN, and
carry no licensing or watermark risk.

**If you want photography**, supply an Unsplash or Pexels API key, or drop licensed images into
`assets/img/`. Each illustration is a single call in the page builders (`figure("drupal")`,
`illus(...)`), so swapping one for an `<img>` is a one-line change per slot.

## Structure

```
├── index.html, about.html, …    generated pages
├── services/                    ten service pages
├── assets/
│   ├── css/styles.css           one stylesheet, design tokens at the top
│   ├── js/main.js               ~370 lines, no dependencies
│   └── img/                     logo lockups and favicons
└── tools/build.py               generator — all content lives here
```

`python3 tools/build.py` rewrites every page. All copy is in data structures near the top:
`SERVICES`, `SOLUTIONS`, `POSTS`, `INDUSTRIES`, `FAQ_GROUPS`, `DISCIPLINES`, `BENEFITS`.

The generator exists because the header, mega-menu and footer repeat across 32 pages; a
contact-detail or navigation change would otherwise mean 32 edits. The generated HTML is fully
standalone — delete `tools/` and the site still works, it just becomes hand-maintained.

## Design

- **Type** — Source Serif 4 for display headings, Inter for everything else.
- **Palette** — sampled from the logo: navy `#021B47`, brand blue `#0A5CAB`, cool neutrals.
  Tokens are CSS custom properties in `:root`. Every text/background pair meets WCAG AA.
- **Logo** — header lockup and reversed footer lockup, twice per page, never repeated in
  section headings or cards.
- **Motion** — one fade-and-rise reveal plus menu and accordion transitions, all disabled
  under `prefers-reduced-motion`.

## Verified

- 32 pages, 3,255 internal links and anchors, zero broken.
- 21/21 scripted browser checks (menus, mobile nav, accordions, filters, form validation).
- Zero console errors and zero failed network requests.
- No horizontal overflow and no broken images at 390px, 834px and 1440px.

## Before going live

1. **Connect the forms.** Contact and careers forms validate and confirm but send nothing.
   Both currently tell the visitor to email or call instead, so nothing is silently lost —
   but wire them to a mail handler or CRM.
2. **Confirm the email addresses** (`info@`, `sales@`, `careers@zoobiedoo.com`) exist.
3. **Set the real domain** in `DOMAIN` in `tools/build.py`, then rebuild — it feeds
   `sitemap.xml`, `robots.txt` and article share links.
4. **Add real social profile URLs** — footer icons currently point at `#`.
5. **Have the privacy policy reviewed** by a legal adviser against your actual processing.
6. **Add a Google Business Profile / map embed** on the contact page if you want a live map;
   the current locator is an illustration.
