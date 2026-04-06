import { RequestHandler } from "express";
import z, { ZodError, ZodObject } from "zod";
import ValidationError from "../errors/ValidationError.js";

const loginSchema = z.object({
    password: z.string().min(8),
    username: z.string(),
  })
  .strict();
const accountSchema = loginSchema.extend({
  role: z.string(),
});

function validate(schema: ZodObject): RequestHandler {
  return (req, _, next) => {
    try {
      req.body = schema.parse(req.body);
    } catch (error) {
      const zodError = error as ZodError;
      throw new ValidationError(
        zodError.issues
          .map((issue) => `${issue.path}: ${issue.message}`)
          .join(";"),
      );
    }
    next();
  };
}

export const validation_create_account = validate(accountSchema);
export const validation_login = validate(loginSchema);
export const validation_update_password = validate(loginSchema)
