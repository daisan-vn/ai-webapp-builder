interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === "GET") {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM users ORDER BY created_at DESC"
    ).all();
    return Response.json({ success: true, data: results });
  }

  if (context.request.method === "POST") {
    let body: { name?: string; email?: string };
    try {
      body = await context.request.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const name = body.name?.trim();
    const email = body.email?.trim();
    if (!name || !email) {
      return Response.json(
        { success: false, error: "name and email are required" },
        { status: 400 }
      );
    }

    const result = await context.env.DB.prepare(
      "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *"
    )
      .bind(name, email)
      .first();
    return Response.json({ success: true, data: result }, { status: 201 });
  }

  return new Response("Method Not Allowed", { status: 405 });
};
