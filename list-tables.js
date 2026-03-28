const HASURA_URL = "http://localhost:8080/v1/graphql";
const ADMIN_SECRET = "myadminsecretkey";

async function listTables() {
  const query = `
    query {
      __schema {
        queryType {
          fields {
            name
          }
        }
      }
    }
  `;

  const res = await fetch(HASURA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": ADMIN_SECRET,
    },
    body: JSON.stringify({ query }),
  });

  const data = await res.json();
  const fields = data.data.__schema.queryType.fields.map(f => f.name);
  console.log("Tracked Tables/Queries:", JSON.stringify(fields, null, 2));
}

listTables();
