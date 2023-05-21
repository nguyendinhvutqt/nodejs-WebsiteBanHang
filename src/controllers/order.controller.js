const User = require("../models/user.model");
const Order = require("../models/order.model");

exports.getOrderProducts = async (req, res) => {
  if (!req.session.cart) {
    return res.redirect("/user/sign-in");
  }
  const user = await User.findById(req.session.user._id);
  const products = req.session.cart;
  return res.render("user/payment", { user, products, error: "" });
};

exports.orderProducts = async (req, res) => {
  const { name, phone, address } = req.body;
  if (!name || !phone || !address) {
    const user = await User.findById(req.session.user._id);
    return res.render("user/payment", {
      user,
      error: "Bạn phải điền đầy đủ thông tin",
    });
  }
  let totalAmount = 0;
  const products = req.session.cart;
  products.forEach((product) => {
    totalAmount += product.price * product.quantity;
  });
  const newOrder = new Order({
    user: req.session.user._id,
    shippingAddress: {
      name,
      phone,
      address,
    },
    products,
    totalAmount,
    paymentMethod: "Tại nhà",
  });
  await newOrder.save();
  return res.redirect("/");
};
