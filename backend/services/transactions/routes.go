package transactions

import (
	"fmt"
	"net/http"
	"riyavij2001/expense-tracker/services/auth"
	"riyavij2001/expense-tracker/types"
	"riyavij2001/expense-tracker/utils"

	"github.com/gorilla/mux"
)

type TransactionHandler struct {
	store     types.TransactionStore
	userStore types.UserStore
}

func NewHandler(store types.TransactionStore, userStore types.UserStore) *TransactionHandler {
	return &TransactionHandler{
		store:     store,
		userStore: userStore,
	}
}

func (h *TransactionHandler) RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/transactions", auth.WithJWTAuth(h.getTransactions, h.userStore)).Methods("GET")
	router.HandleFunc("/transactions", auth.WithJWTAuth(h.createTransaction, h.userStore)).Methods("POST")
	router.HandleFunc("/transactions/{id}", auth.WithJWTAuth(h.updateTransaction, h.userStore)).Methods("PUT")
	router.HandleFunc("/transactions/{id}", auth.WithJWTAuth(h.removeTransaction, h.userStore)).Methods("DELETE")
}

func (h *TransactionHandler) getTransactions(w http.ResponseWriter, r *http.Request) {
	userId := auth.GetUserIDFromContext(r.Context())
	transactions, err := h.store.GetAllTransactions(userId)
	if err != nil {
		return
	}

	utils.WriteJSON(w, http.StatusOK, map[string][]types.Transaction{"transactions": transactions})
}

func (h *TransactionHandler) createTransaction(w http.ResponseWriter, r *http.Request) {
	userId := auth.GetUserIDFromContext(r.Context())
	var tx types.Transaction
	if err := utils.ParseJSON(r, &tx); err != nil {
		fmt.Println("ParseJSON error:", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	tx.UserID = userId

	// Debug: print transaction struct
	fmt.Printf("Received transaction: %+v\n", tx)

	if err := h.store.AddTransaction(tx); err != nil {
		fmt.Println("AddTransaction error:", err)
		http.Error(w, "Failed to create transaction", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusCreated, map[string]string{"message": "Transaction created"})
}

func (h *TransactionHandler) updateTransaction(w http.ResponseWriter, r *http.Request) {
	userId := auth.GetUserIDFromContext(r.Context())
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok {
		http.Error(w, "Missing transaction id", http.StatusBadRequest)
		return
	}
	var tx types.Transaction
	if err := utils.ParseJSON(r, &tx); err != nil {
		fmt.Println("ParseJSON error:", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	tx.UserID = userId
	// Parse id to int and set to tx.ID
	if _, err := fmt.Sscanf(id, "%d", &tx.ID); err != nil {
		fmt.Println("ID parse error:", err)
		http.Error(w, "Invalid transaction id", http.StatusBadRequest)
		return
	}

	// Debug: print transaction struct
	fmt.Printf("Received transaction for update: %+v\n", tx)

	if err := h.store.UpdateTransaction(tx); err != nil {
		fmt.Println("UpdateTransaction error:", err)
		http.Error(w, "Failed to update transaction", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, map[string]string{"message": "Transaction updated"})
}

func (h *TransactionHandler) removeTransaction(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, ok := vars["id"]
	if !ok {
		http.Error(w, "Missing transaction id", http.StatusBadRequest)
		return
	}
	var txID int
	if _, err := fmt.Sscanf(id, "%d", &txID); err != nil {
		http.Error(w, "Invalid transaction id", http.StatusBadRequest)
		return
	}
	if err := h.store.RemoveTransaction(txID); err != nil {
		http.Error(w, "Failed to remove transaction", http.StatusInternalServerError)
		return
	}
	utils.WriteJSON(w, http.StatusOK, map[string]string{"message": "Transaction removed"})
}
