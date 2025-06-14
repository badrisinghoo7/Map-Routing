# React Map Routing App

A modern React web application with Firebase authentication and Leaflet + OpenStreetMap integration for route planning and navigation.

## 🚀 Features

- **Firebase Authentication**
  - Email/password login and registration
  - Google OAuth integration
  - Protected routes and user session management

- **Interactive Map (100% Free)**
  - Leaflet with OpenStreetMap tiles
  - Click-to-select points A and B
  - Route drawing with OSRM routing service
  - Distance and time calculations
  - Custom markers for start and end points

- **Bonus Features**
  - Current location detection
  - Responsive design for all devices
  - Loading states and error handling
  - Clean, modern UI with smooth animations

## 🛠️ Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication and add Email/Password and Google providers
4. Copy your Firebase config and replace the placeholder in `src/services/firebase.js`

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Auth.css
│   ├── Layout/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   └── ProtectedRoute.jsx
│   └── Map/
│       ├── MapView.jsx
│       └── MapView.css
├── contexts/
│   └── AuthContext.jsx
├── services/
│   └── firebase.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## 🔧 Key Technologies

- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Firebase v10** - Authentication and backend services
- **Leaflet + OpenStreetMap** - Free interactive maps
- **OSRM** - Free routing service
- **Vite** - Fast development build tool

## 🗺️ Map Features

- **100% Free** - No API keys required
- **OpenStreetMap** - Community-driven map data
- **OSRM Routing** - Open Source Routing Machine for directions
- **Custom Markers** - Green for start point, red for destination
- **Interactive Popups** - Show coordinates for selected points
- **Route Visualization** - Blue route line with distance and time

## 🎯 Usage

1. **Authentication**: Sign up or log in using email/password or Google
2. **Route Planning**: 
   - Click on the map to set Point A (start) - green marker
   - Click again to set Point B (destination) - red marker
   - View calculated route with distance and time
   - Use current location button for quick start
3. **Reset**: Click "Clear Route" or click anywhere to start over

## 🚀 Deployment

Build for production:

```bash
npm run build
```

The app can be deployed to:
- Netlify
- Vercel
- Firebase Hosting
- Any static hosting service

## 🔐 Security Notes

- Only Firebase configuration is required
- No external API keys needed
- Firebase security rules should be configured properly
- Environment variables should be used for sensitive data

## 📱 Mobile Support

The app is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile devices with touch support

## 🆓 Cost Benefits

- **No Google Maps API costs**
- **No usage limits**
- **No billing setup required**
- **Community-maintained map data**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.