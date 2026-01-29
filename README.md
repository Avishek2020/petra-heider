# Dr. Petra Heider – Gedenkseite

Memorial page for Dr. Petra Heider with condolence book (Gedenkbuch).

## Deploy on Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. **Persistent messages (Gedenkbuch):** In the Vercel project go to **Storage** → **Create Database** → choose **Blob**. Create a Blob store; this adds `BLOB_READ_WRITE_TOKEN` to the project. Redeploy so the `/api/messages` serverless function can read/write messages.
3. Without a Blob store, the site still works: messages are only kept in the browser (localStorage).

After deployment, open your Vercel URL. Submissions go to `/api/messages` and are stored in Blob (if configured).

## Local development

- **With server (writes to messages.json):**  
  `npm install` → `npm start` → open **http://localhost:3001**
- **Static only:** Open `index.html` in a browser; form submissions are stored in localStorage only.

## Repo contents

- **index.html** – Memorial page (candle, quote, Gedenkbuch form).
- **api/messages.js** – Vercel serverless API: GET/POST messages (uses Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set).
- **server.js** – Local Node server for development (reads/writes `messages.json`).
- **messages.json** – Used locally by `server.js`; on Vercel, messages are stored in Blob.
