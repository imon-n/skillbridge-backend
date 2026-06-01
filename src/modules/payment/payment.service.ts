import { prisma } from "../../../lib/prisma";
import Stripe from "stripe";
import axios from "axios";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

export const createStripePaymentIntent = async (
  bookingId: string,
  userId: string,
  amount: number,
  description: string
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        bookingId,
        userId,
      },
      description,
    });

    // Create payment record in database
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId,
        amount,
        currency: "USD",
        status: "PENDING",
        method: "STRIPE",
        stripePaymentId: paymentIntent.id,
        description,
      },
    });

    return {
      paymentId: payment.id,
      clientSecret: paymentIntent.client_secret,
      stripePaymentId: paymentIntent.id,
    };
  } catch (error: any) {
    throw new Error(`Stripe payment creation failed: ${error.message}`);
  }
};

export const verifyStripePayment = async (
  stripePaymentId: string,
  bookingId: string
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      stripePaymentId
    );

    if (paymentIntent.status === "succeeded") {
      // Update payment status
      const payment = await prisma.payment.update({
        where: { stripePaymentId: stripePaymentId },
        data: {
          status: "COMPLETED",
          transactionId: paymentIntent.id,
          completedAt: new Date(),
        },
      });

      // Update booking status
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED" },
      });

      return {
        success: true,
        message: "Payment verified successfully",
        payment,
      };
    } else if (paymentIntent.status === "requires_payment_method") {
      return {
        success: false,
        message: "Payment requires payment method",
        status: paymentIntent.status,
      };
    } else {
      throw new Error(`Payment failed with status: ${paymentIntent.status}`);
    }
  } catch (error: any) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};

export const createSSLCommerzPayment = async (
  bookingId: string,
  userId: string,
  amount: number,
  description: string
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Create payment record with PROCESSING status
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId,
        amount,
        currency: "BDT", // SSLCommerz primarily uses BDT
        status: "PROCESSING",
        method: "SSLCOMMERZ",
        description,
        orderId: `ORD-${bookingId}-${Date.now()}`,
      },
    });

    // SSLCommerz API parameters
    const sslCommerzData = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: amount,
      currency: "BDT",
      tran_id: payment.orderId,
      success_url: `${process.env.BACKEND_URL || "http://localhost:3000"}/api/v1/payments/sslcommerz/success`,
      fail_url: `${process.env.BACKEND_URL || "http://localhost:3000"}/api/v1/payments/sslcommerz/fail`,
      cancel_url: `${process.env.BACKEND_URL || "http://localhost:3000"}/api/v1/payments/sslcommerz/cancel`,
      ipn_url: `${process.env.BACKEND_URL || "http://localhost:3000"}/api/v1/payments/sslcommerz/ipn`,
      cus_name: user.name,
      cus_email: user.email,
      cus_phone: user.phone || "Not provided",
      cus_add1: "Customer Address",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      shipping_method: "NO",
      product_name: description,
      product_category: "tutoring",
      product_profile: "general",
    };

    // Call SSLCommerz API
    const response = await axios.post(
      `${process.env.SSLCOMMERZ_API_URL || "https://testbox.sslcommerz.com/gwprocess/v4/api.php"}`,
      sslCommerzData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.status !== "success") {
      throw new Error(`SSLCommerz API error: ${response.data.failedreason}`);
    }

    // Update payment with session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        sslcSessionId: response.data.sessionkey,
      },
    });

    return {
      paymentId: payment.id,
      redirectUrl: response.data.redirectGatewayURL,
      sessionId: response.data.sessionkey,
    };
  } catch (error: any) {
    throw new Error(`SSLCommerz payment creation failed: ${error.message}`);
  }
};

export const verifySSLCommerzPayment = async (
  sslTransactionId: string,
  bookingId: string
) => {
  try {
    const verifyData = {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
      validation_id: sslTransactionId,
    };

    const response = await axios.post(
      `${process.env.SSLCOMMERZ_VALIDATION_URL || "https://testbox.sslcommerz.com/validator/api/validationserverAPI.php"}`,
      verifyData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data[0].status === "VALID") {
      // Update payment status
      const payment = await prisma.payment.update({
        where: { orderId: response.data[0].tran_id },
        data: {
          status: "COMPLETED",
          transactionId: sslTransactionId,
          completedAt: new Date(),
        },
      });

      // Update booking status
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED" },
      });

      return {
        success: true,
        message: "Payment verified successfully",
        payment,
      };
    } else {
      throw new Error("Payment validation failed");
    }
  } catch (error: any) {
    throw new Error(`Payment verification failed: ${error.message}`);
  }
};

export const getPaymentByBookingId = async (bookingId: string) => {
  return await prisma.payment.findFirst({
    where: { bookingId },
  });
};

export const getPaymentById = async (paymentId: string) => {
  return await prisma.payment.findUnique({
    where: { id: paymentId },
  });
};

export const getUserPayments = async (userId: string) => {
  return await prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const refundPayment = async (
  paymentId: string,
  reason: string = "Customer requested refund"
) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.method === "STRIPE" && payment.stripePaymentId) {
      // Refund via Stripe
      const refund = await stripe.refunds.create({
        payment_intent: payment.stripePaymentId,
        reason: "requested_by_customer",
        metadata: {
          refundReason: reason,
        },
      });

      // Update payment status
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "REFUNDED",
        },
      });

      return {
        success: true,
        message: "Refund processed successfully",
        refundId: refund.id,
      };
    } else {
      throw new Error("Refund not supported for this payment method");
    }
  } catch (error: any) {
    throw new Error(`Refund failed: ${error.message}`);
  }
};

export const getPaymentStats = async () => {
  const stats = await prisma.payment.groupBy({
    by: ["status", "method"],
    _count: true,
    _sum: {
      amount: true,
    },
  });

  return stats;
};
