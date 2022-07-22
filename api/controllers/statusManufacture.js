import { StatusManufacture } from "../models/StatusManufacture.js";
import { Manufacture } from "../models/Manufacture.js";
export const addStatusManufacture = async (req, res) => {
  try {
    let statusObj = {
      name: req.body.name,
      description: req.body.description,
    };
    if (statusObj.name === "") {
      return res.status(200).json({
        success: false,
        message: "Tên không được để trống !",
      });
    }
    const newStatus = StatusManufacture(statusObj);
    await newStatus.save();
    return res.status(200).json({
      success: true,
      message: "Add status success",
      data: newStatus,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "add status manufacture failed",
      error: err.message,
    });
  }
};

export const getAllStatusManufacture = async (req, res) => {
  try {
    const manufacture = await Manufacture.aggregate([
      { $match: { isDelete: false } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const status = await StatusManufacture.find({ isDelete: false }).select(
      "name"
    );
    const total = await Manufacture.find({ isDelete: false })
      .select("name")
      .count();
    let data = [];
    for (let i = 0; i < status.length; i++) {
      let obj = {
        _id: "",
        name: "",
        sum: 0,
      };
      let check = manufacture.filter(
        (d) => String(d._id) === String(status[i]._id)
      );
      if (check.length > 0) {
        obj = {
          _id: status[i]._id,
          name: status[i].name,
          sum: check[0]?.count,
        };
      } else {
        obj = {
          _id: status[i]._id,
          name: status[i].name,
          sum: 0,
        };
      }
      data.push(obj);
    }
    data.unshift({ _id: "1", name: "Tất cả", sum: total });
    res.status(200).json({
      success: true,
      message: "get all status success",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "get all statusManufacture failed",
      error: err.message,
    });
  }
};

export const getAllStatus = async (req, res) => {
  try {
    const data = await StatusManufacture.find({ isDelete: false }).select(
      "name description"
    );
    res
      .status(200)
      .json({ success: true, message: "Lấy dữ liệu thành công", data: data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lấy thông tin thất bại",
      error: err.message,
    });
  }
};
