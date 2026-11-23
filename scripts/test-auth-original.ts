export {};

async function testAuthWithEmailAlert() {
  const BASE_URL = "http://localhost:3000";
  console.log("=== Testing Authentication & Email Notification Alert ===");

  const userEmail = "amansharma846706@gmail.com";
  const userPassword = "123aman@Aman";

  console.log("\n1. Attempting login for:", userEmail);
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userEmail,
      password: userPassword,
    }),
  });
  const loginJson = await loginRes.json();
  console.log(`Login status: ${loginRes.status}`, loginJson);

  console.log("\n2. Waiting 3 seconds for async email dispatch...");
  await new Promise((r) => setTimeout(r, 3000));

  console.log("\n3. Checking email dispatch log for:", userEmail);
  const emailLogRes = await fetch(`${BASE_URL}/api/auth/emails?email=${userEmail}`);
  const emailLogJson = await emailLogRes.json();
  console.log("Email logs found:", JSON.stringify(emailLogJson, null, 2));

  console.log("\n=== AUTH & EMAIL ALERT TESTS COMPLETE ===");
}

testAuthWithEmailAlert().catch(console.error);
