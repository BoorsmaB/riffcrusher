module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS", [
      "92eb1f39ea4216055c2a4aee63bd7f1e0018798ecb86881e06a9b1d7bc73adc2",
      "5873efa412a25cf4f3475928e53d7b75cc0f2fffaace3dd7522e62de683079c0",
    ]),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
