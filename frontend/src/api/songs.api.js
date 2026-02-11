export const getSongs = async (params) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${baseURL}/api/songs?${params}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error');
    }

    const data = await response.json();
    return data;
};
