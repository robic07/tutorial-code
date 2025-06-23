export const handleInvalidToken = (err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    error: true,
    message: err.message || "Internal server error",
  });
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    error: true,
    message: `Not Found - ${req.originalUrl}`,
  });
};
