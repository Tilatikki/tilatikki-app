// import ErrorResponse from '../utils/errorResponse';
import asyncErrorHandler from "../utils/asyncErrorHandler";
// import geocoder from '../utils/geocoder';
import User from "../models/User";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public

export const register = asyncErrorHandler(
  async (req, res, next) => {
  const {firstname,lastname,email,password} = req.body;
  const user = await User.create({  
    firstname,
    lastname,
    email,
    password
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});