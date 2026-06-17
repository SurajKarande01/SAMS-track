import API from "./api";

export const userService = {
  login: async (username, password) => {
    const response = await API.post("/user/login-user", { username, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await API.post("/user/register-user", userData);
    return response.data;
  },
  getByUsername: async (username) => {
    const response = await API.get(`/user/get-user-by-username/${username}`);
    return response.data;
  },
  getAll: async () => {
    const response = await API.get("/user/get-all-user/");
    return response.data;
  },
  getAllFaculty: async () => {
    const response = await API.get("/user/get-all-faculty/");
    return response.data;
  },
  delete: async (username) => {
    const response = await API.delete(`/user/delete-user-by-username?username=${username}`);
    return response.data;
  },
  update: async (userData) => {
    const response = await API.put("/user/update-user/", userData);
    return response.data;
  },
};
