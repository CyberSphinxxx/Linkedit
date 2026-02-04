# LinkedIT

Your **Second Brain for the Internet** - Save links, tag them, and find them instantly.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-12-orange?logo=firebase)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Auto-metadata extraction** - Thumbnails, titles, and descriptions pulled automatically
- **Smart tagging** - Organize with custom tags
- **Instant search** - Find anything in seconds
- **YouTube integration** - Watch videos in-app with embedded player
- **Image lightbox** - View images in full-screen without leaving the app
- **Responsive design** - Works on desktop, tablet, and mobile
- **Dark mode** - Beautiful dark theme by default

## Quick Start

### Prerequisites
- Node.js 18+
- Firebase project with Authentication and Firestore enabled

### Installation

1. Clone the repository
```bash
git clone https://github.com/CyberSphinxxx/Linkedit.git
cd Linkedit
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Authentication**: Firebase Auth (Google Sign-In)
- **Database**: Firebase Firestore
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── api/          # API routes
│   ├── dashboard/    # Main dashboard page
│   └── login/        # Authentication page
├── components/       # Reusable UI components
├── context/          # React Context providers
├── lib/              # Utility functions and services
└── types/            # TypeScript type definitions
```

## Deployment

This project is optimized for Vercel:

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add your environment variables
4. Deploy!

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built for visual thinkers
