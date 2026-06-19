import API from "./api";

export const marksService = {
  getAll: async () => {
    const response = await API.get("/marks/get-all-marks");
    return response.data;
  },
  getByStudent: async (studentId) => {
    const response = await API.get(`/marks/get-marks-by-student/${studentId}`);
    return response.data;
  },
  add: async (markData) => {
    const response = await API.post("/marks/add-mark", markData);
    return response.data;
  },
  update: async (markData) => {
    const response = await API.put("/marks/update-mark", markData);
    return response.data;
  },
  delete: async (id) => {
    const response = await API.delete(`/marks/delete-mark/${id}`);
    return response.data;
  },
};
