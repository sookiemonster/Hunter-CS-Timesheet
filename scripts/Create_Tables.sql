/*
    Note: All timestamps in these databases are stored in UTC I think?

    Please see documentation before using the DB.
    https://www.postgresql.org/docs/current/datatype-datetime.html
*/

/*
 Users Table
 Table of users, their names, and their emails. 
 Row number will serve as the user ID.
*/
CREATE TABLE IF NOT EXISTS users (
 user_id SERIAL PRIMARY KEY,
 full_name TEXT,
 email TEXT,
 is_admin BOOLEAN
);

/*
 Regular_Schedule Table
 Uses an auto-incrementing schedule ID
*/
CREATE TABLE IF NOT EXISTS regular_schedule (
 schedule_id SERIAL PRIMARY KEY,
 email TEXT,
 schedule schedule_type
);

/*
 period_1_2024 Table
 Auto-incrementing schedule ID
*/
CREATE TABLE IF NOT EXISTS period_1_2024 (
 schedule_id SERIAL PRIMARY KEY,
 email TEXT,
 approved BOOLEAN,
 submitted_timestamp TIMESTAMP,
 total_hours NUMERIC,
 submitted_schedule_id INT REFERENCES regular_schedule(schedule_id)
);

/* 
 periods_2024 Table
 Auto-incrementing period ID
*/
CREATE TABLE IF NOT EXISTS periods_2024 (
 period_id SERIAL PRIMARY KEY,
 start_time TIMESTAMP,
 end_time TIMESTAMP,
 ts_due_start TIMESTAMP,
 ts_due_end TIMESTAMP
);