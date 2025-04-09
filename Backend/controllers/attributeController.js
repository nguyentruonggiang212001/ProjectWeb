import Attribute from "../models/Attribute.js";

export const getAllAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find();
    res.status(200).json(attributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy thuộc tính theo ID
export const getAttributeById = async (req, res) => {
  try {
    const { id } = req.params;
    const attribute = await Attribute.findById(id);

    if (!attribute) {
      return res.status(404).json({ error: "Không tìm thấy thuộc tính" });
    }

    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo thuộc tính mới
export const createAttribute = async (req, res) => {
  try {
    const { name, values } = req.body;

    // Kiểm tra xem thuộc tính đã tồn tại chưa
    const existingAttribute = await Attribute.findOne({ name });
    if (existingAttribute) {
      return res.status(400).json({ error: "Thuộc tính này đã tồn tại" });
    }

    // Tạo thuộc tính mới
    const attribute = await Attribute.create({ name, values });

    res.status(201).json({
      message: "Tạo thuộc tính thành công",
      attribute,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật thuộc tính
export const updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, values } = req.body;

    // Cập nhật trực tiếp bằng findByIdAndUpdate
    const attribute = await Attribute.findByIdAndUpdate(
      id,
      { name, values },
      { new: true, runValidators: true }
    );

    if (!attribute) {
      return res.status(404).json({ error: "Không tìm thấy thuộc tính" });
    }

    res.status(200).json({
      message: "Cập nhật thuộc tính thành công",
      attribute,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa thuộc tính
export const deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;

    const attribute = await Attribute.findById(id);
    if (!attribute) {
      return res.status(404).json({ error: "Không tìm thấy thuộc tính" });
    }

    await Attribute.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa thuộc tính thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
