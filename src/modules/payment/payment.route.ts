import express from "express";
import * as PaymentController from "./payment.controller";
import authMiddleware, { UserRole } from "../../midlewares/auth.middleware";

const router = express.Router();

// Stripe routes
router.post(
  "/stripe/checkout",
  authMiddleware(UserRole.STUDENT),
  PaymentController.createStripeCheckout
);

router.post(
  "/stripe/verify",
  authMiddleware(UserRole.STUDENT),
  PaymentController.verifyStripePayment
);

// SSLCommerz routes
router.post(
  "/sslcommerz/checkout",
  authMiddleware(UserRole.STUDENT),
  PaymentController.createSSLCommerzCheckout
);

router.post("/sslcommerz/success", PaymentController.sslCommerzSuccess);
router.post("/sslcommerz/fail", PaymentController.sslCommerzFail);
router.post("/sslcommerz/cancel", PaymentController.sslCommerzCancel);
router.post("/sslcommerz/ipn", PaymentController.sslCommerzIPN);

// Payment history and details
router.get(
  "/history",
  authMiddleware(),
  PaymentController.getUserPaymentHistory
);

router.get(
  "/:paymentId",
  authMiddleware(),
  PaymentController.getPaymentDetails
);

// Admin routes
router.post(
  "/:paymentId/refund",
  authMiddleware(UserRole.ADMIN),
  PaymentController.refundPayment
);

router.get(
  "/admin/stats",
  authMiddleware(UserRole.ADMIN),
  PaymentController.getPaymentStats
);

export default router;
