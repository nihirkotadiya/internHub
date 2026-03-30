import { NextRequest, NextResponse } from "next/server";
import { gql } from "@/lib/hasura";
import { generateOTP, sendOTPMock } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Check if user exists
    const userQuery = `query ($email: String!) {
      users(where: {email: {_eq: $email}}) {
        id
      }
    }`;
    const userRes = await gql(userQuery, { email });
    if (!userRes.data?.users?.length) {
      return NextResponse.json({ error: "User with this email does not exist" }, { status: 404 });
    }

    // 2. Generate OTP
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes from now

    // 3. Save OTP in DB (using mutation)
    const insertMutation = `mutation ($email: String!, $otp: String!, $expiry: timestamp!) {
      insert_password_reset_otps_one(object: {
        email: $email,
        otp: $otp,
        expiry: $expiry
      }) {
        id
      }
    }`;
    const insertRes = await gql(insertMutation, { email, otp, expiry });

    if (insertRes.errors) {
      console.error("OTP Insert Error:", insertRes.errors);
      return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 });
    }

    // 4. Send OTP
    await sendOTPMock(email, otp);

    return NextResponse.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("Reset Password Request Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
