// backend/middlewares/ipAllowlist.js
import dotenv from "dotenv";
dotenv.config();

const rawAllowed = process.env.ALLOWED_IPS || "";
const allowedIps = rawAllowed
  .split(",")
  .map((ip) => ip.trim())
  .filter(Boolean);

export default function ipAllowlist(req, res, next) {
  // if you're behind a proxy, make sure to app.set('trust proxy', true) in index.js
  const raw = (req.headers["x-forwarded-for"] || req.ip || "")
    .split(",")[0]
    .trim();

  // normalize IPv4-mapped IPv6 addresses
  const clientIp = raw.startsWith("::ffff:") ? raw.substring(7) : raw;

  console.log("→ ENV ALLOWED_IPS:", rawAllowed);
  console.log("→ parsed allowedIps:", allowedIps);
  console.log("→ incoming IP raw:", raw, "normalized:", clientIp);

  if (!allowedIps.includes(clientIp)) {
    console.warn(`🚫 Blocked IP: ${raw}`);
    return res.status(403).json({ error: "Forbidden: your IP is not allowed" });
  }

  next();
}
