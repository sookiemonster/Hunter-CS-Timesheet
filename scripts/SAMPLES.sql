/*
    Samples.sql

    This file just contains some sample sql statements
    for us to insert into the db and run some dummy data in. 
    Don't use this for other than filling in the data and, even then,
    use at your own risk!    
*/

-- -- Regular_schedule
-- INSERT INTO regular_schedule (email, schedule)
-- VALUES (
--     'test2@test2.com',
--     ROW(
--         '{"start": "11:00", "end": "12:00"}',  -- sun1
--         '{"start": "08:30", "end": "17:40"}',  -- mon1
--         '{"start": "08:00", "end": "21:00"}',  -- tue1
--         '{"start": "04:00", "end": "17:00"}',  -- wed1
--         '{"start": "03:00", "end": "17:00"}',  -- thu1
--         '{"start": "08:00", "end": "17:00"}',  -- fri1
--         '{"start": "10:00", "end": "14:00"}',  -- sat1
--         '{"start": "08:00", "end": "17:00"}',  -- mon2
--         '{"start": "08:00", "end": "17:00"}',  -- tue2
--         '{"start": "08:00", "end": "17:00"}',  -- wed2
--         '{"start": "08:00", "end": "17:00"}',  -- thu2
--         '{"start": "08:00", "end": "17:00"}',  -- fri2
--         '{"start": "10:00", "end": "14:00"}',  -- sat2
--         '{"start": "09:00", "end": "12:00"}'   -- sun2
--     )::schedule_type -- see Create_Schedule.sql
-- );

-- users
INSERT INTO users (full_name, email, is_admin) VALUES ('first last', 'first_last@email.com', false);

-- periods_2024
INSERT INTO periods_2024 (start_time, end_time, ts_due_start, ts_due_end) VALUES ('2024-05-25 12:10:25', '2024-06-25 19:10:25', '2024-06-01 19:10:25', '2024-06-03 19:10:25');

-- period_1_2024
INSERT INTO period_1_2024 (
    email, 
    approved, 
    submitted_timestamp, 
    total_hours, 
    submitted_schedule_id
) VALUES (
    'test2@test2.com',
    false,
    CURRENT_TIMESTAMP,
    40.0,
    (SELECT schedule_id from regular_schedule WHERE email = 'test2@test2.com')
);
