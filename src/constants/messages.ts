export const MESSAGES = {
  VALIDATION: {
    EMAIL_INVALID: "Please provide a valid email address.",
    EMAIL_REQUIRED: "Email is required.",
    OTP_LENGTH: "OTP must be exactly 6 digits.",
    OTP_NUMERIC: "OTP must contain only numbers.",
    OTP_REQUIRED: "OTP is required.",
    FAILED: "Validation failed",
    ALL_FIELDS_REQUIRED: "All fields are required.",
    INVALID_ROLE: (roles: string) => `Invalid role. Must be one of: ${roles}`,
  },
  AUTH: {
    EMAIL_ALREADY_REGISTERED: "Email is already registered.",
    OTP_SENT: "OTP sent to your email. Please verify to complete registration.",
    REGISTRATION_SESSION_NOT_FOUND: "Registration session not found. Please register again.",
    REGISTRATION_SUCCESS: "Registration successful. You can now log in.",
    NO_PENDING_REGISTRATION: "No pending registration found. Please register first.",
    OTP_RESENT: "OTP resent successfully. Check your email.",
  },
  OTP: {
    INVALID: "Invalid OTP",
    EXPIRED: "OTP expired",
  }
};
