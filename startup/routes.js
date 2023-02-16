const authRouter = require("../controllers/auth");
const gameRouter = require("../controllers/gameController");
const screenActivityRouter = require("../controllers/ScreenActivitesController");
const userGamePlayRouter = require("../controllers/UserGameplayController");
const userSessionRouter = require("../controllers/UserSessionController");
const productRouter = require("../controllers/product");
const cartRouter = require("../controllers/cart");
const transactionRouter = require("../controllers/transaction");
const coinsRouter = require("../controllers/coins");
const sendMessageRouter = require("../controllers/sendMessage");

module.exports = (app) => {
  //API Routes

  app.use("/api/v1", authRouter);
  app.use("/api/v1/game", gameRouter);
  app.use("/api/v1/screen_activity", screenActivityRouter);
  app.use("/api/v1/user_gameplay", userGamePlayRouter);
  app.use("/api/v1", userSessionRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/checkout", transactionRouter);
  app.use("/api/v1/coins", coinsRouter);
  app.use("/api/v1/sendaMessage", sendMessageRouter);
};
