# AI-Powered Issue Tracker - Frontend

This is the frontend application for an **AI-Powered Issue Tracker** built with [Next.js](https://nextjs.org) and React. The application provides a comprehensive project management solution with team collaboration, issue tracking, and AI-powered assistance.

📖 **For detailed documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)**

## Quick Start

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Features

- 🔐 User authentication (Email/Password & Google OAuth)
- 👥 Team collaboration and management
- 📊 Dashboard with analytics
- 📝 Issue tracking (coming soon)
- 🤖 AI-powered assistance (coming soon)

## Project Structure

```
src/
├── app/              # Next.js pages and routes
├── components/       # Reusable React components
├── lib/             # API client and utilities
├── types/           # TypeScript type definitions
└── providers/       # React context providers
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
