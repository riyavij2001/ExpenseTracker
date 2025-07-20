package user

import (
	"database/sql"
	"errors"
	"fmt"
	"riyavij2001/expense-tracker/types"
	"riyavij2001/expense-tracker/utils"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) GetUserByEmail(email string) (*types.User, error) {
	utils.LogMessage(utils.INFO, "Checking email:", email)
	rows, err := s.db.Query("SELECT * FROM users WHERE email = ?", email)

	if err != nil {
		utils.LogMessage(utils.ERROR, "Error:", "db error: ", err)
		return nil, err
	}

	u := new(types.User)
	for rows.Next() {
		u, err = scanRowIntoUser(rows)
		if err != nil {
			utils.LogMessage(utils.ERROR, "Error:", "could not scan into user")
			return nil, err
		}
	}
	if u.ID == 0 {
		utils.LogMessage(utils.ERROR, "Error:", "could not find the user")
		return nil, errors.New("could not find the user")
	}
	utils.LogMessage(utils.INFO, "Success:", "found the user!")
	return u, nil
}

func scanRowIntoUser(row *sql.Rows) (*types.User, error) {
	u := new(types.User)

	err := row.Scan(
		&u.ID,
		&u.FirstName,
		&u.LastName,
		&u.Email,
		&u.Password,
		&u.CreatedAt,
		&u.Balance,
	)
	if err != nil {
		utils.LogMessage(utils.ERROR, "Error:", "could not scan into user")
		return nil, err
	}

	utils.LogMessage(utils.INFO, "Success:", "mapped the user")
	return u, nil
}

func (s *Store) GetUserById(id int) (*types.User, error) {
	rows, err := s.db.Query("SELECT * FROM users WHERE id = ?", id)
	if err != nil {
		return nil, err
	}

	u := new(types.User)
	for rows.Next() {
		u, err = scanRowIntoUser(rows)
		if err != nil {
			return nil, err
		}
	}

	if u.ID == 0 {
		return nil, fmt.Errorf("user not found")
	}

	return u, nil
}

func (s *Store) CreateUser(user types.User) error {
	_, err := s.db.Exec("INSERT INTO users (firstName, lastName, email, password, balance) VALUES (?, ?, ?, ?, 0.0)", user.FirstName, user.LastName, user.Email, user.Password)
	if err != nil {
		return err
	}

	return nil
}

func (s *Store) GetUserBalance(id int) (float64, error) {
	// Get all transactions for the user
	rows, err := s.db.Query("SELECT amount, is_debit FROM transactions WHERE user_id = ?", id)
	if err != nil {
		return 0.0, err
	}
	defer rows.Close()

	var balance float64 = 0.0
	for rows.Next() {
		var amount float64
		var isDebit bool
		if err := rows.Scan(&amount, &isDebit); err != nil {
			fmt.Println("Error is here, could not scan")
			return 0.0, err
		}
		if isDebit {
			balance -= amount
		} else {
			balance += amount
		}
	}

	// Store the calculated balance in the users table
	_, err = s.db.Exec("UPDATE users SET balance = ? WHERE id = ?", balance, id)
	if err != nil {
		return 0.0, err
	}

	return balance, nil
}

func (s *Store) GetAllUsers() ([]*types.User, error) {
	rows, err := s.db.Query("SELECT * FROM users")
	if err != nil {
		return nil, err
	}

	var users []*types.User
	for rows.Next() {
		u, err := scanRowIntoUser(rows)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	return users, nil
}
