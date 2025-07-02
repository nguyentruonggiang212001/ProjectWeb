import express from "express";
import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";
import qs from "qs";

const router = express.Router();

// Cấu hình ZaloPay
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

// Tạo đơn thanh toán
router.post("/payment", async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ message: "Thiếu thông tin đơn hàng!" });
  }

  // const embed_data = {
  //   redirecturl: `${process.env.CLIENT_URL}/order`,
  // };

  const embed_data = {
    redirecturl: "https://nguyentruonggiang212001.github.io/ProjectWeb/#/order",
  };

  const items = [];
  const transID = Math.floor(Math.random() * 1000000);

  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: userId,
    app_time: Date.now(),
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: "",
    callback_url: `${process.env.API_URL}/callback`,
  };

  const data =
    order.app_id +
    "|" +
    order.app_trans_id +
    "|" +
    order.app_user +
    "|" +
    order.amount +
    "|" +
    order.app_time +
    "|" +
    order.embed_data +
    "|" +
    order.item;

  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, { params: order });

    return res.status(200).json({
      order_url: result.data.order_url,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Lỗi kết nối ZaloPay!" });
  }
});

// Nhận callback từ ZaloPay
router.post("/callback", (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;
    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    if (reqMac !== mac) {
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      let dataJson = JSON.parse(dataStr);
      console.log(
        "Thanh toán thành công với app_trans_id:",
        dataJson["app_trans_id"]
      );
      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0;
    result.return_message = ex.message;
  }

  res.json(result);
});

// Kiểm tra trạng thái đơn hàng
router.post("/order-status/:app_trans_id", async (req, res) => {
  const app_trans_id = req.params.app_trans_id;

  let postData = {
    app_id: config.app_id,
    app_trans_id: app_trans_id,
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Lỗi kiểm tra trạng thái đơn hàng!" });
  }
});

export default router;
