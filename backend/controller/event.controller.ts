import { Request, Response } from "express";
import {
  createEventService,
  getAllEventsService,
  getSingleEventService,
  updateEventService,
  deleteEventService,
  getEventsByOrganizerService,
  searchEventsService,
} from "../services/eventService.js";

import { asyncHandler } from "../middleware/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { sendResponse } from "../utils/ApiResponse.js";


/**
 * Create Event
 */

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  const {
    title,
    date,
    location,
    category,
    totalSeats,
    ticketPrice,
    description,
    image,
  } = req.body;

  if (!title ||
    !date ||
    !location ||
    !category ||
    !description ||
    !image ||
    !totalSeats ||
    ticketPrice === undefined) {
    throw new ApiError(400, "Missing required event fields");
  }

  const eventData = {
    ...req.body,
    organizer: req.user._id,
  };

  const event = await createEventService(eventData);

  sendResponse({
    res,
    statusCode: 201,
    message: "Event created successfully",
    data: event,
  });
});





/**
 * Get All Events
 */
export const getAllEvents = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sort = (req.query.sort as string) || "-createdAt";

  const result = await getAllEventsService(page, limit, sort);

  sendResponse({
    res,
    statusCode: 200,
    data: result.events,
    pagination: {
      total: result.total,
      pages: result.totalPages,
      currentPage: result.currentPage,
    },
  });
});

/**
 * Get Single Event
 */
export const getSingleEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await getSingleEventService(req.params.id);

  sendResponse({
    res,
    statusCode: 200,
    data: event,
  });
});

/**
 * Update Event
 */
export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await updateEventService(req.params.id, req.body);

  sendResponse({
    res,
    statusCode: 200,
    message: "Event updated successfully",
    data: event,
  });
});

/**
 * Delete Event
 */
export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  await deleteEventService(req.params.id);

  sendResponse({
    res,
    statusCode: 200,
    message: "Event deleted successfully",
  });
});

/**
 * Get My Events
 */
export const getMyEvents = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
  }

  const events = await getEventsByOrganizerService(
    req.user._id.toString()
  );

  sendResponse({
    res,
    statusCode: 200,
    data: events,
  });
});

/**
 * Search Events
 */
export const searchEvents = asyncHandler(async (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q) {
    throw new ApiError(400, "Search query is required");
  }

  const events = await searchEventsService(q as string);

  sendResponse({
    res,
    statusCode: 200,
    data: events,
  });
});