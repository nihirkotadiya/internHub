async function test() {
  const HASURA_URL = "http://localhost:8080/v1/graphql";
  const ADMIN_SECRET = "myadminsecretkey";

  // Test 1: Fetch with Int filter (like manager/intern)
  console.log("=== TEST 1: GET with Int dept_id ===");
  const q1 = `query GetAnnouncements($dept_id: Int!) {
    announcements(
      where: {
        _or: [
          { department_id: { _is_null: true } },
          { department_id: { _eq: $dept_id } }
        ]
      },
      order_by: {created_at: desc}
    ) {
      id
      title
      message
      created_by
      created_by_role
      department_id
      created_at
    }
  }`;
  const r1 = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: q1, variables: { dept_id: 1 } })
  });
  const d1 = await r1.json();
  console.log(JSON.stringify(d1, null, 2));

  // Test 2: Insert mutation (like manager)
  console.log("\n=== TEST 2: INSERT announcement ===");
  const q2 = `mutation CreateAnnouncement($title: String!, $message: String!, $created_by: uuid!, $created_by_role: String!, $department_id: Int) {
    insert_announcements_one(object: {
      title: $title,
      message: $message,
      created_by: $created_by,
      created_by_role: $created_by_role,
      department_id: $department_id
    }) {
      id
      title
    }
  }`;
  const r2 = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ 
      query: q2, 
      variables: { 
        title: "Test", 
        message: "test msg",
        created_by: "00000000-0000-0000-0000-000000000001",
        created_by_role: "manager",
        department_id: 1
      } 
    })
  });
  const d2 = await r2.json();
  console.log(JSON.stringify(d2, null, 2));
}

test();
