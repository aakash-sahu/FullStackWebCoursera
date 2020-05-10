Packages to install in the the serverside 
1. NodeJS
2. npm install express$4.16.3 --save
3. npm install morgan@1.9.0 --save (for logging)
4. npm install body-parser@1.18.3 --save
5. Use postman to check API. can also send body ->json for put and post requests.
6. Express generator to quickly scaffold out an express application. npm install express-generator@4.16.0 -g
7. To generate express application, "express <appname>, then go tto new foler and "npm install". Then npm start. Add .gitignore (optional)
8. Database - install mongo db (document based -- documents -> collection -> database). Add ObjectId if not given to documents. Add bin folder to Path to use command line. Stores data in BJSON (Binary JSON format)
9. Start Mongodb (first create folder named data) mongod --dbpath=data --bind_ip 127.0.0.1
10. mongo on command line to enter REPL(Read-eval-print-loop) --      
    db (Check database being used. Default is test)
     use conFusion (Change to database confusion)
     db (check new db)
     db.help()
11. Create collection dishes and add a document to it --    db.dishes.insert({ name: "Uthappizza", description: "Test" });
    -- check with db.dishes.find().pretty();
    -- check Object id -         
        -- var id = new ObjectId();
        -- id.getTimestamp();
12. In new folder (node-mongo), npm init and npm install mongodb@3.0.10 --save
13. Install npm install assert@1.4.1 --save to check for true/false values.
14. npm install mongoose@5.1.7 --save (for mongoogse ODM)
15. npm install mongoose@5.1.7 mongoose-currency@0.2.0 --save (for integrating the mongodb server in the express API)