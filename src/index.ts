import express, { Express } from "express";
import * as handlers from "./handlers";
import bodyParser from "body-parser";
import log4js from "log4js";

const app: Express = express();
const port = 8080;

app.use(bodyParser.json());
log4js.configure({
  appenders: {
    app: { type: "file", filename: "log.txt" },
    errorFile: {
      type: "file",
      filename: "log_errors.txt",
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile",
    },
  },
  categories: {
    default: { appenders: ["app"], level: "debug" },
    errors: { appenders: ["errors"], level: "debug" },
  },
});

app.post("/books/new", handlers.createBookValidator, handlers.createBook);
app.get("/books/price", handlers.baseBookValidator, handlers.getPrice);
app.put(
  "/books/purchase",
  handlers.purchaseBookValidator,
  handlers.purchaseBook
);

app.post(
  "/customers/new",
  handlers.createCustomerValidator,
  handlers.createCustomer
);
app.put(
  "/customers/address",
  handlers.updateCustomerAddressValidator,
  handlers.updateCustomerAddress
);
app.get(
  "/customers/balance",
  handlers.getCustomerBalanceValidator,
  handlers.getCustomerBalance
);

app.post("/orders/new", handlers.createOrderValidator, handlers.createOrder);
app.get(
  "/orders/shipped",
  handlers.createOrderValidator,
  handlers.getShipmentStatus
);
app.put("/orders/ship", handlers.shipOrderValidator, handlers.shipOrder);
app.get(
  "/orders/status",
  handlers.getOrderStatusValidator,
  handlers.getOrderStatus
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
