export async function useFetch(urlParams, options = {}) {
    const url = `${import.meta.env.VITE_BASE_URL}${urlParams}`;
    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include' // Send cookies
        });

        const data = await response.json().catch(() => null); // In case no JSON

        // Return full context for UI decisions
        return {
            res: response,
            data,
            status: response.status,
            ok: response.ok
        };

    } catch (error) {
        console.error("Fetch error:", error);
        throw new Error("Fetch error:", error)
    }
}
