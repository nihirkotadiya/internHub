async function test() {
  const HASURA_URL = "http://localhost:8080/v1/graphql";
  const ADMIN_SECRET = "myadminsecretkey";

  // Try inserting with department_id as null (admin style) 
  const q1 = `mutation CreateAnnouncement($title:String!,$message:String!,$created_by:uuid!,$created_by_role:String!,$department_id:uuid) {
    insert_announcements_one(object:{title:$title,message:$message,created_by:$created_by,created_by_role:$created_by_role,department_id:$department_id}) {
      id title department_id
    }
  }`;

  // First get a real uuid user id
  const userRes = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: `query { users(limit:1,where:{role:{_eq:"manager"}}) { id department_id } }` })
  });
  const userData = await userRes.json();
  const user = userData.data?.users?.[0];
  console.log("User:", user);

  if (!user) { console.log("No manager found"); return; }

  // Insert with department_id null (should work for admin)
  const r1 = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: q1, variables: { title: "Test Admin", message: "test", created_by: user.id, created_by_role: "admin", department_id: null } })
  });
  const d1 = await r1.json();
  console.log("Insert null dept_id:", JSON.stringify(d1, null, 2));
  
  // Delete test row
  if (d1.data?.insert_announcements_one?.id) {
    await fetch(HASURA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
      body: JSON.stringify({ query: `mutation { delete_announcements_by_pk(id:"${d1.data.insert_announcements_one.id}") { id } }` })
    });
  }
}
test();
