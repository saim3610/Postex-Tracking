export default async function handler(req, res) {
  const tracking = String(req.query.tracking || "").trim();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!/^[A-Za-z0-9-]{6,40}$/.test(tracking)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid PostEx tracking number."
    });
  }

  const endpoint = `https://wordpress-1566035-6455822.cloudwaysapps.com/api/postex-track.php?tracking=${encodeURIComponent(tracking)}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "accept": "application/json",
        "user-agent": "PostExTrackingWebsite/1.0"
      }
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = { success: false, message: "Tracking service returned an unreadable response." };
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: "Tracking service is temporarily unavailable. Please try again in a moment."
    });
  }
}
