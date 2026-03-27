async function test() {
  const HASURA_URL = "http://localhost:8080/v1/graphql";
  const ADMIN_SECRET = "myadminsecretkey";

  // Fetch all announcements to see what department_id values look like
  const q = `query { announcements(limit: 5) { id title department_id created_by } }`;
  const r = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: q })
  });
  const d = await r.json();
  console.log("Sample announcements:", JSON.stringify(d, null, 2));

  // Check what columns exist in announcements via pg directly
  const q2 = `query { 
    __type(name: "announcements_bool_exp") {
      inputFields { name type { name ofType { name } } }
    }
  }`;
  const r2 = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: q2 })
  });
  const d2 = await r2.json();
  const deptField = d2.data?.__type?.inputFields?.find(f => f.name === 'department_id');
  console.log("department_id bool_exp type:", JSON.stringify(deptField, null, 2));
}
test();
