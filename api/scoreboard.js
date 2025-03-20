module.exports = async (req, res) => {
  // Extract date params from query string (expected via routing rules)
  const { year, month, day } = req.query;
  if (!year || !month || !day) {
    return res.status(400).json({ error: "Missing date parameters" });
  }

  try {
    const apiUrl = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${year}/${month}/${day}/`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch historical NCAA scores" });
  }
};