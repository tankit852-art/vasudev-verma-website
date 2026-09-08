# VASUDEV VERMA OFFICIAL WEBSITE
## README — Staff / Developer Guide

---

## 📁 Folder Structure

```
vasudev-verma-website/
├── index.html          ← Home Page
├── about.html          ← Parichay (About)
├── schedule.html       ← Daily Schedule / Diary
├── gallery.html        ← Media Gallery
├── social.html         ← Social Media Wall
├── news.html           ← News & Press
├── contact.html        ← Contact + Volunteer
├── admin/
│   └── index.html      ← 🔐 Admin Panel (Staff Only)
├── css/
│   └── style.css       ← All styles (tricolor theme)
├── js/
│   └── main.js         ← All JavaScript
├── data/
│   ├── schedule.json   ← Daily schedule data
│   └── news.json       ← News/press data
└── images/
    └── gallery/        ← Place event photos here
```

---

## 🔐 Admin Panel — Daily Schedule Update

### Daily Routine (हर सुबह करें)
1. Browser में open करें: `admin/index.html`
2. Password डालें: `vasudev2026`
3. "नई Entry Add करें" tab → form fill करें
4. "Entry Save करें" → JSON popup आएगा
5. JSON copy करें → `data/schedule.json` को Notepad से खोलें → पूरा content replace करें → Save

### Admin Password बदलना
`js/main.js` खोलें → Line 1: `const ADMIN_PASSWORD = 'vasudev2026';` → नया password डालें

---

## 📷 Photos कैसे Add करें

1. Photo को `images/gallery/` folder में डालें (JPEG/WebP format, under 500KB)
2. `gallery.html` खोलें
3. किसी `gallery-item` div में: `<div class="gallery-placeholder-img">` को `<img src="images/gallery/YOUR-PHOTO.jpg">` से replace करें

### Hero Photo (Home Page)
`index.html` में:
```html
<!-- Remove the placeholder div and uncomment: -->
<img src="images/hero.jpg" alt="Vasudev Verma" />
```
Photo को `images/hero.jpg` नाम से save करें।

---

## 📰 News Add करना

`data/news.json` खोलें और नई entry add करें:
```json
{
  "id": "6",
  "date": "2026-09-09",
  "source": "Newspaper Name",
  "headline": "खबर का शीर्षक",
  "summary": "खबर का संक्षिप्त विवरण...",
  "url": "https://link-to-full-article.com"
}
```

---

## 📱 Instagram Feed Setup (Elfsight — 5 Minutes)

1. Go to: https://elfsight.com/instagram-feed-widget/
2. Sign up (free plan available)
3. "Connect Instagram Account" → `vasudev_office` connect करें
4. Widget customize करें (grid layout, posts count)
5. "Get Code" → copy embed code
6. `social.html` खोलें → `social-embed-box` div को embed code से replace करें
7. Same steps for `official_vasudev_bjp`

---

## 🌐 Hosting / Deploy करना

### Option A — Hostinger / GoDaddy (Recommended for India)
1. Domain लें: `vasudevverma.in` (~₹700/year)
2. Hosting plan लें (Basic, ~₹200/month)
3. cPanel → File Manager → `public_html` folder में सारी files upload करें
4. Done! Website live है।

### Option B — Netlify (Free)
1. Go to netlify.com → Sign up
2. "Deploy manually" → folder को drag & drop करें
3. Custom domain add करें

### Option C — GitHub Pages (Free)
1. GitHub पर repository बनाएं
2. Files upload करें
3. Settings → Pages → Branch: main → Save

---

## 🔧 Content जो Replace करना है

| Placeholder | असली Data कहाँ डालें |
|---|---|
| `+91 12345 67890` | असली phone number |
| `office@vasudevverma.in` | असली email |
| `images/hero.jpg` | नेता की असली hero photo |
| `images/gallery/*.jpg` | Event photos |
| Biography text | असली जीवन परिचय |
| Google Maps embed | Office का actual Maps code |
| Elfsight embed | Instagram feed code |

---

## ⚠️ Important Notes

- **Party Symbol (Lotus):** Website में party का official symbol नहीं है — यह trademark issue से बचने के लिए है। Text badges और colors से affiliation दिखाया गया है।
- **Admin Panel Security:** Production में deploy करने के बाद एक proper backend (PHP/Node.js) बनवाएं।
- **Mobile First:** Website 100% mobile-responsive है। सभी pages mobile पर test करें।

---

© 2026 Vasudev Verma. All Rights Reserved.
