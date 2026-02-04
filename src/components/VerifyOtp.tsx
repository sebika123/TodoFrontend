"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Snackbar,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { Email, AccessTime } from "@mui/icons-material";

interface OtpVerificationProps {
  email: string;
  onVerified: (data: {
    access_token: string;
    refresh_token: string;
    user: any;
  }) => void;
  onCancel?: () => void;
}

// GraphQL mutations
const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOtp($input: VerifyOtpDto!) {
    verifyOtp(input: $input) {
      message
      access_token
      refresh_token
      user {
        id
        name
        email
        role
        isVerified
      }
    }
  }
`;

const RESEND_OTP_MUTATION = gql`
  mutation ResendOtp($input: ResendOtpDto!) {
    resendOtp(input: $input) {
      message
      otpExpires
    }
  }
`;

const OTP_EXPIRY_MINUTES = 10; // Match your backend OTP expiry

const OtpVerification: React.FC<OtpVerificationProps> = ({
  email,
  onVerified,
  onCancel,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpExpiryTime, setOtpExpiryTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(OTP_EXPIRY_MINUTES * 60); // in seconds
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // GraphQL mutations
  const [verifyOtpMutation] = useMutation(VERIFY_OTP_MUTATION);
  const [resendOtpMutation] = useMutation(RESEND_OTP_MUTATION);

  // Resend OTP countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // OTP expiry countdown timer
  useEffect(() => {
    if (timeLeft > 0 && otpExpiryTime) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        if (timeLeft - 1 <= 0) {
          setIsOtpExpired(true);
          setSnackbar({
            open: true,
            message: "OTP has expired. Please request a new one.",
            severity: "warning",
          });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, otpExpiryTime]);

  // Initialize OTP expiry when component mounts
  useEffect(() => {
    const initialExpiryTime = new Date();
    initialExpiryTime.setMinutes(
      initialExpiryTime.getMinutes() + OTP_EXPIRY_MINUTES
    );
    setOtpExpiryTime(initialExpiryTime);
    setTimeLeft(OTP_EXPIRY_MINUTES * 60);
    setIsOtpExpired(false);
  }, []);

  const sendOtp = async () => {
    if (countdown > 0) return;

    try {
      const { data } = await resendOtpMutation({
        variables: {
          input: { email },
        },
      });

      if (data?.resendOtp) {
        // Set new expiry time
        const newExpiryTime = new Date(data.resendOtp.otpExpires);
        setOtpExpiryTime(newExpiryTime);
        setTimeLeft(Math.floor((newExpiryTime.getTime() - Date.now()) / 1000));
        setIsOtpExpired(false);

        // Clear OTP input
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();

        setSnackbar({
          open: true,
          message: data.resendOtp.message,
          severity: "success",
        });
        setCountdown(60); // Reset resend cooldown to 60 seconds
      }
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to resend OTP",
        severity: "error",
      });
    }
  };

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setSnackbar({
        open: true,
        message: "Please enter complete OTP",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await verifyOtpMutation({
        variables: {
          input: {
            email,
            otp: otpCode,
          },
        },
      });

      if (data?.verifyOtp) {
        setSnackbar({
          open: true,
          message: data.verifyOtp.message,
          severity: "success",
        });

        // Pass the complete auth data to parent component
        setTimeout(() => {
          onVerified({
            access_token: data.verifyOtp.access_token,
            refresh_token: data.verifyOtp.refresh_token,
            user: data.verifyOtp.user,
          });
        }, 1000);
      }
    } catch (error: any) {
      console.error("Verification error:", error);

      let errorMessage = "Invalid OTP";
      if (error.message.includes("expired")) {
        errorMessage = "OTP has expired. Please request a new one.";
        setIsOtpExpired(true);
      } else if (error.message.includes("already verified")) {
        errorMessage = "Email is already verified. Please login.";
        setTimeout(() => {
          if (onCancel) onCancel(); // Redirect to login
        }, 2000);
      } else if (error.message.includes("not found")) {
        errorMessage = "User not found.";
        setTimeout(() => {
          if (onCancel) onCancel(); // Redirect to register
        }, 2000);
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });

      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Box
      sx={{
        maxWidth: 450,
        mx: "auto",
        mt: 6,
        p: 4,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Stack spacing={3} alignItems="center">
          <Email sx={{ fontSize: 60, color: "primary.main" }} />

          <Typography variant="h5" fontWeight={600} textAlign="center">
            Verify Your Email
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            We've sent a 6-digit code to
            <br />
            <strong>{email}</strong>
          </Typography>

          {/* OTP Input Boxes */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
            }}
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e as any)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                  },
                }}
                sx={{
                  width: 56,
                  "& input": {
                    padding: "16px 0",
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isOtpExpired
                      ? "rgba(255, 0, 0, 0.05)"
                      : "transparent",
                    borderColor: isOtpExpired ? "error.main" : "",
                  },
                }}
                disabled={isOtpExpired}
              />
            ))}
          </Box>

          {/* OTP Timer */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime
              sx={{
                fontSize: 20,
                color: isOtpExpired
                  ? "error.main"
                  : timeLeft < 60
                  ? "warning.main"
                  : "primary.main",
              }}
            />
            <Typography
              variant="body2"
              color={
                isOtpExpired
                  ? "error.main"
                  : timeLeft < 60
                  ? "warning.main"
                  : "text.secondary"
              }
              fontWeight={isOtpExpired ? 600 : 400}
            >
              {isOtpExpired
                ? "OTP Expired"
                : `Expires in ${formatTime(timeLeft)}`}
            </Typography>
          </Box>

          {/* Verify Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={verifyOtp}
            disabled={loading || otp.join("").length !== 6 || isOtpExpired}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              mt: 1,
              ...(isOtpExpired && {
                backgroundColor: "grey.400",
                color: "grey.600",
                "&:hover": {
                  backgroundColor: "grey.400",
                },
              }),
            }}
          >
            {loading
              ? "Verifying..."
              : isOtpExpired
              ? "OTP Expired"
              : "Verify OTP"}
          </Button>

          {/* Resend OTP Section */}
          <Box textAlign="center" sx={{ width: "100%" }}>
            <Typography variant="body2" color="text.secondary">
              Didn't receive the code?
            </Typography>

            {countdown > 0 ? (
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Resend available in {countdown}s
                </Typography>
              </Box>
            ) : (
              <Button
                variant="text"
                onClick={sendOtp}
                disabled={countdown > 0}
                sx={{ mt: 1 }}
              >
                Resend OTP
              </Button>
            )}

            {isOtpExpired && (
              <Alert
                severity="warning"
                sx={{ mt: 2 }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={sendOtp}
                    disabled={countdown > 0}
                  >
                    Resend
                  </Button>
                }
              >
                OTP has expired. Please request a new one.
              </Alert>
            )}
          </Box>

          {/* Cancel Button */}
          {onCancel && (
            <Button variant="outlined" fullWidth onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Stack>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OtpVerification;
