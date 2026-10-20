import { API_URL, getHeaders, handleResponse } from "./config";

export const getLeaveTypes = async () => {
  const res = await fetch(`${API_URL}/leave-types`, { headers: getHeaders() });
  return handleResponse(res);
};

export const getLeaveType = async (id) => {
  const res = await fetch(`${API_URL}/leave-types/${id}`, { headers: getHeaders() });
  return handleResponse(res);
};

export const createLeaveType = async (formData) => {
  const res = await fetch(`${API_URL}/leave-types`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
};

export const updateLeaveType = async (id, formData) => {
  const res = await fetch(`${API_URL}/leave-types/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(formData),
  });
  return handleResponse(res);
};

export const deleteLeaveType = async (id) => {
  const res = await fetch(`${API_URL}/leave-types/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
};
