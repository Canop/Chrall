package main


import (
	"database/sql"
	"flag"
	"log"
	_ "github.com/ziutek/mymysql/godrv"
)

func main() {
	user := flag.String("user", "", "user pour la bd chrall")
	pwd := flag.String("pwd", "", "password pour la bd chrall")
	flag.Parse()
	if *user=="" || *pwd=="" {
		log.Fatal("database user and password must be provided")
	}
	
	db, err := sql.Open("mymysql", "chrall/"+*user+"/"+*pwd)
	if err != nil {
		panic(err)
	}
	
	rows, err := db.Query("select nom from observation where num=?", 57760)
	if err!=nil {
		log.Fatal("Error while querying", err)
	}
	for rows.Next() {
		var name string
		err = rows.Scan(&name)
		if err!=nil {
			log.Fatal("Error while iterating", err)
		}
		log.Println("result :", name)
	}
	rows.Close()
	
}
