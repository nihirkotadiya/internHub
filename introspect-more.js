const HASURA_URL = "http://localhost:8080/v1/graphql";
const ADMIN_SECRET = "myadminsecretkey";

async function introspect() {
  const query = `
    query {
      announcements: __type(name: "announcements") {
        fields { name }
      }
      otps: __type(name: "password_reset_otps") {
        fields { name }
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
  console.log(JSON.stringify(data, null, 2));
}

introspect();
