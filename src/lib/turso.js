import { createClient } from '@libsql/client/web';

const rawUrl = import.meta.env.VITE_TURSO_DATABASE_URL || 'libsql://studyrooms-lolopolo.aws-ap-south-1.turso.io';
// Ensure https protocol for browser/web client if using libsql://
const httpUrl = rawUrl.replace('libsql://', 'https://');
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTI0OTk5NDgsImlkIjoiMDFhMTU5NTItNmQwMS03Mzc2LWI4MDUtMWQwM2YxNjQ5YzkyIiwia2lkIjoicS1fSklfbFBTZVpSN1gtSDVsRzNIMnUxMmdVQlI0cmw3NHBwNTNNSTVqOCIsInJpZCI6IjdiMmE1ZjZmLTMzODctNGEyYi04MGUxLWEyMzUyMTcxYWE0OCJ9.DZ9ScicpgHwgJBHnkpWxkGEBWTMPuigHMhgq7s3csPSlKGosHSsdxXbSfuLOtgdlydQlMhfNfLL7Tjv2S3zaBQ';

export const turso = createClient({
  url: httpUrl,
  authToken: authToken,
});

// Native browser SHA-256 password hashing
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Check if a user email already exists
export async function checkEmailExists(email) {
  const result = await turso.execute({
    sql: 'SELECT id FROM users WHERE LOWER(email) = LOWER(?)',
    args: [email.trim()],
  });
  return result.rows.length > 0;
}

// Register a new student user
export async function registerUser({ name, email, department, year, password }) {
  const id = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  const passwordHash = await hashPassword(password);

  await turso.execute({
    sql: `INSERT INTO users (id, name, email, department, year, password_hash)
          VALUES (?, ?, LOWER(?), ?, ?, ?)`,
    args: [id, name.trim(), email.trim(), department, year, passwordHash],
  });

  return { id, name, email, department, year };
}

// Log in existing student user
export async function loginUser({ email, password }) {
  const passwordHash = await hashPassword(password);
  const result = await turso.execute({
    sql: 'SELECT id, name, email, department, year, password_hash FROM users WHERE LOWER(email) = LOWER(?)',
    args: [email.trim()],
  });

  if (result.rows.length === 0) {
    throw new Error('No account found with this email address.');
  }

  const user = result.rows[0];
  if (user.password_hash !== passwordHash) {
    throw new Error('Incorrect password. Please try again.');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    department: user.department,
    year: user.year,
  };
}
