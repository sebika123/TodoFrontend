"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
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
import { CheckCircle, Email } from "@mui/icons-material";

interface OtpVerificationProps {
  email: string;
  onVerified: () => void;
  onCancel?: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  email,
  onVerified,
  onCancel,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "success" });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Send OTP on component mount
  useEffect(() => {
    sendOtp();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOtp = async () => {
    setSendingOtp(true);
    try {
      await axios.post("http://localhost:3002/otp/send", { email });
      setSnackbar({
        open: true,
        message: "OTP sent to your email!",
        severity: "success",
      });
      setCountdown(60); // 60 seconds countdown
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to send OTP",
        severity: "error",
      });
    } finally {
      setSendingOtp(false);
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
      const response = await axios.post("http://localhost:3002/otp/verify", {
        email,
        otp: otpCode,
      });
      setSnackbar({
        open: true,
        message: "Email verified successfully!",
        severity: "success",
      });
      setTimeout(() => onVerified(), 1000);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Invalid OTP",
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
                }}
              />
            ))}
          </Box>

          {/* Verify Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={verifyOtp}
            disabled={loading || otp.join("").length !== 6}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ mt: 3 }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          {/* Resend OTP */}
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Didn't receive the code?
            </Typography>
            <Button
              variant="text"
              onClick={sendOtp}
              disabled={sendingOtp || countdown > 0}
              sx={{ mt: 1 }}
            >
              {countdown > 0
                ? `Resend in ${countdown}s`
                : sendingOtp
                ? "Sending..."
                : "Resend OTP"}
            </Button>
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
