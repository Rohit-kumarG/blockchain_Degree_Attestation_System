export function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    return res.status(409).json({
      error: "Duplicate value already exists",
      fields: Object.keys(err.keyValue || {}),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Invalid identifier format",
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || "Internal server error",
  });
}
