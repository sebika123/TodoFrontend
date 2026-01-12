"use client";
import { Button } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const HomePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <div>HomePage</div>
      {session ? (
        <Button
          variant="contained"
          onClick={() => {
            signOut();
            router.push("/login");
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
        >
          Sign In
        </Button>
      )}
    </>
  );
};

export default HomePage;
