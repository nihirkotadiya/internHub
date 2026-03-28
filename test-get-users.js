async function testGetUsers() {
  const url = 'http://localhost:3000/api/users?role=intern';
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        // Note: This might require a session cookie if it's protected.
        // But let's see if it fails with a 403 or a 500 (GQL error).
      }
    });

    const data = await res.json();
    console.log("Response status:", res.status);
    if (res.status === 403 || res.status === 401) {
      console.log("Authentication required, but we are looking for 500/GQL errors.");
    } else {
      console.log("Response body:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Error during GET users test:", err);
  }
}

testGetUsers();
