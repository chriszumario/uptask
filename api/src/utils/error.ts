import type { Response } from 'express';

/**
 * Handles HTTP errors by sending a response with the error message
 * @param res - The Express response object
 * @param errorMessage - The error message to send
 * @param errorDetails - Optional raw error details for logging
 */
export const handleHttpError = (
    res: Response,
    errorMessage: string,
    errorDetails?: any
): void => {
    if (errorDetails) {
        console.error(errorDetails);
    }
    res.status(500).send({ error: errorMessage });
};
