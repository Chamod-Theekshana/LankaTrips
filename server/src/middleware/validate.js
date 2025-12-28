import { ZodError } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400);
      return res.json({
        success: false,
        data: null,
        message: 'Validation failed',
        errors: err.issues.map(i => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    next(err);
  }
};
