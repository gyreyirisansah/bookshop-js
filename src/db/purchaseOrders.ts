import { chargeCustomerForPO, hasEnoughBalance,ChargeCustomer } from "./customers";
import { connect } from "./db";

// export type Purchase ={
//     bid:number,
//     cid:number
// }


export type PurchaseOrder ={
    bid:number,
    cid:number
}


export type PurchaseId = {
    id: number
}

export const createPurchaseOrder = async (purchaseOrder:PurchaseOrder): Promise<PurchaseId> => {
    const db = await connect();
    await db.run(`INSERT INTO PurchaseOrders (bookId, customerId, shipped,checkedOut) VALUES (?, ?, ?,?)`, [purchaseOrder.bid, purchaseOrder.cid, 0,0]);
    return getPOIdByContents(purchaseOrder);
}

export const getPOIdByContents = async (purchaseOrder:PurchaseOrder): Promise<PurchaseId> => {
    const db = await connect();
    const result = await db.get(`SELECT id FROM PurchaseOrders WHERE bookId = ? AND customerId = ?`, [purchaseOrder.bid, purchaseOrder.cid]);
    return result.id;
}

export const isPoShipped = async (purchaseOrder:PurchaseId): Promise<boolean> => {
    const db = await connect();
    const result = await db.get(`SELECT shipped FROM PurchaseOrders WHERE id = ? `, [purchaseOrder]);
    return result.shipped === 1;
}

export const isCheckedOut = async (purchaseOrder:PurchaseId): Promise<boolean> => {
    const db = await connect();
    const result = await db.get(`SELECT checkedOut FROM PurchaseOrders WHERE id = ? `, [purchaseOrder.id]);
    return result.checkedOut === 1;
}

export const checkOUt = async (charge: ChargeCustomer): Promise<void> => {
    const db = await connect();
    await chargeCustomerForPO(charge);
    await db.run(`UPDATE PurchaseOrders SET checkedOut = 1 WHERE id = ?`, [charge.pid]);
}

export const shipPo = async (purchaseOrder:PurchaseId): Promise<void> => {
    const db = await connect();
    await db.run(`UPDATE PurchaseOrders SET shipped = 1 WHERE id = ?`, [purchaseOrder]);
}