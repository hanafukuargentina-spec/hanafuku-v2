import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MercadoPagoConfig, Preference } from "mercadopago";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ error: "MP_ACCESS_TOKEN not configured" });
  }

  try {
    const { items, payer } = req.body;

    if (!items?.length || !payer?.email) {
      return res.status(400).json({ error: "Missing items or payer data" });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const baseUrl = process.env.SITE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

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
        back_urls: {
          success: `${baseUrl}/checkout/resultado?status=approved`,
          failure: `${baseUrl}/checkout/resultado?status=rejected`,
          pending: `${baseUrl}/checkout/resultado?status=pending`,
        },
        auto_return: "approved",
        statement_descriptor: "HANAFUKU",
        external_reference: `hanafuku-${Date.now()}`,
      },
    });

    return res.status(200).json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}
