"use client";
import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { AuthSliderProps } from "@/types/auth-types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import dynamic from "next/dynamic";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

interface Props {
  items: AuthSliderProps[];
}

const AuthSlider: React.FC<Props> = ({ items }) => {
  const settings = {
    autoplay: true,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {items.map((item, i) => (
        <Stack
          key={i}
          alignItems="center"
          sx={{ padding: "0 37px 16px", maxWidth: "632px", margin: "0 auto" }}
          gap={2}
          textAlign="center"
        >
          <Typography variant="h5" color="#000">
            {item.title}
          </Typography>
          <Typography variant="body1" color="#000" fontWeight={600}>
            {item.description}
          </Typography>
        </Stack>
      ))}
    </Slider>
  );
};

export default AuthSlider;
