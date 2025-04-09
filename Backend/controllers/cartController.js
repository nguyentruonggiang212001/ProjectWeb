import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, variantId, quantity } = req.body;

    // console.log(" Request thêm sản phẩm vào giỏ hàng:", {
    //   userId,
    //   productId,
    //   variantId,
    //   quantity,
    // });

    if (!userId || !productId || quantity <= 0) {
      console.error(" Lỗi: Dữ liệu không hợp lệ!");
      return res.status(400).json({ error: "Dữ liệu không hợp lệ!" });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      console.warn(" Sản phẩm không tồn tại!");
      return res.status(404).json({ error: "Sản phẩm không tồn tại!" });
    }

    let price = product.basePrice;
    let stock;

    //  Nếu có variantId, lấy stock từ variant
    if (variantId) {
      const variant = await Variant.findById(variantId);
      if (!variant) {
        console.warn(" Biến thể không tồn tại!");
        return res.status(404).json({ error: "Biến thể không tồn tại!" });
      }
      price = variant.price;
      stock = variant.stock;
    } else {
      stock = product.totalStock; // Nếu không có biến thể, dùng tổng tồn kho
    }

    //  Kiểm tra stock trước khi thêm vào giỏ hàng
    if (quantity > stock) {
      console.error(" Lỗi: Số lượng vượt quá tồn kho!");
      return res.status(400).json({ error: "Số lượng vượt quá tồn kho!" });
    }

    // Kiểm tra xem giỏ hàng đã có sản phẩm này chưa
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      console.log(" Tạo giỏ hàng mới cho user:", userId);
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        (!variantId || item.variantId?.toString() === variantId)
    );

    if (existingItem) {
      if (existingItem.quantity + quantity > stock) {
        console.error(" Lỗi: Không đủ hàng trong kho!");
        return res.status(400).json({ error: "Không đủ hàng trong kho!" });
      }
      existingItem.quantity += quantity;
    } else {
      const newItem = {
        productId,
        variantId,
        quantity,
        price,
        stock,
      };
      cart.items.push(newItem);
      // console.log(" Thêm sản phẩm mới vào giỏ hàng:", newItem);
    }

    //  Cập nhật tổng giá trị giỏ hàng
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    console.log(" Tổng giá trị giỏ hàng sau khi thêm:", cart.totalPrice);

    await cart.save();
    // console.log(" Thêm sản phẩm vào giỏ hàng thành công!");

    res.status(200).json({ message: "Đã thêm vào giỏ hàng", cart });
  } catch (error) {
    console.error(" Lỗi khi thêm vào giỏ hàng:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title imageUrl",
    });

    if (!cart) {
      return res.status(200).json({ message: "Giỏ hàng trống!", items: [] });
    }

    res.status(200).json(cart.items);
  } catch (error) {
    console.error(" Lỗi khi lấy giỏ hàng:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    let { productId, variantId, quantity } = req.body;

    console.log(" API nhận request cập nhật giỏ hàng:", req.body);

    // Kiểm tra dữ liệu đầu vào
    if (
      !userId ||
      !productId ||
      !variantId ||
      quantity == null ||
      isNaN(quantity) ||
      quantity < 1
    ) {
      console.error(" Backend: Dữ liệu không hợp lệ!", {
        userId,
        productId,
        variantId,
        quantity,
      });
      return res.status(400).json({ error: "Dữ liệu không hợp lệ!" });
    }

    // Kiểm tra giỏ hàng có tồn tại không, nếu không thì tạo mới
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    // Tìm sản phẩm trong giỏ hàng
    const item = cart.items.find(
      (item) =>
        String(item.productId) === String(productId) &&
        String(item.variantId) === String(variantId)
    );

    if (!item) {
      console.error(" Backend: Sản phẩm không có trong giỏ hàng!", {
        productId,
        variantId,
      });
      return res
        .status(404)
        .json({ error: "Sản phẩm không có trong giỏ hàng!" });
    }

    //  Cập nhật số lượng
    item.quantity = Number(quantity);
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Cập nhật thành công!", cart });
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    res.status(500).json({ error: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, variantId } = req.body;

    console.log(" Request xóa sản phẩm:", { userId, productId, variantId });

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      console.warn(" Giỏ hàng không tồn tại!");
      return res.status(404).json({ error: "Giỏ hàng không tồn tại!" });
    }

    // console.log(" Trước khi xóa, giỏ hàng:", JSON.stringify(cart, null, 2));

    //  Chuyển `productId` thành string nếu nó là object
    const formattedProductId =
      typeof productId === "object" ? productId._id : productId;

    //  Lọc sản phẩm ra khỏi giỏ hàng
    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === formattedProductId &&
          (!variantId || item.variantId?.toString() === variantId)
        )
    );

    //  Cập nhật `totalPrice`
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    // console.log(" Sau khi xóa, giỏ hàng:", JSON.stringify(cart, null, 2));

    await cart.save();
    console.log(" Xóa sản phẩm thành công!");

    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng!", cart });
  } catch (error) {
    console.error(" Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ error: error.message });
  }
};
