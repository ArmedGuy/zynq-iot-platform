package main

import (
	"fmt"
	"log"
	"mime/multipart"
	"net/http"

	"github.com/gin-gonic/gin"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const FPGA_ALL = "0"
const FPGA_1 = "1"
const FPGA_2 = "2"

var FPGA1_Filename string
var FPGA2_Filename string

type File struct {
	Name string
	Data *multipart.FileHeader
}

type Device struct {
	Id     bson.ObjectId `bson:"_id" json:"name"`
	Status string        `json:"status"`
	CPU    int           `json:"cpu"`
	RAM    int           `json:"ram"`
	Model  string        `json:"model"`
}

func main() {

	r := gin.Default()

	session, err := mgo.Dial("130.240.200.99:27017")
	if err != nil {
		panic(err)
	}

	// Optional. Switch the session to a monotonic behavior.
	session.SetMode(mgo.Monotonic, true)

	r.GET("/api/getDevices", func(c *gin.Context) {
		setCorsHeaders(c)

		s := session.Clone()
		defer s.Close()

		var result []Device
		q := session.DB("iot_platform").C("devices")
		err = q.Find(bson.M{}).All(&result)

		if err != nil {
			log.Fatal(err)
		}

		c.JSON(http.StatusOK, result)
	})

	r.GET("/api/getDevice/:id", func(c *gin.Context) {
		setCorsHeaders(c)

		s := session.Clone()
		defer s.Close()

		id := c.Param("id")

		var result Device
		q := session.DB("iot_platform").C("devices")
		err = q.Find(bson.M{"_id": bson.ObjectIdHex(id)}).One(&result)

		if err != nil {
			log.Fatal(err)
		}

		c.JSON(http.StatusOK, result)
	})

	r.POST("/api/configure/:fpga", func(c *gin.Context) {
		setCorsHeaders(c)

		form, _ := c.MultipartForm()
		files := form.File["file"]
		deployDest := c.Param("fpga")

		for _, file := range files {
			switch deployDest {
			case FPGA_ALL:
				c.SaveUploadedFile(file, "./configFPGA1/"+file.Filename)
				FPGA1_Filename = file.Filename
				c.SaveUploadedFile(file, "./configFPGA2/"+file.Filename)
				FPGA2_Filename = file.Filename
				d := session.DB("test").C("files")
				err = d.Insert(&File{file.Filename, file})
				if err != nil {
					log.Fatal(err)
				}

				result := File{}
				err = d.Find(bson.M{"name": file.Filename}).One(&result)
				if err != nil {
					log.Fatal(err)
				}

				fmt.Println("Filename:", result.Name)
			case FPGA_1:
				c.SaveUploadedFile(file, "./configFPGA1/"+file.Filename)
				FPGA1_Filename = file.Filename
			case FPGA_2:
				c.SaveUploadedFile(file, "./configFPGA2/"+file.Filename)
				FPGA2_Filename = file.Filename
			}
		}

		//For single file only (in case we only want to take 1 zip file?)
		/*file, _ := c.FormFile("file")
		deployDest := c.Param("fpga")
		fmt.Printf(deployDest)
		switch deployDest {
		case FPGA_ALL:
			c.SaveUploadedFile(file, "./configFPGA1/"+file.Filename)
			FPGA1_Filename = file.Filename
			c.SaveUploadedFile(file, "./configFPGA2/"+file.Filename)
			FPGA2_Filename = file.Filename
		case FPGA_1:
			c.SaveUploadedFile(file, "./configFPGA1/"+file.Filename)
			FPGA1_Filename = file.Filename
		case FPGA_2:
			c.SaveUploadedFile(file, "./configFPGA2/"+file.Filename)
			FPGA2_Filename = file.Filename
		}*/
		/*c.JSON(http.StatusOK, gin.H{
			"response": "Request received.",
		})*/
	})

	r.GET("/api/current", func(c *gin.Context) {
		setCorsHeaders(c)

		c.JSON(http.StatusOK, gin.H{
			"response": struct {
				FPGA1 string
				FPGA2 string
			}{
				FPGA1: FPGA1_Filename,
				FPGA2: FPGA2_Filename,
			}})
	})

	r.Run(":8080")
}

func setCorsHeaders(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Headers", "access-control-allow-origin, access-control-allow-headers")
}
