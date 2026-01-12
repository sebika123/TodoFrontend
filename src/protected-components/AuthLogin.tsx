"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import axios from "axios";
import { signIn } from "next-auth/react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Snackbar,
  CircularProgress,
  IconButton,
  InputAdornment,
  LinearProgress,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

interface RegisterFormInputs {
  name: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  terms: boolean;
}

const AuthLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormInputs>();

  const password = watch("password", "");

  const getPasswordStrength = (pass: string) => {
    if (pass.length < 6)
      return { label: "Too Short", color: "error", value: 20 };
    if (pass.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/))
      return { label: "Strong", color: "success", value: 100 };
    return { label: "Weak", color: "warning", value: 60 };
  };

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    const res = await signIn("credentials", {
      redirect: false, // important for client-side handling
      email: data.email,
      password: data.password,
    });

    if (res?.ok) {
      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });
      router.push("/"); // redirect after login
    } else {
      setSnackbar({
        open: true,
        message: res?.error || "Login failed",
        severity: "error",
      });
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const strength = password ? getPasswordStrength(password) : null;

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        p: 4,
        border: 1,
        borderColor: "grey.300",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={3} textAlign={"center"}>
        Login
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Password Field */}
          <Box>
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {strength && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={strength.value}
                  color={strength.color as "error" | "warning" | "success"}
                  sx={{ height: 8, borderRadius: 5 }}
                />
                <Typography
                  variant="body2"
                  color={`${strength.color}.main`}
                  mt={0.5}
                >
                  {strength.label}
                </Typography>
              </Box>
            )}

            {errors.password && (
              <Typography variant="body2" color="error">
                {errors.password.message}
              </Typography>
            )}
          </Box>

          {/* Confirm Password Field */}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Submitting..." : "Login"}
          </Button>
        </Stack>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

export default AuthLogin;
