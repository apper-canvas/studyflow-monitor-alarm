import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const courseService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords("course_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "target_grade_c" } },
          { field: { Name: "credit_hours_c" } },
          { field: { Name: "grade_categories_c" } },
        ],
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map((course) => ({
        ...course,
        gradeCategories: course.grade_categories_c
          ? JSON.parse(course.grade_categories_c)
          : [],
      }));
    } catch (error) {
      console.error("Error fetching courses:", error?.message || error);
      toast.error("Failed to load courses");
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

      const response = await apperClient.getRecordById("course_c", parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "target_grade_c" } },
          { field: { Name: "credit_hours_c" } },
          { field: { Name: "grade_categories_c" } },
        ],
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      const course = response.data;
      return {
        ...course,
        gradeCategories: course.grade_categories_c
          ? JSON.parse(course.grade_categories_c)
          : [],
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.message || error);
      toast.error("Failed to load course");
      return null;
    }
  },

  async create(courseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const payload = {
        records: [
          {
            Name: courseData.name_c || courseData.name || courseData.Name,
            name_c: courseData.name_c || courseData.name,
            code_c: courseData.code_c || courseData.code,
            instructor_c: courseData.instructor_c || courseData.instructor,
            color_c: courseData.color_c || courseData.color,
            target_grade_c: parseInt(courseData.target_grade_c || courseData.targetGrade),
            credit_hours_c: parseInt(courseData.credit_hours_c || courseData.creditHours || 3),
            grade_categories_c: JSON.stringify(courseData.gradeCategories || []),
          },
        ],
      };

      const response = await apperClient.createRecord("course_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create course:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        const course = response.results[0]?.data;
        return {
          ...course,
          gradeCategories: course.grade_categories_c
            ? JSON.parse(course.grade_categories_c)
            : [],
        };
      }

      return null;
    } catch (error) {
      console.error("Error creating course:", error?.message || error);
      toast.error("Failed to create course");
      return null;
    }
  },

  async update(id, courseData) {
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
            Name: courseData.name_c || courseData.name || courseData.Name,
            name_c: courseData.name_c || courseData.name,
            code_c: courseData.code_c || courseData.code,
            instructor_c: courseData.instructor_c || courseData.instructor,
            color_c: courseData.color_c || courseData.color,
            target_grade_c: parseInt(courseData.target_grade_c || courseData.targetGrade),
            credit_hours_c: parseInt(courseData.credit_hours_c || courseData.creditHours || 3),
            grade_categories_c: JSON.stringify(courseData.gradeCategories || []),
          },
        ],
      };

      const response = await apperClient.updateRecord("course_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update course:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        const course = response.results[0]?.data;
        return {
          ...course,
          gradeCategories: course.grade_categories_c
            ? JSON.parse(course.grade_categories_c)
            : [],
        };
      }

      return null;
    } catch (error) {
      console.error("Error updating course:", error?.message || error);
      toast.error("Failed to update course");
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

      const response = await apperClient.deleteRecord("course_c", {
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
          console.error(`Failed to delete course:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting course:", error?.message || error);
      toast.error("Failed to delete course");
      return false;
    }
  },
};