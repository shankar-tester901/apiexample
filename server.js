const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');


app.set('view engine', 'ejs');
// parse application/json

const LoggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} ---- ${new Date()} `)
  next();
}

app.use(LoggerMiddleware);


//The body-parser extracts the entire body portion of
// an incoming request stream and makes it accessible on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var methodOverride = require('method-override')


app.use(methodOverride(function (req, res)
{
//console.log("inside methodOveride")
if (req.body && typeof req.body === 'object' && '_method' in req.body)
{
  var method = req.body._method;
  //console.log(method);
  delete req.body._method;
  return method;
}
}));




//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shankarnode'
});

//connect to database
conn.connect((err) =>{
  if(err) throw err;
 // console.log('Mysql Connected...');
});

//show all products
app.get('/api/products',(req, res) => {
  let sql = "SELECT * FROM product";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('home', {result: results})
   // res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show single product
app.get('/api/products/:id',(req, res) =>
 {
//console.log('invoked Edit ');
  let sql = "SELECT * FROM product WHERE product_id="+req.params.id;
  let query = conn.query(sql, (err, results) =>
   {
    if(err) throw err;

   // console.log("Fetched users successfully");

    // const userIs = results.map((result) => {
    //   return { abc : '123' }
    // })

    res.render('edit', {
      id : results[0].product_id,
      name: results[0].product_name,
      price: results[0].product_price
    })
  //  res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});



//add new product
app.post('/api/products',(req, res) => {

  let data = {product_name: req.body.product_name, product_price: req.body.product_price};
  let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//update product
app.put('/api/products/:id',(req, res) => {
 // console.log("invoked put");
  let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/api/products');
   // res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//Delete product
app.delete('/api/products/:id',(req, res) => {
  let sql = "DELETE FROM product WHERE product_id="+req.params.id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
     res.redirect('/api/products');
      //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//Server listening
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});
