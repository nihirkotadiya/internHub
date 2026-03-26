import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { gql } from "@/lib/hasura";
import { isValidPassword } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both current and new passwords are required." }, { status: 400 });
    }

    if (!isValidPassword(newPassword)) {
      return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
    }

    const verifyQuery = `query ($id: uuid!, $password: String!) {
      users(where: {id: {_eq: $id}, password: {_eq: $password}}) {
        id
      }
    }`;

    const verifyRes = await gql(verifyQuery, {
      id: session.user.id,
      password: currentPassword
    });

    if (verifyRes.errors) {
       return NextResponse.json({ error: "Error verifying password." }, { status: 500 });
    }

    if (!verifyRes.data?.users?.length) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
    }

    const updateMutation = `mutation ($id: uuid!, $newPassword: String!) {
      update_users_by_pk(pk_columns: {id: $id}, _set: {password: $newPassword}) {
        id
      }
    }`;

    const updateRes = await gql(updateMutation, {
      id: session.user.id,
      newPassword: newPassword
    });

    if (updateRes.errors) {
      return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Change Password Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
