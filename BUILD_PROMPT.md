# Build a production marketing website for an HVAC contractor

You are building a complete, deployable marketing website. Work autonomously,
end to end, in the current directory. Do not ask questions — make tasteful
decisions and finish.

## Tech stack (required)
- Vite + React 18 + TypeScript + Tailwind CSS
- Mobile-first responsive (most visitors are on phones)
- Static SPA, deployable to **GitHub Pages at subpath `/northeast-hvac/`** —
  set `base: '/northeast-hvac/'` in `vite.config.ts`, use relative/hashless
  asset paths so it works under the subpath.
- **No API keys, secrets, backend, or env vars.** Pure static site.
- It MUST build cleanly: run `npm install` then `npm run build` yourself and
  fix anything until `dist/` builds with zero errors. This is part of the task.

## The business (use these real facts)
- Name: **Northeast Heating & Cooling**
- Trade: HVAC contractor — residential & light-commercial heating + cooling
- Address: 12 Bond St, Haverhill, MA 01835
- Phone: **(978) 691-5822** (make every phone number a clickable `tel:` link)
- Rating: **5.0 stars from 460+ Google reviews** (use this for credibility)
- Service area: Haverhill and the Merrimack Valley — also Methuen, Lawrence,
  Andover, North Andover, Bradford, Groveland, Boxford, Georgetown.

## Sections (in order)
1. **Emergency banner** (thin, red, sticky-ish top): "24/7 Emergency HVAC Service — Call (978) 691-5822"
2. **Header / nav**: logo wordmark, nav links (Services, Why Us, Service Area, Reviews, Contact), an amber "Get a Quote" button.
3. **Hero** (2-col on desktop, stacked on mobile): strong headline about year-round comfort in the Merrimack Valley, subheadline, trust chips (Licensed & Insured · NATE-Certified · 5.0★ 460+ Reviews · 24/7 Emergency), two CTAs (primary "Get a Free Quote", secondary "Call Now"). Right side: a real HVAC photo.
4. **Services — dual layout**: two groups.
   - **Cooling** (blue-tinted cards): AC installation, AC repair, ductless mini-splits, maintenance plans.
   - **Heating** (amber-tinted cards): furnace install & repair, boiler service, heat pumps, tune-ups.
   Each card: icon, title, 1–2 sentence description.
5. **Why choose us**: 4–6 points (licensed & insured, NATE-certified techs, upfront pricing, 24/7 emergency, financing available, locally owned & operated).
6. **Seasonal promo**: a gradient card (cool-blue → warm-amber) with a "Season Special" offer (e.g. $89 tune-up or free estimate on install).
7. **Reviews / testimonials**: 3–4 realistic, specific testimonials (first name + town), styled as cards, with a "5.0 ★ from 460+ Google reviews" header. Keep them believable and varied (an AC install, an emergency no-heat call, a mini-split job).
8. **Service area**: list the towns above, framed around the Merrimack Valley.
9. **Contact / quote CTA**: big band with phone, address, hours, and a simple quote form (name, phone, email, service needed, message). The form is **front-end only** — on submit, show a thank-you state (no backend); optionally also offer a `tel:` and `mailto:` fallback.
10. **Footer**: dark (primary-dark), 3 columns — company + license line ("MA HVAC License #_____ · Fully Insured"), quick links, contact + service area. Copyright.

## Design system — APPLY THIS EXACTLY
Cool blue (cooling/trust) + warm amber (heating/comfort). Inter font. Clean
white with cool-gray surfaces. Technical, modern, trustworthy.

```
colors:
  primary: #0A66C2   primary-light: #1680E0   primary-dark: #084A8E
  accent:  #E87722   accent-light:  #F0963F
  canvas:  #FFFFFF   surface: #F5F7FA   surface-cool: #EEF4FA   surface-warm: #FEF7F2
  text: #1C2833   text-muted: #5D6D7E   text-on-dark: #FFFFFF   emergency: #DC2626
typography: Inter; hero 46/700, h1 36/700, h2 28/600, body 16/1.65
spacing: section 80, lg 40, md 24, sm 16 ; radius md 8, lg 14
button-primary: blue #0A66C2 bg, white bold text, rounded 8
button-accent:  amber #E87722 bg, white bold text — "Get a Quote"
```
DOs: blue for cooling cards, amber for heating cards; always show the emergency
number; show NATE + license; seasonal promo gets the gradient treatment.
DON'Ts: no ice/fire cliché stock photos; don't use blue+amber equally on the
same card (pick one); no heavy animations.

## Imagery
Use real photos via Unsplash source URLs (e.g. `https://images.unsplash.com/...`)
of HVAC technicians, service vans, clean equipment, comfortable homes — NOT
ice/fire clichés. Add descriptive `alt` text. If a specific URL is uncertain,
use a known-good Unsplash photo id. Lazy-load images.

## Quality bar
Match the polish of a site a real HVAC company would proudly pay for: clear
hierarchy, generous spacing, consistent rounded corners, accessible color
contrast, smooth (light) hover states, fully responsive down to 360px. No
lorem ipsum, no placeholder text, no broken links.

## When done
Write a short `BUILD_NOTES.md` listing what you built, the component structure,
and confirm `npm run build` succeeded with the `dist/` path.
