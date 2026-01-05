"use client";

import React from "react";
import { Box, Grid, Stack, Typography, Link } from "@mui/material";
import AuthRegister from "@/protected-components/AuthRegister";
import AuthSlider from "@/protected-components/AuthSlider";
import BackgroundPattern, { PageType } from "@/card/BackgroundPattern";
import { AuthSliderProps } from "@/types/auth-types";

const RegisterPage = () => {
  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left Side: Form */}
      <Grid
        item
        xs={12}
        md={6}
        lg={6}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: { xs: 4, md: 8 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 500 }}>
          <Stack spacing={4}>
            {/* Header */}
            <Stack spacing={1} alignItems={{ xs: "center", md: "flex-start" }}>
              <Typography variant="h3" fontWeight={700} color="text.primary">
                Sign me up!
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign={{ xs: "center", md: "left" }}
              >
                Create your account now
              </Typography>
            </Stack>

            {/* Registration Form */}
            <AuthRegister />

            {/* Login Link */}
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign={{ xs: "center", md: "left" }}
            >
              Already have an account?{" "}
              <Link href="/login" color="secondary" underline="hover">
                Log in
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Grid>

      {/* Right Side: Image + Slider */}
      <Grid
        item
        xs={0}
        md={6}
        lg={6}
        sx={{
          display: { xs: "none", md: "block" },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <BackgroundPattern pageType={PageType.AUTH_REGISTER}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                'url("/public/assets/images/auth/RegisterImage.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.85)",
            }}
          />
          {/* Slider content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              pb: 8,
              px: 4,
              textAlign: "center",
              color: "#fff",
            }}
          >
            <AuthSlider items={items} />
          </Box>
        </BackgroundPattern>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;

// Slider items
const items: AuthSliderProps[] = [
  {
    title: "Search by Your Needs",
    description:
      "Find therapists based on your condition or preferred support.",
  },
  {
    title: "Compare Therapists",
    description: "Check profiles, services, and experience at a glance.",
  },
  {
    title: "Contact or Book",
    description: "Send a message or book an appointment instantly.",
  },
  {
    title: "Get the Right Care",
    description: "Start your journey with the support that suits you.",
  },
];
