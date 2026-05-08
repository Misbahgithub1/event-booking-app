import axiosInstance from "./axiosInstance";

/**
 * ✅ Get All Events (Public)
 */
export const getAllEvents = async (params?: {
  page?: number;
  limit?: number;
  sort?: string;
}) => {
  const response = await axiosInstance.get("/events", {
    params,
  });
  return response.data;
};

/**
 * ✅ Search Events (Public)
 */
export const searchEvents = async (query: string) => {
  const response = await axiosInstance.get("/events/search", {
    params: { q: query },
  });
  return response.data;
};

/**
 * ✅ Get Logged-in User Events (Private)
 */
export const getMyEvents = async () => {
  const response = await axiosInstance.get("/events/user/my-events");
  return response.data;
};

/**
 * ✅ Get Single Event (Public or Protected depending backend)
 */
export const getSingleEvent = async (id: string) => {
  const response = await axiosInstance.get(`/events/${id}`);
  return response.data;
};

/**
 * ✅ Create Event (Admin only)
 */
export const createEvent = async (data: any) => {
  const response = await axiosInstance.post("/events", data);
  return response.data;
};

/**
 * ✅ Update Event (Admin only)
 */
export const updateEvent = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/events/${id}`, data);
  return response.data;
};

/**
 * ✅ Delete Event (Admin only)
 */
export const deleteEvent = async (id: string) => {
  const response = await axiosInstance.delete(`/events/${id}`);
  return response.data;
};