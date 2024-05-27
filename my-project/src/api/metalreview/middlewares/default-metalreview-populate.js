"use strict";

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (!ctx.query.populate) {
      ctx.query.populate = ["author"];
    }
    await next();
  };
};
