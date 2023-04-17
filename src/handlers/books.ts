import { Request, Response } from 'express';
import * as db from '../db';
import { matchedData,validationResult } from 'express-validator';

import {baseTitleValidator,basePriceValidator,baseNameValidator} from "./utils/base_validators"

export const baseBookValidator = [
    ...baseTitleValidator,
    ...baseNameValidator("author")
]

export const createBookValidator = [
    
    ...baseBookValidator,
    ...basePriceValidator
]


export const createBook = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { title, author, price } = validatedData;
        await db.createBook(title, author, price);
        res.status(201).json({ 'status': 'success' });
    }
    
}

export const getPrice = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json(errors.array());
    }else{
        const validatedData = matchedData(req)
        const { title, author } = validatedData
        const bid = await db.getBookId(title, author);
        const price = await db.getBookPrice(bid);
        res.status(200).json({ price });
    }

    
}