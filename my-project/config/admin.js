module.exports = ({ env }) => ({
  auth: {
    secret: env("69a9943b27fa7bce16a46e4a3a74ebc5"),
  },
  apiToken: {
    salt: env("f42708cf80e173da37366ec1bf041778"),
  },
  transfer: {
    token: {
      salt: env("3cd1960c74399afc13e2f84d8fb6f6cb"),
    },
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
});
