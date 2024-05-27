module.exports = {
  lifecycles: {
    async afterCreate(event) {
      const { result } = event;

      await strapi.plugins["email"].services.email.send({
        to: "your-email@example.com",
        subject: `New contact form submission from ${result.name}`,
        text: `Name: ${result.name}\nEmail: ${result.email}\n\nMessage:\n${result.message}`,
      });
    },
  },
};
