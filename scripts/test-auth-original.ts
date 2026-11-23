export {};

async function testAuth() {
  const BASE_URL = "http://localhost:3000";
  console.log("=== Testing Original Email & Password Authentication ===");

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/`);
  console.log(`1. Homepage status: ${healthRes.status} (Expected: 200)`);

  // 2. Register Aman Sharma
  const testEmail = "sharmaaman9318411@gmail.com";
  const testPassword = "AmanPassword@2026";
  const testName = "Aman Sharma";

  console.log("\n2. Attempting registration for:", testEmail);
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: testName,
      email: testEmail,
      password: testPassword,
    }),
  });
  const regJson = await regRes.json();
  console.log(`Registration status: ${regRes.status}`, regJson);

  // 3. Register duplicate email -> should fail
  console.log("\n3. Attempting duplicate registration (should fail):");
  const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: testName,
      email: testEmail,
      password: testPassword,
    }),
  });
  const dupJson = await dupRes.json();
  console.log(`Duplicate registration status: ${dupRes.status}`, dupJson);

  // 4. Login with WRONG password -> should fail
  console.log("\n4. Attempting login with WRONG password (should fail):");
  const wrongLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: "wrongpassword123",
    }),
  });
  const wrongJson = await wrongLoginRes.json();
  console.log(`Wrong password status: ${wrongLoginRes.status}`, wrongJson);

  // 5. Login with CORRECT password -> should succeed
  console.log("\n5. Attempting login with CORRECT password:");
  const correctLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });
  const correctJson = await correctLoginRes.json();
  console.log(`Correct login status: ${correctLoginRes.status}`, correctJson);

  // 6. Check sign-in and sign-up pages
  const signInPageRes = await fetch(`${BASE_URL}/sign-in`);
  console.log(`\n6. /sign-in page status: ${signInPageRes.status} (Expected: 200)`);

  const signUpPageRes = await fetch(`${BASE_URL}/sign-up`);
  console.log(`7. /sign-up page status: ${signUpPageRes.status} (Expected: 200)`);

  console.log("\n=== ALL AUTH TESTS COMPLETE ===");
}

testAuth().catch(console.error);
