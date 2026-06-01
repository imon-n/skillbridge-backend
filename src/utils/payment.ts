/**
 * Payment Utility Functions
 * Helper functions for payment processing and validation
 */

import {
  PaymentStatus,
  PaymentMethod,
} from "@prisma/client";

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  STRIPE: "Credit/Debit Card (Stripe)",
  SSLCOMMERZ: "SSLCommerz (Bangladesh)",
};

/**
 * Validate payment amount
 */
export const validatePaymentAmount = (
  amount: number,
  minAmount: number = 0.5,
  maxAmount: number = 10000
): { valid: boolean; error?: string } => {
  if (!amount || amount <= 0) {
    return { valid: false, error: "Amount must be greater than 0" };
  }

  if (amount < minAmount) {
    return {
      valid: false,
      error: `Amount must be at least ${minAmount}`,
    };
  }

  if (amount > maxAmount) {
    return {
      valid: false,
      error: `Amount cannot exceed ${maxAmount}`,
    };
  }

  return { valid: true };
};

/**
 * Format payment amount for currency
 */
export const formatPaymentAmount = (
  amount: number,
  currency: string = "USD"
): string => {
  const formatters: Record<string, Intl.NumberFormat> = {
    USD: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }),
    BDT: new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
    }),
  };

  const formatter = formatters[currency] || formatters.USD;
  return formatter.format(amount);
};

/**
 * Convert amount between currencies (approximate)
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  // Approximate exchange rates (should use real API in production)
  const rates: Record<string, Record<string, number>> = {
    USD: { BDT: 110, USD: 1 },
    BDT: { USD: 0.0091, BDT: 1 },
  };

  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rate = rates[fromCurrency]?.[toCurrency];
  if (!rate) {
    console.warn(
      `Exchange rate not found for ${fromCurrency} to ${toCurrency}`
    );
    return amount;
  }

  return amount * rate;
};

/**
 * Generate transaction ID
 */
export const generateTransactionId = (prefix: string = "TXN"): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

/**
 * Generate order ID
 */
export const generateOrderId = (bookingId: string): string => {
  const timestamp = Date.now().toString();
  return `ORD-${bookingId}-${timestamp}`;
};

/**
 * Check if payment status is terminal
 */
export const isTerminalPaymentStatus = (
  status: PaymentStatus
): boolean => {
  return ["COMPLETED", "FAILED", "REFUNDED"].includes(status);
};

/**
 * Check if payment can be refunded
 */
export const canRefundPayment = (
  status: PaymentStatus,
  method: PaymentMethod
): boolean => {
  // Only COMPLETED payments can be refunded
  if (status !== "COMPLETED") {
    return false;
  }

  // Only Stripe payments can be refunded automatically
  if (method !== "STRIPE") {
    return false;
  }

  return true;
};

/**
 * Get payment status badge color
 */
export const getPaymentStatusColor = (
  status: PaymentStatus
): string => {
  const colors: Record<PaymentStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
    REFUNDED: "bg-purple-100 text-purple-800",
  };

  return colors[status] || "bg-gray-100 text-gray-800";
};

/**
 * Get payment method icon/badge color
 */
export const getPaymentMethodColor = (
  method: PaymentMethod
): string => {
  const colors: Record<PaymentMethod, string> = {
    STRIPE: "bg-blue-100 text-blue-800",
    SSLCOMMERZ: "bg-green-100 text-green-800",
  };

  return colors[method] || "bg-gray-100 text-gray-800";
};

/**
 * Validate email for payment
 */
export const validatePaymentEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Check if it's between 10 and 15 digits (international standard)
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  // Bangladesh format
  if (cleaned.startsWith("88")) {
    return `+${cleaned}`;
  }

  // US format
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }

  // Generic international format
  if (cleaned.length > 10) {
    return `+${cleaned}`;
  }

  return phone;
};

/**
 * Get payment retry delay (exponential backoff)
 */
export const getRetryDelay = (
  attempt: number,
  baseDelay: number = 1000,
  multiplier: number = 2
): number => {
  return baseDelay * Math.pow(multiplier, attempt - 1);
};

/**
 * Check if payment is expired
 */
export const isPaymentExpired = (
  createdAt: Date,
  expiryHours: number = 24
): boolean => {
  const expiryTime = new Date(createdAt.getTime() + expiryHours * 60 * 60 * 1000);
  return new Date() > expiryTime;
};

/**
 * Create payment metadata
 */
export const createPaymentMetadata = (
  data: Record<string, any>
): string => {
  return JSON.stringify(data);
};

/**
 * Parse payment metadata
 */
export const parsePaymentMetadata = (
  metadata: string | null
): Record<string, any> => {
  if (!metadata) {
    return {};
  }

  try {
    return JSON.parse(metadata);
  } catch (error) {
    console.error("Failed to parse payment metadata:", error);
    return {};
  }
};

/**
 * Calculate payment processing time
 */
export const calculateProcessingTime = (
  startTime: Date,
  endTime: Date
): { milliseconds: number; seconds: number; minutes: number } => {
  const diff = endTime.getTime() - startTime.getTime();

  return {
    milliseconds: diff,
    seconds: Math.round(diff / 1000),
    minutes: Math.round(diff / 60000),
  };
};

/**
 * Format payment description
 */
export const formatPaymentDescription = (
  tutorName: string,
  date: string,
  time: string
): string => {
  return `Tutoring Session with ${tutorName} on ${date} at ${time}`;
};

/**
 * Get payment statistics
 */
export const calculatePaymentStats = (
  payments: Array<{ status: PaymentStatus; amount: number }>
): {
  total: number;
  completed: number;
  failed: number;
  pending: number;
  totalAmount: number;
  completedAmount: number;
  averageAmount: number;
  successRate: number;
} => {
  const stats = {
    total: payments.length,
    completed: payments.filter((p) => p.status === "COMPLETED").length,
    failed: payments.filter((p) => p.status === "FAILED").length,
    pending: payments.filter((p) => p.status === "PENDING").length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    completedAmount: payments
      .filter((p) => p.status === "COMPLETED")
      .reduce((sum, p) => sum + p.amount, 0),
    averageAmount:
      payments.length > 0
        ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length
        : 0,
    successRate:
      payments.length > 0
        ? (payments.filter((p) => p.status === "COMPLETED").length /
            payments.length) *
          100
        : 0,
  };

  return stats;
};

/**
 * Validate Stripe payment intent ID
 */
export const isValidStripePaymentIntentId = (id: string): boolean => {
  return /^pi_[a-zA-Z0-9]{24,}$/.test(id);
};

/**
 * Validate SSLCommerz transaction ID
 */
export const isValidSSLCommerzTransactionId = (id: string): boolean => {
  // SSLCommerz transaction IDs are typically numeric or alphanumeric
  return /^[a-zA-Z0-9]{3,}$/.test(id);
};

/**
 * Log payment event
 */
export const logPaymentEvent = (
  event: string,
  data: Record<string, any>,
  level: "info" | "warn" | "error" = "info"
): void => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    level,
    data,
  };

  if (level === "error") {
    console.error(`[Payment Error] ${timestamp}:`, data);
  } else if (level === "warn") {
    console.warn(`[Payment Warning] ${timestamp}:`, data);
  } else {
    console.log(`[Payment Info] ${timestamp}:`, data);
  }

  // Here you could send to external logging service (e.g., Sentry, LogRocket)
};

export default {
  formatPaymentAmount,
  convertCurrency,
  generateTransactionId,
  generateOrderId,
  isTerminalPaymentStatus,
  canRefundPayment,
  getPaymentStatusColor,
  getPaymentMethodColor,
  validatePaymentAmount,
  validatePaymentEmail,
  validatePhoneNumber,
  formatPhoneNumber,
};
