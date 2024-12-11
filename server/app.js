import express from 'express';
import pgPromise from 'pg-promise';
import { CURRENT_PERIOD, PERIOD_DB } from './config.js';

const app = express()
app.use(express.json());
const pgp = pgPromise({})
const db = pgp(process.env.DATABASE_URL)
const port = process.env.PORT || 8000

/*
  /getUser/:email

  Returns the user data about a user with a specified email.
*/
app.get('/users/getUser/:email', async (req, res) => {
  let email = req.params.email

  try {
    let users = await db.any('SELECT * FROM USERS WHERE email = $1;', [email])
    res.status(200).send(users)
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
})

/*
  /all 

  Returns all the usernames, emails, and is_admin state in the users table

  You should probably disable this if/when you deploy this. 
*/
app.get('/users/all', async (res,req) => {
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
    let current_period = await db.any(`SELECT * FROM ${PERIOD_DB} WHERE to_timestamp($1 / 1000.0) BETWEEN start_time AND end_time;`, [curr_time])
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
    let current_period = await db.any(`SELECT * FROM ${PERIOD_DB} WHERE period_id = $1;`, [period_no])
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
  const email = req.params.email
  try {
    let current_period = await db.any(`
      SELECT ${CURRENT_PERIOD}.email, ${CURRENT_PERIOD}.approved, ${CURRENT_PERIOD}.submitted_timestamp,
        ${CURRENT_PERIOD}.total_hours, row_to_json(regular_schedule.schedule) AS schedule
        FROM ${CURRENT_PERIOD}
        INNER JOIN regular_schedule
            ON regular_schedule.schedule_id = ${CURRENT_PERIOD}.submitted_schedule_id
        WHERE ${CURRENT_PERIOD}.email = $1;`, [email])
    res.status(200).send(current_period)
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
})

/*
  /timesheet/setDefault/:period_no/:email

  Updates schedule obj from an email

  :period_no not currently supported. Currently, just goes into the period_1_2024 db
*/
app.post('/timesheet/modify/:period_no/:email', async (req,res) => {
  let email = req.params.email

  if (! req.body) {
    res.status(422).send("Error: No body attatched")
    return
  }
  try {
    let now = Date.now()
    let schedule_id = await db.any(`
      SELECT submitted_schedule_id FROM ${CURRENT_PERIOD}
        WHERE email = $1;
      `, [email])
    
    if (! schedule_id || ! schedule_id[0].submitted_schedule_id) {
      res.send(404).send(`Error: No submissions from ${email} found.`)
      return
    }
    // the below line is probably written so poorly
    // however, it works

    const schedule = req.body.map(slot => `'{"start": "${slot.start}", "end": "${slot.end}"}'`).join(',')
    // update the schedule data
    await db.none(`
      UPDATE regular_schedule
      SET schedule = ROW(${schedule})::schedule_type
      WHERE schedule_id = $1;
    `, [schedule_id[0].submitted_schedule_id]);
    // update timestamp
    await db.none(`
      UPDATE ${CURRENT_PERIOD}
      SET submitted_timestamp = to_timestamp($1 / 1000.0)
      WHERE submitted_schedule_id = $2;
    `, [now, schedule_id[0].submitted_schedule_id])
    
    res.status(200).send(`Success!`)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.toString())
  }
});

/*
  /timesheet/getSubmitted/:period_no/:email

  Get's a time sheet from an email. GOes into the period_1_2024 db, so period_no not supported yet.
*/
app.get('/timesheet/getSubmitted/:period_no/:email', async (req, res) => {
  let email = req.params.email

  try {
    let schedule_id = await db.any(`
      SELECT submitted_schedule_id FROM ${CURRENT_PERIOD}
        WHERE email = $1;
      `, [email])
    
    if (! schedule_id || ! schedule_id[0].submitted_schedule_id ) {
      res.status(200).send([])
      return
    }
    
    let data = await db.any(`
      SELECT row_to_json(schedule) from regular_schedule
        WHERE schedule_id = $1;
      `, [schedule_id[0].submitted_schedule_id])
    
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
});

/*
  /timesheet/disapprove/:period_no/:email

  Dissaproves a time sheet from :period_no from :email

  for now :period_no not suppoted
*/
app.get('/timesheet/disapprove/:period_no/:email', async (req, res) => {
  try {
    let email = req.params.email

    if (! email ) {
      res.status(200).send([])
      return
    }
    
    let data = await db.any(`
      UPDATE ${CURRENT_PERIOD}
        SET approved = FALSE
        WHERE email = $1
        RETURNING *;
      `, [email])
    
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send(error.toString())
    return
  }
});

/*
  /timesheet/approve/:period_no/:email

  Dissaproves a time sheet from :period_no from :email

  for now :period_no not suppoted
*/
app.get('/timesheet/approve/:period_no/:email', async (req, res) => {
  try {
    let email = req.params.email

    if (! email ) {
      res.status(400).send(["Error: No email specified"])
      return
    }
    
    let data = await db.any(`
      UPDATE ${CURRENT_PERIOD}
        SET approved = TRUE
        WHERE email = $1
        RETURNING *;
      `, [email])
    
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

  for now :period_no not suppoted -- will just go to the period defined in the config
*/
app.get('/timesheet/isApproved/:period_no/:email', async (req, res) => {
  try {
    let email = req.params.email

    if (! email ) {
      res.status(400).send(["Error: No email specified"])
      return
    }
    
    let data = await db.any(`
      SELECT r.approved FROM ${CURRENT_PERIOD} r
        WHERE email = $1
        LIMIT 1;
      `, [email])
    
    if (! data) {
      res.status(404).send([`Error: Timesheet from ${email} not found`])
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

    if (! email ) {
      res.status(400).send(["Error: No email specified"])
      return
    }
    
    let data = await db.any(`
      SELECT r.submitted_timestamp FROM ${CURRENT_PERIOD} r
        WHERE email = $1
        LIMIT 1;
      `, [email])
    
    if (! data) {
      res.status(200).send(null)
      return
    }

    res.status(200).send(data)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.toString())
    return
  }
});

app.listen(port, () => {
  // catching common error
  if (! process.env.DATABASE_URL) {
    console.log("Error: No database url specified. See package.json script being ran or your .env file (you likely don't have one")
    return
  }
  console.log(`Timesheet Backend listening on port ${port}`)
})
