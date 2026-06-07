# Frontend README

The frontend is a React + Vite single-page application for the AI Powered Market Linkage Platform.

## Main Responsibilities

- Registration and login screens.
- Role-based navigation and protected routes.
- Farmer dashboard and listing management.
- Buyer dashboard and inquiry tracking.
- Listing browsing, filtering, and detail view.
- Create/edit listing forms with image upload.
- AI quality and price result display.
- Explicit GPS capture with accuracy warning and manual coordinate override.
- Map-based listing discovery with Leaflet and OpenStreetMap.

## Setup

```bash
cd "AI Market Linkage/frontend"
npm install
```

Optional environment file:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Save this as `.env.local` if needed.

## Development

```bash
npm run dev
```

Default local URL:

- `http://127.0.0.1:5173`

## Validation

```bash
npm run lint
npm run build
npm audit --omit=dev --audit-level=high
```

## Source Structure

```text
src/
  api/
    client.js
    endpoints.js
  components/
    AIQualityResult.jsx
    ListingCard.jsx
    ListingFilter.jsx
    Navbar.jsx
    ProtectedRoute.jsx
  context/
    authStore.js
  hooks/
  pages/
    AddListingPage.jsx
    BrowseListingsPage.jsx
    EditListingPage.jsx
    FarmerDashboardPage.jsx
    BuyerDashboardPage.jsx
    ListingDetailPage.jsx
    MapPage.jsx
  styles/
  utils/
```

## Important Behaviors

AI quality:

- Triggered when a user uploads a product image.
- The current classifier is tomato-focused.
- The UI displays quality class, grade, confidence, and price recommendation status.

Price recommendation:

- Runs after quality grade and crop details are available.
- If an image is uploaded first, the UI asks the user to enter crop details. No re-upload is required.
- Unsupported or unknown towns are handled by backend fallback logic.

GPS:

- The app does not auto-save browser GPS on page load.
- The user must click `Use My GPS Location`.
- The UI displays the accuracy estimate.
- Users can clear incorrect GPS and enter latitude/longitude manually.

Map:

- Listings with valid coordinates appear as markers.
- Marker popups link to listing detail pages.

## Production Build

```bash
npm run build
```

Deploy the generated `dist/` folder to a static hosting provider and set `VITE_API_URL` to the production backend API.
