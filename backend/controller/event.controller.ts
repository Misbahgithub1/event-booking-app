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

/* ===============================
    CREATE EVENT (Admin)
=============================== */

export const createEvent = asyncHandler(
  async (req: Request, res: Response) => {
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
    } = req.body;

    //  Required field validation (image optional)
    if (
      !title ||
      !date ||
      !location ||
      !category ||
      !description ||
      totalSeats === undefined ||
      ticketPrice === undefined
    ) {
      throw new ApiError(400, "Missing required event fields");
    }

   //  If image uploaded via multer
const imageUrl = req.file
  ? `http://localhost:5000/uploads/${req.file.filename}`
  : undefined;

    const eventData = {
      title,
      date,
      location,
      category,
      totalSeats: Number(totalSeats),
      ticketPrice: Number(ticketPrice),
      description: description || "",
      image: imageUrl,
      organizer: req.user._id,
    };

    const event = await createEventService(eventData);

    sendResponse({
      res,
      statusCode: 201,
      message: "Event created successfully",
      data: event,
    });
  }
);

/* ===============================
    UPDATE EVENT (Admin)
================================ */

export const updateEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const updateData = { ...req.body };

    //  If new image uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const event = await updateEventService(
      req.params.id,
      updateData
    );

    sendResponse({
      res,
      statusCode: 200,
      message: "Event updated successfully",
      data: event,
    });
  }
);

/* ==============================
    GET ALL EVENTS
================================ */

export const getAllEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort =
      (req.query.sort as string) || "-createdAt";

    const result = await getAllEventsService(
      page,
      limit,
      sort
    );

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
  }
);

/* ===============================
    GET SINGLE EVENT
================================ */

export const getSingleEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const event = await getSingleEventService(
      req.params.id
    );

    sendResponse({
      res,
      statusCode: 200,
      data: event,
    });
  }
);

/* ===============================
    DELETE EVENT
================================ */

export const deleteEvent = asyncHandler(
  async (req: Request, res: Response) => {
    await deleteEventService(req.params.id);

    sendResponse({
      res,
      statusCode: 200,
      message: "Event deleted successfully",
    });
  }
);

/* ===============================
    GET MY EVENTS
================================ */

export const getMyEvents = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?._id) {
      throw new ApiError(401, "Unauthorized");
    }

    const events =
      await getEventsByOrganizerService(
        req.user._id.toString()
      );

    sendResponse({
      res,
      statusCode: 200,
      data: events,
    });
  }
);

/* ===============================
   ✅ SEARCH EVENTS
================================ */

export const searchEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q) {
      throw new ApiError(
        400,
        "Search query is required"
      );
    }

    const events =
      await searchEventsService(q as string);

    sendResponse({
      res,
      statusCode: 200,
      data: events,
    });
  }
);