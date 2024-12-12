/* 
    NO LONGER IN USE

    This file just exists in case a bug arises from this type for debugging purposes. (I should
    have just made this one jsonb object)

    Schedule Type  

    This type holds 14 time tables inside of them as text. The text would be formatted as json
    While it would've been nice to define it differently, for the sake of time, it is json.
*/
CREATE TYPE schedule_type AS (
    sun1 JSONB,
    mon1 JSONB,
    tue1 JSONB,
    wed1 JSONB,
    thu1 JSONB,
    fri1 JSONB,
    sat1 JSONB,
    mon2 JSONB,
    tue2 JSONB,
    wed2 JSONB,
    thu2 JSONB,
    fri2 JSONB,
    sat2 JSONB,
    sun2 JSONB
); 