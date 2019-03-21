const request = require('request');
 
const json = {
    "product_name": "Product 15 Added",
    "product_price": "15000",
};
 
request.post({
    url: 'http://localhost:3000/api/products',
    body: json,
    json: true,
}, function (error, response, body) {
    console.log(body);
});