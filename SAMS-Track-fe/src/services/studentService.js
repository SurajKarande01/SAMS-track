import API from "./api";

export const studentService = {
  getAll: async () => {
    const response = await API.get("/student/get-all-students/");
    return response.data;
  },
  add: async (studentData) => {
    const response = await API.post("/student/add-student/", studentData);
    return response.data;
  },
  getById: async (id) => {
    const response = await API.get(`/student/get-student-by-id/${id}`);
    return response.data;
  },
  update: async (studentData) => {
    const response = await API.put("/student/update-student/", studentData);
    return response.data;
  },
  delete: async (id) => {
    const response = await API.delete(`/student/delete-student/${id}/`);
    return response.data;
  },
};
