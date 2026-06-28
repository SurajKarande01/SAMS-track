import API from "./api";

export const passwordResetService = {
  requestReset: async (contactNo, role) => {
    const response = await API.post(`/password-reset/request?contactNo=${contactNo}&role=${role}`);
    return response.data;
  },
  getPendingRequests: async () => {
    const response = await API.get("/password-reset/all-pending");
    return response.data;
  },
  approveReset: async (id) => {
    const response = await API.post(`/password-reset/approve/${id}`);
    return response.data;
  },
  rejectReset: async (id) => {
    const response = await API.post(`/password-reset/reject/${id}`);
    return response.data;
  },
};
