const express = require('express');
const path = require('path');
const database = require('./database.js');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

function makeQuery(query) {
  return new Promise((resolve, reject) => {
    database.query(query, function(err, result, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function getProducts() {
  return await makeQuery('SELECT * FROM product');
}

app.get('/getProducts', async function(request, response) {
  let products = await getProducts();
  response.send(products);
});

async function getUsers() {
  return await makeQuery('SELECT * FROM user');
}

app.get('/getUsers', async function(request, response) {
  let users = await getUsers();
  response.send(users);
});

async function getCategories() {
  return await makeQuery('SELECT * FROM category');
}

app.get('/getCategories', async function(request, response) {
  let categories = await getCategories();
  response.send(categories);
});

async function getSubCategories() {
  return await makeQuery('SELECT * FROM sub_category');
}

app.get('/getSubCategories', async function(request, response) {
  let subCategories = await getSubCategories();
  response.send(subCategories);
});

async function getCities() {
  return await makeQuery('SELECT zoom.city.cityname FROM city ORDER BY zoom.city.cityname ASC');
}

app.get('/getCities', async function(request, response) {
  let cites = await getCities();
  response.send(cites);
});

async function getProductsForQuery() {
  return await makeQuery(`SELECT zoom.product.title, zoom.product.description, zoom.sub_category.subcategoryname, zoom.category.categoryname, zoom.city.cityname FROM zoom.product
INNER JOIN zoom.sub_category ON zoom.product.subcategoryid = zoom.sub_category.subcategoryid
INNER JOIN zoom.category ON zoom.category.categoryid = zoom.sub_category.categoryid
INNER JOIN zoom.user ON zoom.user.userid = zoom.product.userid
INNER JOIN zoom.city ON zoom.city.cityid = zoom.user.cityid`);
}

app.post('/queryProducts', async function(request, response) {
  const query = request.body.query.toLowerCase();
  let products = await getProductsForQuery();
  if (query.length > 0) {
    products = products.filter(product => {
      return Object.values(product).some(value => {
        return value.toLowerCase().indexOf(query) !== -1;
      });
    });
  }
  response.send(products);
});

app.post('/signup', (request, response) => {
  const sql = `INSERT INTO user (email, phonenumber) values ('${request.body.email}','${request.body.phonenumber}')`;
  database.query(sql, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    result.effectedRowa > 0;
  });
});

app.get('/getuser', (request, response) => {
  const email = request.query.email;
  const password = request.query.password;

  console.log(request.query.email);
  console.log(request.query.password);

  const sql = 'SELECT * FROM user WHERE email=? AND auth_str=?';
  database.query(sql, [email, password], (err, result) => {
    if (err) response.send(err);
    console.log(result);
    response.send(result);
  });
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
