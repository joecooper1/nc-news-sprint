# **NC-NEWS DATABASE**

This project is a build of a small database in the style of a newspaper site, with topics, articles, users and comments.

## **GETTING STARTED**

### **Prerequisites**

_You will need:_

- express
- knex
- fs
- pg

_And also, as dev dependencies:_

- chai
- chai-sorted
- mocha
- supertest

## **Installing**

_To set up the database, run these commands:_

- npm run setup-dbs --- This will make the database go live on pg
- npm run migrate-latest --- This will set up the tables and columns in the database
- npm run seed-test --- This will seed into the test database, for testing, OR
- npm run seed --- This will seed into the dev database

To get data out of the system you can make a call to the localhost using insomnia or a similar tool.

- /api --- this endpoint will list all available endpoints, their functions. and the queries they accept

## **Testing**

- npm t --- will run tests on the database, to test for endpoints and error hadling.

### **Deployment**

### **Built With**

### **Contributing**

### **Versioning**

### **Authors**

### **License**
