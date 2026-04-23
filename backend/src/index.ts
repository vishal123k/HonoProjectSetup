import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt, sign } from 'hono/jwt';

// 1. Cloudflare DB & JWT Types
type Bindings = { DB: D1Database; };
type Variables = { jwtPayload: { id: string; role: string; }; };

// 2. Main App Initialization
const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();
const SECRET_KEY = "UTTAMSEWA_SUPER_SECRET_2026";

// 3. CORS Middleware (Frontend connect karne ke liye)
app.use('*', cors());

// Default Route
app.get('/', (c) => c.text('UttamSewa B2B Edge API is Running!'));

// ==========================================
// 🔴 AUTHENTICATION ROUTES (No imports needed)
// ==========================================

app.post('/api/auth/register', async (c) => {
  const { name, email, password, role } = await c.req.json();
  const db = c.env.DB;

  try {
    const id = crypto.randomUUID();
    await db.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, name, email, password, role).run();

    return c.json({ success: true, message: "User Registered Successfully!" }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 400);
  }
});

app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  const db = c.env.DB;

  type UserDB = { id: string; name: string; role: string };

  const user = await db.prepare(
    "SELECT * FROM users WHERE email = ? AND password = ?"
  ).bind(email, password).first<UserDB>();

  if (!user) return c.json({ error: "Invalid credentials" }, 401);

  const token = await sign({ id: user.id, role: user.role }, SECRET_KEY, 'HS256');
  return c.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});


// ==========================================
// 🔵 CONTRACT ROUTES (Protected by JWT)
// ==========================================

// Apply JWT Middleware to all /api/contracts routes
app.use('/api/contracts/*', jwt({ secret: SECRET_KEY, alg: 'HS256' }));

app.post('/api/contracts', async (c) => {
  const { provider_id, title, amount } = await c.req.json();
  const payload = c.get('jwtPayload'); 
  const db = c.env.DB;

  if (!amount || amount < 10) return c.json({ error: "Minimum ₹10 required" }, 400);

  try {
    await db.prepare(
      "INSERT INTO contracts (title, amount, client_id, provider_id) VALUES (?, ?, ?, ?)"
    ).bind(title, amount, payload.id, provider_id).run();
    return c.json({ success: true }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/contracts/client', async (c) => {
  const payload = c.get('jwtPayload');
  const db = c.env.DB;
  const { results } = await db.prepare(
    "SELECT c.*, u.name as provider_name FROM contracts c LEFT JOIN users u ON c.provider_id = u.id WHERE c.client_id = ?"
  ).bind(payload.id).all();
  return c.json(results);
});

app.get('/api/contracts/vendors', async (c) => {
  const payload = c.get('jwtPayload');
  const db = c.env.DB;
  const { results } = await db.prepare(
    "SELECT c.*, u.name as client_name FROM contracts c JOIN users u ON c.client_id = u.id WHERE c.provider_id = ?"
  ).bind(payload.id).all();
  return c.json(results);
});

app.put('/api/contracts/:id/status', async (c) => {
  const id = c.req.param('id');
  const { status } = await c.req.json();
  const db = c.env.DB;
  await db.prepare("UPDATE contracts SET status = ? WHERE id = ?").bind(status, id).run();
  return c.json({ message: "Status updated" });
});

// Final Export for Cloudflare
export default app;