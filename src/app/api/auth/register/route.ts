// app/api/auth/register/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "http://localhost:3001",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight OPTIONS request
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { headers });
  }

  const body = await request.json();

  // Example: simple response
  return NextResponse.json(
    { message: "Registration successful", data: body },
    { headers }
  );
}
