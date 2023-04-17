import { Request, Response } from "express";
import * as db from "../db";
import {baseTitleValidator,baseIdValidator,baseNameValidator,baseShippingAddress} from "./utils/base_validators"
import { matchedData,validationResult } from 'express-validator';

export const createOrderValidator = [
    ...baseTitleValidator,
    ...baseNameValidator("author"),
    ...baseNameValidator("name"),
    ...baseShippingAddress
]

export const shipOrderValidator = [
    ...baseIdValidator("pid")
]

export const getOrderStatusValidator = [
    ...baseIdValidator("cid"),
    ...baseIdValidator("bid")
]

export const createOrder = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { title, author, name, shippingAddress } = validatedData;
        const bid = await db.getBookId(title, author);
        const cid = await db.getCustomerId(name, shippingAddress);
        console.log("bid: "+bid),
        console.log("cid: "+cid)
        await db.createPurchaseOrder(bid, cid);
        res.status(201).json({ 'status': 'success' });
    }

    
}

export const getShipmentStatus = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { title, author, name, shippingAddress } = validatedData;
        const bid = await db.getBookId(title, author);
        const cid = await db.getCustomerId(name, shippingAddress);
        const pid = await db.getPOIdByContents(bid, cid);
        const shipped = await db.isPoShipped(pid);
        res.status(200).json({ shipped });
    }
    
}

export const shipOrder = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { pid } = validatedData;
        await db.shipPo(pid);
        res.status(200).json({ 'status': 'success' });
    }
    
}

export const getOrderStatus = async (req: Request, res: Response) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)

        const { cid, bid } = validatedData;
        const pid = await db.getPOIdByContents(bid, cid);
        const shipped = await db.isPoShipped(pid);
        const addr = await db.getCustomerAddress(cid)
        res.set('Content-Type', 'text/html');
        res.status(200)
        res.send(Buffer.from(`
        <html>
        <head>
        <title>Order Status</title>
        </head>
        <body>
            <h1>Order Status</h1>
            <p>Order ID: ${pid}</p>
            <p>Book ID: ${bid}</p>
            <p>Customer ID: ${cid}</p>
            <p>Is Shipped: ${shipped}</p>
            <p>Shipping Address: ${addr}</p>
        </body>
        </html>
        `));
    }
}