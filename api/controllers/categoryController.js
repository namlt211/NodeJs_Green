import { Category } from "../models/Category.js";
import { createBy } from "./verifyToken.js";
import { Product } from "../models/Product.js";
export const addCategory = async (req, res) => {
  const token = req.headers.token;
  if (token) {
    try {
      const name = req.body.name;
      const userId = createBy(token);
      const description = req.body.description;
      if (name === "") {
        return res.status(200).json({
          success: false,
          message: "Tên không được để trống !",
        });
      }
      const category = {
        name: name,
        createBy: userId,
        description: description,
      };
      const result = Category(category);
      await result.save();
      res.status(200).json({
        success: true,
        message: "Thêm danh mục thành công !",
        data: result,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Thêm danh mục thất bại !",
        error: err.message,
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "you're not authorized",
      error: err.message,
    });
  }
};
export const getAllCategoryForProduct = async (req, res) => {
  try {
    const count = await Product.aggregate([
      { $match: { isDelete: false } },
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 },
        },
      },
    ]);
    const result = await Category.find({ isDelete: false }).select("name");
    const total = await Product.find({ isDelete: false }).count();
    let arr = [];
    for (let i = 0; i < result.length; i++) {
      let obj = {
        _id: "",
        name: "",
        sum: 0,
      };
      let b = count.filter((d) => String(d._id) === String(result[i]._id));
      if (b.length > 0) {
        obj = {
          _id: result[i]._id,
          name: result[i].name,
          sum: b[0]?.total,
        };
      } else {
        obj = {
          _id: result[i]._id,
          name: result[i].name,
          sum: 0,
        };
      }
      arr.push(obj);
    }
    arr.unshift({ _id: "1", name: "Tất cả", sum: total });
    res.status(200).json({
      success: true,
      message: "get all category success",
      data: arr,
      total: total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "get all category failed",
      error: err.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const result = await Category.find({ isDelete: false })
      .select("name createBy createAt description")
      .populate({
        path: "createBy",
        select: "_id",
        model: "User",
        populate: { path: "role", select: "name" },
      });
    res.status(200).json({
      success: true,
      message: "get all categories success",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "get all category failed",
      error: err.message,
    });
  }
};

export const deleteCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Category.updateOne(
      { _id: id },
      { isDelete: true },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Xóa danh mục thành công",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Xóa danh mục thất bại",
      error: err.message,
    });
  }
};
export const updateCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = {
      name: req.body.name,
      description: req.body.description,
      updateAt: Date.now(),
    };
    const data = await Category.findOneAndUpdate(
      { $and: [{ _id: id }, { isDelete: false }] },
      category,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Cập nhật danh mục thất bại",
      error: err.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    let data = await Category.findOne({
      $and: [{ _id: id }, { isDelete: false }],
    }).select("name description");
    res.status(200).json({
      success: true,
      message: "Lấy dữ liệu danh mục thành công !",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lấy thông tin danh mục thất bại !",
      error: err.message,
    });
  }
};

export const findCategoryByName = async (req, res) => {
  const searchKey = req.params.searchKey;

  try {
    const data = await Category.find({ isDelete: false })
      .select("name createBy createAt description")
      .populate({
        path: "createBy",
        select: "_id",
        model: "User",
        populate: { path: "role", select: "name" },
      });
    if (!searchKey) {
      return res
        .status(200)
        .json({ success: true, message: "Tìm kiếm tất cả", data: data });
    } else {
      const result = data.filter((d) =>
        String(d.name).toLowerCase().includes(String(searchKey).toLowerCase())
      );
      if (result.length > 0) {
        return res.status(200).json({
          success: true,
          message: "Tìm kiếm thành công",
          data: result,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Không tìm thấy dữ liệu liên quan ",
        });
      }
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Tìm kiếm thất bại ", error: err });
  }
};
