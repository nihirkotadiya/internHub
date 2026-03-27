async function test() {
  const HASURA_URL = "http://localhost:8080/v1/graphql";
  const ADMIN_SECRET = "myadminsecretkey";

  const introspectionQuery = `
    query IntrospectionQuery {
      __type(name: "announcements") {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }
  `;

  const res = await fetch(HASURA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-hasura-admin-secret': ADMIN_SECRET },
    body: JSON.stringify({ query: introspectionQuery })
  });
  
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
