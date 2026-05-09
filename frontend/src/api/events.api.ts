import axiosInstance from "./axiosInstance";
import { ApiResponse } from "../types/api.types";

import {
  Event,
  EventPayload,
} from "../types/event.types";

/**
 * ✅ Get All Events (Public)
 */
export const getAllEvents = async (
  params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }
): Promise<Event[]> => {
 const response = await axiosInstance.get<ApiResponse<Event[]>>(
    "/events",
    {
      params,
    }
  );

  return response.data.data;
};

/**
 * ✅ Search Events (Public)
 */
export const searchEvents = async (
  query: string
): Promise<Event[]> => {
  const response = await axiosInstance.get<ApiResponse<Event[]>>(
    "/events/search",
    {
      params: { q: query },
    }
  );

  return response.data.data;
};

/**
 * ✅ Get Logged-in User Events (Private)
 */
export const getMyEvents = async (): Promise<Event[]> => {
  const response = await axiosInstance.get<ApiResponse<Event[]>>(
    "/events/user/my-events"
  );

  return response.data.data;
};

/**
 * ✅ Get Single Event
 */
export const getSingleEvent = async (
  id: string
): Promise<Event> => {
  const response = await axiosInstance.get<ApiResponse<Event>>(
    `/events/${id}`
  );

  return response.data.data;
};

/**
 * ✅ Create Event (Admin only)
 */
export const createEvent = async (
  data: EventPayload
): Promise<Event> => {
  const response = await axiosInstance.post<ApiResponse<Event>>(
    "/events",
    data
  );

  return response.data.data;
};

/**
 * ✅ Update Event (Admin only)
 */
export const updateEvent = async (
  id: string,
  data: EventPayload
): Promise<Event> => {
  const response = await axiosInstance.put<ApiResponse<Event>>(

    `/events/${id}`,
    data
  );

  return response.data.data;
};

/**
 * ✅ Delete Event (Admin only)
 */
export const deleteEvent = async (
  id: string
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<ApiResponse<{ message: string }>>(
    `/events/${id}`
  );

  return response.data.data;
};