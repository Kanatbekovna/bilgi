export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Сервер катасы";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${req.method} ${req.url} →`, err.message);
  }

  res.status(status).json({ error: message });
}
