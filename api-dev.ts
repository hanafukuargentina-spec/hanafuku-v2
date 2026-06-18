import http from "node:http";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { config } from "dotenv";

config({ path: ".env.local" });

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/create-preference") {
    let body = "";
    for await (const chunk of req) body += chunk;

    try {
      const { items, payer } = JSON.parse(body);
      const accessToken = process.env.MP_ACCESS_TOKEN;

      if (!accessToken) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "MP_ACCESS_TOKEN not configured" }));
        return;
      }

      const client = new MercadoPagoConfig({ accessToken });
      const preference = new Preference(client);

      const result = await preference.create({
        body: {
          items: items.map((item: { id: string; nombre: string; talla: string; precioActual: number; cantidad: number }) => ({
            id: item.id,
            title: `${item.nombre} — Talla ${item.talla}`,
            unit_price: item.precioActual,
            quantity: item.cantidad,
            currency_id: "ARS",
          })),
          payer: {
            name: payer.nombre,
            surname: payer.apellido,
            email: payer.email,
            phone: payer.telefono ? { number: payer.telefono } : undefined,
          },
          statement_descriptor: "HANAFUKU",
          external_reference: `hanafuku-${Date.now()}`,
        },
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        id: result.id,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
      }));
    } catch (err: unknown) {
      console.error("API Error:", err);
      const message = err instanceof Error ? err.message : (typeof err === "object" && err !== null && "message" in err) ? String((err as {message: string}).message) : String(err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: message }));
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`API dev server running on http://localhost:${PORT}`);
});
