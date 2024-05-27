module.exports = ({ env }) => ({
  email: {
    provider: "nodemailer",
    providerOptions: {
      host: env("SMTP_HOST", "smtp.example.com"),
      port: env("SMTP_PORT", 587),
      auth: {
        user: env("SMTP_USER"),
        pass: env("SMTP_PASS"),
      },
    },
    settings: {
      defaultFrom: "your-email@example.com",
      defaultReplyTo: "your-email@example.com",
    },
  },
});
