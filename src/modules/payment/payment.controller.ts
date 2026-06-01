import { Request, Response } from "express";
import * as PaymentService from "./payment.service";
import { prisma } from "../../../lib/prisma";
import Stripe from "stripe";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

export const createStripeCheckout = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { bookingId, amount, description } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: bookingId, amount",
      });
    }

    const result = await PaymentService.createStripePaymentIntent(
      bookingId,
      user.id,
      amount,
      description || "Tutoring Booking Payment"
    );

    return res.status(200).json({
      success: true,
      message: "Payment intent created",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyStripePayment = async (req: Request, res: Response) => {
  try {
    const { stripePaymentId, bookingId } = req.body;

    if (!stripePaymentId || !bookingId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: stripePaymentId, bookingId",
      });
    }

    const result = await PaymentService.verifyStripePayment(
      stripePaymentId,
      bookingId
    );

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.payment,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createSSLCommerzCheckout = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { bookingId, amount, description } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: bookingId, amount",
      });
    }

    const result = await PaymentService.createSSLCommerzPayment(
      bookingId,
      user.id,
      amount,
      description || "Tutoring Booking Payment"
    );

    return res.status(200).json({
      success: true,
      message: "SSLCommerz payment initiated",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Webhook handlers for SSLCommerz
export const sslCommerzSuccess = async (req: Request, res: Response) => {
  try {
    const { tran_id, status } = req.body;

    if (status === "VALID" || status === "AUTHENTICATED") {
      await PaymentService.verifySSLCommerzPayment(tran_id, req.body.tran_id);

      return res.status(200).json({
        success: true,
        message: "Payment successful",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment validation failed",
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sslCommerzFail = async (req: Request, res: Response) => {
  try {
    const { tran_id } = req.body;

    // Update payment status to FAILED
    await prisma.payment.update({
      where: { orderId: tran_id },
      data: { status: "FAILED" },
    });

    return res.status(200).json({
      success: false,
      message: "Payment failed",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sslCommerzCancel = async (req: Request, res: Response) => {
  try {
    const { tran_id } = req.body;

    // Update payment status to FAILED (cancelled)
    await prisma.payment.update({
      where: { orderId: tran_id },
      data: { status: "FAILED" },
    });

    return res.status(200).json({
      success: false,
      message: "Payment cancelled",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sslCommerzIPN = async (req: Request, res: Response) => {
  try {
    const { tran_id, status, val_id } = req.body;

    if (status === "VALID") {
      // Verify the transaction
      await PaymentService.verifySSLCommerzPayment(val_id, tran_id);
    } else {
      // Update payment status to FAILED
      await prisma.payment.update({
        where: { orderId: tran_id },
        data: { status: "FAILED" },
      });
    }

    return res.status(200).send("OK");
  } catch (error: any) {
    console.error("IPN Error:", error);
    return res.status(500).send("ERROR");
  }
};

// Stripe webhook handler
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = req.body.toString();

  try {
    let event: any;

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(payload, sig || "", webhookSecret);
    } else {
      event = JSON.parse(payload);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any;

      // Update payment status
      await prisma.payment.update({
        where: { stripePaymentId: paymentIntent.id },
        data: {
          status: "COMPLETED",
          transactionId: paymentIntent.id,
          completedAt: new Date(),
        },
      });

      // Update booking status
      if (paymentIntent.metadata.bookingId) {
        await prisma.booking.update({
          where: { id: paymentIntent.metadata.bookingId },
          data: { status: "CONFIRMED" },
        });
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as any;

      // Update payment status
      await prisma.payment.update({
        where: { stripePaymentId: paymentIntent.id },
        data: { status: "FAILED" },
      });
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return res.status(400).json({
      success: false,
      message: `Webhook error: ${error.message}`,
    });
  }
};

export const getPaymentDetails = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const paymentId = Array.isArray(req.params.paymentId)
      ? req.params.paymentId[0]
      : req.params.paymentId;

    const payment = await PaymentService.getPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Verify ownership
    if (payment.userId !== user.id && user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserPaymentHistory = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payments = await PaymentService.getUserPayments(user.id);

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const refundPayment = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can process refunds",
      });
    }

    const paymentId = Array.isArray(req.params.paymentId)
      ? req.params.paymentId[0]
      : req.params.paymentId;
    const { reason } = req.body;

    const result = await PaymentService.refundPayment(
      paymentId,
      reason || "Refund requested"
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPaymentStats = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view payment stats",
      });
    }

    const stats = await PaymentService.getPaymentStats();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
