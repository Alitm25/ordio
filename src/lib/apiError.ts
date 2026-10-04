import mongoose from "mongoose";

// An error that already knows which HTTP status code it should become
export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

// Turn any thrown error into a safe JSON response (internal details stay on the server)
export function handleApiError(error: unknown) {
    // Errors we threw on purpose, e.g. new ApiError(401, "Unauthorized")
    if (error instanceof ApiError) {
        return Response.json({ message: error.message }, { status: error.status });
    }

    // A malformed id, e.g. /api/orders/banana
    if (error instanceof mongoose.Error.CastError) {
        return Response.json({ message: "Invalid id" }, { status: 400 });
    }

    // Data that breaks a schema rule, e.g. status: "flying"
    if (error instanceof mongoose.Error.ValidationError) {
        return Response.json({ message: "Invalid data" }, { status: 400 });
    }

    // Anything unexpected: log the details for us, send a generic message to the client
    console.error(error);
    return Response.json({ message: "Server error" }, { status: 500 });
}
