# Project Overview

## Purpose

The AI Powered Market Linkage Platform is a prototype system for improving agricultural market access. It connects farmers and buyers, supports produce listings and inquiries, and adds AI-based decision support for quality assessment and price recommendation.

## Users

- Farmers create listings, upload images, manage their produce, and view buyer inquiries.
- Buyers browse listings, filter products, view details, and send inquiries.
- Admin users can manage platform data through Django admin.

## Main Modules

Backend:

- `users`: custom email-based user model, roles, registration, login, and profile endpoints.
- `farmers`: farmer profile data.
- `listings`: product listing, image upload, filters, coordinate handling, and owner permissions.
- `inquiries`: buyer-to-farmer inquiry workflow.
- `ai_service`: tomato image classification and price recommendation APIs.

Frontend:

- `api`: Axios client and endpoint wrappers.
- `context`: Zustand authentication store.
- `components`: navigation, route protection, filters, listing cards, and AI result display.
- `pages`: dashboards, listing forms, detail pages, inquiries, map, login, and registration.
- `styles`: page and component CSS.

AI assets:

- `ai_model/train_model.py`: trains the tomato quality image classifier.
- `ai_model/model/tomato_classifier.h5`: trained tomato classifier.
- `ai_model/model/evaluation_metrics.json`: classifier evaluation results.
- `ai_model/price_model/train_price_model.py`: trains the price recommender.
- `ai_model/price_model/price_model.pkl`: trained Random Forest price model.
- `ai_model/price_model/encoders.pkl`: categorical encoders for crop, location, and grade.

## Model Choices

### Tomato Image Classifier

The image model uses a MobileNetV2-based convolutional neural network with transfer learning. This is suitable because produce-quality assessment is an image-classification task. MobileNetV2 is lightweight compared with larger CNNs, which makes it practical for a prototype that may later target web or mobile use. Transfer learning reduces the amount of training data required, and fine-tuning the later layers adapts the model to tomato quality classes.

The classifier predicts:

- `Damaged`
- `Old`
- `Ripe`
- `Unripe`

These are mapped to market grades:

- `Ripe` -> `Grade A`
- `Unripe` -> `Grade B`
- `Old` -> `Grade C`
- `Damaged` -> `Reject`

The saved evaluation metrics show approximately 93 percent accuracy for the current classifier, which is strong enough for a prototype demonstration.

### Price Recommendation Model

The price model uses `RandomForestRegressor`. This is suitable because the inputs are structured/tabular fields:

- crop
- location
- quality grade
- quantity

Random Forest handles non-linear relationships better than a single linear model, is robust for small-to-medium tabular datasets, and is easier to explain during defense than a neural network for pricing. The system maps untrained towns to the nearest trained market city where possible, and falls back to a general market price when the location is completely unknown.

## Current Feature Coverage

- Secure user registration and login.
- Farmer and buyer roles.
- Listing creation with required image upload.
- Tomato AI quality classification.
- AI price recommendation.
- Price fallback for untrained or unknown towns.
- Manual and GPS-assisted location entry.
- Map-based listing discovery.
- Buyer inquiries and farmer inquiry management.
- API documentation.

## Known Prototype Boundaries

- Image recognition is limited to tomato quality classification.
- Price recommendations are based on the available training data and fallback logic, not live market feeds.
- The platform does not include payments, logistics, delivery tracking, or real-time chat.
- Browser GPS can be approximate, so manual coordinates are supported.
- Production deployment requires security hardening.

## System Flow

1. A user registers as a farmer or buyer.
2. A farmer creates a listing and uploads a produce image.
3. If the listing is tomato-related, the image classifier predicts quality.
4. The quality grade, crop, location, and quantity are used for price recommendation.
5. Buyers browse listings, use filters or the map, and send inquiries.
6. Farmers view and respond to inquiries outside the platform or mark them as responded.

## Validation

Backend validation:

```bash
cd "AI Market Linkage/backend"
python manage.py check
python manage.py test
```

Frontend validation:

```bash
cd "AI Market Linkage/frontend"
npm run lint
npm run build
```
