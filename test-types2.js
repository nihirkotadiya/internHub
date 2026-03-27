async function test() {
  const HASURA_URL = "http://localhost:8080/v1/graphql";
  const ADMIN_SECRET = "myadminsecretkey";

  // Check all scalar types in announcements and users tables
  const q = `query {
    ann: __type(name: "announcements") {
      fields { name type { name kind ofType { name kind } } }
    }
    usr: __type(name: "users") {
      fields { name type { name kind ofType { name kind } } }
    }
  }`;
  const r = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: q })
  });
  const d = await r.json();
  const annFields = d.data.ann.fields.filter(f => ['id','department_id','created_by'].includes(f.name));
  const usrFields = d.data.usr.fields.filter(f => ['id','department_id'].includes(f.name));
  console.log("announcements fields:", JSON.stringify(annFields, null, 2));
  console.log("users fields:", JSON.stringify(usrFields, null, 2));
}
test();
