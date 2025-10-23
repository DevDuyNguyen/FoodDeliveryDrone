const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const Account = require("../models/account");
const authController = require("../controllers/authController");
const multer = require("multer");
const router = express.Router();
const path = require("path");

const shipperUpload = multer({
  // Sử dụng cấu hình storage/fileFilter đã có từ server.js
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join("images"));
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Math.floor(Math.random() * 90000) + 10000 + "-" + file.originalname
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    )
      cb(null, true);
    else cb(null, false);
  },
});

const upload = multer({
  // Sử dụng cấu hình storage/fileFilter đã có từ server.js
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join("images"));
    },
    filename: (req, file, cb) => {
      cb(
        null,
        Math.floor(Math.random() * 90000) + 10000 + "-" + file.originalname
      );
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    )
      cb(null, true);
    else cb(null, false);
  },
});

// Middleware để xử lý 3 file: portrait, licenseFront, licenseBack
const uploadDeliveryFiles = shipperUpload.fields([
  { name: "portrait", maxCount: 1 },
  { name: "licenseFront", maxCount: 1 },
  { name: "licenseBack", maxCount: 1 },
]);

router.post(
  "/signup-user",
  [
    body("email", "Please enter a valid email to continue.")
      .isEmail()
      .custom((value, { req }) => {
        return Account.findOne({ email: value }).then((accountDoc) => {
          if (accountDoc) {
            return Promise.reject(
              "Email address already exists, please try again with another email."
            );
          }
        });
      })
      .normalizeEmail(),
    body("password", "Password should be at least 6 characters long")
      .trim()
      .isLength({ min: 6 }),
    body("firstName", "First Name cannot be empty").trim().not().isEmpty(),
    body("lastName", "Last Name cannot be empty").trim().not().isEmpty(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authController.signupUser
);

router.get("/verify/:token", authController.verifyAccount);

router.post("/login", authController.login);

router.post(
  "/signup-seller",
  upload.array("images", 10),
  [
    body("email", "Please enter a valid email to continue.")
      .isEmail()
      .custom((value, { req }) => {
        return Account.findOne({ email: value }).then((accountDoc) => {
          if (accountDoc) {
            return Promise.reject(
              "Email address already exists, please try again with another business email."
            );
          }
        });
      })
      .normalizeEmail(),
    body("password", "Password should be at least 6 characters long")
      .trim()
      .isLength({ min: 6 }),
    body("name", "Restaurant Name cannot be empty").trim().not().isEmpty(),
    body("payment", "Payment cannot be empty").trim().not().isEmpty(),
    body("tags", "Tags cannot be empty").trim().not().isEmpty(),
    body("street", "Street cannot be empty").trim().not().isEmpty(),
    body("locality", "Locality cannot be empty").trim().not().isEmpty(),
    body("aptName", "Apartment name cannot be empty").trim().not().isEmpty(),
    body("zip", "Zipcode cannot be empty").trim().not().isEmpty(),
    body("costForOne", "Cost for one cannot be empty").trim().not().isEmpty(),
    body("minOrderAmount", "Minimum Order Amount cannot be empty")
      .trim()
      .not()
      .isEmpty(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
    body("phoneNo", "Enter a valid 10 digit phone number")
      .trim()
      .isLength({ min: 10, max: 10 }),
  ],
  authController.signupSeller
);
router.post(
  "/signup-delivery-partner", // Đổi tên tuyến đường cho Delivery Partner
  uploadDeliveryFiles,
  [
    (req, res, next) => {
      console.log(req.body);
      next();
    },
    // Xác thực Email (Kiểm tra định dạng và tính duy nhất)
    body("email", "Vui lòng nhập email hợp lệ.")
      .isEmail()
      .custom((value, { req }) => {
        // Kiểm tra xem email đã tồn tại trong bảng Account chưa
        return Account.findOne({ email: value }).then((accountDoc) => {
          if (accountDoc) {
            return Promise.reject(
              "Địa chỉ email đã tồn tại. Vui lòng thử lại với email khác."
            );
          }
        });
      })
      .normalizeEmail(),

    // Xác thực Mật khẩu
    body("password", "Mật khẩu phải dài ít nhất 6 ký tự.")
      .trim()
      .isLength({ min: 6 }),

    // Xác thực Tên và Họ
    body("firstName", "Tên không được để trống.").trim().not().isEmpty(),
    body("lastName", "Họ không được để trống.").trim().not().isEmpty(),

    // Xác thực Số điện thoại
    body("phone", "Vui lòng nhập số điện thoại hợp lệ (từ 10 đến 11 chữ số).")
      .trim()
      .isLength({ min: 10, max: 11 }), // Tùy chỉnh độ dài số điện thoại theo yêu cầu của bạn

    // Xác thực Xác nhận Mật khẩu
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Mật khẩu xác nhận không khớp!");
        }
        return true;
      }),
      body("CCCD", "CCCD phải là số gồm đúng 12 chữ số theo quy định Việt Nam.")
        .trim() // Loại bỏ khoảng trắng thừa ở đầu/cuối
        .not()
        .isEmpty()
        .withMessage("CCCD không được để trống.") // Lỗi nếu rỗng
        .isLength({ min: 12, max: 12 })
        .withMessage("CCCD phải đúng 12 chữ số (không phải CMND 9 số cũ).") // Lỗi nếu sai độ dài
        .isNumeric()
        .withMessage("CCCD chỉ được chứa chữ số (0-9), không chứa chữ cái hoặc ký tự đặc biệt.") // Lỗi nếu không phải số
        .custom((value, { req }) => {
          // Kiểm tra tính duy nhất trong database (giả sử field 'CCCD' trong model User)
          return User.findOne({ CCCD: value }).then((userDoc) => {
            if (userDoc) {
              return Promise.reject("CCCD đã tồn tại trong hệ thống. Vui lòng sử dụng CCCD khác.");
            }
          });
        })
        .custom((value) => {
          // Validation nâng cao: Kiểm tra cấu trúc CCCD (tùy chọn, để tăng độ chính xác)
          if (value.length !== 12) return true; // Đã check length trước, nhưng để an toàn

          const provinceCode = parseInt(value.substring(0, 3)); // 3 số đầu: Mã tỉnh (001-096)
          if (provinceCode < 1 || provinceCode > 96) {
            throw new Error("Mã tỉnh/thành phố trong CCCD không hợp lệ (phải từ 001 đến 096).");
          }

          const genderCenturyCode = parseInt(value.substring(3, 4)); // 1 số: Mã giới tính/thế kỷ
          if (genderCenturyCode < 0 || genderCenturyCode > 3) { // Hiện tại chỉ 0-3 (thế kỷ 20-21)
            throw new Error("Mã giới tính/thế kỷ trong CCCD không hợp lệ (phải từ 0 đến 3).");
          }

          const birthYear = parseInt(value.substring(4, 6)); // 2 số: Năm sinh (00-99)
          const currentYear = new Date().getFullYear() % 100; // 2 chữ số cuối năm hiện tại (ví dụ: 2025 → 25)
          if (birthYear > currentYear + 1 || birthYear < 0) { // Không vượt quá năm hiện tại +1, và không âm
            throw new Error("Năm sinh trong CCCD không hợp lệ (không thể vượt quá năm hiện tại).");
          }
          // Có thể thêm check tuổi tối thiểu, ví dụ: if ((currentYear - birthYear) < 18) throw new Error("Shipper phải đủ 18 tuổi.");

          return true; // Nếu tất cả hợp lệ
        })
  ],
  authController.signUpDeliveryPartner
);

router.post("/images-test", authController.imagesTest);

module.exports = router;
