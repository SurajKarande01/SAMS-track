import API from "./api";

export const attendanceService = {
  takeAttendance: async (payload) => {
    const response = await API.post("/attendance/take-attendance", payload);
    return response.data;
  },
  getAllRecords: async () => {
    const response = await API.get("/attendance/get-all-attendance-records");
    return response.data;
  },
  getFiltered: async (faculty, subjectId, date) => {
    const response = await API.get(`/attendance/get-attendance/${faculty}/${subjectId}/${date}`);
    return response.data;
  },
};
