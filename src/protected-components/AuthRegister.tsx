"use client";

import React from "react";
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
  CircularProgress,
} from "@mui/material";

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
  gender: Gender;
  terms: boolean;
}

const AuthRegister = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormInputs>();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        data
      );
      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      reset();
    } catch (error: any) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 6,
        p: 4,
        border: 1,
        borderColor: "grey.300",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h4" fontWeight={600} mb={3}>
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

          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
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
    </Box>
  );
};

export default AuthRegister;
