import { User } from "../models/User.js";

export const deleteAllUser = async (req, res) => {
  try {
    const result = await User.deleteMany({ isDelete: false });
    res.status(200).json({
      success: true,
      message: "delete success",
      user: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "delete failed",
      error: err.message,
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const result = await User.find({ isDelete: false })
      .select("name phone address email role")
      .populate({ path: "role", select: "name" });
    res.status(200).json({
      success: true,
      message: "get all oke",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "get all user failed",
      error: err.message,
    });
  }
};
