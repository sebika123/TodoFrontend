"use client";
import {
  Button,
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SpeedIcon from "@mui/icons-material/Speed";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import SecurityIcon from "@mui/icons-material/Security";
import MenuIcon from "@mui/icons-material/Menu";
import KanbanBoard from "./KanBanBoard";

const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const features = [
    {
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Easy Task Management",
      description:
        "Create, organize, and complete tasks with our intuitive interface designed for productivity.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Lightning Fast",
      description:
        "Experience blazing fast performance with instant updates and seamless interactions.",
    },
    {
      icon: <CloudSyncIcon sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Cloud Sync",
      description:
        "Access your tasks anywhere, anytime. Your data syncs across all your devices instantly.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: "#667eea" }} />,
      title: "Secure & Private",
      description:
        "Your data is encrypted and secure. We prioritize your privacy above everything else.",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar
        position="sticky"
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          color: "#333",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            TaskFlow
          </Typography>

          {session ? (
            <Button
              variant="contained"
              onClick={() => {
                signOut();
                router.push("/login");
              }}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "25px",
                textTransform: "none",
                px: 3,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6b3f8f 100%)",
                },
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                router.push("/login");
              }}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "25px",
                textTransform: "none",
                px: 3,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6b3f8f 100%)",
                },
              }}
            >
              Sign In
            </Button>
          )}

          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, ml: 2, color: "#333" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 12,
          flex: 1,
        }}
      >
        <Container maxWidth="xl">
          <KanbanBoard />
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          background: "#1a1a2e",
          color: "white",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              width: "100%",
              mt: 4,
              pt: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2024 TaskFlow. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
