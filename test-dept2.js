async function test() {
  const HASURA_URL = "http://localhost:8080/v1/graphql";
  const ADMIN_SECRET = "myadminsecretkey";

  // 1. Check if departments table 'id' is uuid or Int
  const q = `query { departments(limit: 3) { id name } }`;
  const r = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: q })
  });
  const d = await r.json();
  console.log("Sample departments:", JSON.stringify(d.data?.departments, null, 2));

  // 2. Test the dept lookup query by integer id
  const q2 = `query GetDept($int_id: Int!) { departments(where: { id: { _eq: $int_id } }) { id } }`;
  const r2 = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: q2, variables: { int_id: 2 } })
  });
  const d2 = await r2.json();
  console.log("Dept lookup result:", JSON.stringify(d2, null, 2));
}
test();
