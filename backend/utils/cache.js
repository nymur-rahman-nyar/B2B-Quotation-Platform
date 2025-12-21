// utils/cache.js
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 0, checkperiod: 0 }); // No expiry
export default cache;
