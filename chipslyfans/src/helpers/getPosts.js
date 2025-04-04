export async function useFetch(urlParams, options = {}) {
    try {
        const url = `${import.meta.env.VITE_BASE_URL}${urlParams}`;
        const res = await fetch(url, { ...options });
        const data = await res.json();
        
        return { res, data };
    } catch (error) {
        console.error("Fetch error:", error);
        return { res: null, data: null, error };
    }
}