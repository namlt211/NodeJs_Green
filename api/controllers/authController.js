import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

export const registerUser = async (req, res) => {
  const email = req.body.email;
  const name = req.body.firstName + " " + req.body.lastName;
  const address = req.body.address;
  const phone = req.body.phone;
  const password = req.body.password;
  const roleId = req.body.roleId;
  const checkEmail = await User.findOne({ email: email });
  const checkPhone = await User.findOne({ phone: phone });

  const checkIsPhone = (p) => {
    return /((09|03|07|08|05)+([0-9]{8})\b)/g.test(p);
  };
  if (!email || !validator.isEmail(email)) {
    return res
      .status(200)
      .json({ success: false, message: "Email không đúng định dạng" });
  }
  if (checkEmail) {
    return res
      .status(200)
      .json({ success: false, message: "Email đã tồn tại" });
  }
  if (checkPhone) {
    return res
      .status(200)
      .json({ success: false, message: "Số điện thoại đã tồn tại" });
  }
  if (!checkIsPhone(phone)) {
    return res
      .status(200)
      .json({ success: false, message: "Số điện thoại không hợp lệ" });
  }
  if (!req.body.firstName || !req.body.lastName) {
    return res
      .status(200)
      .json({ success: false, message: "Tên không được để trống" });
  }
  if (!address) {
    return res
      .status(200)
      .json({ success: false, message: "Địa chỉ không được để trống" });
  }
  if (!phone) {
    return res.status(200).json({
      success: false,
      message: "Số điện thoại không được để trống",
    });
  }
  if (!password) {
    return res
      .status(200)
      .json({ success: false, message: "Mật khẩu không được để trống" });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const result = {
      name: name,
      address: address,
      phone: phone,
      email: email,
      password: hashed,
      role: roleId,
    };
    const newUser = User(result);
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "user created successfully",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "create failed",
      error: err.message,
    });
  }
};
export const loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !validator.isEmail(email)) {
    return res
      .status(200)
      .json({ success: false, message: "Tài khoản không đúng" });
  }
  if (!password) {
    return res
      .status(200)
      .json({ success: false, message: "Tài khoản hoặc mật khẩu không đúng" });
  }
  try {
    const result = await User.findOne({
      $and: [{ email: email }, { isDelete: false }],
    }).populate({
      path: "role",
      select: "name",
    });
    const validPassword = await bcrypt.compare(
      req.body.password,
      result.password
    );
    if (!result) {
      return res.status(200).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    } else if (!validPassword) {
      return res.status(200).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    } else if (result.isDelete) {
      return res.status(200).json({
        success: false,
        message: "Tài khoản đã bị xóa",
      });
    } else if (result.locked) {
      return res
        .status(200)
        .json({ success: false, message: "Tài khoản đang bị khóa" });
    } else {
      const accessToken = generateAccessToken(result);
      const accessRefreshToken = generateRefreshToken(result);
      result.refreshToken = accessRefreshToken;
      await result.save();
      res.cookie("refreshToken", accessRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      // const { password, locked, isDelete, refreshToken, ...user } = result._doc;
      return res.status(200).json({
        success: true,
        message: "login successfully",
        data: result,
        token: accessToken,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Đăng nhập không thành công",
      error: err.message,
    });
  }
};
export const logoutUser = async (req, res) => {
  try {
    const result = await User.findOne({ refreshToken: req.body.token });
    result.refreshToken = "";
    await result.save();
    res.clearCookie("refreshToken");
    return res.status(200).json({
      success: true,
      message: "logout successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Đăng xuất không thành công",
      error: err.message,
    });
  }
};
export const requestRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json("you're not authenticated");
  }
  try {
    const result = await User.findOne({ refreshToken: refreshToken });
    if (result) {
      jwt.verify(
        refreshToken,
        process.env.ACCESS_REFRESH_TOKEN,
        async (err, user) => {
          if (err) {
            console.log(err);
          }
          const newAccessToken = generateAccessToken(user);
          const newRefreshToken = generateRefreshToken(user);
          result.refreshToken = newRefreshToken;
          await result.save();
          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
          });
          res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        }
      );
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "refresh token failed",
      error: err.message,
    });
  }
};
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, userRole: user.role },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "365d",
    }
  );
};
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name },
    process.env.ACCESS_REFRESH_TOKEN,
    {
      expiresIn: "360d",
    }
  );
};
