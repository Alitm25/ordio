import {isAxiosError} from "axios";

export function getErrorMessage(error: unknown, fallback :string) :string {
    if (isAxiosError(error)  && error.response?.data.message) {
        return error.response.data.message;
    }

    return fallback;
}