async function test() {
  const HASURA_URL = "http://localhost:8080/v1/graphql";
  const ADMIN_SECRET = "myadminsecretkey";

  const q = `
    query {
      __type(name: "announcements") {
        fields {
          name
          type {
            name
            ofType {
              name
            }
          }
        }
      }
    }
  `;
  const res = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: q })
  });
  
  const data = await res.json();
  const fields = data.data.__type.fields.filter(f => ['department_id', 'created_by'].includes(f.name));
  console.log("ANNOUNCEMENTS TYPE:");
  console.log(JSON.stringify(fields, null, 2));

  const q2 = `
    query {
      __type(name: "users") {
        fields {
          name
          type {
            name
            ofType {
              name
            }
          }
        }
      }
    }
  `;
  const res2 = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: q2 })
  });
  const data2 = await res2.json();
  const fields2 = data2.data.__type.fields.filter(f => ['id', 'department_id'].includes(f.name));
  console.log("USERS TYPE:");
  console.log(JSON.stringify(fields2, null, 2));
}

test();
