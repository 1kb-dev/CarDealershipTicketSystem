package db

import "database/sql"

const FindUserByUsernameOrEmail = `
	SELECT ID, USERNAME, EMAIL, PASSWORD, KEY
	FROM OWL_LENDREG.USERS
	WHERE USERNAME = :1 OR EMAIL = :2
`
const CheckUsernameAvailability = `
	SELECT USERNAME
	FROM OWL_LENDREG.USERS
	WHERE USERNAME = :1
`

const CheckIfEmailAlreadyRegistered = `
	SELECT EMAIL
	FROM OWL_LENDREG.USERS
	WHERE EMAIL = :1
`
const InsertUser = `
	INSERT INTO OWL_LENDREG.USERS (USERNAME, EMAIL, PASSWORD, KEY)
	VALUES (:1, :2, :3, :4)
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
