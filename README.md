# ACM Industry Training 3: Databases

## How to Setup

**Frontend:**
cd frontend  
npm install, npm start  

**Backend:**
in 2nd terminal, cd backend  
python3 server.py  

## Things to Do

- Understand how user database works (sign-in/create account implemented)  
- Create an items database by creating a new items.db file and opening it in SQLite and run the following query:  
CREATE TABLE items (  
   id INTEGER PRIMARY KEY AUTOINCREMENT,  
   user VARCHAR(255) NOT NULL,  
   message VARCHAR(255) NOT NULL,  
   timestamp VARCHAR(255) NOT NULL  
)  
- Understand CRUD operations on items database  
- Learn how to view database table and commit queries in VSCode  
- Modify CRUD API routes
