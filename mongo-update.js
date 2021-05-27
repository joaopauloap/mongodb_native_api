//Update Document in Collection

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://joao:qwerty123@cluster0-i7dxf.gcp.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(url,{useUnifiedTopology: true}, function(err, db) {

  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("accounts").findOne({}, function(err, result) {
    if (err) throw err;
    console.log(result.name);
    db.close();
  });
});