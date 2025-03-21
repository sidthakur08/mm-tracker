module.exports = async (req, res) => {
  try {
    // Create a Date object in Pacific Time by converting the locale‐formatted string back into a Date
    const nowPT = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
    );

    const year = nowPT.getFullYear();
    const month = String(nowPT.getMonth() + 1).padStart(2, "0");
    const day = String(nowPT.getDate()).padStart(2, "0");

    const apiUrl = `https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1/${year}/${month}/${day}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch NCAA scores" });
  }
};
