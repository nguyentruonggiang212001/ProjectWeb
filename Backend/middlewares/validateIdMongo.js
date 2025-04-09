import mongoose from "mongoose";

export const validateIdMongo = async (req, res, next) => {
  const id = req.params.id || req.params.variantId; // Lấy cả `id` và `variantId`

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    console.error(" ID không hợp lệ:", id);
    return res.status(400).json({ error: "ID không hợp lệ!" });
  }

  // console.log(" ID hợp lệ:", id);
  next();
};
