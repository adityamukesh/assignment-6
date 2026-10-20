export const API_URL = import.meta.env.VITE_API_URL;

export const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    "Content-Type": "application/json",
    Authorization: user ? `Bearer ${user.token}` : "",
  };
};

export const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};
