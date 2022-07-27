import { Manufacture } from "../models/Manufacture.js";
import { createBy } from "./verifyToken.js";
export const addManufacture = async (req, res) => {
  const token = req.headers.token;
  if (token) {
    try {
      const name = req.body.name;
      const description = req.body.description;
      const phone = req.body.phone;
      const image = req.body.image;
      const address = req.body.address;
      const userId = createBy(token);
      const status = req.body.status;
      const result = {
        name: name,
        phone: phone,
        image: image,
        address: address,
        description: description,
        createBy: userId,
        status: status,
      };
      if(status === ""){
        return res.status(200).json({
          success: false,
          message: "Bạn chưa chọn trạng thái",
        });
      }
      const newManufacture = Manufacture(result);
      await newManufacture.save();
      res.status(200).json({
        success: true,
        message: "Thêm nhà cung cấp thành công",
        data: newManufacture,
      });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Thêm thất bại", error: err.message });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "you're not authorized",
      error: err.message,
    });
  }
};

export const getAllManufacture = async (req, res) => {
  try {
    const result = await Manufacture.find({ isDelete: false })
      .select("name address phone image manager updateAt description status")
      .populate({
        path: "createBy",
        select: "_id",
        model: "User",
        populate: { path: "role", select: "name" },
      })
      .populate({
        path: "status",
        select: "_id name",
      });
    const countAll = await Manufacture.find({ isDelete: false }).count();
    res.status(200).json({
      success: true,
      message: "get all success",
      data: result,
      total: countAll,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "get all manufacture failed",
      error: err.message,
    });
  }
};

export const getAllManufactureByStatus = async (req, res) => {
  try {
    let count = [];
    const manufacture = await Manufacture.find({ isDelete: false }).select(
      "_id name status "
    );
    const countStatus = await Manufacture.aggregate([
      { $match: { isDelete: false } },
      { $group: { _id: "$_id", total: { $sum: 1 } } },
    ]);
    for (let i = 0; i < manufacture.length; i++) {
      let obj = {
        _id: "",
        name: "",
        status: "",
        sum: 0,
      };
      let check = countStatus.filter(
        (d) => String(d._id) === String(manufacture[i]._id)
      );
      if (check.length > 0) {
        obj = {
          _id: manufacture[i]._id,
          name: manufacture[i].name,
          status: manufacture[i].status,
          sum: check[0]?.total,
        };
      } else {
        obj = {
          _id: manufacture[i]._id,
          name: manufacture[i].name,
          status: manufacture[i].status,
          sum: 0,
        };
      }
      count.push(obj);
    }
    res.status(200).json({
      success: true,
      message: "get manufacture success",
      data: count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "get allManufactureByStatus failed",
      error: err.message,
    });
  }
};

export const getManufactureByStatusId = async (req, res) => {
  const status = req.params.statusid;
  try {
    let data = await Manufacture.find({
      $and: [{ isDelete: false }, { status: status }],
    })
      .select("name address phone image manager updateAt description status")
      .populate({
        path: "createBy",
        select: "_id",
        model: "User",
        populate: { path: "role", select: "name" },
      })
      .populate({
        path: "status",
        select: "_id name",
      });
    res
      .status(200)
      .json({ success: true, message: "get manufacture success", data: data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "get allManufactureByStatus failed",
      error: err.message,
    });
  }
};

export const deleteManufactureById = async (req, res) => {
  if (!req.params.id) {
    return res.status(200).json({ success: false, message: "Lỗi khi xóa !" });
  }
  try {
    const id = req.params.id;
    const data = await Manufacture.updateOne(
      { _id: id },
      { isDelete: true },
      { new: true }
    );
    if (data) {
      return res
        .status(200)
        .json({ success: true, message: "Xóa thành công !" });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Xóa thất bại !" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Xóa thất bại !", error: err });
  }
};

export const updateManufactureById = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(200)
      .json({ success: false, message: "Lỗi khi cập nhật !" });
  }
  const id = req.params.id;
  const token = req.headers.token;
  if (!token) {
    return res.status(200).json({
      success: false,
      message: "Bạn chưa đăng nhập hoặc không có quyền này !",
    });
  }
  try {
    const name = req.body.name;
    const description = req.body.description;
    const phone = req.body.phone;
    const image = req.body.image;
    const address = req.body.address;
    const userId = createBy(token);
    const status = req.body.status;
    const result = {
      name: name,
      phone: phone,
      image: image,
      address: address,
      description: description,
      updateBy: userId,
      status: status,
    };
    await Manufacture.updateOne(
      {
        $and: [{ isDelete: false }, { _id: id }],
      },
      result
    );
    res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật !",
      error: err.message,
    });
  }
};

export const getManufactureById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Manufacture.findOne({
      $and: [{ isDelete: false }, { _id: id }],
    })
      .select("name address phone image manager updateAt description status")
      .populate({
        path: "createBy",
        select: "_id",
        model: "User",
        populate: { path: "role", select: "name" },
      })
      .populate({
        path: "status",
        select: "_id name",
      });
    res
      .status(200)
      .json({ success: true, message: "Lấy dữ liệu thành công !", data: data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lấy thông tin thất bại !",
      error: err.message,
    });
  }
};

export const findManufactureByName = async (req, res) => {
  const search = req.params.search;
  try {
    const data = await Manufacture.find({
      isDelete: false,
    })
      .select("name address phone image manager updateAt description status")
      .populate({
        path: "createBy",
        select: "_id",
        model: "User",
        populate: { path: "role", select: "name" },
      })
      .populate({
        path: "status",
        select: "_id name",
      });
    if (!search) {
      return res.status(200).json({
        success: true,
        message: "Tìm kiếm tất cả",
        data: data,
      });
    }
    let result = data.filter((d) =>
      String(d.name)
        .toLocaleLowerCase()
        .includes(String(search).toLocaleLowerCase())
    );
    res.status(200).json({
      success: true,
      message: "Tìm kiếm thành công !",
      data: result,
      total: result.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "get allManufactureByStatus failed",
      error: err.message,
    });
  }
};
