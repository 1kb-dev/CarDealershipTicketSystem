package domain

// handlers.LoginHandler
type LoginRequest struct {
	UsernameOrEmail string `json:"usernameOrEmail"`
	Password        string `json:"password"`
}

type UserAuth struct {
	ID           int64
	Email        string
	Username     string
	Password string
}

// handlers.RegisterHandler
type RegisterRequest struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
	Key      string `json:"key"`
	Role     string `json:"role"`
}
