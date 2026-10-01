CREATE TYPE user_role AS ENUM ('guest', 'worker');

CREATE TABLE IF NOT EXISTS app_user (
    user_id     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email       VARCHAR(254) NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    role        user_role NOT NULL DEFAULT 'guest'
);

CREATE TABLE IF NOT EXISTS ticket (
    ticket_id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id             INTEGER NOT NULL,
    pr                  SMALLINT NOT NULL,
    category            VARCHAR(50) NOT NULL,
    subject             VARCHAR(200) NOT NULL,
    claimed_by_user_id  INTEGER,

    CONSTRAINT fk_ticket_user
        FOREIGN KEY (user_id)
        REFERENCES app_user(user_id),

    CONSTRAINT fk_ticket_claimed_by
        FOREIGN KEY (claimed_by_user_id)
        REFERENCES app_user(user_id),

    CONSTRAINT chk_ticket_priority
        CHECK (pr BETWEEN 1 AND 5)
);