import API from "./api";

export const subjectService = {
  getAll: async () => {
    const response = await API.get("/subject/get-all-subjects");
    return response.data;
  },
  add: async (name) => {
    const response = await API.post("/subject/add-subject", { name });
    return response.data;
  },
  update: async (id, name) => {
    const response = await API.put("/subject/update-subject", { id, name });
    return response.data;
  },
  delete: async (id) => {
    const response = await API.delete(`/subject/delete-subject/${id}`);
    return response.data;
  },
  getByFaculty: async (facultyUsername) => {
    const response = await API.get(`/subject/faculty/${facultyUsername}`);
    return response.data;
  },
};
