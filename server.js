const express = require("express");
const path = require("path");
const prerender = require("prerender-node");

const app = express();

// Add bot detection middleware BEFORE prerender
app.use((req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  const isBot =
    /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|developers.google.com/i.test(
      userAgent
    );

  if (isBot) {
    console.log(`Bot detected: ${userAgent} - redirecting to proxy`);
    return res.redirect(301, `https://prerender-proxy.onrender.com${req.url}`);
  }
  next();
});

app.use(prerender);

// Serve React build files
app.use(express.static(path.join(__dirname, "build")));

// React Router fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
