export function getHealth(req, res) {
  res.status(200).json({
    status: "ok",
    service: "degree-attestation-api",
    timestamp: new Date().toISOString(),
  });
}
