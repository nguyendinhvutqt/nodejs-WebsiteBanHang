const userRouter = require("./user.routes");
const shopRouter = require("./shop.routes");
const adminRouter = require("./admin.routes");

const routes = (app) => {
  // Đặt middleware để truyền biến currentUser cho tất cả các view
  app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.message = req.session.message;
    res.locals.cart = req.session.cart;
    next();
  });

  // route user
  app.use("/user", userRouter);

  app.use("/admin", adminRouter);

  app.use("/", shopRouter);
  app.get("/", (req, res) => {
    res.render("user/home");
  });
};

module.exports = routes;
