package domain

// handlers.LoginHandler
type LoginRequest struct {
	UsernameOrEmail string 		`json:"usernameOrEmail"`
	Password        string 		`json:"password"`
	Key             string 		`json:"key"`
}

type UserAuth struct {
	UserID         	int16
	Email        	string
	Username     	string
	PasswordHash 	string
	Key          	string
}

// handlers.RegisterHandler
type RegisterRequest struct {
	Email    		string 		`json:"email"`
	Username 		string 		`json:"username"`
	Password 		string 		`json:"password"`
	Key      		string 		`json:"key"`
}
