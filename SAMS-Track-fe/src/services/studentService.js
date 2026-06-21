import API from "./api";

/**
 * studentService: Client-side API caller containing methods for CRUD operations on student profiles.
 */
export const studentService = {
  /**
   * getAll: Fetches list of all students from the system database.
   */
  getAll: async () => {
    const response = await API.get("/student/get-all-students");
    return response.data;
  },

  /**
   * add: Sends request to register a new student.
   *
   * @param {Object} studentData - Student profile inputs
   */
  add: async (studentData) => {
    const response = await API.post("/student/add-student", studentData);
    return response.data;
  },

  /**
   * getById: Retrieves details of a specific student by their unique ID.
   *
   * @param {number} id - Student ID
   */
  getById: async (id) => {
    const response = await API.get(`/student/get-student-by-id/${id}`);
    return response.data;
  },

  /**
   * update: Sends updated student details to modify the student record.
   *
   * @param {Object} studentData - Student details
   */
  update: async (studentData) => {
    const response = await API.put("/student/update-student", studentData);
    return response.data;
  },

  /**
   * delete: Deletes a student from the system by ID.
   *
   * @param {number} id - Student ID
   */
  delete: async (id) => {
    const response = await API.delete(`/student/delete-student/${id}`);
    return response.data;
  },

  /**
   * chooseSubjects: Associates a list of subject IDs to a student profile.
   *
   * @param {number} studentId - Student ID
   * @param {Array<number>} subjectIds - Selected subject IDs
   */
  chooseSubjects: async (studentId, subjectIds) => {
    const response = await API.post(`/student/${studentId}/choose-subjects`, subjectIds);
    return response.data;
  },

  /**
   * getSubjects: Retrieves subjects enrolled by the student.
   *
   * @param {number} studentId - Student ID
   */
  getSubjects: async (studentId) => {
    const response = await API.get(`/student/${studentId}/subjects`);
    return response.data;
  },
};
