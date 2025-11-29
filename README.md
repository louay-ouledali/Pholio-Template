# Pholio - Modern React Portfolio Template

A modern, customizable portfolio template built with React. Features a clean design, smooth animations, and easy configuration.

## Features

-  Modern UI with smooth animations
-  Fully responsive design
-  Easy to customize
-  Project showcase with image galleries
-  Blog/Articles section
-  Experience timeline
-  Certifications display
-  Optional AI chat integration
-  Cloud-ready deployment

## Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/Pholio.git
cd Pholio
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure your portfolio**
Edit `src/data/user.js` with your personal information.

4. **Start development server**
```bash
npm start
```

5. **Build for production**
```bash
npm run build
```

## Configuration

### Personal Information
Edit `src/data/user.js` to customize:
- Name, email, and social links
- About section with your story
- Projects and their details
- Work experience
- Certifications

### Environment Variables
Create a `.env` file based on `.env.example`:
```env
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
# ... other variables
```

### Images
Add your images to the `public/` folder and reference them in `user.js`.

## Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Other Platforms
The `build/` folder can be deployed to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## Tech Stack

- React 18
- React Router v6
- Framer Motion
- Tailwind CSS
- Firebase (optional)
- Cloudinary (optional)

## License

MIT License - feel free to use this template for your own portfolio!

---

Made with  using React
