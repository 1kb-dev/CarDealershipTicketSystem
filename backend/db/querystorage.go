package db

import "database/sql"

const FindUserByEmail = `
	SELECT user_id, email, "password", "role"
	FROM public.app_user
	WHERE email = $1
`

const FindUserIdentityByEmail = `
	SELECT user_id
	FROM public.app_user
	WHERE email = $1
`

const CheckIfEmailAlreadyRegistered = `
	SELECT email
	FROM public.app_user
	WHERE email = $1
`
const InsertUser = `
	INSERT INTO public.app_user
	(user_id, email, "password", "role")
	VALUES($1, $2, $3, 'guest'::user_role)
`
const FindUserRoleByEmail = `
	SELECT ROLE
	FROM public.app_user
	WHERE EMAIL = $1
`

const InsertTicket = `
	INSERT INTO public.ticket
	(ticket_id, user_id, pr, category, subject, issue, claimed_by_user_id)
	VALUES($1, $2, 5, $3, $4, $5, 0)
`

const GetTickets = `
	SELECT ticket_id, user_id, pr, category, platform, subject, issue,
	       COALESCE(claimed_by_user_id, 0) AS claimed_by_user_id
	FROM public.ticket;
`

// Allow query calls from handlers
func Query(query string, args ...interface{}) (*sql.Rows, error) {
	return db.Query(query, args...)
}

func QueryRow(query string, args ...interface{}) *sql.Row {
	return db.QueryRow(query, args...)
}

func Exec(query string, args ...interface{}) (sql.Result, error) {
	return db.Exec(query, args...)
}
