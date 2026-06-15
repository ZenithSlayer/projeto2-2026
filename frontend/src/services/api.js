const apiUrl = "http://localhost:3001";
const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  "Content-Type": "application/json",
});

export const api = {
  get: (path) => fetch(`${apiUrl}${path}`, { headers: authHeaders() }).then(res => res.json()),
  post: (path, body) => fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  }).then(res => res.json()),
  put: (path, body) => fetch(`${apiUrl}${path}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  }).then(res => res.json()),
  delete: (path) => fetch(`${apiUrl}${path}`, {
    method: "DELETE",
    headers: authHeaders(),
  }),
};