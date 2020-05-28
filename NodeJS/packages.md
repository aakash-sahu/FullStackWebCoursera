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
16. npm install express-session@1.15.6 session-file-store@1.2.0 --save (to tract authentiated users using express session)
17. npm install passport@0.4.0 passport-local@1.0.0 passport-local-mongoose@5.0.1 --save (usin passport for authentication)
18. npm install passport-jwt@4.0.0 jsonwebtoken@8.3.0 --save (to use json web token for authentication)
19. To use mongoose population, first drop old users in mongodb repl: db.users.drop(). Mongoose population is used to populate one document with content from another document.
20. Admin account setup behind the scenes. Sign up user normally, then go to mongo repl and update admin flag as follows:
db.users.update({"username":"admin"}, {$set: {"admin":true}})
21. For HTTPS, get a self signed certificate with following commands on linux or Git for windows in the bin folder: 
    openssl genrsa 1024 > private.key
    openssl req -new -key private.key -out cert.csr
    openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
    Use https to connect to port _443 and configure Postman
22. File upload multipart - npm install multer@1.3.1 --save
23. For Cross Origin Resource Sharing(CORS) -  npm install cors@2.8.4 --save.. set origin in postman to https link for post, put, delete... to preflight, send via OPTIONS field in postman and set origin in header.. then check response