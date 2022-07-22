import { Menu } from "../models/Menu.js";

export const addMenu = async (req, res) => {
  try {
    const request = { parent: req.body.name };
    const item = Menu(request);
    await item
      .save()
      .then((menu) => {
        res
          .status(200)
          .json({ success: true, message: "add menu success", data: menu });
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          message: "add menu failed",
          error: error.message,
        });
      });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "add menu failed", error: err.message });
  }
};

export const getAllMenu = async (req, res) => {
  try {
    await Menu.find({ isDelete: false })
      .select("parent")
      .then((item) => {
        res
          .status(200)
          .json({ success: true, message: "get menu success", data: item });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "get add menu failed",
          error: err.message,
        });
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "get add menu failed",
      error: err.message,
    });
  }
};
