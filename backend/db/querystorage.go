package db

import "database/sql"

const FindUserByEmail = `
	SELECT user_id, EMAIL, PASSWORD
	FROM public.app_user
	WHERE EMAIL = $1
`
const CheckUsernameAvailability = `
	SELECT user_id
	FROM public.app_user
	WHERE EMAIL = $1
`

const CheckIfEmailAlreadyRegistered = `
	SELECT EMAIL
	FROM public.app_user
	WHERE EMAIL = $1
`
const InsertUser = `
	INSERT INTO public.app_user (EMAIL, PASSWORD, KEY)
	VALUES ($1, $2, $3, $4)
`
const FindUserRoleByEmail = `
	SELECT ROLE
	FROM public.app_user
	WHERE EMAIL = $1
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
