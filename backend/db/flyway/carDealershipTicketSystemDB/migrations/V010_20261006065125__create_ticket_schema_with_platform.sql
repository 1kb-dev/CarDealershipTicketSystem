CREATE TABLE public.ticket (
	ticket_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
	user_id int4 NOT NULL,
	pr int2 NOT NULL,
	category varchar(50) NOT NULL,
	platform varchar(50) NOT NULL,
	subject varchar(200) NOT NULL,
	issue text NOT NULL,
	claimed_by_user_id int4 NULL,
	CONSTRAINT chk_ticket_priority CHECK (((pr >= 1) AND (pr <= 5))),
	CONSTRAINT ticket_category_not_null NOT NULL category,
	CONSTRAINT ticket_platform_not_null NOT NULL platform,
	CONSTRAINT ticket_issue_not_null NOT NULL issue,
	CONSTRAINT ticket_pkey PRIMARY KEY (ticket_id),
	CONSTRAINT ticket_pr_not_null NOT NULL pr,
	CONSTRAINT ticket_subject_not_null NOT NULL subject,
	CONSTRAINT ticket_ticket_id_not_null NOT NULL ticket_id,
	CONSTRAINT ticket_user_id_not_null NOT NULL user_id
);

ALTER TABLE public.ticket ADD CONSTRAINT fk_ticket_claimed_by FOREIGN KEY (claimed_by_user_id) REFERENCES public.app_user(user_id);
ALTER TABLE public.ticket ADD CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) REFERENCES public.app_user(user_id);