package domain

// handlers.LoginHandler
type LoginRequest struct {
	Email			string 		`json:"email"`
	Password        string		`json:"password"`
}

type UserAuth struct {
	UserID			int64
	Email        	string
	Password 		string
	Role 			string
}

// handlers.RegisterHandler
type RegisterRequest struct {
	Email    		string 		`json:"email"`
	Password 		string 		`json:"password"`
	Role     		string 		`json:"role"`
}
