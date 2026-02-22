# Shree Satguru Hospital — React Website

A modernized React (Vite) single-page website built from the original static HTML.

## What’s included
- Uses your assets:
  - `src/assets/logo.png` for the site logo
  - `src/assets/pic1.jpg`–`pic4.jpg` in the hero/gallery
  - `src/assets/rajesh.png`, `src/assets/rkyadav.png`, `src/assets/ajay.png` for the doctor cards
- Google Map embedded on-page (iframe)
- Working Appointment + Feedback forms
  - Saves submissions locally (localStorage)
  - Appointment form opens WhatsApp with a pre-filled message for confirmation

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown in your terminal.

## Build

```bash
npm run build
npm run preview
```

---

## ✅ Enabled: Real storage + notifications (Backend)

This version includes a small backend that:
- Stores appointments + feedbacks into a **SQLite database** (`backend/data/hospital.db`)
- Optionally sends an **email notification** to the hospital inbox (SMTP), if configured.

### Start backend (Terminal 1)
```bash
cd backend
npm install
cp .env.example .env   # optional, for email alerts
npm run dev
```

### Start frontend (Terminal 2)
```bash
npm install
npm run dev
```

### Where the data goes now
- **Database:** `backend/data/hospital.db` (SQLite)
- **Email:** If `.env` SMTP fields are set, it emails `MAIL_TO`.

> Note: WhatsApp sending is still user-confirmed (opens WhatsApp). Automatic WhatsApp sending requires WhatsApp Business API/Twilio.

---

## 🔐 Admin Dashboard (view appointments & feedback)

Backend includes a protected admin page:

- URL: `http://localhost:5055/admin`
- Auth: Basic Auth using `ADMIN_USER` and `ADMIN_PASS` in `backend/.env`

It shows the latest appointments and feedback, and pulls from the SQLite DB.

## 🛡️ Anti-spam: CAPTCHA + Rate limiting

### Rate limit (enabled by default)
`/api/appointments` and `/api/feedbacks` are limited to **12 requests per 10 minutes per IP**.

### CAPTCHA (optional, recommended for public deployment)
Uses **Cloudflare Turnstile**.

1) Create Turnstile keys in Cloudflare dashboard
2) Set frontend sitekey:
   - create `.env` in project root
   - set `VITE_TURNSTILE_SITEKEY=...`
3) Set backend secret:
   - set `TURNSTILE_SECRET_KEY=...` in `backend/.env`
4) To make CAPTCHA mandatory:
   - set `TURNSTILE_REQUIRED=true`

## 💬 WhatsApp Business API automation (optional)

This backend supports **Meta WhatsApp Cloud API**.

Set in `backend/.env`:
- `WHATSAPP_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_SEND_TO_PATIENT=true` (default)
- `WHATSAPP_NOTIFY_NUMBER=918437343300` (optional staff alerts)

On appointment submit, it can:
- send confirmation message to patient number (if enabled)
- optionally notify a staff number
