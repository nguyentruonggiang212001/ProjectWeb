import express from "express";
import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";
import qs from "qs";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APP INFO
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

app.post("/payment", async (req, res) => {
  const { userId, amount } = req.body; // Nhận tổng tiền từ frontend

  console.log(" Dữ liệu nhận từ frontend:", req.body);

  if (!userId || !amount) {
    return res.status(400).json({ message: "Thiếu thông tin đơn hàng!" });
  }

  const embed_data = {
    redirecturl: "http://localhost:5173/order",
  };

  // const items = [{}];
  const items = []; // Sửa thành mảng rỗng
  const transID = Math.floor(Math.random() * 1000000);
  const order = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: userId,
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: amount,
    description: `Lazada - Payment for the order #${transID}`,
    bank_code: "",
    callback_url:
      "https://f132-2405-4803-fe4b-fdf0-f533-5bda-e9ae-ef32.ngrok-free.app/callback",
  };

  console.log(" Order gửi lên ZaloPay:", order);

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
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

    console.log("ZaloPay order response:", result.data);

    // return res.status(200).json(result.data);

    return res.status(200).json({
      order_url: result.data.order_url, // Lấy link thanh toán từ response
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Lỗi kết nối ZaloPay!" });
  }
});

app.post("/callback", (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    } else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log(
        "update order's status = success where app_trans_id =",
        dataJson["app_trans_id"]
      );

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
});

app.post("/order-status/:app_trans_id", async (req, res) => {
  const app_trans_id = req.params.app_trans_id;
  let postData = {
    app_id: config.app_id,
    app_trans_id: app_trans_id, // Input your app_trans_id
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
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
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(5000, () => {
  console.log("server run at port 5000");
});
