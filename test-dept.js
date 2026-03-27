async function test() {
  const HASURA_URL = "http://localhost:8080/v1/graphql";
  const ADMIN_SECRET = "myadminsecretkey";

  const q = `query {
    dept: __type(name: "departments") {
      fields { name type { name kind ofType { name kind } } }
    }
  }`;
  const r = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: q })
  });
  const d = await r.json();
  console.log("departments fields:", JSON.stringify(d.data.dept.fields.filter(f=>['id','name'].includes(f.name)), null, 2));

  // Also fetch a sample user's department_id
  const q2 = `query { users(limit: 2) { id name role department_id } }`;
  const r2 = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: q2 })
  });
  const d2 = await r2.json();
  console.log("sample users:", JSON.stringify(d2.data?.users, null, 2));
}
test();
