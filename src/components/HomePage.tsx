"use client";
import { useSession } from "next-auth/react";
import React from "react";

const HomePage = () => {
  const { data: session } = useSession();
  console.log("🚀 ~ HomePage ~ data:", session);
  return <div>HomePage</div>;
};

export default HomePage;
