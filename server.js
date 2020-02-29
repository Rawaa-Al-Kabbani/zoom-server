const express = require('express');
const path = require('path');
const database = require('./database.js');

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
  return await makeQuery('SELECT * FROM city');
}

app.get('/getCities', async function(request, response) {
  let cites = await getCities();
  response.send(cites);
});

async function getProductsForQuery() {
  return await makeQuery(`SELECT zoom.product.title, zoom.product.description, zoom.sub_category.subcategoryname, zoom.category.categoryname FROM zoom.product
INNER JOIN zoom.sub_category ON zoom.product.subcategoryid = zoom.sub_category.subcategoryid
INNER JOIN zoom.category ON zoom.category.categoryid = zoom.sub_category.categoryid`);
}

app.post('/queryProducts', async function(request, response) {
  const query = request.body.query.toLowerCase();
  let products = await getProductsForQuery();
  products = products.filter(product => {
    return Object.values(product).some(value => {
      return value.toLowerCase().indexOf(query) !== -1;
    });
  });
  response.send(products);
});

app.listen(process.env.PORT || 5000);
