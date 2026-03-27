import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { gql } from "@/lib/hasura";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId, role } = session.user as { id: string; role: string };

    // Fetch all announcements with admin secret
    const res = await gql(`query GetAnnouncements {
      announcements(order_by: {created_at: desc}) {
        id
        title
        message
        created_by
        created_by_role
        department_id
        created_at
      }
    }`, {});

    if (res.errors) {
      console.error("GraphQL errors fetching announcements:", res.errors);
      return NextResponse.json({ error: "Failed to fetch announcements", details: res.errors }, { status: 500 });
    }

    let announcements = res.data?.announcements || [];

    if (role !== "admin") {
      // Get current user's department_id (Int) from users table
      const userRes = await gql(`query GetUser($id: uuid!) {
        users(where: { id: { _eq: $id } }) {
          department_id
        }
      }`, { id: userId });

      const myDeptId: number | null = userRes.data?.users?.[0]?.department_id ?? null;

      // Get department_ids for all creators of announcements
      const creatorIds = Array.from(new Set(announcements.map((a: any) => a.created_by)));
      let creatorDeptMap = new Map<string, number | null>();

      if (creatorIds.length > 0) {
        const creatorsRes = await gql(`query GetCreators($ids: [uuid!]!) {
          users(where: { id: { _in: $ids } }) {
            id
            department_id
          }
        }`, { ids: creatorIds });

        if (!creatorsRes.errors && creatorsRes.data?.users) {
          for (const u of creatorsRes.data.users) {
            creatorDeptMap.set(u.id, u.department_id);
          }
        }
      }

      // Filter: show global (admin-created, dept null) OR same-department
      announcements = announcements.filter((a: any) => {
        if (a.created_by_role === "admin") return true; // Admin announcements are global
        const creatorDept = creatorDeptMap.get(a.created_by);
        return creatorDept === myDeptId; // Same department
      });
    }

    // Fetch user names for announcements
    if (announcements.length > 0) {
      const userIds = Array.from(new Set(announcements.map((a: any) => a.created_by)));
      const usersRes = await gql(`
        query GetUsers($ids: [uuid!]!) {
          users(where: { id: { _in: $ids } }) {
            id
            name
          }
        }
      `, { ids: userIds });
      if (!usersRes.errors && usersRes.data?.users) {
        const userMap = new Map(usersRes.data.users.map((u: any) => [u.id, u.name]));
        for (const a of announcements) {
          a.user = { name: userMap.get(a.created_by) || "Unknown" };
        }
      } else {
        for (const a of announcements) {
          a.user = { name: "Unknown" };
        }
      }
    }

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: user_id, role } = session.user as { id: string; role: string };

    if (role === "intern") {
      return NextResponse.json({ error: "Forbidden. Interns cannot create announcements." }, { status: 403 });
    }

    const body = await request.json();
    const { title, message } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
    }

    // Store department_id as null — visibility is determined at read time
    // by comparing the creator's department with the viewer's department
    const mutation = `mutation CreateAnnouncement(
      $title: String!, 
      $message: String!, 
      $created_by: uuid!, 
      $created_by_role: String!
    ) {
      insert_announcements_one(object: {
        title: $title,
        message: $message,
        created_by: $created_by,
        created_by_role: $created_by_role,
        department_id: null
      }) {
        id
        title
      }
    }`;

    const variables = {
      title,
      message,
      created_by: user_id,
      created_by_role: role,
    };

    const res = await gql(mutation, variables);

    if (res.errors) {
      console.error("GraphQL errors creating announcement:", res.errors);
      return NextResponse.json({ error: "Failed to create announcement", details: res.errors }, { status: 500 });
    }

    return NextResponse.json({ announcement: res.data?.insert_announcements_one });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
