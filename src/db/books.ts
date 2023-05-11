import { type } from 'os';
import { connect } from './db'



export type Book = {
    title:string,
    author:string,
    price:number
};
export type BookTitleAndAuthor = {
    title:string,
    author:string,
};

export type BookId = {
    id:number
};



export const createBook = async (book:Book):Promise<number> => {
    const db = await connect();
    await db.run(`INSERT INTO Books (title, author, price) VALUES (?, ?, ?)`, [book.title, book.author, book.price]);
    return getBookId({title:book.title, author:book.author})
}

export const getBookId = async (bookIdInput:BookTitleAndAuthor):Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT id FROM Books WHERE title = ? AND author = ?`, [bookIdInput.title, bookIdInput.author]);
    return result.id;
}

export const getBookPrice = async (priceInput:BookId):Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT price FROM Books WHERE id = ?`, [priceInput.id]);
    return result.price;
}