import cors from "cors";
import { CorsOptions } from "cors";

const allowedOrigins = [
  "http://localhost:3000",
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin as string)) {
      callback(null, true);
    } else {
      callback(new Error("CORS: доступ с этого домена запрещён"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
} as CorsOptions);
