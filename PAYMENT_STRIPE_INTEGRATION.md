Stripe Integration Notes

- Add the following environment variables to `SkillBridge-5/.env`:
  - `STRIPE_SECRET_KEY` — your Stripe secret key (server-side)

- Frontend environment (in `skillbridge-frontend/.env` or your deployment env):
  - `NEXT_PUBLIC_STRIPE_PK` — your Stripe publishable key
  - `NEXT_PUBLIC_BACKEND_URL` — backend base URL (e.g. `https://your-backend.com`)
  - `NEXT_PUBLIC_FRONTEND_URL` — frontend base URL (optional; used for return_url)

Quick test steps:

1. Start backend server.
2. Set `STRIPE_SECRET_KEY` in `.env`.
3. Deploy or run frontend; set `NEXT_PUBLIC_STRIPE_PK` and `NEXT_PUBLIC_BACKEND_URL`.
4. Open `/checkout` page on frontend, create a payment intent (provide bookingId and amount).
5. Complete payment via Payment Element; webhook will update payment and booking status.

Notes:
- Webhook endpoint: `/api/v1/payments/stripe/webhook` — the backend accepts webhook events without requiring a Stripe webhook signing secret.
- The backend already includes server-side logic to create PaymentIntents, verify them, and process refunds via Stripe.
