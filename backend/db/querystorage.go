package db

import "database/sql"

const FindUserByUsernameOrEmail = `
	SELECT user_id, USERNAME, EMAIL, PASSWORD
	FROM public.app_user
	WHERE USERNAME = $1 OR EMAIL = $2
`
const CheckUsernameAvailability = `
	SELECT USERNAME
	FROM public.app_user
	WHERE USERNAME = $1
`

const CheckIfEmailAlreadyRegistered = `
	SELECT EMAIL
	FROM public.app_user
	WHERE EMAIL = $1
`
const InsertUser = `
	INSERT INTO public.app_user (USERNAME, EMAIL, PASSWORD, KEY)
	VALUES ($1, $2, $3, $4)
`
const FindUserRoleByUsername = `
	SELECT ROLE
	FROM public.app_user
	WHERE USERNAME = $1
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
