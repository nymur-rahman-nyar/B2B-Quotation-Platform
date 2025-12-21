import express from "express";
import nodemailer from "nodemailer";
import geoip from "geoip-lite";
import Product from "../../models/Product.js";
import Service from "../../models/Service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      items = [], // [{ id, packSize?, quantity, query }, …]
      services: svcItems = [],
      contact = {},
    } = req.body;

    // Capture sender's IP address and lookup GeoIP location
    const ip =
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.socket.remoteAddress;
    const geo = geoip.lookup(ip) || {};
    const location = [geo.city, geo.region, geo.country]
      .filter(Boolean)
      .join(", ");

    // Fetch referenced products & services
    const prodIds = items.map((it) => it.id);
    const products = await Product.find({ _id: { $in: prodIds } }).lean();

    const serviceIds = svcItems.map((it) => it.id);
    const servicesList = await Service.find({
      _id: { $in: serviceIds },
    }).lean();

    // Build the email HTML
    let html = `
      <h2>Quote Request</h2>
      <p><strong>Contact Info</strong><br/>
        Name: ${contact.name}<br/>
        Phone: ${contact.phone}<br/>
        ${contact.email ? `Email: ${contact.email}<br/>` : ""}
        ${contact.company ? `Company: ${contact.company}<br/>` : ""}
        IP Address: ${ip}<br/>
        ${location ? `Location: ${location}<br/>` : ""}
      </p>
      <h3>Products</h3>
      <ul>
    `;
    for (const it of items) {
      const p = products.find((x) => x._id.toString() === it.id);
      if (!p) continue;
      html += `
        <li>
          <strong>${p.name}</strong> (${p.code})<br/>
          ${it.packSize ? `Pack Size: ${it.packSize}<br/>` : ""}
          Quantity: ${it.quantity}<br/>
          Brand: ${p.brand}<br/>
          Origin: ${p.countryOfOrigin}<br/>
          ${it.query ? `<em>Note:</em> ${it.query}<br/>` : ""}
        </li>
      `;
    }
    html += `</ul>`;

    if (servicesList.length) {
      html += `<h3>Services</h3><ul>`;
      for (const s of servicesList) {
        const svc = svcItems.find((x) => x.id === s._id.toString());
        html += `
          <li>
            <strong>${s.name}</strong>${
          svc.query ? ` — <em>${svc.query}</em>` : ""
        }
          </li>
        `;
      }
      html += `</ul>`;
    }

    // Create a secure transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    // Send the mail with updated subject
    await transporter.sendMail({
      from: `"Quote Bot" <${process.env.SMTP_USER}>`,
      to: process.env.QUOTE_RECIPIENT,
      subject: `Quote Request - ${contact.name}`,
      html,
    });

    return res.json({ message: "Quote email sent via Gmail." });
  } catch (err) {
    console.error("❌ Error in /api/quote:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
