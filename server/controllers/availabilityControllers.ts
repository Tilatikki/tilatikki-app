import { type Request, type Response } from "express";
import Availability, {
  type IAvailability,
  isAvailabilityList,
} from "../models/Availability.js";
import Reservation from "../models/Reservation.js";
import Premise from "../models/Premise.js";
import Space from "../models/Space.js";
import { intersectingTimespans } from "../utils/dateFunctions.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";

// Get all availabilities on the premise that are partially or totally
// contained between startdate and enddate time parameters received in the body.
export const getAvailabilitiesWithPremiseId = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { startdate, enddate } = req.body;
    const { premiseId } = req.params;

    if (!startdate)
      return res.status(400).json({ error: "startdate missing from body" });
    if (!enddate)
      return res.status(400).json({ error: "enddate missing from body" });

    let availabilities = await Availability.find({
      premise: premiseId,
    }).populate("reservations");

    if (!availabilities || availabilities.length === 0) {
      // No availabilities exist for this premise, or the premise does not exist.
      return res.status(204).json([]);
    }

    // Filter availabilities that are partially or totally contained between startdate and enddate.
    availabilities = availabilities.filter((availability) => {
      if (startdate <= availability.startdate < enddate) return true;
      if (startdate < availability.enddate <= enddate) return true;
      if (
        availability.startdate <= startdate &&
        enddate <= availability.enddate
      )
        return true;

      return false;
    });

    res.status(200).json(availabilities);
  }
);

// Desc: Get all availabilities
// @route GET /api/availabilities
// @access Public
export const getAvailability = asyncErrorHandler(
  async (_req: Request, res: Response) => {
    const availabilities = await Availability.find();
    res.status(200).json({ success: true, msg: "Show all availabilities", availabilities});
  }
);

// Desc: Create new availability
// @route POST /api/availabilities
// @access Private
export const createAvailability = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { startdate, enddate, spaceId } = req.body;
    const user = req.user;

    if (!startdate)
      return res.status(400).json({ error: "startdate missing from body" });
    if (!enddate)
      return res.status(400).json({ error: "enddate missing from body" });
    if (!spaceId)
      return res.status(400).json({ error: "spaceId missing from body" });

    const space = await Space.findById(spaceId).populate("availabilities");


    if (!space)
      return res
        .status(404)
        .json({ error: `Space not found with id: ${spaceId}` });

    // Make sure the space.availabilities field is an Availability list
    // by using the typeguard function: isAvailabilityList.
    if (!isAvailabilityList(space.availabilities)) {
      return res.status(500).json({
        error: `The availabilities field of space: ${space._id} is not of type IAvailability[]`,
      });
    }

    // Check that the new availability does not overlap with other availabilities
    // on the same space.
    if (
      intersectingTimespans(
        startdate,
        enddate,
        space.availabilities as IAvailability[]
      )
    ) {
      return res.status(400).json({ error: "Availabilities cannot overlap." });
    }

    const premise = await Premise.findById(space.premise);
    console.log(premise)

    if (!premise) {
      return res
        .status(404)
        .json({ error: `Premise not found with id: ${space.premise}` });
    }

    // Check if the user is authorized to create an availability for this premise.
    if (!premise.users.some((uid) => user._id.equals(uid))) {
      return res.status(401).json({
        error: `You are not authorized to create availabilities for premise: ${spaceId}`,
      });
    }

    let availability = new Availability({
      creator: user._id,
      startdate,
      enddate,
      space: spaceId,
      premise: premise._id,
    });

    availability = await availability.save();

    user.availabilities.push(availability._id);

    await user.save();

    res.status(201).json(availability);
  }
);

// Change Availability startdate and/or enddate
export const updateAvailability = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { startdate, enddate } = req.body;
    const user = req.user;
    const { id } = req.params;

    if (!startdate && !enddate) {
      return res
        .status(400)
        .json({ error: "Both startdate and enddate are missing." });
    }

    const availability = await Availability.findById(id);

    if (!availability) {
      return res
        .status(404)
        .json({ error: `Availability not found with id: ${id}` });
    }

    const space = await Space.findById(availability.space).populate(
      "availabilities"
    );

    if (!space) {
      // This should never happen, but typescript complained about space
      // migth being null so it was included.
      return res.status(404).json({
        error: `The space with id: ${availability.space} that was
                associated with availability: ${id} was not found.`,
      });
    }

    // Make sure the space.availabilities field is an Availability list
    // by using the typeguard function: isAvailabilityList.
    if (!isAvailabilityList(space.availabilities)) {
      return res.status(500).json({
        error: `The availabilities field of space: ${space._id} is not of type IAvailability[]`,
      });
    }

    // Check that the availability does not overlap with other availabilities
    // on the same space.
    if (
      intersectingTimespans(
        startdate,
        enddate,
        (space.availabilities as IAvailability[]).filter((a) =>
          a._id.equals(id)
        )
      )
    ) {
      return res.status(400).json({ error: "Availabilities cannot overlap." });
    }

    const premise = await Premise.findById(availability.premise);

    if (!premise) {
      return res
        .status(404)
        .json({ error: `Premise not found with id: ${availability.premise}` });
    }

    // Check if the user is authorized to edit an availability on this premise.
    if (!premise.users.some((uid) => user._id.equals(uid))) {
      return res.status(401).json({
        error: `You are not authorized to create availabilities for premise: ${premise._id}`,
      });
    }

    // Update the existing fields.
    if (startdate) availability.startdate = startdate;
    if (enddate) availability.enddate = enddate;

    const updatedAavailability = await availability.save();

    res.status(200).json(updatedAavailability);
  }
);

// Desc: Delete availability
// @route DELETE /api/availabilities/:id
// @access Private

export const deleteAvailability = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    const availability = await Availability.findById(id);

    if (!availability) {
      return res
        .status(404)
        .json({ error: `Availability not found with id: ${id}` });
    }

    const premise = await Premise.findById(availability.premise);

    if (!premise) {
      return res
        .status(404)
        .json({ error: `Premise not found with id: ${availability.premise}` });
    }

    // Check if the user is authorized to remove availability from this premise.
    if (!premise.users.some((uid) => user._id.equals(uid))) {
      return res.status(401).json({
        error: `You are not authorized to remove availabilities from premise: ${premise._id}`,
      });
    }

    // Remove the reservartions associated with this availability.
    availability.reservations.forEach(async (reservation_id) => {
      await Reservation.findByIdAndDelete(reservation_id);
    });

    await Availability.findByIdAndDelete(id);

    res.status(204).json({ message: "Availability deleted" });
  }
);
