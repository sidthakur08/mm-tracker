module.exports = async (req, res) => {
  try {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const apiUrl = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${year}/${month}/${day}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(200).json(data);  // return the fetched data as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch NCAA scores" });
  }
};
