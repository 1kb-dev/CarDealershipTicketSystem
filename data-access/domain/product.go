package domain

// handlers.GetProducts (specifies identifiers)
type Product struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
}
