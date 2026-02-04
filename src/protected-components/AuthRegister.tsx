"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import axios from "axios";
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
import OtpVerification from "@/app/otp-verification/page";
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

const AuthRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
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
    getValues,
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
    const { confirmPassword, ...payload } = data;
    try {
      const response = await axios.post(
        "http://localhost:3002/auth/register",
        payload
      );

      // Store email and show OTP verification
      setRegisteredEmail(data.email);

      setSnackbar({
        open: true,
        message: "Registration successful! Please verify your email.",
        severity: "success",
      });
      router.push("/otp-verification");
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message,
        severity: "error",
      });
    }
  };

  const handleCancelOtp = () => {
    setShowOtpVerification(false);
    setSnackbar({
      open: true,
      message: "Verification cancelled. Please verify your email later.",
      severity: "error",
    });
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
        backgroundColor: "background.paper",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" fontWeight={600} mb={3} textAlign={"center"}>
        Register
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            label="Name"
            fullWidth
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Phone"
            fullWidth
            {...register("phone", { required: "Phone is required" })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          <TextField
            label="Address"
            fullWidth
            {...register("address", { required: "Address is required" })}
            error={!!errors.address}
            helperText={errors.address?.message}
          />

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
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>Gender</InputLabel>
            <Controller
              name="gender"
              control={control}
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <Select {...field} label="Gender">
                  <MenuItem value="">
                    <em>Select gender</em>
                  </MenuItem>
                  <MenuItem value={Gender.MALE}>Male</MenuItem>
                  <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                  <MenuItem value={Gender.OTHER}>Other</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.gender?.message}</FormHelperText>
          </FormControl>

          <FormControl error={!!errors.terms}>
            <Controller
              name="terms"
              control={control}
              rules={{ required: "You must accept terms and conditions" }}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="I accept the terms and conditions"
                />
              )}
            />
            <FormHelperText>{errors.terms?.message}</FormHelperText>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? "Submitting..." : "Register"}
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

export default AuthRegister;
