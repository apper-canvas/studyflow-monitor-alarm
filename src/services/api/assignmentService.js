import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const assignmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords("assignment_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "grade_c" } },
        ],
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map((assignment) => ({
        ...assignment,
        courseId: assignment.course_id_c?.Id,
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error?.message || error);
      toast.error("Failed to load assignments");
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

      const response = await apperClient.getRecordById("assignment_c", parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "grade_c" } },
        ],
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const assignment = response.data;
      return {
        ...assignment,
        courseId: assignment.course_id_c?.Id,
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.message || error);
      toast.error("Failed to load assignment");
      return null;
    }
  },

  async getByCourseId(courseId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords("assignment_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "grade_c" } },
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)],
          },
        ],
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map((assignment) => ({
        ...assignment,
        courseId: assignment.course_id_c?.Id,
      }));
    } catch (error) {
      console.error("Error fetching assignments by course:", error?.message || error);
      toast.error("Failed to load assignments");
      return [];
    }
  },

  async create(assignmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const payload = {
        records: [
          {
            Name: assignmentData.title_c || assignmentData.title || assignmentData.Name,
            title_c: assignmentData.title_c || assignmentData.title,
            description_c: assignmentData.description_c || assignmentData.description,
            course_id_c: parseInt(assignmentData.course_id_c || assignmentData.courseId),
            due_date_c: assignmentData.due_date_c || assignmentData.dueDate,
            priority_c: assignmentData.priority_c || assignmentData.priority,
            category_c: assignmentData.category_c || assignmentData.category,
            completed_c: assignmentData.completed_c !== undefined ? assignmentData.completed_c : false,
            grade_c: assignmentData.grade_c !== undefined ? parseInt(assignmentData.grade_c) : null,
          },
        ],
      };

      const response = await apperClient.createRecord("assignment_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create assignment:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        const assignment = response.results[0]?.data;
        return {
          ...assignment,
          courseId: assignment.course_id_c?.Id,
        };
      }

      return null;
    } catch (error) {
      console.error("Error creating assignment:", error?.message || error);
      toast.error("Failed to create assignment");
      return null;
    }
  },

  async update(id, assignmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const updateRecord = {
        Id: parseInt(id),
      };

      if (assignmentData.title_c !== undefined || assignmentData.title !== undefined) {
        updateRecord.Name = assignmentData.title_c || assignmentData.title || assignmentData.Name;
        updateRecord.title_c = assignmentData.title_c || assignmentData.title;
      }
      if (assignmentData.description_c !== undefined || assignmentData.description !== undefined) {
        updateRecord.description_c = assignmentData.description_c || assignmentData.description;
      }
      if (assignmentData.course_id_c !== undefined || assignmentData.courseId !== undefined) {
        updateRecord.course_id_c = parseInt(assignmentData.course_id_c || assignmentData.courseId);
      }
      if (assignmentData.due_date_c !== undefined || assignmentData.dueDate !== undefined) {
        updateRecord.due_date_c = assignmentData.due_date_c || assignmentData.dueDate;
      }
      if (assignmentData.priority_c !== undefined || assignmentData.priority !== undefined) {
        updateRecord.priority_c = assignmentData.priority_c || assignmentData.priority;
      }
      if (assignmentData.category_c !== undefined || assignmentData.category !== undefined) {
        updateRecord.category_c = assignmentData.category_c || assignmentData.category;
      }
      if (assignmentData.completed_c !== undefined || assignmentData.completed !== undefined) {
        updateRecord.completed_c = assignmentData.completed_c !== undefined 
          ? assignmentData.completed_c 
          : assignmentData.completed;
      }
      if (assignmentData.grade_c !== undefined || assignmentData.grade !== undefined) {
        const gradeValue = assignmentData.grade_c !== undefined ? assignmentData.grade_c : assignmentData.grade;
        updateRecord.grade_c = gradeValue !== null ? parseInt(gradeValue) : null;
      }

      const payload = {
        records: [updateRecord],
      };

      const response = await apperClient.updateRecord("assignment_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update assignment:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        const assignment = response.results[0]?.data;
        return {
          ...assignment,
          courseId: assignment.course_id_c?.Id,
        };
      }

      return null;
    } catch (error) {
      console.error("Error updating assignment:", error?.message || error);
      toast.error("Failed to update assignment");
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

      const response = await apperClient.deleteRecord("assignment_c", {
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
          console.error(`Failed to delete assignment:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting assignment:", error?.message || error);
      toast.error("Failed to delete assignment");
      return false;
    }
  },

  async toggleComplete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const currentAssignment = await this.getById(id);
      if (!currentAssignment) {
        toast.error("Assignment not found");
        return null;
      }

      return await this.update(id, {
        completed_c: !currentAssignment.completed_c,
      });
    } catch (error) {
      console.error("Error toggling assignment completion:", error?.message || error);
      toast.error("Failed to update assignment");
      return null;
    }
  },
};