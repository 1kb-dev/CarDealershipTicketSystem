package db

import "database/sql"

const FindUserByEmail = `
	SELECT user_id, email, "password", role
	FROM public.app_user
	WHERE email = $1
`

const CheckIfEmailAlreadyRegistered = `
	SELECT email
	FROM public.app_user
	WHERE email = $1
`
const CheckIfPasswordIsValid = `
	SELECT "password"
	FROM public.app_user
	WHERE email = $1
`

const InsertUser = `
	INSERT INTO public.app_user
	(email, "password")
	VALUES($1, $2)
`
const FindUserRoleByEmail = `
	SELECT role
	FROM public.app_user
	WHERE email = $1
`

const FindUserIdentityByEmail = `
	SELECT user_id, role
	FROM public.app_user
	WHERE email = $1
`
const InsertTicket = `
	INSERT INTO public.ticket
	(user_id, pr, category, platform, subject, issue, claimed_by_user_id)
	VALUES($1, $2, $3, $4, $5, $6, null)
	RETURNING ticket_id
`

const GetTickets = `
	SELECT t.ticket_id, t.user_id, u.email, t.pr, t.category, t.platform, t.subject, t.issue,
	       COALESCE(claimed_by_user_id, 0) AS claimed_by_user_id
	FROM public.ticket t
	JOIN public.app_user u ON u.user_id = t.user_id;
`

// Allow query calls from handlers
func Query(query string, args ...any) (*sql.Rows, error) {
	return db.Query(query, args...)
}

func QueryRow(query string, args ...any) *sql.Row {
	return db.QueryRow(query, args...)
}

func Exec(query string, args ...any) (sql.Result, error) {
	return db.Exec(query, args...)
}
