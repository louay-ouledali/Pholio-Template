<div align="center">

#  Pholio

### A Modern, AI-Powered Portfolio Template

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Pholio** is a stunning, feature-rich portfolio template built with React and Firebase.  
Showcase your projects, skills, certifications, and experience with style! 

[Features](#-features)  [Quick Start](#-quick-start)  [Deployment](#-deployment)

</div>

---

##  Features

<table>
<tr>
<td width="50%">

###  **Beautiful UI/UX**
- Modern, responsive design
- Smooth animations & transitions
- Dark/light theme support
- Mobile-first approach

###  **AI Chat Assistant**
- Powered by Groq (Llama 3) & Gemini
- Answers questions about your portfolio
- Context-aware responses
- Fallback strategy for reliability

</td>
<td width="50%">

###  **Admin Dashboard**
- Secure Firebase authentication
- Edit projects, skills, certifications
- Cloudinary image uploads
- Real-time updates

###  **Dynamic Content**
- Firebase Firestore backend
- Project showcases with carousels
- Certifications & achievements
- Work experience timeline

</td>
</tr>
</table>

---

##  Tech Stack

<div align="center">

| Frontend | Backend | Cloud | AI |
|:--------:|:-------:|:-----:|:--:|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black) | ![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=flat-square&logo=google-cloud&logoColor=white) | ![Groq](https://img.shields.io/badge/Groq-FF6B35?style=flat-square) |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | ![Firestore](https://img.shields.io/badge/Firestore-039BE5?style=flat-square&logo=firebase&logoColor=white) | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white) | ![Gemini](https://img.shields.io/badge/Gemini-8E75B2?style=flat-square&logo=google&logoColor=white) |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | ![Firebase Hosting](https://img.shields.io/badge/Hosting-FFA000?style=flat-square&logo=firebase&logoColor=white) | ![Llama 3](https://img.shields.io/badge/Llama_3-0467DF?style=flat-square&logo=meta&logoColor=white) |

</div>

---

##  Quick Start

### Prerequisites
- Node.js 18+
- Firebase account
- Cloudinary account (for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Pholio-Template.git
cd Pholio-Template

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase & API keys

# Start development server
npm start
```

### Environment Variables

Create a `.env` file with:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Cloudinary (for image uploads)
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_preset

# AI Chat (optional)
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
```

---

##  Project Structure

```
Pholio/
  public/              # Static assets & images
  src/
     components/      # Reusable UI components
        admin/       # Admin dashboard components
        common/      # Shared components (navbar, footer, chat)
        homepage/    # Homepage sections
        projects/    # Project cards & modals
     context/         # React context (Portfolio data)
     data/            # Static data & configuration
     pages/           # Page components
        admin/       # Admin pages (editors)
        styles/      # Page-specific styles
     utils/           # Utility functions
  functions/           # Firebase Cloud Functions (AI chat)
  api/                 # Azure Functions (alternative)
```

---

##  Customization

Edit `src/data/user.js` to customize:
- Your name, email, and social links
- About section with your story
- Projects and their details
- Work experience
- Certifications

Add your images to the `public/` folder and reference them in `user.js`.

---

##  Deployment

### Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build the app
npm run build

# Deploy
firebase deploy --only hosting
```

### Other Platforms

<details>
<summary> Vercel</summary>

1. Import your GitHub repo at [vercel.com](https://vercel.com)
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

</details>

<details>
<summary> Netlify</summary>

1. Connect your repo at [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `build`

</details>

---

##  Contributing

Contributions are welcome! Feel free to:

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

---

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

###  Star this repo if you found it helpful!

Made with  and 

</div>
