import { API_URL, getHeaders, handleResponse } from "./config";

export const applyLeave = async (formData) => {
  const res = await fetch(`${API_URL}/leaves`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
};

export const getMyLeaves = async () => {
  const res = await fetch(`${API_URL}/leaves/my`, { headers: getHeaders() });
  return handleResponse(res);
};

export const getMyBalance = async () => {
  const res = await fetch(`${API_URL}/leaves/balance`, { headers: getHeaders() });
  return handleResponse(res);
};

export const getLeave = async (id) => {
  const res = await fetch(`${API_URL}/leaves/${id}`, { headers: getHeaders() });
  return handleResponse(res);
};

export const cancelLeave = async (id) => {
  const res = await fetch(`${API_URL}/leaves/${id}/cancel`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getAllLeaves = async () => {
  const res = await fetch(`${API_URL}/leaves`, { headers: getHeaders() });
  return handleResponse(res);
};

export const updateLeaveStatus = async (id, status, remarks) => {
  const res = await fetch(`${API_URL}/leaves/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status, remarks }),
  });
  return handleResponse(res);
};

export const getDashboard = async () => {
  const res = await fetch(`${API_URL}/dashboard`, { headers: getHeaders() });
  return handleResponse(res);
};
