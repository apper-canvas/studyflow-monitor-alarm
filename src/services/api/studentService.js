import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const studentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords("student_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "major_c" } },
          { field: { Name: "year_c" } },
          { field: { Name: "gpa_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "enrollment_date_c" } },
        ],
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.message || error);
      toast.error("Failed to load students");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const response = await apperClient.getRecordById("student_c", parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "major_c" } },
          { field: { Name: "year_c" } },
          { field: { Name: "gpa_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "enrollment_date_c" } },
        ],
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.message || error);
      toast.error("Failed to load student");
      return null;
    }
  },

  async create(studentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const payload = {
        records: [
          {
            Name: studentData.name_c || studentData.Name,
            name_c: studentData.name_c,
            email_c: studentData.email_c,
            major_c: studentData.major_c,
            year_c: studentData.year_c,
            gpa_c: parseFloat(studentData.gpa_c),
            status_c: studentData.status_c,
            enrollment_date_c: studentData.enrollment_date_c || new Date().toISOString().split("T")[0],
          },
        ],
      };

      const response = await apperClient.createRecord("student_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create student:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0]?.data;
      }

      return null;
    } catch (error) {
      console.error("Error creating student:", error?.message || error);
      toast.error("Failed to create student");
      return null;
    }
  },

  async update(id, studentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const payload = {
        records: [
          {
            Id: parseInt(id),
            Name: studentData.name_c || studentData.Name,
            name_c: studentData.name_c,
            email_c: studentData.email_c,
            major_c: studentData.major_c,
            year_c: studentData.year_c,
            gpa_c: parseFloat(studentData.gpa_c),
            status_c: studentData.status_c,
          },
        ],
      };

      const response = await apperClient.updateRecord("student_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update student:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0]?.data;
      }

      return null;
    } catch (error) {
      console.error("Error updating student:", error?.message || error);
      toast.error("Failed to update student");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return false;
      }

      const response = await apperClient.deleteRecord("student_c", {
        RecordIds: [parseInt(id)],
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete student:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting student:", error?.message || error);
      toast.error("Failed to delete student");
      return false;
    }
  },
};