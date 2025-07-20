package types

import (
	"errors"
	"time"
)

type TransactionStore interface {
	AddTransaction(Transaction) error
	RemoveTransaction(int) error
	GetAllTransactions(int) ([]Transaction, error)
	GetRangeTransactions(int, time.Time, time.Time) ([]Transaction, error)
	UpdateTransaction(Transaction) error
}
type Category string

const (
	CategoryGroceries   Category = "Groceries"
	CategoryLeisure     Category = "Leisure"
	CategoryElectronics Category = "Electronics"
	CategoryUtilities   Category = "Utilities"
	CategoryClothing    Category = "Clothing"
	CategoryHealth      Category = "Health"
	CategorySalary      Category = "Salary"
	CategoryOtherIncome Category = "Other Income"
	CategoryOthers      Category = "Others"
)

func (c Category) isValid() error {
	switch c {
	case CategoryGroceries, CategoryLeisure, CategoryElectronics, CategoryUtilities, CategoryClothing, CategoryHealth, CategoryOthers:
		return nil
	}
	return errors.New("invalid category")
}

type Transaction struct {
	ID          int      `json:"id"`
	UserID      int      `json:"userId"`
	Amount      float64  `json:"amount"`
	Category    Category `json:"category"`
	Date        string   `json:"date"`
	Description string   `json:"description"`
	IsDebit     bool     `json:"is_debit"`
}
