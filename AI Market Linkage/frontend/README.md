# AI Market Linkage - Frontend

React-based single-page application for the AI-powered agricultural marketplace.

## Setup

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create a `.env` file:
```
VITE_API_URL=http://localhost:8000/api
```

### Development Server
```bash
npm run dev
```

The app will start on `http://localhost:3000`

### Build
```bash
npm run build
```

## Features

- **User Authentication**: Registration and login with JWT tokens
- **Farmer Dashboard**: Create and manage agricultural listings
- **Buyer Dashboard**: Browse listings and send inquiries
- **Image Upload**: Multiple image support for listings
- **Location-Based Discovery**: Filter listings by province/district
- **Price Filtering**: Find products within your price range
- **Inquiry Management**: Track and manage buyer inquiries

## Project Structure

```
src/
├── api/              # API endpoints and axios client
├── components/       # Reusable UI components
├── pages/           # Page components
├── context/         # Zustand store for state management
├── styles/          # CSS modules
├── utils/           # Utility functions
└── main.jsx         # App entry point
```

## Technologies

- React 18
- React Router v6
- Axios
- Zustand (State Management)
- Vite
- CSS3

## Deployment

For production deployment:
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure CORS and API endpoints for production
