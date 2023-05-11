import { connect } from './db';
export type Customer = {
    name:string,
    address:string
}

export type CustomerId = {
    id:number,
}

export type UpdateCustomerAddressInput ={
    id:number,
    address:string
}

export type ChargeCustomer = {
    id:number,
    pid:number
    price:number
}

export const createCustomer = async (customer:Customer): Promise<number> => {
    const db = await connect();
    await db.run(`INSERT INTO Customers (name, shippingAddress) VALUES (?, ?)`, [customer.name, customer.address]);
    return getCustomerId(customer);
}

export const getCustomerId = async (customer:Customer): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT id FROM Customers WHERE name = ? AND shippingAddress = ?`, [customer.name, customer.address]);
    return result.id;
}

export const getCustomerAddress = async (customer:CustomerId): Promise<string> => {
    const db = await connect();
    const result = await db.get(`SELECT shippingAddress FROM Customers WHERE id = ?`, [customer.id]);
    return result.shippingAddress;
}

export const updateCustomerAddress = async (customer:UpdateCustomerAddressInput): Promise<void> => {
    const db = await connect();
    await db.run(`UPDATE Customers SET shippingAddress = ? WHERE id = ?`, [customer.address, customer.id]);
}

export const customerBalance = async (customer:CustomerId): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT accountBalance FROM Customers WHERE id = ?`, [customer.id]);
    return result.accountBalance;
}

export const hasEnoughBalance = async (customer:ChargeCustomer):Promise<boolean> => {
    const balance = await customerBalance({id:customer.id});
    return balance >=customer.price
}

export const chargeCustomerForPO = async (customer:ChargeCustomer):Promise<void> => {
    // todo
    const db = await connect();
    const balance = await customerBalance({id:customer.id});
    const new_balance = balance - customer.price;
    await db.run(`UPDATE Customers SET accountBalance = ? WHERE id = ?`, [new_balance, customer.id]);
}