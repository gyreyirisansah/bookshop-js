import { Request, Response } from "express";
import * as db from "../db";
import {
  baseTitleValidator,
  baseIdValidator,
  baseNameValidator,
  baseShippingAddress,
} from "./utils/base_validators";
import { matchedData, validationResult } from "express-validator";
import { Book, BookTitleAndAuthor } from "../db/books";
import { Customer, CustomerId } from "../db/customers";
import { PurchaseOrder } from "../db/purchaseOrders";
import log4js from "log4js";

const logger = log4js.getLogger("app");
const err_logger = log4js.getLogger("errors");

export const createOrderValidator = [
  ...baseTitleValidator,
  ...baseNameValidator("author"),
  ...baseNameValidator("name"),
  ...baseShippingAddress,
];

export const shipOrderValidator = [...baseIdValidator("pid")];

export const getOrderStatusValidator = [
  ...baseIdValidator("cid"),
  ...baseIdValidator("bid"),
];

export const createOrder = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const { title, author, name, address } = validatedData;
      const book: BookTitleAndAuthor = { title: title, author: author };
      const bid = await db.getBookId(book);

      const customer: Customer = { name: name, address: address };
      const cid = await db.getCustomerId(customer);
      const purchaseOrder: PurchaseOrder = { cid: cid, bid: bid };
      await db.createPurchaseOrder(purchaseOrder);
      logger.info("Purchase order created successfully");
      res.status(201).json({ status: "success" });
    } catch (err) {
      err_logger.error("Create Order: " + err);
      res.status(500).json({ error: "internal server error" });
    }
  }
};

export const getShipmentStatus = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const { title, author, name, address } = validatedData;
      const book: BookTitleAndAuthor = { title: title, author: author };
      const bid = await db.getBookId(book);

      const customer: Customer = { name: name, address: address };
      const cid = await db.getCustomerId(customer);
      const purchaseOrder: PurchaseOrder = { cid: cid, bid: bid };
      const pid = await db.getPOIdByContents(purchaseOrder);
      const shipped = await db.isPoShipped(pid);
      res.status(200).json({ shipped });
    } catch (err) {
      err_logger.error("Shipment status: " + err);
      res.status(500).json({ error: "internal server error" });
    }
  }
};

export const shipOrder = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const { pid } = validatedData;
      await db.shipPo(pid);
      res.status(200).json({ status: "success" });
    } catch (err) {
      err_logger.error("Ship Order: " + err);
      res.status(500).json({ error: "internal server error" });
    }
  }
};

export const getOrderStatus = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);

      const purchaseOrder: PurchaseOrder = {
        cid: validatedData.cid,
        bid: validatedData.bid,
      };
      const pid = await db.getPOIdByContents(purchaseOrder);
      const shipped = await db.isPoShipped(pid);
      const customer: CustomerId = { id: purchaseOrder.cid };
      const addr = await db.getCustomerAddress(customer);
      res.set("Content-Type", "text/html");
      res.status(200);
      res.send(
        Buffer.from(`
            <html>
            <head>
            <title>Order Status</title>
            </head>
            <body>
                <h1>Order Status</h1>
                <p>Order ID: ${pid}</p>
                <p>Book ID: ${purchaseOrder.bid}</p>
                <p>Customer ID: ${purchaseOrder.cid}</p>
                <p>Is Shipped: ${shipped}</p>
                <p>Shipping Address: ${addr}</p>
            </body>
            </html>
            `)
      );
    } catch (err) {
      err_logger.error("Ship Order: " + err);
      res.status(500).json({ error: "internal server error" });
    }
  }
};
