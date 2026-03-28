async function testSignup() {
  const url = 'http://localhost:3000/api/signup';
  const timestamp = Date.now();
  const payload = {
    name: "Test Intern " + timestamp,
    email: `test_intern_${timestamp}@example.com`,
    password: "password123",
    role: "intern",
    department_id: 1,
    gender: "male",
    college: "Test University",
    contact_number: String(timestamp).slice(-10),
    joining_date: "2024-03-27",
    date_of_birth: "2000-01-01",
    degree: "B.Tech"
  };

  console.log("Testing signup with payload:", JSON.stringify(payload, null, 2));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(data, null, 2));

    if (res.ok && data.success) {
      console.log("✅ Signup successful!");
    } else {
      console.log("❌ Signup failed!");
      if (data.error) {
        console.log("Error Detail:", data.error);
      }
    }
  } catch (err) {
    console.error("Error during signup test:", err);
  }
}

testSignup();
