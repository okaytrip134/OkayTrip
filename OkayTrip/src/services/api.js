const API_URL = "http://localhost:8000";

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) throw new Error("Error fetching data");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
