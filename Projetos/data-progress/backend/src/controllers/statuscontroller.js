exports.getStatus = (req, res) => {
  res.json({
    status: "online",
    platform: "Data Progress"
  });
};