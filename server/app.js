import express from 'express';
import pgPromise from 'pg-promise';
import { PERIOD_DB } from './config.js';

const app = express()
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const pgp = pgPromise({})
const db = pgp(process.env.DATABASE_URL)
const port = process.env.PORT || 8000

/*
  /getUser/:email

  Returns the user data about a user with a specified email.
*/
app.get('/users/getUser/:email', async (req, res) => {
  let email = req.params.email.toLowerCase()

  try {
    let users = await db.any('SELECT * FROM USERS WHERE email = $1;', [email])
    if (users.length === 0) {
      res.status(404).send("User not found.")
    }
    res.status(200).send(users[0])
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
})

/*
  /users/all 

  Returns all the usernames, emails, and is_admin state in the users table

  You should probably disable this if/when you deploy this. 
*/
app.get('/users/all', async (req,res) => {
  try {
    let users = await db.any('SELECT * FROM USERS;')
    res.status(200).send(users)
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
})

/*
  /periods/getCurrentPeriod

  Returns the time period from periods_2024 that is happening at the
  time of the submission of the request.
*/
app.get('/periods/getCurrentPeriod', async(req, res) => {
  const curr_time = Date.now();
  try {
    let current_period = await db.any(`SELECT * FROM ${PERIOD_DB} WHERE to_timestamp($1 / 1000.0) BETWEEN start_time AND end_time LIMIT 1;`, [curr_time])
    res.status(200).send(current_period)
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
})

/*
  /periods/all

  Returns the data of all the periods in 2024.

  Draws data from periods_2024
*/
app.get('/periods/all', async(req, res) => {
  try {
    let data = await db.any(`SELECT * FROM ${PERIOD_DB};`)
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
})

/*
  /periods/getCurrentPeriod

  Returns the data about the period number with id specified. 
*/
app.get('/periods/getPeriod/:period_no', async(req, res) => {
  const period = req.params.period_no
  try {
    if (isNaN(Number(period_no))) {
      // if Period is not a number
      res.status(422).send(`Error: Period Number ${period} could not be processed as number.`)
      return
    }
    let current_period = await db.any(`SELECT * FROM ${PERIOD_DB} WHERE period_id = $1;`, [period])
    res.status(200).send(current_period)
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
})

/*
  /timesheet/getDefault/:email

  Returns schedules corresponding to the email from the current period db
*/
app.get('/timesheet/getDefault/:email', async(req, res) => {
  const email = req.params.email.toLowerCase()
  try {
    let current_period = await db.any(`
      SELECT * from regular_schedule
      WHERE email = $1 LIMIT 1;`,
      [email]
    );
    res.status(200).send(current_period)
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
})

/*
  /timesheet/setDefault/:period_no/_email

  Updates default schedule in regular_schedule db
*/
app.post('/timesheet/setDefault/:period_no/:email', async (req, res) => {
  try {
    if (! req.body || isNaN(Number(period_no)) || ! req.params.email) {
      res.status(422).send(`Error: Either no body sent, period_no not numeric, or no email specified`)
      return
    }

    await db.any(`
      INSERT INTO regular_schedule (email, schedule)
        VALUES ($1, to_jsonb(CAST($2 AS TEXT)))
        ON CONFLICT(email) DO UPDATE SET schedule = to_jsonb(CAST($2 AS TEXT));
      `, [req.params.email.toLowerCase(), req.body])
    
    res.status(200).send("Success!")
    return
  } catch (error) {
    console.error(error)
    res.status(500).send(error.toString())
    return
  }
})

/*
  /submit/{period_no}/{email}
  → Request body uses a schedule object
  → Updates the submitted columns to reflect the given body
  → Updates the timestamp column to be the current time
*/
app.post('/timesheet/submit/:period_no/:email', async (req, res) => {
  try {

    if (! req.body || isNaN(Number(req.params.period_no)) || ! req.params.email) {
      res.status(422).send(`Error: Either no body sent, period_no not numeric, or no email specified`)
      return
    }

    await db.any(`
      INSERT INTO period_${req.params.period_no}_2024 (email, approved, submitted_schedule)
        VALUES ($1, false, to_jsonb(CAST($2 AS TEXT)))
        ON CONFLICT(email) DO UPDATE SET submitted_schedule = to_jsonb(CAST($2 AS TEXT));
      `, [req.params.email.toLowerCase(), req.body])
    
    res.status(200).send("Success!")
    return
  } catch (error) {
    console.error(error)
    res.status(500).send(error.toString())
    return
  }
})

/*
  /timesheet/getSubmitted/:period_no/:email

  Get's a time sheet from an email. GOes into the period_1_2024 db, so period_no not supported yet.
*/
app.get('/timesheet/getSubmitted/:period_no/:email', async (req, res) => {
  try {
    let email = req.params.email
    let period_no = req.params.period_no
    if (! req.body || isNaN(Number(period_no)) || ! req.params.email) {
      res.status(422).send(`Error: Either no body sent, period_no not numeric, or no email specified`)
      return
    }
    let data = await db.any(`
      SELECT submitted_schedule FROM period_${period_no}_2024
        WHERE email = $1;
      `, [email.toLowerCase()])
    
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
});

/*
  /timesheet/getLatest/:period_no/:email

  → Return a Schedule object representing the most up to date version of the timesheet, AND a property: {type: EDITED | SUBMISSION | AUTO }
  If modified is NOT ALL empty → Used the modified columns
  If submitted is propagated, use submitted 
  If it was not submitted, send the default timeschedule
  Send the correct property value based on the above criteria
*/
app.get('/timesheet/getLatest/:period_no/:email', async (req, res) => {
  try {
    let email = req.params.email
    let period_no = req.params.period_no
    if (! req.body || isNaN(Number(period_no)) || ! req.params.email) {
      res.status(422).send(`Error: Either no body sent, period_no not numeric, or no email specified`)
      return
    }
    let data = await db.any(`
      SELECT submitted_schedule, modified_schedule FROM period_${period_no}_2024
        WHERE email = $1;
      `, [email.toLowerCase()])
    
    let null_list = [null, undefined]
    if (! data || !data[0] || ! Object.keys(data[0]) || 
      (null_list.includes(data[0]['modified_schedule']) && null_list.includes(data[0]['submitted_schedule']))
    ) {
      // get the default schedule
      let data = await db.any(`
        SELECT schedule FROM regular_schedule
          WHERE email = $1;
        `, [email])
      res.status(200).send(data)
      return
    } else {
      // try return modified first, otherwise submitted
      if (! null_list.includes(data[0]['modified_schedule'])) {
        res.status(200).send(data[0]['modified_schedule'])
        return
      } else {
        res.status(200).send(data[0]['submitted_schedule'])
        return        
      }
    }
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
});

/*
  /isModified/{period_no}/{email}

*/
app.get('/isModified/:period_no/:email', async (req, res) => {
  try {
    let email = req.params.email
    let period_no = req.params.period_no
    if (! req.body || isNaN(Number(period_no)) || ! req.params.email) {
      res.status(422).send(`Error: Either no body sent, period_no not numeric, or no email specified`)
      return
    }
    let data = await db.any(`
      SELECT schedule_id, modified_schedule from period_${period_no}_2024
      WHERE email = $1
      LIMIT 1;
      `, [email])

    if (! data) {
      res.status(404).send(`Error: No submission in period ${period_no} from email ${email} found.`)
      return
    }

    res.status(200).send(! [null, undefined].includes(data[0]['modified_schedule']))

  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
});

/*
  /timesheet/modify/:period_no/:email

  Updates schedule obj from an email
*/
app.post('/timesheet/modify/:period_no/:email', async (req,res) => {
  try {
    let email = req.params.email
    let period_no = req.params.period_no
    if (! req.body || isNaN(Number(period_no)) || ! req.params.email) {
      res.status(422).send(`Error: Either no body sent, period_no not numeric, or no email specified`)
      return
    }

    let now = Date.now()
    
    await db.any(`
      UPDATE period_${period_no}_2024
        SET modified_schedule = to_jsonb(CAST($1 as text))
        WHERE email = $2;
      `, [req.body, email.toLowerCase()])
    
    res.status(200).send(`Success!`)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.toString())
  }
});

/*
  /timesheet/revert/:period_no/:email

  Turns the modified schedule into null
*/
app.delete('/timesheet/revert/:period_no/:email', async (req, res) => {
  try {
    let email = req.params.email
    let period_no = req.params.period_no
    if (! req.body || isNaN(Number(period_no)) || ! req.params.email) {
      res.status(422).send(`Error: Either no body sent, period_no not numeric, or no email specified`)
      return
    }

    let now = Date.now()
    
    await db.any(`
      UPDATE period_${period_no}_2024
        SET modified_schedule = NULL
        WHERE email = $2;
      `, [req.body, email.toLowerCase()])
    
    res.status(200).send(`Success!`)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.toString())
  }
})

/*
  /timesheet/disapprove/:period_no/:email

  Dissaproves a time sheet from :period_no from :email

  for now :period_no not suppoted
*/
app.get('/timesheet/disapprove/:period_no/:email', async (req, res) => {
  try {
    let email = req.params.email
    let period_no = req.params.period_no
    if (! email ) {
      res.status(200).send([])
      return
    }
    
    let data = await db.any(`
      UPDATE period_${period_no}_2024
        SET approved = FALSE
        WHERE email = $1
        RETURNING *;
      `, [email.toLowerCase()])
    
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
});

/*
  /timesheet/approve/:period_no/:email

  Dissaproves a time sheet from :period_no from :email

  if the entry doesn't exist, it will 

*/
app.get('/timesheet/approve/:period_no/:email', async (req, res) => {
  try {
    let email = req.params.email
    let period_no = req.params.period_no

    if (! email ) {
      res.status(400).send(["Error: No email specified"])
      return
    }

    // // if the row doesn't exist we'll add a 
    // let schedule = await db.any(`SELECT schedule from regular_schedule WHERE email = $1;`, [email]);
    // let schedule_json = JSON.parse(schedule[0]['schedule'])

    let schedule_data = await db.any(`
      SELECT schedule FROM regular_schedule 
      WHERE email = $1;
    `, [email.toLowerCase()])


    if (! schedule_data) {
      return res.status(404).send(["Error: No default schedule found for this email"])
    }

    let data = await db.any(`
      INSERT INTO period_${period_no}_2024 (email, approved, submitted_schedule)
      VALUES ($1, TRUE, to_jsonb(CAST($2 AS TEXT)))
      ON CONFLICT (email) DO UPDATE 
      SET approved = TRUE
      RETURNING *;
    `, [email.toLowerCase(), schedule_data[0].schedule])
    
    res.status(200).send(data)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.toString())
    return
  }
});

/*
  /timesheet/isApproved/:period_no/:email

  Returns whether or not a particular time sheet is approved (True/False)

*/
app.get('/timesheet/isApproved/:period_no/:email', async (req, res) => {
  try {
    let email = req.params.email
    let period_no = req.params.period_no
    if (! email ) {
      res.status(400).send(["Error: No email specified"])
      return
    }
    
    let data = await db.any(`
      SELECT r.approved FROM period_${period_no}_2024 r
        WHERE email = $1
        LIMIT 1;
      `, [email.toLowerCase()])
    
    if (!data?.approved) {
      // res.status(404).send([`Error: Timesheet from ${email} not found`])
      res.status(200).send(false);
      return
    }

    res.status(200).send(data[0]['approved'])
  } catch (error) {
    console.error(error)
    res.status(500).send(error.toString())
    return
  }
});


/*
  /timesheet/timestamp/:period_no/:email

  Returns NULL if the given timesheet has not been submitted yet, otherwise the value of the submitted_timestamp column

  for now :period_no not suppoted -- will just go to the period defined in the config
*/
app.get('/timesheet/timestamp/:period_no/:email', async (req, res) => {
  try {
    let email = req.params.email
    let period_no = req.params.period_no
    if (! email ) {
      res.status(400).send(["Error: No email specified"])
      return
    }
    
    let data = await db.any(`
      SELECT r.submitted_timestamp FROM period_${period_no}_2024 r
        WHERE email = $1
        LIMIT 1;
      `, [email.toLowerCase()])
    
    if (!data || data.length === 0) {
      res.status(200).send(false)
      return
    }

    res.status(200).send(data)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.toString())
    return
  }
});

/*
  /timesheet/all/:period_no

  Returns all of the timesheet data from a particular period_no
*/
app.get('/timesheet/all/:period_no', async (req, res) => {
  try {
    let period_no = req.params.period_no

    if (isNaN(Number(period_no))) {
      res.status(422).send(`Error: Period_no ${period_no} is not a number`)
      return
    }

    let table_name = `period_${period_no}_2024`;
    let data = await db.any(`SELECT * FROM ${table_name}`);

    res.status(200).send(data)
    return
  } catch (error) {
    res.status(500).send(`The error could be that the period_no you entered may have not been valid. Error: ${error}`)    
    return
  }
})

app.listen(port, () => {
  // catching common error
  if (! process.env.DATABASE_URL) {
    console.log("Error: No database url specified. See package.json script being ran or your .env file (you likely don't have one")
    return
  }
  console.log(`Timesheet Backend listening on port ${port}`)
})
