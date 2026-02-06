export class ErrorUtil {
    /** 
     * Throws a standardized, enriched error for test failures
     * 
     * @param message    User-facing failure message
     * @param code       Unique error code for classification
     * @param context    Optional metadata for debugging (API body, element selector, etc.)
     */
    static throwError(
        message: string,
        code: string = "GENERIC_ERROR",
        context?: Record<string, unknown>
    ): never {
        const errorPayload = {
            code,
            message,
            context,
            timestamp: new Date().toISOString(),
        };

        // Unified structured logging
        console.error("\n=== TEST ERROR ===");
        console.error("Code:      ", code);
        console.error("Message:   ", message);
        console.error("Context:   ", context ? JSON.stringify(context, null, 2) : "-");
        console.error("Occurred:  ", errorPayload.timestamp);
        console.error("===================\n");

        const err = new Error(message);
        (err as any).code = code;
        (err as any).context = context;
        throw err;
    }
}
