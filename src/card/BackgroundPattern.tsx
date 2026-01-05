"use client";
import { ReactElement } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

// assets
const authPattern = "/assets/images/auth/RegisterImage.jpg";

const authRegisterPattern = "/assets/images/auth/RegisterImage.jpg";

// ===========================|| BACKGROUND GRID PATTERN 1 ||=========================== //

export enum PageType {
  AUTH = "auth",
  AUTH_REGISTER = "authRegister",
  RESET_PASSWORD = "resetPassword",
  FORGOT_PASSWORD = "forgotPassword",
  OTP_VERIFICATION = "otpVerification",
  CHECK_MAIL = "checkmail",
}

const backgroundPatternMap: Record<PageType, string> = {
  [PageType.AUTH]: authPattern,
  [PageType.AUTH_REGISTER]: authRegisterPattern,
  [PageType.RESET_PASSWORD]: authPattern,
  [PageType.FORGOT_PASSWORD]: authPattern,
  [PageType.OTP_VERIFICATION]: authPattern,
  [PageType.CHECK_MAIL]: authPattern,
};

interface BackgroundPatternProps {
  pageType: PageType;
  children?: ReactElement | ReactElement[];
}

const BackgroundPattern = ({ pageType, children }: BackgroundPatternProps) => {
  const theme = useTheme();
  console.log("🚀 ~ authPattern:", `url(${backgroundPatternMap[pageType]})`);
  return (
    <Box
      component="span"
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#fff",
        backgroundImage: `url(${backgroundPatternMap[pageType]})`,
        position: "absolute",
        backgroundSize: "cover",
        overflow: "hidden",
        m: "0 0 0 auto",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: theme.palette.mode === "dark" ? 0.85 : 0.9,
      }}
    >
      {children}
    </Box>
  );
};

export default BackgroundPattern;
