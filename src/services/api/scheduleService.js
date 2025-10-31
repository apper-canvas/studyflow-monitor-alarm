import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const scheduleService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords("schedule_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "day_of_week_c" } },
          { field: { Name: "start_time_c" } },
          { field: { Name: "end_time_c" } },
          { field: { Name: "location_c" } },
        ],
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return (response.data || []).map((schedule) => ({
        ...schedule,
        courseId: schedule.course_id_c?.Id,
        dayOfWeek: schedule.day_of_week_c,
        startTime: schedule.start_time_c,
        endTime: schedule.end_time_c,
        location: schedule.location_c,
      }));
    } catch (error) {
      console.error("Error fetching schedules:", error?.message || error);
      toast.error("Failed to load schedules");
      return [];
    }
  },

  async getByCourseId(courseId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return [];
      }

      const response = await apperClient.fetchRecords("schedule_c", {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "day_of_week_c" } },
          { field: { Name: "start_time_c" } },
          { field: { Name: "end_time_c" } },
          { field: { Name: "location_c" } },
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

      return (response.data || []).map((schedule) => ({
        ...schedule,
        courseId: schedule.course_id_c?.Id,
        dayOfWeek: schedule.day_of_week_c,
        startTime: schedule.start_time_c,
        endTime: schedule.end_time_c,
        location: schedule.location_c,
      }));
    } catch (error) {
      console.error("Error fetching schedules by course:", error?.message || error);
      toast.error("Failed to load schedules");
      return [];
    }
  },

  async create(scheduleData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error("ApperClient not initialized");
        return null;
      }

      const payload = {
        records: [
          {
            Name: scheduleData.Name || `${scheduleData.day_of_week_c || scheduleData.dayOfWeek} Schedule`,
            course_id_c: parseInt(scheduleData.course_id_c || scheduleData.courseId),
            day_of_week_c: scheduleData.day_of_week_c || scheduleData.dayOfWeek,
            start_time_c: scheduleData.start_time_c || scheduleData.startTime,
            end_time_c: scheduleData.end_time_c || scheduleData.endTime,
            location_c: scheduleData.location_c || scheduleData.location,
          },
        ],
      };

      const response = await apperClient.createRecord("schedule_c", payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const failed = response.results.filter((r) => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create schedule:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        const schedule = response.results[0]?.data;
        return {
          ...schedule,
          courseId: schedule.course_id_c?.Id,
          dayOfWeek: schedule.day_of_week_c,
          startTime: schedule.start_time_c,
          endTime: schedule.end_time_c,
          location: schedule.location_c,
        };
      }

      return null;
    } catch (error) {
      console.error("Error creating schedule:", error?.message || error);
      toast.error("Failed to create schedule");
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

      const response = await apperClient.deleteRecord("schedule_c", {
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
          console.error(`Failed to delete schedule:`, failed);
          failed.forEach((record) => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting schedule:", error?.message || error);
      toast.error("Failed to delete schedule");
      return false;
    }
  },
};