import { Role } from "../models/UserRole.js";

export const addRole = async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const result = Role({ name: name, description: description });
    await result.save();
    res
      .status(200)
      .json({ success: true, message: "add role success", data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
