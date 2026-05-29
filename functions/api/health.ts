interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    await context.env.DB.prepare("SELECT 1").first();
    return Response.json({
      success: true,
      status: "ok",
      database: "connected",
    });
  } catch {
    return Response.json(
      {
        success: false,
        status: "error",
        database: "disconnected",
      },
      { status: 503 }
    );
  }
};
