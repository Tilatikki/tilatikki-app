import express from "express";

// Import controller functions
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/userControllers";

// Import User model
import User from "../models/User";

// Import middleware functions
import { protect, authorize } from "../utils/middleware";

// Import advancedResults middleware
import advancedResults from "../utils/advancedResults";

const router = express.Router();
// Use the protect middleware to ensure authentication for all routes below
//router.use(protect);

// Use the authorize middleware to ensure only admins can access routes below
// router.use(authorize("admin"));


// Define routes for handling user data
router.route("/")
  .get(advancedResults(User), getUsers) // Route for getting users with advanced results
  .post(createUser); // Route for creating a new user

router.route("/:id")
  .get(getUser) // Route for getting a single user by ID
  .put(updateUser) // Route for updating a user by ID
  .delete(deleteUser); // Route for deleting a user by ID

export default router;