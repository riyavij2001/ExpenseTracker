package transactions

import (
	"database/sql"
	"fmt"
	"riyavij2001/expense-tracker/types"
	"time"
)

type Store struct {
	db *sql.DB
}

func NewStore(db *sql.DB) *Store {
	return &Store{db: db}
}

func (s *Store) AddTransaction(transaction types.Transaction) error {
	// Parse date string to time.Time
	parsedDate, err := time.Parse("2006-01-02", transaction.Date)
	if err != nil {
		return fmt.Errorf("invalid date format, expected YYYY-MM-DD: %w", err)
	}
	query := `INSERT INTO transactions (user_id, amount, category, date, description, is_debit) VALUES (?, ?, ?, ?, ?, ?)`
	tx, err := s.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	_, err = tx.Exec(query, transaction.UserID, transaction.Amount, transaction.Category, parsedDate, transaction.Description, transaction.IsDebit)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (s *Store) UpdateTransaction(transaction types.Transaction) error {
	// Parse date string to time.Time
	parsedDate, err := time.Parse("2006-01-02", transaction.Date)
	if err != nil {
		return fmt.Errorf("invalid date format, expected YYYY-MM-DD: %w", err)
	}
	query := `UPDATE transactions SET amount = ?, category = ?, date = ?, description = ?, is_debit = ? WHERE id = ? AND user_id = ?`
	tx, err := s.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	_, err = tx.Exec(query, transaction.Amount, transaction.Category, parsedDate, transaction.Description, transaction.IsDebit, transaction.ID, transaction.UserID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func ScanRowIntoTransaction(row *sql.Rows) (*types.Transaction, error) {
	var transaction types.Transaction
	var date time.Time
	err := row.Scan(&transaction.ID, &transaction.UserID, &transaction.Amount, &transaction.Category, &date, &transaction.Description, &transaction.IsDebit)
	if err != nil {
		return nil, err
	}
	transaction.Date = date.Format("2006-01-02")
	return &transaction, nil
}

func (s *Store) RemoveTransaction(id int) error {
	query := `DELETE FROM transactions WHERE id = ?`
	tx, err := s.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	_, err = tx.Exec(query, id)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (s *Store) GetAllTransactions(userID int) ([]types.Transaction, error) {
	query := `SELECT id, user_id, amount, category, date, description, is_debit FROM transactions WHERE user_id = ?`
	rows, err := s.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []types.Transaction
	for rows.Next() {
		transaction, err := ScanRowIntoTransaction(rows)
		if err != nil {
			return nil, err
		}
		transactions = append(transactions, *transaction)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return transactions, nil
}

func (s *Store) GetRangeTransactions(userID int, from time.Time, to time.Time) ([]types.Transaction, error) {
	query := `SELECT id, user_id, amount, category, date, description, is_debit FROM transactions WHERE user_id = ? AND date BETWEEN ? AND ?`
	rows, err := s.db.Query(query, userID, from, to)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []types.Transaction
	for rows.Next() {
		transaction, err := ScanRowIntoTransaction(rows)
		if err != nil {
			fmt.Println("error scanning row:", err)
			return nil, err
		}
		transactions = append(transactions, *transaction)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return transactions, nil
}
