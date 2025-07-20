package main

import (
	"database/sql"
	"log"
	"riyavij2001/expense-tracker/cmd/api"
	"riyavij2001/expense-tracker/config"
	"riyavij2001/expense-tracker/db"
	"riyavij2001/expense-tracker/utils"

	"github.com/go-sql-driver/mysql"
)

func main() {
	mysqlConfig := mysql.Config{
		User:                 config.Envs.DBUser,
		Passwd:               config.Envs.DBPassword,
		Addr:                 config.Envs.DBAddress,
		DBName:               config.Envs.DBName,
		Net:                  "tcp",
		AllowNativePasswords: true,
		ParseTime:            true,
	}
	db, err := db.NewMySQLStorage(&mysqlConfig)
	if err != nil {
		log.Fatal(err.Error())
	}
	checkAndInitDBStorage(db)
	server := api.NewAPIServer(":8181", db)
	if err := server.Run(); err != nil {
		utils.LogMessage(utils.ERROR, "Could not run the server")
	}
}

func checkAndInitDBStorage(db *sql.DB) {
	err := db.Ping()
	if err != nil {
		log.Fatal("Could not ping the DB")
	}
	utils.LogMessage(utils.INFO, "Connected to the DB")
}
