"use client";
import { ReactElement } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import RegisterImage from "../../public/RegisterImage.jpg";

// assets
const authPattern = "/RegisterImage.jpg"; // use string path
const authRegisterPattern = "/RegisterImage.jpg";

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
      component="div"
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundImage: `url(${backgroundPatternMap[pageType]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "absolute",
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
