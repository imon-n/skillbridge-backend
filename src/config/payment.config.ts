/**
 * Payment Configuration File
 * Configure payment settings, currencies, and limits here
 */

export const PAYMENT_CONFIG = {
  // ==================== STRIPE CONFIGURATION ====================
  STRIPE: {
    // Enabled/Disabled
    enabled: process.env.STRIPE_SECRET_KEY ? true : false,
    
    // Stripe-specific settings
    apiVersion: "2024-04-10" as const,
    
    // Payment intent settings
    paymentIntentDefaults: {
      currency: "usd",
      description: "Tutoring Session Payment",
    },

    // Charge settings
    chargeSettings: {
      statementDescriptor: "SkillBridge Tutoring",
    },

    // Test/Live mode indicator
    isTestMode: process.env.NODE_ENV !== "production",

    // Timeout settings
    timeouts: {
      paymentIntentExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      webhookTimeout: 30000, // 30 seconds
    },

    // Retry settings
    retrySettings: {
      maxRetries: 3,
      initialRetryDelay: 1000, // 1 second
      backoffMultiplier: 2,
    },
  },

  // ==================== SSLCOMMERZ CONFIGURATION ====================
  SSLCOMMERZ: {
    // Enabled/Disabled
    enabled: process.env.SSLCOMMERZ_STORE_ID ? true : false,

    // API settings
    apiUrl: process.env.SSLCOMMERZ_API_URL || 
      "https://testbox.sslcommerz.com/gwprocess/v4/api.php",
    
    validationUrl: process.env.SSLCOMMERZ_VALIDATION_URL ||
      "https://testbox.sslcommerz.com/validator/api/validationserverAPI.php",

    // Payment settings
    paymentDefaults: {
      currency: "BDT",
      shippingMethod: "NO",
      productCategory: "tutoring",
      productProfile: "general",
    },

    // Customer settings
    customerDefaults: {
      city: "Dhaka",
      state: "Dhaka",
      postcode: "1000",
      country: "Bangladesh",
    },

    // Timeout settings
    timeouts: {
      sessionExpiry: 24 * 60 * 60 * 1000, // 24 hours
      apiTimeout: 30000, // 30 seconds
    },

    // Retry settings
    retrySettings: {
      maxRetries: 3,
      initialRetryDelay: 1000,
      backoffMultiplier: 2,
    },

    // Test mode indicator
    isTestMode: process.env.NODE_ENV !== "production",
  },

  // ==================== GENERAL PAYMENT SETTINGS ====================
  GENERAL: {
    // Default currency
    defaultCurrency: "USD",

    // Payment timeout
    paymentTimeout: 30 * 60 * 1000, // 30 minutes

    // Failed payment retry
    failedPaymentRetry: {
      enabled: true,
      maxAttempts: 3,
      delayBetweenRetries: 5 * 60 * 1000, // 5 minutes
    },

    // Refund settings
    refund: {
      enabled: true,
      autoRefundOnCancellation: false,
      maxRefundDays: 30,
    },

    // Notification settings
    notifications: {
      emailOnSuccess: true,
      emailOnFailure: true,
      emailOnRefund: true,
      smsCopy: false,
    },

    // Amount limits
    limits: {
      minAmount: 0.5, // USD / BDT equivalent
      maxAmount: 10000, // USD / BDT equivalent
    },

    // Booking settings
    booking: {
      requirePaymentBeforeConfirmation: true,
      autoConfirmAfterPayment: true,
      cancelUnpaidBookingsAfter: 24 * 60 * 60 * 1000, // 24 hours
    },

    // Logging settings
    logging: {
      logAllTransactions: true,
      logFailedAttempts: true,
      logWebhooks: true,
    },

    // Rate limiting
    rateLimit: {
      paymentRequestsPerMinute: 10,
      paymentRequestsPerHour: 100,
      ipLimit: true,
    },
  },

  // ==================== FEE SETTINGS ====================
  FEES: {
    // Stripe fees
    STRIPE: {
      percentage: 2.9, // 2.9%
      flatFee: 0.30, // $0.30 or currency equivalent
      internationalPercentage: 3.9, // 3.9% for international cards
    },

    // SSLCommerz fees
    SSLCOMMERZ: {
      percentage: 1.5, // 1.5%
      flatFee: 10, // BDT 10
    },

    // Should fees be passed to customer
    passToCustomer: false,

    // Offer discount
    discount: {
      enabled: false,
      percentage: 5,
      minAmount: 100,
      maxUsesPerUser: 1,
    },
  },

  // ==================== WEBHOOK SETTINGS ====================
  WEBHOOKS: {
    // Stripe webhook settings
    STRIPE: {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 5000,
      logEvents: true,
      events: [
        "payment_intent.succeeded",
        "payment_intent.payment_failed",
        "payment_intent.canceled",
        "charge.refunded",
      ],
    },

    // SSLCommerz webhook settings
    SSLCOMMERZ: {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 5000,
      logEvents: true,
      validateSignature: true,
    },
  },

  // ==================== SECURITY SETTINGS ====================
  SECURITY: {
    // Encryption
    encryptSensitiveData: true,
    encryptionAlgorithm: "aes-256-cbc",

    // HTTPS enforcement
    enforceHttps: process.env.NODE_ENV === "production",

    // CORS settings
    cors: {
      allowedOrigins: [
        "http://localhost:3000",
        "https://skillbridge-frontend-ten-nu.vercel.app",
      ],
      credentials: true,
    },

    // Token settings
    jwt: {
      expiresIn: "24h",
      algorithm: "HS256",
    },

    // Rate limiting
    bruteForceProtection: {
      maxAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
    },

    // PCI Compliance
    pciCompliance: {
      tokenizeCardData: true,
      neverStoreCVV: true,
      requireSSL: true,
    },
  },

  // ==================== TESTING CONFIGURATION ====================
  TESTING: {
    // Use mock payments in testing
    mockPayments: process.env.MOCK_PAYMENTS === "true",

    // Test data
    testData: {
      // Stripe test cards
      stripeTestCards: {
        visa: "4242424242424242",
        mastercard: "5555555555554444",
        amex: "378282246310005",
      },

      // SSLCommerz test cards
      sslcommerzTestCards: {
        visa: "4111111111111111",
        mastercard: "5555555555554444",
      },

      testCurrency: "USD",
      testAmount: 50,
    },

    // Mock response delay
    mockResponseDelay: 100, // ms
  },

  // ==================== ANALYTICS & REPORTING ====================
  ANALYTICS: {
    trackPayments: true,
    trackFailures: true,
    trackRefunds: true,

    // Metrics to track
    metrics: {
      conversionRate: true,
      averageTransactionValue: true,
      paymentMethodDistribution: true,
      failureRateByGateway: true,
      avgProcessingTime: true,
    },

    // Report generation
    reports: {
      dailyReport: true,
      weeklyReport: true,
      monthlyReport: true,
      onDemandReport: true,
    },
  },
};

// Helper functions for configuration
export const getPaymentConfig = (gateway: "STRIPE" | "SSLCOMMERZ") => {
  return PAYMENT_CONFIG[gateway];
};

export const isPaymentMethodEnabled = (
  method: "STRIPE" | "SSLCOMMERZ"
): boolean => {
  return PAYMENT_CONFIG[method].enabled;
};

export const getEnabledPaymentMethods = (): ("STRIPE" | "SSLCOMMERZ")[] => {
  const methods: ("STRIPE" | "SSLCOMMERZ")[] = [];
  
  if (PAYMENT_CONFIG.STRIPE.enabled) methods.push("STRIPE");
  if (PAYMENT_CONFIG.SSLCOMMERZ.enabled) methods.push("SSLCOMMERZ");
  
  return methods;
};

export const calculateFee = (
  amount: number,
  gateway: "STRIPE" | "SSLCOMMERZ"
): number => {
  const fees = PAYMENT_CONFIG.FEES[gateway];
  return amount * (fees.percentage / 100) + fees.flatFee;
};

export const calculateTotalAmount = (
  amount: number,
  gateway: "STRIPE" | "SSLCOMMERZ"
): number => {
  if (PAYMENT_CONFIG.FEES.passToCustomer) {
    return amount + calculateFee(amount, gateway);
  }
  return amount;
};

export default PAYMENT_CONFIG;
