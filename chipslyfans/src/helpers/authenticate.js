export async function useFetch(urlParams, options = {}) {
    try {
        const url = `${import.meta.env.VITE_BASE_URL}${urlParams}`;
        const response = await fetch(url, {
            ...options,
            credentials: 'include' // Important for cookies
        });
        
        if (!response.ok) throw new Error('Request failed');
        
        const data = await response.json();
        return { res: response, data };
    } catch (error) {
        console.error("Fetch error:", error);
        return { res: null, data: null, error };
    }
}