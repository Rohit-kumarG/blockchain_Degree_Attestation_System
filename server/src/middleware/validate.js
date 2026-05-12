import { ApiError } from "../utils/ApiError.js";

export function validate(schema) {
  return function validateRequest(req, res, next) {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(", ");
      return next(new ApiError(400, message));
    }

    req.validated = result.data;
    return next();
  };
}

