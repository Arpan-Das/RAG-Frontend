# 💬 AskYourDocs — Frontend

A clean, two-pane React interface for uploading documents and chatting with them — the client for the [AskYourDocs RAG backend](#).

**Live app:** [ask-your-docs-five.vercel.app](https://ask-your-docs-five.vercel.app)
**Backend API:** [rag-backend-28x8.onrender.com](https://rag-backend-28x8.onrender.com)
**Backend repo:** [https://github.com/Arpan-Das/RAG-backend](#) 
---

## ✨ Features

- 📤 **Drag-in document upload** — select and upload multiple PDFs at once, with per-file preview before sending
- 📋 **Live document list** — see upload/index status update in real time
- 🗑️ **One-click delete** — remove a document and its indexed data
- 💬 **Chat interface** — ask questions in natural language, with:
  - Auto-scrolling message history
  - A typing indicator while waiting on the backend
  - Source citations shown inline under grounded answers
  - Disabled input/send state while a request is in flight, so you can't fire duplicate requests
  - Enter-to-send and click-to-send, both routed through one submit handler

---

## 🏗️ Architecture

```
┌────────────────┐        ┌──────────────────┐
│  DocumentPanel  │◀──────▶│                  │
│  (upload/list/   │        │   FastAPI API    │
│   delete)         │        │  (Render, live)  │
├────────────────┤        │                  │
│   ChatPanel      │◀──────▶│                  │
│  (ask/answer)      │        └──────────────────┘
└────────────────┘
        ▲
        │
     App.jsx
```

Two independent panels, each owning their own state and talking directly to the backend via `fetch` — no shared global state manager needed at this scale.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| State | React hooks (`useState`, `useEffect`, `useRef`) — no external state library |
| HTTP | Native `fetch` API |
| Hosting | Vercel |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── DocumentPanel.jsx   # Upload, list, delete
│   │   └── ChatPanel.jsx        # Chat interface
│   ├── App.jsx                    # Two-pane layout
│   ├── main.jsx
│   └── index.css                    # Tailwind entrypoint
├── vite.config.js
└── package.json
```

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- A running instance of the [backend API](#) (local or deployed)

### Local development

```bash
git clone <repo-url>
cd frontend
npm install
npm run dev
```

By default, the app points at `http://127.0.0.1:8000` for the backend. If you're running against a deployed backend instead, update the fetch URLs in `DocumentPanel.jsx` and `ChatPanel.jsx`, or (recommended) configure a `VITE_API_URL` environment variable and reference it via `import.meta.env.VITE_API_URL`.

### Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

### Deploying

Deployed on Vercel, auto-connected to this repo — every push to `main` triggers a new build and deploy automatically.

> **CORS note:** the backend must have this app's deployed origin explicitly allowlisted in its CORS configuration (exact match, no trailing slash) for requests to succeed.

---

## 🧩 Key Implementation Details

- **File uploads use `FormData`**, not JSON — PDFs are binary, and the browser sets the correct `multipart/form-data` boundary automatically (manually setting `Content-Type` breaks this).
- **The hidden-input + ref-click pattern** is used for the upload button — native file inputs are hard to style directly, so a styled button programmatically triggers a hidden `<input type="file">`.
- **All async actions (`upload`, `chat`) use `try/catch/finally`**, so loading states always clear correctly even if a request fails — no permanently-stuck spinners.
- **Send is disabled** when a response is pending *or* the input is empty, both at the button level and as a safety check inside the handler itself.

---

## ⚠️ Known Limitations

- Documents uploaded to the backend are **not currently persisted** across backend restarts/redeploys — after backend idle periods, the document list will appear empty until documents are re-uploaded. This is a backend storage limitation, tracked in the [backend README](#).
- No message history persistence — refreshing the page clears the chat.
- No streaming — responses appear all at once rather than token-by-token (planned).

---

## 🗺️ Roadmap

- [ ] Streaming chat responses (token-by-token rendering)
- [ ] Persist chat history across page reloads
- [ ] Environment-variable-based API URL configuration
- [ ] Toast notifications instead of `alert()` for delete confirmations

---

*Built by Arpan Das*
