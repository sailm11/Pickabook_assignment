# InstantID Personalizer – Frontend (React + Vite)

This is the frontend of the InstantID Personalizer project.  
It provides a clean, modern UI to:

- Upload a **main image** (required)
- Upload an **optional personalization image** (pose/style reference)
- Enter a text prompt
- Send everything to the backend for InstantID generation
- Preview the result and **download the generated image**

The frontend is deployed on **Vercel**, while the backend runs on **Render**.

---

## 🚀 Tech Stack

- **React + Vite**
- **CSS custom design (full-page UI)**
- **Vercel hosting**
- **Fetch API** to communicate with the backend
- **Environment variables** for API URL

---

## 📂 Project Structure

frontend/
│── src/
│ ├── App.jsx # Main application UI
│ ├── App.css # Custom UI styling
│ ├── main.jsx
│── index.html
│── package.json
│── vite.config.js
└── README.md # (this file)



---

## 🔧 Environment Variables

The frontend must know where your backend lives.

### For local development

Create a `.env` in `frontend/`:

VITE_API_URL=http://localhost:8000

### On Vercel (Production)

Go to:

Vercel → Project → Settings → Environment Variables → Add New

Add

KEY: VITE_API_URL
VALUE: https://<your-backend_url>.onrender.com

Then redeploy the project.

---

## 🛠 Local Development

To run locally:

```bash
cd frontend
npm install
npm run dev


The app will run at:
http://localhost:5173

It will send API requests to whatever VITE_API_URL is set to.

🧪 Build for Production

npm run build
Vercel will automatically run this command on deployment.

🔗 API Contract (What frontend sends)

The frontend submits the following multipart/form-data:

F| Field            | Type   | Required | Description        |
| ---------------- | ------ | -------- | ------------------ |
| `image_main`     | File   | YES      | Primary face image |
| `image_optional` | File   | NO       | Pose / style image |
| `prompt`         | String | YES      | Text prompt        |


{
  "result_url": "/generated/<file-name>.png"
}
Frontend displays this file and offers a download button.

💅 UI Features

Full-page layout with navbar

Two-column design (form + result)

Responsive for mobile

Upload preview thumbnails

Download result button

Clean animations on hover

Modern glass-card styling