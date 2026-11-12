export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
};

export type OtpErrorCode =
  | "INVALID_CODE"
  | "CODE_EXPIRED"
  | "TOO_MANY_ATTEMPTS"
  | "RESEND_TOO_SOON";

export type OtpChallenge = {
  verificationId: string;
  maskedEmail: string;
  expiresAt: number;
  resendAvailableAt: number;
  lockedUntil: number | null;
};

export type OtpState =
  | { kind: "idle" }
  | { kind: "wrong"; attemptsRemaining: number }
  | { kind: "expired" }
  | { kind: "locked"; lockedUntil: number }
  | { kind: "success" };
