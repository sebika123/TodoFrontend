"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import OtpVerification from "@/components/VerifyOtp";

export default function OtpVerificationPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Get email from URL or localStorage
    const emailFromUrl = searchParams.get("email");
    const emailFromStorage = localStorage.getItem("pendingVerificationEmail");

    const finalEmail = emailFromUrl || emailFromStorage || "";

    if (!finalEmail) {
      // No email found, redirect to register
      router.push("/register");
      return;
    }

    setEmail(finalEmail);
    setLoading(false);
  }, [searchParams, router]);

  const handleVerified = (authData: {
    access_token: string;
    refresh_token: string;
    user: any;
  }) => {
    // Save tokens
    localStorage.setItem("access_token", authData.access_token);
    localStorage.setItem("refresh_token", authData.refresh_token);
    localStorage.setItem("user", JSON.stringify(authData.user));

    // Clean up
    localStorage.removeItem("pendingVerificationEmail");

    // Redirect to home
    router.push("/");
  };

  const handleCancel = () => {
    localStorage.removeItem("pendingVerificationEmail");
    router.push("/register");
  };

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ mt: 10, textAlign: "center", minHeight: "100vh" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <OtpVerification
          email={email}
          onVerified={handleVerified}
          onCancel={handleCancel}
        />
      </Box>
    </Container>
  );
}
