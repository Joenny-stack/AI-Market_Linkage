# Manual Test Cases

Use these test cases to collect screenshots and evidence for the project report or defense.

## Environment

Backend:

```bash
cd "AI Market Linkage/backend"
python manage.py migrate
python manage.py runserver
```

Frontend:

```bash
cd "AI Market Linkage/frontend"
npm install
npm run dev
```

Default URLs:

- API: `http://127.0.0.1:8000/api/`
- Frontend: `http://127.0.0.1:5173`

## Accounts

Prepare at least:

- one farmer account
- one buyer account
- one admin account if admin screenshots are needed

## Test Images

Prepare:

- a clear tomato image under 5 MB
- a poor-quality or poorly lit tomato image
- an image larger than 5 MB for upload validation

## TC01 - Register Farmer

Objective: verify farmer registration.

Steps:

1. Open the register page.
2. Select `Farmer`.
3. Enter name, email, phone, and password.
4. Submit the form.

Expected result:

- Account is created.
- User can login as a farmer.

Evidence:

- Registration screen.
- Successful login/dashboard screen.

## TC02 - Register Buyer

Objective: verify buyer registration.

Steps:

1. Open the register page.
2. Select `Buyer`.
3. Enter name, email, phone, and password.
4. Submit the form.

Expected result:

- Account is created.
- User can login as a buyer.

## TC03 - Login Valid User

Objective: verify successful authentication.

Steps:

1. Open login page.
2. Enter valid email and password.
3. Submit.

Expected result:

- User is redirected to the correct dashboard for their role.

## TC04 - Login Invalid User

Objective: verify login error handling.

Steps:

1. Open login page.
2. Enter valid email with wrong password.
3. Submit.

Expected result:

- Error message is shown.
- User is not logged in.

## TC05 - Create Listing With Image

Objective: verify farmer listing creation.

Steps:

1. Login as farmer.
2. Open create listing page.
3. Enter crop, category, description, quantity, unit, price, location, province, district, and harvest date.
4. Upload a valid image.
5. Submit.

Expected result:

- Listing is created.
- Listing appears in farmer listings and public browse.

## TC06 - Tomato AI Classification

Objective: verify image quality prediction.

Steps:

1. Login as farmer.
2. Create a tomato listing.
3. Upload a clear tomato image.

Expected result:

- AI quality result appears.
- Response includes `predicted_class`, `quality_grade`, and `confidence_score`.

Evidence:

- Screenshot of the AI result.
- API payload or listing detail showing AI fields.

## TC07 - Price Recommendation

Objective: verify recommended price output.

Steps:

1. Create or edit a listing.
2. Enter crop, quantity, location/province, and upload a tomato image to produce a grade.
3. Wait for price recommendation.

Expected result:

- Recommended price appears.
- Listing response contains `recommended_price` or `ai_price_recommendation`.

## TC08 - Unknown Town Price Fallback

Objective: verify price recommendation does not fail for towns outside the training data.

Steps:

1. Create a listing with a town such as `Kwekwe`, `Chinhoyi`, or an unknown rural ward.
2. Complete crop, grade, and quantity inputs.

Expected result:

- Price recommendation is still returned.
- The backend maps known untrained towns to a nearest trained market city or falls back to a general market price.

## TC09 - GPS and Manual Coordinates

Objective: verify location capture.

Steps:

1. Open create listing page.
2. Click `Use My GPS Location`.
3. Check detected accuracy and coordinates.
4. If location is wrong, clear GPS and manually enter latitude/longitude.

Expected result:

- User can use GPS only when correct.
- User can manually correct coordinates before saving.

## TC10 - Map View

Objective: verify map-based discovery.

Steps:

1. Create one or more listings with coordinates.
2. Open the listings map.

Expected result:

- Listings with valid latitude/longitude appear as map markers.
- Marker popup links to listing details.

## TC11 - Buyer Inquiry

Objective: verify buyer-to-farmer inquiry flow.

Steps:

1. Login as buyer.
2. Open a listing detail page.
3. Send an inquiry.
4. Login as the farmer who owns the listing.
5. Open farmer inquiries.

Expected result:

- Buyer inquiry is created.
- Farmer can view it.

## TC12 - Validation Errors

Objective: verify invalid listing input is rejected.

Scenarios:

- Missing image on create.
- Quantity less than or equal to zero.
- Unit other than `kg`.
- Image larger than 5 MB.

Expected result:

- API or UI shows validation error.
- Invalid listing is not saved.

## Evidence Template

For each test case, record:

- tester name
- date
- input data
- expected result
- actual result
- pass/fail status
- screenshot or API response snippet
