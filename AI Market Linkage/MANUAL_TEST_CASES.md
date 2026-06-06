# Manual Test Cases (TC01-TC10)

This document is for running the project test cases manually for documentation.

## 1. Environment Setup

 'python.exe manage.py runserver`
 Start frontend (new terminal):
   - `cd "AI Market Linkage/frontend"`
   - `npm install`
   - `npm run dev`

Base API URL: `http://127.0.0.1:8000/api`
Frontend URL: `http://127.0.0.1:5173`

## 2. Accounts to Prepare

Create one farmer and one buyer account using UI registration or API:
- Farmer: role `FARMER`
- Buyer: role `BUYER`

## 3. Test Data Files

Prepare these files:
- Valid tomato image: under 5MB (jpg/png/webp)
- Low-quality tomato image (poor lighting)
- Large image file: over 5MB

## 4. Manual Test Execution Matrix

### TC01 - User login (valid)
Objective: Verify successful login.
- Input: Correct email and password.
- Steps:
  1. Open frontend login page.
  2. Enter valid farmer credentials.
  3. Submit.
- Expected Result: Redirect to dashboard.
- Evidence to Capture: Dashboard screenshot with logged-in user.

### TC02 - User login (invalid)
Objective: Verify login error handling.
- Input: Wrong password.
- Steps:
  1. Open frontend login page.
  2. Enter valid email with incorrect password.
  3. Submit.
- Expected Result: Error message shown.
- Evidence to Capture: Screenshot showing failed login message.

### TC03 - Upload listing
Objective: Verify listing creation with image and AI fields.
- Input: Product details + valid image.
- Steps:
  1. Login as farmer.
  2. Go to create listing form.
  3. Fill required fields (crop, quantity, unit=kg, price, location, province, district, harvest date).
  4. Attach valid image.
  5. Submit.
- Expected Result: Listing created and saved with AI result fields.
- Evidence to Capture: Listing detail screenshot and API response payload.

### TC04 - AI classification
Objective: Verify classification output values appear.
- Input: Clear tomato image.
- Steps:
  1. Repeat TC03 using a clear ripe tomato image.
  2. Open created listing details.
- Expected Result: Class and grade returned (for example Ripe, Grade A) with confidence value.
- Evidence to Capture: API response containing `predicted_class`, `quality_grade`, `confidence_score`.

### TC05 - Price recommendation
Objective: Verify AI recommended price is returned.
- Input: Crop + grade + quantity.
- Steps:
  1. Create listing as in TC03.
  2. Inspect response details.
- Expected Result: Recommended price is populated.
- Evidence to Capture: API response containing `recommended_price` / `ai_price_recommendation`.

### TC06 - Missing image
Objective: Verify listing image is mandatory on create.
- Input: Product details without image.
- Steps:
  1. Login as farmer.
  2. Submit listing form without attaching image.
- Expected Result: Validation error with message `Image file is required.`
- Evidence to Capture: Error toast/screenshot and API 400 response.

### TC07 - Invalid quantity
Objective: Verify negative quantity validation.
- Input: Negative quantity value.
- Steps:
  1. Login as farmer.
  2. Fill listing form with quantity `< 0`.
  3. Attach valid image and submit.
- Expected Result: Validation error for quantity.
- Evidence to Capture: API 400 response with `quantity_available` error.

### TC08 - Unauthorized access
Objective: Verify buyer cannot access farmer-only create listing API.
- Input: Buyer account creating listing.
- Steps:
  1. Login as buyer.
  2. Attempt to create listing.
- Expected Result: Access denied (`403`).
- Evidence to Capture: Network tab / API response status 403.

### TC09 - AI classification (poor lighting)
Objective: Observe model behavior on low-quality images.
- Input: Poor lighting tomato image.
- Steps:
  1. Login as farmer.
  2. Create listing with low-quality image.
- Expected Result: Classification may degrade; document actual class and confidence.
- Evidence to Capture: Listing response and side-by-side sample image.

### TC10 - Large image upload
Objective: Verify oversized image rejection.
- Input: Image larger than 5MB.
- Steps:
  1. Login as farmer.
  2. Attempt listing create with image file > 5MB.
- Expected Result: Rejected with validation error (5MB limit).
- Evidence to Capture: API 400 response and screenshot.

## 5. API Endpoints Used

- Login: `POST /api/auth/login/`
- Listings create: `POST /api/listings/`
- Listings list: `GET /api/listings/`

## 6. Notes for Documentation

- For each TC, record:
  - Date/time
  - Tester
  - Input used
  - Expected result
  - Actual result
  - Status (Pass/Fail/Partial Pass)
  - Screenshot or response JSON snippet
