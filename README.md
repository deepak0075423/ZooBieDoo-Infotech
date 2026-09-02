# Zoobiedoo Infotech — Corporate Website

A frontend-only corporate website: plain HTML, CSS and vanilla JavaScript.
No framework, no build step, no backend.

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

---

## Pages (31)

| Section | Files |
| --- | --- |
| Home | `index.html` |
| About Us | `about.html` |
| Services | `services.html` + 9 pages in `services/` |
| Insights | `insights.html` |
| — Case Studies | `case-studies.html` + 6 `case-study-*.html` |
| — Blogs | `blog.html` + 6 `blog-*.html` |
| Careers | `careers.html` |
| Contact Us | `contact.html` |
| FAQs | `faqs.html` |
| Privacy Policy | `privacy-policy.html` |
| SEO | `sitemap.xml`, `robots.txt` |

**Services** (mega-menu, each with its own page): Mobile App Development, Web Development,
Software Development, UI/UX Design, Cloud Solutions, AI & Machine Learning, DevOps,
Quality Assurance & Testing, IT Consulting.

## Structure

```
├── index.html, about.html, …     the pages
├── services/                     nine service detail pages
└── assets/
    ├── css/styles.css            single stylesheet, design tokens at the top
    ├── js/main.js                ~370 lines, no dependencies
    └── img/                      logo lockups and favicons
```

Every page is standalone: edit the HTML directly and ship it. The header, mega-menu and
footer markup is repeated in each file, so a change to navigation or footer links needs a
find-and-replace across all 31 pages — your editor's "replace in files" handles this well.

## Logo

Three lockups are in use, each sized by height with `width: auto` so proportions are never
distorted:

| File | Used where |
| --- | --- |
| `assets/img/logo-horizontal.png` | Header, 38px tall — monogram + wordmark |
| `assets/img/logo-mark.png` | Header below 480px, via `<picture>` art direction |
| `assets/img/logo-full-light.png` | Footer, 132px tall — reversed for the navy background |
| `assets/img/favicon-32/48/64.png`, `apple-touch-icon.png` | Browser tab, home screen |

The logo appears **twice per page** — header and footer. It is deliberately not repeated in
section headings, cards or other components. The reversed footer variant maps the artwork to
white and the "InfoTech" / tagline greys to a softer tint, preserving the original hierarchy
on dark backgrounds.

To change the logo, replace these files, keeping the same aspect ratio and transparent
background. The header sizes by height, so a slightly different width is fine.

## Design

- **Type** — Source Serif 4 for display headings, Inter for everything else (Google Fonts,
  with system fallbacks if the network is unavailable).
- **Palette** — sampled from the logo: navy `#021B47`, brand blue `#0A5CAB` (the logo blue,
  darkened to reach 6.5:1 on white), cool neutrals. All tokens are CSS custom properties in
  `:root` at the top of `styles.css`; change those values to re-skin the whole site.
  Every text/background pair meets WCAG AA — the weakest is 4.9:1.
- **Imagery** — apart from the logo files there are no external images or icon libraries.
  All artwork and icons are inline SVG, so nothing 404s and nothing needs a CDN.
- **Motion** — one fade-and-rise reveal on scroll, plus menu and accordion transitions.
  All disabled under `prefers-reduced-motion`.

## Behaviour

`assets/js/main.js` handles: sticky header state, the services mega-menu and insights
dropdown (hover, click, keyboard and Escape), the off-canvas mobile menu with accordions,
FAQ accordions, tag filtering on the blog / case study / careers listings, client-side form
validation, article scrollspy, back-to-top and copy-to-clipboard.

It degrades safely: with JavaScript off, all content is visible and every link works.

## Responsive

Tested at 390px (mobile), 834px (tablet), 1024px and 1440px (desktop). The primary nav
collapses into the off-canvas panel below 1024px; grids step from 4 → 2 → 1 column.

## Before going live

1. **Forms are demonstrations.** The contact, careers and newsletter forms validate and show
   a success state but send nothing. Point them at your CRM, ATS or form endpoint.
2. **Replace the placeholder company data** — client names, case-study figures, team members,
   office addresses, phone numbers and open roles are illustrative content, not real records.
3. **Have the privacy policy reviewed** by your own counsel so it matches your actual
   processing, retention and regulatory position.
4. **Update the domain** in `sitemap.xml`, `robots.txt` and the social share links in the
   article sidebars (currently `www.zoobiedoo.com`).
5. **Add real social profile URLs** — footer social links currently point at `#`.
6. **Brand casing.** The logo is styled `ZooBieDoo InfoTech`; body copy, page titles and the
   copyright line use ordinary `Zoobiedoo Infotech`.
