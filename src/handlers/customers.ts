import { Request, Response } from 'express';
import * as db from '../db';
import {baseNameValidator,baseShippingAddress,baseIdValidator} from "./utils/base_validators"
import { matchedData,validationResult } from 'express-validator';

export const createCustomerValidator = [
    ...baseNameValidator("name"),
    ...baseShippingAddress
]

export const updateCustomerAddressValidator = [
    ...baseIdValidator("cid"),
    ...baseShippingAddress
]

export const getCustomerBalanceValidator = [
    ...baseIdValidator("cid")
]

export const createCustomer = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { name, shippingAddress } = validatedData;
        await db.createCustomer(name, shippingAddress);
        res.status(201).json({ 'status': 'success' });
    }
   
}

export const updateCustomerAddress = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { cid, shippingAddress } = validatedData;
        await db.updateCustomerAddress(cid, shippingAddress);
        res.status(200).json({ 'status': 'success' });
    }
}

export const getCustomerBalance = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { cid } = validatedData;
        const balance = await db.customerBalance(cid);
        res.status(200).json({ balance });
    }
    
}