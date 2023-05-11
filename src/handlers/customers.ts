import { Request, Response } from "express";
import * as db from "../db";
import {
  baseNameValidator,
  baseShippingAddress,
  baseIdValidator,
} from "./utils/base_validators";
import { matchedData, validationResult } from "express-validator";
import {
  Customer,
  UpdateCustomerAddressInput,
  CustomerId,
} from "../db/customers";

import log4js from "log4js";

const logger = log4js.getLogger("app");
const err_logger = log4js.getLogger("errors");

export const createCustomerValidator = [
  ...baseNameValidator("name"),
  ...baseShippingAddress,
];

export const updateCustomerAddressValidator = [
  ...baseIdValidator("cid"),
  ...baseShippingAddress,
];

export const getCustomerBalanceValidator = [...baseIdValidator("cid")];

export const createCustomer = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const customer: Customer = {
        name: validatedData.name,
        address: validatedData.address,
      };
      await db.createCustomer(customer);
      logger.info("User created successfully");
      res.status(201).json({ status: "success" });
    } catch (err) {
      err_logger.error("Create Customer: " + err);
      res.status(500).json({ error: "internal server error" });
    }
  }
};

export const updateCustomerAddress = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const customer: UpdateCustomerAddressInput = {
        id: validatedData.cid,
        address: validatedData.address,
      };
      await db.updateCustomerAddress(customer);
      logger.info(customer.id + " updated successfully");
      res.status(200).json({ status: "success" });
    } catch (err) {
      err_logger.error("Update Customer: " + err);
      res.status(500).json({ error: "internal server error" });
    }
  }
};

export const getCustomerBalance = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors.array());
  } else {
    try {
      const validatedData = matchedData(req);
      const customer: CustomerId = { id: validatedData.cid };
      const balance = await db.customerBalance(customer);
      res.status(200).json({ balance });
    } catch (err) {
      err_logger.error("Customer Balance: " + err);
      res.status(500).json({ error: "internal server error" });
    }
  }
};
