# HABS Frontend

Healthcare Appointment Booking System - Frontend application built with React, TailwindCSS, and Framer Motion.

## Features

- 🎨 Beautiful, modern UI with smooth animations
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔍 Symptom-based hospital search
- 📅 Real-time slot booking
- ⏱️ Live queue tracking
- 🏥 Hospital directory with filters
- 📊 Hospital dashboard for managing appointments

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Date Handling**: date-fns

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode
```bash
npm start
```

The app will open at `http://localhost:3000`

### Production Build
```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── SymptomSearch.jsx
│   ├── HospitalCard.jsx
│   ├── BookingModal.jsx
│   └── LoadingSpinner.jsx
├── pages/              # Route pages
│   ├── Home.jsx
│   ├── Hospitals.jsx
│   ├── HospitalDetail.jsx
│   ├── MyBookings.jsx
│   ├── BookingDetail.jsx
│   └── HospitalDashboard.jsx
├── context/            # React Context
│   └── AppContext.js
├── services/           # API services
│   └── api.js
├── App.js             # Main app component
├── index.js           # Entry point
└── index.css          # Global styles
```

## Key Features

### User Flow
1. **Home Page**: Hero section with symptom search
2. **Hospital Search**: Location-aware hospital listing with filters
3. **Hospital Details**: View slots, doctor info, and book appointments
4. **Booking Confirmation**: Get token number and queue position
5. **My Bookings**: Track all appointments by phone number

### Hospital Dashboard
- View today's appointments
- Update queue information
- Track booking statistics
- Manage patient flow

## Custom Animations

The app uses Framer Motion for smooth animations:
- Fade-in effects
- Slide transitions
- Scale animations
- Page transitions

## Responsive Design

Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Color Scheme

- **Primary**: Blue (#0ea5e9)
- **Secondary**: Purple (#d946ef)
- **Success**: Green
- **Warning**: Orange
- **Error**: Red

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting with React.lazy
- Image optimization
- Memoized components
- Efficient re-renders with React hooks

## Future Enhancements

- [ ] Multi-language support (Gujarati, Hindi)
- [ ] Voice search for symptoms
- [ ] Push notifications
- [ ] PWA support
- [ ] Dark mode
- [ ] Payment integration
- [ ] Chat support

## Contributing

Please follow the existing code style and component structure when contributing.
