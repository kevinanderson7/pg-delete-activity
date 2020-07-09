const express = require('express');
const router = express.Router();

// TODO: Move this setup into a module
// PG SETUP
const pg = require('pg');
const Pool = pg.Pool;
const config = {
  database: 'shoe_store', // name of database
  host: 'localhost',
  port: 5432,
  max: 10, // max number of concurrent connections
  idleTimeoutMillis: 10000, // attepmt to connect for 10 seconds
};

const pool = new Pool(config);

pool.on('connect', () => {
  console.log('postgresql connected!!!');
});

pool.on('error', (error) => {
  console.log('Error connecting to db', error);
});

// Express removed the '/shoes' when we do a app.use
router.post('/', function (req, res) {
  const shoeToAdd = req.body; // This the data we sent
  console.log('In POST route - product:', shoeToAdd); // Has a name, size and cost
  const query =
    'INSERT INTO "shoes" ("name", "cost", "size") VALUES ($1, $2, $3);';
  // $ with index (e.g. $1) will help improve the security of your db
  // Avoids SQL injection -- see bobby drop table comic
  pool
    .query(query, [shoeToAdd.name, shoeToAdd.cost, shoeToAdd.size])
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log('Error in POST', error);
      res.sendStatus(500);
    });
});

// http://localhost:5002/shoes will go here
router.get('/', function (req, res) {
  console.log('In GET route');
  // The query we want to run
  const query = 'SELECT * FROM "shoes";';
  pool
    .query(query)
    .then((results) => {
      console.log(results); // This is an object
      res.send(results.rows); // result.rows is an Array of shoes
    })
    .catch((error) => {
      console.log('Error making GET', error);
      res.sendStatus(500);
    });
}); // END GET ROUTE

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const queryText = `DELETE FROM "shoes" WHERE "id" = $1;`;

  pool
    .query(queryText, [id])
    .then((dbResponse) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log('error on delete', error);
      res.sendStatus(500);
    });
});

module.exports = router;
