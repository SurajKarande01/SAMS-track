import API from "./api";

export const adminDeletionService = {
  requestDeletion: async (targetAdmin, requestedBy) => {
    const response = await API.post(`/admin-deletion/request?targetAdmin=${targetAdmin}&requestedBy=${requestedBy}`);
    return response.data;
  },
  getPendingRequests: async () => {
    const response = await API.get("/admin-deletion/all-pending");
    return response.data;
  },
  grantRequest: async (id) => {
    const response = await API.post(`/admin-deletion/grant/${id}`);
    return response.data;
  },
  denyRequest: async (id) => {
    const response = await API.post(`/admin-deletion/deny/${id}`);
    return response.data;
  },
};
