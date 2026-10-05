DROP TABLE IF EXISTS public.ticket;

CREATE TABLE public.ticket (
    ticket_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    pr SMALLINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    issue TEXT NOT NULL,
    claimed_by_user_id INTEGER,

    CONSTRAINT chk_ticket_priority
        CHECK (pr >= 1 AND pr <= 5),

    CONSTRAINT fk_ticket_user
        FOREIGN KEY (user_id)
        REFERENCES public.app_user(user_id),

    CONSTRAINT fk_ticket_claimed_by
        FOREIGN KEY (claimed_by_user_id)
        REFERENCES public.app_user(user_id)
);