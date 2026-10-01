export const validate = (schema) => {
    return (req, res, next) => {
        try {
            const result = schema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    code: 'VALIDATION_ERROR',
                    errors: result.error.issues.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message,
                        code: issue.code,
                    })),
                });
            }

            req.body = result.data;

            next();

        } catch (error) {
            console.error("Validation error:", error);

            next(error);
        }
    };
};
