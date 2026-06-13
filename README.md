# PostEx Tracking SEO Website

Static, Vercel-ready PostEx tracking website with a serverless API proxy.

## Pages

- `/` - homepage with tracking search, result card, timeline, FAQs, and 700+ word SEO content
- `/postex-office-near-me.html` - city-wise office/service help cards
- `/postex-tracking-status.html` - shipment status meanings
- `/postex-cod-tracking.html` - COD parcel guide
- `/postex-shipping-guide.html` - customer and seller shipping tips
- `/keyword-cluster.html` - keyword cluster and low-competition targeting plan

## Tracking API

The homepage calls:

```text
/api/track?tracking=YOUR_TRACKING_NUMBER
```

That Vercel serverless route proxies the provided PostEx tracking API and returns JSON to the frontend.

## Before Deploying

Replace `https://your-domain.com` in these files with your real domain:

- `index.html`
- `postex-office-near-me.html`
- `postex-tracking-status.html`
- `postex-cod-tracking.html`
- `postex-shipping-guide.html`
- `keyword-cluster.html`
- `robots.txt`
- `sitemap.xml`

## Deploy

Upload the project to Vercel or connect it with GitHub. Vercel will serve the HTML/CSS/JS files and deploy `api/track.js` as a serverless function.
