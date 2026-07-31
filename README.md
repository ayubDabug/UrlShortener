# UrlShortener

A backend REST API that turns long URLs into short, shareable links and redirects visitors to the original destination. Written in TypeScript.

<!-- TODO: add a screenshot/GIF — e.g. a curl POST returning a short code, then hitting it in the browser and redirecting. -->

---

## Features

- **Shorten** any valid long URL into a compact code
- **Redirect** short links to their original destination
- **Type-safe** end to end with TypeScript
- Input validation and error handling for bad or missing URLs <!-- CONFIRM / remove -->
<!-- Add any you built: click tracking, custom aliases, expiry, rate limiting -->

---

## Tech stack

<!-- CONFIRM against your code -->

- **Language:** TypeScript
- **Runtime:** Node.js, Express
- **Storage:** <!-- TODO: what do you store links in? In-memory / SQLite / PostgreSQL / MongoDB / Redis -->
- **Testing:** <!-- Jest? remove if none -->

---

## API overview

<!-- CONFIRM these routes match your implementation -->

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/shorten` | Accepts a long URL, returns a short code / link |
| `GET` | `/:code` | Redirects to the original URL for that code |

**Example**
```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/some/really/long/path"}'

# → { "shortUrl": "http://localhost:3000/abc123" }
```

---

## Getting started

### Prerequisites
- Node.js (v18+)  <!-- CONFIRM -->
- <!-- any database that needs to be running -->

### Install & run
```bash
git clone https://github.com/ayubDabug/UrlShortener.git
cd UrlShortener
npm install
npm run dev        # or: npm run build && npm start   <!-- CONFIRM your scripts -->
```
The API runs at `http://localhost:3000`. <!-- CONFIRM port -->

### Environment variables
```
PORT=3000
DATABASE_URL=...   <!-- delete if you don't use a DB -->
```

---

## Testing
```bash
npm test           <!-- remove this section if you have no tests yet -->
```

---

## Possible next steps
<!-- Optional — shows you think beyond the assignment -->
- Custom short aliases
- Click analytics per link
- Link expiration
