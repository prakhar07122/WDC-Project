var express = require('express');
var router = express.Router();
var argon2 = require('argon2');
const { query } = require('express-validator');
var nodemailer = require('nodemailer');
var connection = require('../db');

const sanitizeHtml = require('sanitize-html');

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: 'jashsuchak99@gmail.com',
    pass: 'qxmmvhalljgewibi'
  },
  secure: true
});

// function email_user(email, subject, lines) {
//   console.log(email);
//   const info = {
//     from: "jashsuchak99@gmail.com",
//     to: email,
//     subject: subject,
//     text: lines,
//     html: '<h3>Hey There!</h3>'
//   };
//   transporter.sendMail(info, function (err, data) {
//     if (err)
//       console.log('Error sending email: ', err); // ERROR SENDING EMAIL
//     else
//       console.log('Email sent: ', data.response); // RESPONSE FROM MAIL SERVER
//   });
// }


// var connection = require('../db');

const CLIENT_ID = '176124111804-da0crl4icfuijh2qqtq23i58hfg7gtls.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);



/* GET home page. */
router.get('/', function (req, res, next) {
  /*   connection.query('select * from ...;', (err, rows, fields) => {
      if (err) throw err;

      console.log('Server connected to the database!');
    }); */
  //res.redirect('/login.html');
  res.render('index', { title: 'Express' });
});

// // page index redirect
// router.get('/', function(req, res, next) {

//   if (!('user' in req.session)){
//       res.redirect('/login.html');
//       return;
//   }
//   next();
// });

// // restrict acces to pages without loggin in
// router.use(function(req, res, next) {
//   email_user("rahulghetia67@gmail.com", "HOHO", "HEHE");
//   if (!('user' in req.session)){
//       res.redirect('/login.html');
//       return;
//   }
//   next();
// });

router.post('/register', function (req, res, next) {
  console.log("Inside!");

  if ('UserName' in req.body && req.body.UserName !== null &&
    'UserEmail' in req.body && req.body.UserEmail !== null &&
    'GivenName' in req.body && req.body.FirstName !== null &&
    'FamilyName' in req.body && req.body.LastName !== null &&
    'Password' in req.body && req.body.Password !== null &&
    'Password2' in req.body && req.body.Password2 !== null) {
    console.log("Jash");

    req.pool.getConnection(async function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      const hash = await argon2.hash(req.body.Password);
      var query = `INSERT INTO Login (UserName, Email, GivenName, FamilyName, Password ) VALUES (?, ?, ?, ?, ?)`;
      connection.query(query, [
        req.body.UserName,
        req.body.UserEmail,
        req.body.GivenName,
        req.body.FamilyName,
        hash], function (qerr, rows, fields) {
          connection.release();
          if (qerr) {
            console.log(qerr);
            res.sendStatus(500);
            return;
          }
          req.session.accepted = true;
          req.session.user = rows.insertId;
          console.log("200");
          res.status(200).send();
        });
    });
  }
  else {
    res.sendStatus(401);
  }
});

// login with Useremail and Password
router.post('/login', async function (req, res, next) {
  if ('client_id' in req.body && 'credential' in req.body) {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log('test');

    req.pool.getConnection(function (err, connection) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      let query = `SELECT * FROM Login WHERE Email = ?`;
      connection.query(query, [payload['Email']], function (qerr, rows, fields) {
        connection.release();
        if (qerr) {
          console.log(qerr);
          res.sendStatus(500);
          return;
        }
        if (rows[0]) {
          res.status(200).send(JSON.stringify(rows[0]));
        }
        else {
          //No User
          res.sendStatus(401);
        }
      });
    });

  } else if ('UserEmail' in req.body && req.body.UserEmail !== null &&
    'Password' in req.body && req.body.Password !== null) {
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      let query = `SELECT * FROM Login WHERE Email = ?`;
      connection.query(query, [req.body.UserEmail], async function (qerr, rows, fields) {
        connection.release();
        if (qerr) {
          res.sendStatus(500);
          return;
        }
        if (rows[0]) {
          if (await argon2.verify(rows[0].Password, req.body.Password)) {

            let [user_login] = rows;
            delete user_login.Password;

            req.session.accepted = true;
            req.session.user = user_login;
            res.status(200).send(JSON.stringify(rows[0]));
          }
        }
        else {
          //No User
          res.sendStatus(401);
        }
      });
    });
  }
  else {
    res.sendStatus(401);
  }
});

router.post('/googles_login', async function (req, res, next) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: CLIENT_ID
    });
    const payload = ticket.getPayload();

    const sql = 'SELECT * FROM Login WHERE GoogleUserID = ?';

    connection.query(sql, [payload.sub], (error, result) => {
      if (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      if (result.length === 0) {
        const addUser = 'INSERT INTO Login (Username, Email, GivenName, FamilyName, GoogleUserID, Designation, Password) VALUES (?, ?, ?, ?, ?, ?, ?)';

        connection.query(addUser, [payload.name, payload.email, payload.given_name, payload.family_name, payload.sub, 'User', 'some_hashed_password'], (error, googleUser) => {
          if (error) {
            console.error('Error executing insert query:', error);
            res.status(500).json({ error: 'Database error' });
            return;
          }

          const userId = googleUser.insertId;

          const user = {
            Username: payload.name,
            Email: payload.email,
            GivenName: payload.given_name,
            FamilyName: payload.family_name,
            Designation: 'User',
            UserID: userId
          };

          req.session.accepted = true;
          req.session.user = user;
          req.session.save();

          res.redirect('/main_page.html');
        });
      } else {
        const user = result[0];

        req.session.accepted = true;
        req.session.user = user;
        req.session.save();

        res.redirect('/main_page.html');
      }
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ error: 'Token verification error' });
  }
});

router.post('/rsvp-me', function (req, res, next) {
  var { Club_id } = req.body;
  var { Event_title } = req.body;
  var { Venue } = req.body;
  var { event_description } = req.body;
  var { Date } = req.body;
  console.log(req.session);
  connection.query('SELECT * FROM Club WHERE ClubID=?', [Club_id], function (err, rows, fields) {
    if (err) throw err;
    var { Club_name } = rows[0];
    const info = {
      from: "jashsuchak99@gmail.com",
      to: req.session.user.Email,
      subject: "Event_title",
      text: "event_description",
      html: '<h3>Hey There!</h3>\
      <h3>This is the confirmation of the event details that you RSVPed for:</h3>\
        <table>\
        <tr><td>Club Name</td><td>'+ Club_name + '</td></tr>\
        <tr><td>Event Title</td><td>'+ Event_title + '</td></tr>\
        <tr><td>Venue</td><td>'+ Venue + '</td></tr>\
        <tr><td>Event Description</td><td>'+ event_description + '</td></tr>\
        <tr><td>Date</td><td>'+ Date + '</td></tr>\
        </table>\
        <p> See you there!! </p>'
    };
    transporter.sendMail(info, function (cerr, data) {
      if (cerr)
        console.log('Error sending email: ', cerr); // ERROR SENDING EMAIL
      else
        console.log('Email sent: ', data.response); // RESPONSE FROM MAIL SERVER
    });
  });
  // connection.query(`INSERT INTO RSVP (RSVP_Club_name, RSVP_Event_title, RSVP_Venue, RSVP_event_description, RSVP_Date) VALUES (?, ?, ?, ?, ?);`, [1, 1, Venue, event_description, Date], (err, rows, fields) => {
  //   if (err) throw err;
  //   console.log("1 record inserted");
  // });
  res.status(200).send();
});



router.get('/get-all-users', function (req, res, next) {
  var sql = "SELECT * FROM Login;";

  connection.query(sql, function (error, data) {
    res.json(data);
  });
});

router.get('/get-all-clubs', function (req, res, next) {
  var sql = "SELECT * FROM Club;";

  connection.query(sql, function (error, data) {
    res.json(data);
  });
});


//fitz

router.get('/mainPage', function (req, res, next) {
  if (!req.session.user) {
    res.json([]);
    return;
  }
  res.json(req.session.user);
});

router.get('/logout', function (req, res, next) {
  req.session.destroy();
  const data = null;
  res.json(data);
});

router.get('/get_data', function (req, res, next) {
  var search_query = req.query.search_query;
  if (!search_query) {
    res.json([]);
    return;
  }
  var sql = "SELECT * FROM Club WHERE Club_name LIKE '%" + search_query + "%' LIMIT 10;";

  connection.query(sql, function (error, data) {
    res.json(data);
  });
});

router.get('/get_clubs', (req, res) => {
  var user = req.session.user;
  var sql = "SELECT Club.Club_name FROM Club LEFT JOIN Club_members ON Club_members.ClubID = Club.ClubID WHERE Club_members.UserID= ?;";
  connection.query(sql, [user.UserID], function (error, data) {
    res.json(data);
  });
});

router.post('/remove-user', (req, res) => {
  var { id } = req.body;
  console.log(id);
  var sql = "DELETE FROM Login WHERE UserID=?;";
  connection.query(sql, [id], function (error, data) {
    if (error) throw error;
    res.sendStatus(200);
  });
});

router.post('/remove-club', (req, res) => {
  var { id } = req.body;
  var sql = "DELETE FROM Club WHERE ClubID=?;";
  connection.query(sql, [id], function (error, data) {
    if (error) throw error;
    res.sendStatus(200);
  });
});


// 获取按类别分类的俱乐部
router.get('/clubs-by-category', (req, res) => {
  var category = req.query.category;
  const sql = 'select * from Club where Category=?';

  connection.query(sql, [category], (error, results) => {
    if (error) {
      console.error('Error executing database query:', error);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    if (!results) {
      res.json([]);
      return;
    }
    res.json(results);
  });
});



//fitz





router.get('/login', function (req, res, next) {

  var start_connection = req.pool;
  var Login_query = `SELECT * FROM Login`;

  start_connection.getConnection(function (err, connection) {

    console.log("hi iam hrre");
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    console.log(err);

    connection.query(Login_query, function (error, rows, fields) {

      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});


router.get('/event_info', function (req, res, next) {

  var start_connection = req.pool;
  var event_query = `SELECT * FROM Event`;

  start_connection.getConnection(function (err, connection) {

    console.log("hi iam hrre");
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    console.log(err);

    connection.query(event_query, function (error, rows, fields) {

      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.post('/update_user_details', function (req, res, next) {

  if ('firstname' in req.body && req.body.firstname !== null &&
    'lastname' in req.body && req.body.lastname !== null &&
    'email' in req.body && req.body.email !== null &&
    'id' in req.body && req.body.id !== null
  ) {

    var user = {};
    var userSession = req.session.user;
    user['Username'] = userSession['Username'];
    user['Email'] = req.body.email;
    user['GivenName'] = req.body.firstname;
    user['FamilyName'] = req.body.lastname;
    user['UserID'] = req.body.id;
    console.log(user);

    req.pool.getConnection(async function (err, connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      // eslint-disable-next-line no-shadow
      var query = `UPDATE Login SET GivenName=?, FamilyName=?, Email=? where UserID=?;`;
      console.log('test');
      connection.query(query, [
        req.body.firstname,
        req.body.lastname,
        req.body.email,
        req.body.id
      ], function (qerr, rows, fields) {
        connection.release();
        if (qerr) {
          console.log(qerr);
          res.sendStatus(500);
          return;
        }
        req.session.accepted = true;
        req.session.user = user;
        res.status(200).send();
      });
    });
  }
  else {
    res.sendStatus(401);
  }
});

router.post('/club', function (req, res, next) {
  console.log("Inside!");
  console.log(req.body);
  if ('Club_name' in req.body && req.body.Club_name !== null &&
    'About_club' in req.body && req.body.About_club !== null &&
    'category' in req.body && req.body.category !== null) {
    console.log("Jash");

    req.pool.getConnection(function (err, conn) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      var query = `INSERT INTO Club (ClubId, Club_name, About_club, Category, Manager) VALUES (DEFAULT, ?, ?, ?, ?)`;
      conn.query(query, [
        req.body.Club_name,
        req.body.About_club,
        req.body.category,
        req.body.ManagerName,
      ], function (qerr, rows, fields) {
        conn.release();
        if (qerr) {
          console.log(qerr);
          res.sendStatus(500);
          return;
        }
        req.session.accepted = true;
        req.session.user = rows.insertId;
        console.log("200");
        res.status(200).send();
      });
    });
  }
  else {
    res.sendStatus(401);
  }
});

router.post('/newadmin', function (req, res, next) {
  req.pool.getConnection(function (err, conn) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    const selectQuery = 'SELECT * FROM Login WHERE Email = ?;';
    conn.query(selectQuery, [req.body.newAdminEmail], function (qerr, rows, fields) {
      if (qerr) {
        console.log(qerr);
        res.sendStatus(500);
        conn.release();
        return;
      }
      if (rows.length === 0) {
        // User does not exist
        res.status(500).send('User does not exist');
        conn.release();
        return;
      }
      const updateQuery = 'UPDATE Login SET Designation = "admin" WHERE Email = ?;';
      // eslint-disable-next-line no-shadow
      conn.query(updateQuery, [req.body.newAdminEmail], function (qerr, result) {
        conn.release();
        if (qerr) {
          console.log(qerr);
          res.sendStatus(500);
          return;
        }
        console.log(JSON.stringify(req.session.user));
        res.status(200).send();
      });
    });
  });
});

//faisal


//Faisal

router.get('/clubinfo', function (req, res, next) {
  var start_connection = req.pool;
  var q_club = `select * from Club;`;

  start_connection.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    connection.query(q_club, function (error, rows, fields) {
      connection.release();

      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

var saveid;
router.get('/get_manager', function (req, res, next) {
  var start_connection = req.pool;
  var clubID = req.query.ClubID;
  saveid = req.query.ClubID;
  // var q_manager = "SELECT Manager FROM Club where ClubID LIKE '%" + clubID +"%';";
  var q_manager = "SELECT * FROM Club WHERE ClubID LIKE '%" + clubID + "%';";

  start_connection.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    console.log(q_manager);
    console.log("from manager: ", saveid);
    connection.query(q_manager, function (error, rows, fields) {
      connection.release();

      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});


router.get('/club_events', function (req, res, next) {
  var start_connection = req.pool;
  saveid = req.query.id;
  var q_club_members = "select *  from Event where ClubID =" + saveid + ";";

  start_connection.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    connection.query(q_club_members, function (error, rows, fields) {
      connection.release();

      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});


router.get('/club_members', function (req, res, next) {
  var start_connection = req.pool;
  var clubID = req.query.ClubID;


  var q_club_members = "SELECT L.Username, L.Email FROM Login L JOIN Club_members CM ON L.UserID = CM.UserID JOIN Club C ON CM.ClubID = C.ClubID WHERE CM.ClubID = " + saveid + ";";

  start_connection.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    console.log("from clubmember: ", saveid);
    console.log(q_club_members);
    connection.query(q_club_members, function (error, rows, fields) {
      connection.release();

      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      res.json(rows);
    });
  });
});

router.post('/add_member', function (req, res, next) {
  var start_connection = req.pool;
  var add_ClubID = req.body.ClubID;
  var add_UserID = req.body.UserID;

  start_connection.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    connection.query("INSERT INTO Club_members (ClubID, UserID) VALUES (?, ?)", [add_ClubID, add_UserID], function (error, results, fields) {

      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }

      var member = {
        ClubID: add_ClubID,
        UserID: add_UserID
      };

      res.json(member);
    });
  });
});


router.post('/add_eventtobase', function (req, res, next) {
  var start_connection = req.pool;
  var aEventName = req.body.EventName;
  var aDate = req.body.Date;
  var aEventDescription = req.body.EventDescription;
  var aEventStatus = req.body.EventStatus;
  var aClubID = req.body.ClubID;
  var aLocation = req.body.Location;

  start_connection.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    connection.query("INSERT INTO Event (EventName, Date, EventDescription, EventStatus, ClubID, Location) VALUES (?, ?, ?, ?, ?, ?)", [aEventName, aDate, aEventDescription, aEventStatus, aClubID, aLocation], function (error, results, fields) {

      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }

      var eventtobase = {
        EventName: aEventName,
        Date: aDate,
        EventDescription: aEventDescription,
        EventStatus: aEventStatus,
        ClubID: aClubID,
        Location: aLocation
      };

      res.json(eventtobase);
    });
  });
});


router.delete('/delete_member', function (req, res, next) {
  var start_connection = req.pool;
  var rm_UserID = req.body.UserID;
  // console.log(rm_UserID);


  start_connection.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    connection.query("DELETE FROM Club_members WHERE UserID=?;", [rm_UserID], function (error, results, fields) {

      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }

      var member = {
        UserID: rm_UserID
      };

      res.json(member);
    });
  });
});


router.delete('/delete_event', function (req, res, next) {
  var start_connection = req.pool;
  var dEventDescription = req.body.EventDescription;
  var dEventStatus = req.body.EventStatus;
  var dClubID = req.body.ClubID;
  // console.log(rm_UserID);


  start_connection.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    connection.query("DELETE FROM TableName WHERE EventDescription = ? AND EventStatus = ? AND ClubID = ?;", [dEventDescription, dEventStatus, dClubID], function (error, results, fields) {

      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }

      let del_event =
      {
        EventDescription: dEventDescription,
        EventStatus: dEventStatus,
        ClubID: dClubID
      };

      res.json(del_event);
    });
  });
});




router.post('/add_member', function (req, res, next) {
  var start_connection = req.pool;
  var add_ClubID = req.body.ClubID;
  var add_UserID = req.body.UserID;

  start_connection.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    connection.query("INSERT INTO Club_members (ClubID, UserID) VALUES (?, ?)", [add_ClubID, add_UserID], function (error, results, fields) {

      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }

      var member = {
        ClubID: add_ClubID,
        UserID: add_UserID
      };

      res.json(member);
    });
  });
});

router.post('/add_eventtobase', function (req, res, next) {
  var start_connection = req.pool;
  var aEventName = req.body.EventName;
  var aDate = req.body.Date;
  var aEventDescription = req.body.EventDescription;
  var aEventStatus = req.body.EventStatus;
  var aClubID = req.body.ClubID;
  var aLocation = req.body.Location;

  start_connection.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    connection.query("INSERT INTO Event (EventName, Date, EventDescription, EventStatus, ClubID, Location) VALUES (?, ?, ?, ?, ?, ?)", [aEventName, aDate, aEventDescription, aEventStatus, aClubID, aLocation], function (error, results, fields) {

      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }

      var eventtobase = {
        EventName: aEventName,
        Date: aDate,
        EventDescription: aEventDescription,
        EventStatus: aEventStatus,
        ClubID: aClubID,
        Location: aLocation
      };

      res.json(eventtobase);
    });
  });
});


router.delete('/delete_member', function (req, res, next) {
  var start_connection = req.pool;
  var rm_UserID = req.body.UserID;
  // console.log(rm_UserID);


  start_connection.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    connection.query("DELETE FROM Club_members WHERE UserID=?;", [rm_UserID], function (error, results, fields) {

      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }

      var member = {
        UserID: rm_UserID
      };

      res.json(member);
    });
  });
});

router.delete('/delete_event', function (req, res, next) {
  var start_connection = req.pool;
  var dEventDescription = req.body.EventDescription;
  var dEventStatus = req.body.EventStatus;
  var dClubID = req.body.ClubID;
  // console.log(rm_UserID);


  start_connection.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    connection.query("DELETE FROM Event WHERE EventDescription = ? AND EventStatus = ? AND ClubID = ?;", [dEventDescription, dEventStatus, dClubID], function (error, results, fields) {

      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }

      let del_event =
      {
        EventDescription: dEventDescription,
        EventStatus: dEventStatus,
        ClubID: dClubID
      };

      res.json(del_event);
    });
  });
});


router.delete('/delete_member_from_db', function (req, res, next) {
  var start_connection = req.pool;
  var dEmail = req.body.Email;

  console.log("thie is email: ", dEmail);


  start_connection.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    connection.query("DELETE FROM Club_members WHERE UserID = ( SELECT UserID FROM Login WHERE Email = ? );", [dEmail], function (error, results, fields) {

      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }

      let del_member_db =
      {
        Email: dEmail
      };

      res.json(del_member_db);
    });
  });
});

module.exports = router;
