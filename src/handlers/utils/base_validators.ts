import {check} from 'express-validator';

export const baseNameValidator =(attr:string) =>{
    return [
        check(attr)
        .trim()
        .not().isEmpty()
        .withMessage(attr+" can not be null")
        .escape()
        //Regex expression taken from https://stackoverflow.com/questions/2385701/regular-expression-for-first-and-last-name
        .matches(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)
        .withMessage("Invalid "+attr),
    ]
}
 

export const baseTitleValidator =[
    check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Book title can not be null!!")
    .escape(),
]
export const basePriceValidator = [
    
    check("price")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Price cannot be null")
    .escape().isFloat({min:0})
    .withMessage("invalid price")
]

export const baseIdValidator =(attr:string) =>{
    return [
        check(attr)
        .trim()
        .not()
        .isEmpty()
        .withMessage(attr+" can not be null")
        .escape()
        .isInt({min:1})
        .withMessage("Invalid "+attr)
    ]
}

export const baseShippingAddress =[
    check("shippingAddress")
    .trim()
    .not()
    .isEmpty()
    .escape()
    .matches(/^(\d{1,}) [a-zA-Z0-9\s]+(\,)? [a-zA-Z]+(\,)? [A-Z]{2} [0-9]{5,6}$/)
    .withMessage("Invalid Address (Pattern: Addr number Street Name, City, State ZIP code Ex: 2024 E Beufort St, Laramie, WY 82072")
]