# bookshop-js

A simple book store API in need of input validation/sanitization.

This is a part of the University of Wyoming's Secure Software Design Course (Spring 2023). This is the base repository to be forked and updated for various assignments. Alternative language versions are available in:

- [Go](https://github.com/andey-robins/bookshop-go)
- [Rust](https://github.com/andey-robins/bookshop-rs)

## Versioning

`bookshop-js` is built with:

- node version v16.19.0
- npm version 9.6.2
- nvm version 0.39.3

## Usage

Start the api using `npm run dev`

I recommend using [`httpie`](https://httpie.io) for testing of HTTP endpoints on the terminal. Tutorials are available elsewhere online, and you're free to use whatever tools you deem appropriate for testing your code.

## Analysis of Existing Code

### Problems:

The current code has a few problems that need to be addressed.
First of all, the current code does not check for duplicity of data in the database. For example, books with the same title and author can be inserted into the database, or customers with the same name and shipping address can be inserted into the DB. This can be addressed in two ways. The first way is by creating a custom field in the validation chain implemented in this assignment to check if the user does not exist based on the provided information and returns an error message. The second way is to query the database to check if the user exists before inserting the data. If the user exists, the application should return a response with a bad request status code to the user and inform users that the user or book already exists.

Another problem discovered is that there is no error handling; therefore, the entire program crushes if, for example, a customer who doesn't exist is being fetched. The developers should include error handling in all the functions to catch all potential errors. Also, results from database queries should be checked if they did return data before reading values from the results to curb the reading of undefined properties errors.

Another problem but trivial encountered was that the shipping address in creating a customer was renamed as address; this might need to be clarified for the end user that both addresses are the same. This was renamed to make the input validation much more straightforward.

Lastly, the get order function in the orders file returns an entire HTML as a response. This might limit what the user can do with the data. Also, it becomes problematic if the client is not told what content type to expect. I strongly suggest all the responses should be in the same format; thus, JSON format, so the client has flexibility with the data being received as a response.

### Bugs

The only bug encountered was in creating a purchase order; two placeholders were provided instead of the required three columns for the orders table in the query string.

### Security Concerns

The current already deals with SQL injection because the queries are all prepared to escape special characters since the query parameters are not stringified.

However, there needs to be an official logging of errors and activities in the current app, which would make the auditability of the program easier. Logs should, therefore, be created the data is created, updated, or deleted.

Lastly, there needs to be a strategy that manages the number of requests being sent per user; this makes the application susceptible to denial of service attacks. Therefore, rate limiting should be added to the current code to mitigate this vulnerability.

# Type First Design Assignment

## Purchase endpoint;

I assume that the purchase end points pay for a purchase order. Parameters for this endpoints are customer id, purchase id, book title, and author I am including the author because I assume there could be books with same title but different authors. We included an additional column in the purchase order table that sets a purchase order checked out or not checked out. Account Balance should be enough for a successful purchase.

## Input Validation.

To achieve a type-first validation, we used an express validator. We created a base validation chain for the individual fields in the application: title, name, price, Ids, and shipping address. The title must be a string and can take special characters. Name and can take Unicode characters; the price must be only positive numbers. Ids can be only positive numbers, and the shipping address must be of a specific type.
From the base validators, we created validators for each request that also matches a defined type. For example, we made the book validator, which includes the author (From the name base validator), title, and price.

## Flow of Application

The flow chart below depicts the flow of inputs in the application.
![Alt adding polls](flowchat.PNG)


## Note: An internal server response may be due to fetching a data that is not available.