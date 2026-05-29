interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === "GET") {
    const { results } = await context.env.DB.prepare(
SELECT * FROM users ORDER BY created_at DESC"
    ).all();
    return Response.json({ success: true, data: results });
  }
  
  if (context.request.method === "POST") {
    const body = await context.request.json<{ name: string; email: string }>();
    const result = await context.env.DB.prepare(
      "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *"
    ).bind(body.name, body.email).first();
    return Response.json({ success: true, data: result }, { status: 201 });
  }
  
  return new Response("Method Not Allowed", { status: 405 });
};
