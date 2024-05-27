"use strict";

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::metalreview.metalreview", {
  config: {
    find: {
      middlewares: ["api::metalreview.default-metalreview-populate"],
    },
    findOne: {
      middlewares: ["api::metalreview.default-metalreview-populate"],
    },
  },
});
