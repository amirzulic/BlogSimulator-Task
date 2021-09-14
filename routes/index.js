var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = {
  user: 'dcngkysm',
  database: 'dcngkysm',
  password: 'cISGJkkPAxSBJQ5byKxHJGj-PlsBAAZ5',
  host: 'hattie.db.elephantsql.com',
  port: 5432,
  max: 100,
  idleTimeoutMillis: 10,
};

/* IZVORI:
* getbootstrap.com --- stackoverflow.com --- jquery.com --- w3schools --- node-postrgres.com */

var pool = new pg.Pool(config);
var brojac = 0;
/* GET home page. */
router.get('/', function(req, res, next) {
  brojac += 1;
  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error", "status": 500}');
    }

    client.query(`SELECT * FROM Objava WHERE aktivna = 1;`, [], function(err, result) {
      done();
      if (err) {
        console.info(err);
      } else {
        res.render('pocetna', {objava: result.rows});
      }
    });

  });
});

router.post('/unesiObjavu', function(req, res, next) {
  let nazivAutora = req.body.nazivAutora;
  let datum = req.body.datum;
  let vrijeme = req.body.vrijeme;
  let tekst = req.body.tekst;

  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error", "status": 500}');
    }

    client.query(`INSERT INTO Objava (nazivAutora, datum, vrijeme, tekst)
    values ('${nazivAutora}', '${datum}', '${vrijeme}', '${tekst}');`, [], function(err, result) {
      done();
      if (err) {
        console.info(err);
      } else {
        res.redirect('/admin');
      }
    });

  });
});

router.get('/sortiraj/:tip/:smjer', function(req, res, next) {
  let tip = req.params.tip;
  let smjer = req.params.smjer;

  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error", "status": 500}');
    }

    client.query(`SELECT * FROM Objava
    ORDER BY ${tip};`, [], function(err, result) {
      done();
      if (err) {
        console.info(err);
      } else {
        res.render('sortirano', {objava: result.rows});
      }
    });

  });
});

router.get('/admin', function(req, res, next) {
  res.render('admin');
});

router.post('/prijavi', function(req, res, next) {
  let ime = req.body.korisnickoIme;
  let sifra = req.body.sifra;
  if(ime === 'admin' && sifra === 'pmf123') {
    res.redirect('/admin/objave');
  }
});

router.get('/admin/objave', function(req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error", "status": 500}');
    }
    client.query(`SELECT * FROM Objava;`, [], function(err, result) {
      done();
      if (err) {
        console.info(err);
      } else {
        res.render('adminObjave', {objava: result.rows});
      }
    });

  });
});

router.get('/admin/objave/:korisnik', function(req, res, next) {
  let korisnik = req.params.korisnik;

  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error", "status": 500}');
    }

    client.query(`SELECT * FROM Objava WHERE nazivAutora = '${korisnik}';`, [], function(err, result) {
      done();
      if (err) {
        console.info(err);
      } else {
        res.render('objaveKorisnik', {objava: result.rows});
      }
    });

  });
});

router.get('/urediObjavu', function(req, res, next) {
  res.render('urediObjavu');
});

router.get('/prozorBrisanja', function(req, res, next) {
  res.render('prozorBrisanja');
});

router.get('/statistika', function(req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error", "status": 500}');
    }

    client.query(`SELECT * FROM Brojac;`, [], function(err, result) {
      done();
      if (err) {
        console.info(err);
      } else {
        res.render('brojac', {brojac: result.rows[0].broj});
      }
    });

  });
});

router.post('/brojac', function(req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error", "status": 500}');
    }

    client.query(`UPDATE Brojac
    SET broj = broj + 1;`, [], function (err, result) {
      done();
      if (err) {
        console.info(err);
      }
    });
  });
});



router.post('/like', function(req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error", "status": 500}');
    }

    client.query(`;`, [], function(err, result) {
      done();
      if (err) {
        console.info(err);
      } else {
        res.redirect('/');
      }
    });

  });
});



module.exports = router;
