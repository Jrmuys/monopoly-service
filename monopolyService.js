/**
 * This module implements a REST-inspired webservice for the Monopoly DB.
 * The database is hosted on ElephantSQL.
 *
 * Currently, the service supports the player table only.
 *
 * To guard against SQL injection attacks, this code uses pg-promise's built-in
 * variable escaping. This prevents a client from issuing this URL:
 *     https://cs262-monopoly-service.herokuapp.com/players/1%3BDELETE%20FROM%20PlayerGame%3BDELETE%20FROM%20Player
 * which would delete records in the PlayerGame and then the Player tables.
 * In particular, we don't use JS template strings because it doesn't filter
 * client-supplied values properly.
 *
 * @author: kvlinden
 * @date: Summer, 2020
 */

// Set up the database connection.
const pgp = require('pg-promise')();
const db = pgp({
  host: 'salt.db.elephantsql.com',
  port: 5432,
  database: process.env.USER,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

// Configure the server and its routes.

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get('/', readHelloMessage);
router.get('/players', readPlayers);
router.get('/players/:id', readPlayer);
router.put('/players/:id', updatePlayer);
router.post('/players', createPlayer);
router.delete('/players/:id', deletePlayer);
router.get('/winners', readWinners);

app.use(router);
app.use(errorHandler);
app.listen(port, () => console.log(`Listening on port ${port}`));

// Implement the CRUD operations.

function errorHandler(err, req, res) {
  if (app.get('env') === 'development') {
    console.log(err);
  }
  res.sendStatus(err.status || 500);
}

function returnDataOr404(res, data) {
  if (data == null) {
    res.sendStatus(404);
  } else {
    res.send(data);
  }
}

function readWinners(req, res, next) {
  db.many(
    `SELECT name, score, emailAddress
    FROM Player, Game, PlayerGame
    WHERE Player.ID = PlayerGame.PlayerID
    AND Game.ID = PlayerGame.GameID
    AND score > 500
    ORDER BY score DESC`
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readHelloMessage(req, res) {
  res.send('This is Joels monopoly serivice, enjoy!');
}

function readPlayers(req, res, next) {
  db.many('SELECT * FROM Player')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readPlayer(req, res, next) {
<<<<<<< HEAD
  db.oneOrNone(`SELECT * FROM Player WHERE id=${req.params.id}`)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function updatePlayer(req, res, next) {
  db.oneOrNone(
    `UPDATE Player SET email=$(email), name=$(name) WHERE id=${req.params.id} RETURNING id`,
    req.body
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function createPlayer(req, res, next) {
  db.one(
    `INSERT INTO Player(email, name) VALUES ($(email), $(name)) RETURNING id`,
    req.body
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function deletePlayer(req, res, next) {
  db.oneOrNone(`DELETE FROM Player WHERE id=${req.params.id} RETURNING id`)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
=======
    db.oneOrNone('SELECT * FROM Player WHERE id=${id}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function updatePlayer(req, res, next) {
    db.oneOrNone('UPDATE Player SET email=${body.email}, name=${body.name} WHERE id=${params.id} RETURNING id', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function createPlayer(req, res, next) {
    db.one('INSERT INTO Player(email, name) VALUES (${email}, ${name}) RETURNING id', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}

function deletePlayer(req, res, next) {
    db.oneOrNone('DELETE FROM Player WHERE id=${id} RETURNING id', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
>>>>>>> 55224cdd94f9224d2a2d3ae45a67452e5097c611
}
