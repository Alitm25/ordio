import { useSyncExternalStore } from "react";

const subscribeNothing = () => () => {};

// false while rendering on the server / hydrating, true in the browser afterward.
// Use it for values that only exist in the browser (e.g. the saved theme in localStorage).
export function useIsMounted() {
    return useSyncExternalStore(subscribeNothing, () => true, () => false);
}
