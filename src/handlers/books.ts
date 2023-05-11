import { Request, Response } from "express";
import * as db from "../db";
import { matchedData, validationResult } from "express-validator";

import {
  baseTitleValidator,
  basePriceValidator,
  baseNameValidator,
  baseIdValidator,
} from "./utils/base_validators";
import { Book, BookTitleAndAuthor } from "../db/books";
import { CustomerId, hasEnoughBalance, ChargeCustomer } from "../db/customers";
import { PurchaseId, checkOUt, isCheckedOut } from "../db/purchaseOrders";
import log4js from "log4js";

const logger = log4js.getLogger("app");
const err_logger = log4js.getLogger("errors");

export const baseBookValidator = [
  ...baseTitleValidator,
  ...baseNameValidator("author"),
];

export const createBookValidator = [
  ...baseBookValidator,
  ...basePriceValidator,
];

export const purchaseBookValidator = [
  ...baseBookValidator,
  ...baseIdValidator("cid"),
  ...baseIdValidator("pid"),
];

export const createBook = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const book: Book = {
        title: validatedData.title,
        author: validatedData.author,
        price: validatedData.price,
      };

      await db.createBook(book);
      logger.info("Book creates successfully title: ", book.title);
      res.status(201).json({ status: "success" });
    } catch (err) {
      err_logger.error("Create Book: " + err);
      res.status(500).json({ error: "internal server error" });
    }
  }
};

export const getPrice = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const book: BookTitleAndAuthor = {
        title: validatedData.title,
        author: validatedData.author,
      };
      const bid = await db.getBookId(book);
      const price = await db.getBookPrice({ id: bid });
      res.status(200).json({ price });
    } catch (err) {
      err_logger.error("Get Price: " + err);
      res.status(500).json({ error: "internal server error" });
    }
  }
};

export const purchaseBook = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const book: BookTitleAndAuthor = {
        title: validatedData.title,
        author: validatedData.author,
      };
      const purchaseId: PurchaseId = { id: validatedData.pid };
      const customer: CustomerId = { id: validatedData.cid };
      const bid = await db.getBookId(book);
      const price = await db.getBookPrice({ id: bid });
      const charge: ChargeCustomer = {
        id: customer.id,
        pid: purchaseId.id,
        price: price,
      };

      if (await isCheckedOut(purchaseId)) {
        res
          .status(400)
          .json({ msg: "This order has already been checked out" });
      } else {
        if (await hasEnoughBalance(charge)) {
          await checkOUt(charge);
          logger.info(charge.id + " purchased book successfully");
          res.status(200).json({ status: "success" });
        } else {
          err_logger.error("Insufficient balance for user " + charge.id);
          res.status(402).json({ msg: "Insufficient balance" });
        }
      }
    } catch (err) {
      err_logger.error("Purchase Book: " + err);
      res.status(500).json({ error: "internal server error" });
    }
  }
};
