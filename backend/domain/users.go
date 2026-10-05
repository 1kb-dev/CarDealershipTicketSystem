package domain

// handlers.LoginHandler
type LoginRequest struct {
	Email			string 		`json:"email"`
	Password        string 		`json:"password"`
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
	Password 		string 		`json:"password"`
	Role 			string 		`json:"role"`
}
