//Create Collection

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://joao:qwerty123@cluster0-i7dxf.gcp.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.createCollection("accounts", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});