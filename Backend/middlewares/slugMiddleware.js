import slugify from "slugify";

const slugMiddleware = (sourceField, targetField) => {
  return function (schema) {
    schema.pre("save", function (next) {
      if (!this[targetField]) {
        this[targetField] = slugify(this[sourceField], {
          lower: true,
          strict: true,
        });
      }
      next();
    });
  };
};

export default slugMiddleware;
