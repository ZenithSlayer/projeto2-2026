const BASE_URL = "http://localhost:3001";

const getHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

export const request = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  const data = response.status === 204 ? {} : await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "API Request failed");
  }

  return data as T;
};