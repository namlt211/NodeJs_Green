import { parse } from "path";
import { Product } from "../models/Product.js";
import { createBy } from "./verifyToken.js";
export const addProduct = async (req, res) => {
  const token = req.headers.token;
  if (token) {
    if (!req.body.name) {
      return res.status(200).json({
        success: false,
        message: "Tên không được để trống !",
      });
    }
    if (!req.body.image) {
      return res.status(200).json({
        success: false,
        message: "Hình ảnh không được để trống !",
      });
    }
    if (!req.body.manufacture) {
      return res.status(200).json({
        success: false,
        message: "Chưa chọn nhà cung cấp !",
      });
    }
    if (!req.body.category) {
      return res.status(200).json({
        success: false,
        message: "Chưa chọn loại sản phẩm !",
      });
    }
    if (!req.body.price || parseInt(req.body.price) < 0) {
      return res.status(200).json({
        success: false,
        message: "Chưa nhập giá sản phẩm hoặc giá sản phẩm nhập sai !",
      });
    }
    if (parseInt(req.body.priceSale) < 0) {
      return res.status(200).json({
        success: false,
        message: "Giá nhập vào không được nhỏ hơn 0 !",
      });
    }
    try {
      const result = {
        name: req.body.name,
        image: req.body.image,
        createBy: createBy(token),
        manufacture: req.body.manufacture,
        price: req.body.price,
        quantity: req.body.quantity,
        priceSale: req.body.priceSale,
        category: req.body.category,
        description: req.body.description,
      };
      const newProduct = Product(result);
      await newProduct.save();
      res.status(200).json({
        success: true,
        message: "Thêm sản phẩm thành công",
        data: newProduct,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Thêm sản phẩm thất bại",
        error: err.message,
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "Lỗi thêm sản phẩm",
      error: err.message,
    });
  }
};

export const getAllProduct = async (req, res) => {
  let page = parseInt(req.params.page);
  if (!page) {
    page = 1;
  }
  let limit = parseInt(req.params.limit);
  if (!limit) {
    limit = 10;
  }
  let skip = limit * (page - 1);
  try {
    const products = await Product.find({ isDelete: false })
      .select(
        "name image manufacture price priceSale category createBy quantity"
      )
      .populate({ path: "manufacture", select: "_id name" })
      .populate({ path: "category", select: "_id name" })
      .populate({
        path: "createBy",
        select: "_id",
        populate: { path: "role", select: "name" },
      })
      .sort("createdAt DESC")
      .skip(skip)
      .limit(limit);
    const total = await Product.find({ isDelete: false }).count();
    const totalItem = (page - 1) * limit + products.length;
    res.status(200).json({
      success: true,
      message: "Lay thong tin thanh cong",
      data: products,
      total: total,
      totalItem: totalItem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "get all product failed",
      error: err.message,
    });
  }
};

export const getProductByCategory = async (req, res) => {
  let page = parseInt(req.query.page);
  if (!page) {
    page = 1;
  }
  let limit = parseInt(req.query.limit);
  if (!limit) {
    limit = 10;
  }
  let skip = limit * (page - 1);
  try {
    const categoryId = req.params.id;
    const data = await Product.find({
      $and: [{ isDelete: false }, { category: categoryId }],
    })
      .select(
        "name image manufacture price priceSale category createBy quantity"
      )
      .populate({ path: "manufacture", select: "_id name" })
      .populate({ path: "category", select: "_id name" })
      .populate({
        path: "createBy",
        select: "_id",
        populate: { path: "role", select: "name" },
      })
      .sort("createdAt DESC")
      .skip(skip)
      .limit(limit);
    const total = await Product.find({
      $and: [{ isDelete: false }, { category: categoryId }],
    }).count();
    res.status(200).json({
      success: true,
      message: "get product by category success",
      data: data,
      total: total,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "get all product failed",
      error: err.message,
    });
  }
};

export const deleteProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Product.updateOne(
      { _id: id },
      { isDelete: true },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Xóa không thành công",
      error: err.message,
    });
  }
};

export const findProductByName = async (req, res) => {
  const searchKey = req.params.searchKey;
  try {
    const data = await Product.find({ isDelete: false })
      .select(
        "name image manufacture price priceSale category createBy quantity"
      )
      .populate({ path: "manufacture", select: "_id name" })
      .populate({ path: "category", select: "_id name" })
      .populate({
        path: "createBy",
        select: "_id",
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
      return res.status(200).json({
        success: true,
        message: "Tìm kiếm thành công",
        data: result,
        total: result.length,
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Tìm kiếm thất bại ", error: err });
  }
};

export const updateProductById = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.token;
  const newProduct = {
    name: req.body.name,
    image: req.body.image,
    updateBy: createBy(token),
    manufacture: req.body.manufacture,
    price: req.body.price,
    quantity: req.body.quantity,
    priceSale: req.body.priceSale,
    category: req.body.category,
    description: req.body.description,
  };
  try {
    let data = await Product.updateOne(
      {
        $and: [{ isDelete: false }, { _id: id }],
      },
      newProduct,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Cập nhật sản phẩm thất bại !",
      error: err.message,
    });
  }
};

export const findProductById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Product.findOne({
      $and: [{ isDelete: false }, { _id: id }],
    })
      .select(
        "name image manufacture price priceSale category createBy quantity description"
      )
      .populate({ path: "manufacture", select: "_id name" })
      .populate({ path: "category", select: "_id name" })
      .populate({
        path: "createBy",
        select: "_id",
        populate: { path: "role", select: "name" },
      });
    return res.status(200).json({
      success: true,
      message: "Tìm kiếm thành công",
      data: data,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Tìm kiếm thất bại ", error: err });
  }
};
