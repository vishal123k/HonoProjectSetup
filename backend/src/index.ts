import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt, sign } from 'hono/jwt';

// 1. Types Configuration
type Bindings = { DB: D1Database; };
type Variables = { jwtPayload: { id: string; role: string; }; };

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();
const SECRET_KEY = "UTTAMSEWA_SUPER_SECRET_2026";

// 2. Optimized CORS for Production
app.use('*', cors({
  origin: 'https://040f3184.honoprojectsetup.pages.dev', // Aapka live frontend URL
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Default Health Check
app.get('/', (c) => c.text('UttamSewa B2B Edge API is Live!'));

// ==========================================
// 🔴 AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/register', async (c) => {
  const { name, email, password, role } = await c.req.json();
  const db = c.env.DB;
  try {
    const id = crypto.randomUUID();
    await db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, name, email, password, role).run();
    return c.json({ success: true, message: "Registered!" }, 201);
  } catch (err: any) {
    return c.json({ error: "Email already exists" }, 400);
  }
});

app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  const db = c.env.DB;
  const user = await db.prepare(
    "SELECT * FROM users WHERE email = ? AND password = ?"
  ).bind(email, password).first<any>();

  if (!user) return c.json({ error: "Invalid credentials" }, 401);

  const token = await sign({ id: user.id, role: user.role }, SECRET_KEY, 'HS256');
  return c.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

// ==========================================
// 🔵 PROTECTED ROUTES (JWT Required)
// ==========================================

app.use('/api/*', jwt({ secret: SECRET_KEY, alg: 'HS256' }));

// --- VENDOR PROFILE UPDATE (Fixes the "Update Failed" error) ---
app.put('/api/auth/update-profile', async (c) => {
  const payload = c.get('jwtPayload');
  const db = c.env.DB;
  const { company_name, gstin, competencies, service_rate } = await c.req.json();

  try {
    await db.prepare(
      `UPDATE users SET 
       company_name = ?, 
       gstin = ?, 
       competencies = ?, 
       service_rate = ? 
       WHERE id = ?`
    ).bind(company_name, gstin, competencies, service_rate, payload.id).run();

    return c.json({ success: true, message: "Profile Updated Successfully" });
  } catch (err: any) {
    return c.json({ error: "Database update failed" }, 500);
  }
});

// --- CONTRACTS ---
app.post('/api/contracts', async (c) => {
  const { provider_id, title, amount } = await c.req.json();
  const payload = c.get('jwtPayload'); 
  const db = c.env.DB;
  try {
    await db.prepare(
      "INSERT INTO contracts (title, amount, client_id, provider_id) VALUES (?, ?, ?, ?)"
    ).bind(title, amount, payload.id, provider_id).run();
    return c.json({ success: true }, 201);
  } catch (err: any) { return c.json({ error: err.message }, 500); }
});

app.get('/api/contracts/client', async (c) => {
  const payload = c.get('jwtPayload');
  const { results } = await c.env.DB.prepare(
    "SELECT c.*, u.name as provider_name FROM contracts c LEFT JOIN users u ON c.provider_id = u.id WHERE c.client_id = ?"
  ).bind(payload.id).all();
  return c.json(results);
});

app.get('/api/contracts/vendors', async (c) => {
  const payload = c.get('jwtPayload');
  const { results } = await c.env.DB.prepare(
    "SELECT c.*, u.name as client_name FROM contracts c JOIN users u ON c.client_id = u.id WHERE c.provider_id = ?"
  ).bind(payload.id).all();
  return c.json(results);
});

export default app;