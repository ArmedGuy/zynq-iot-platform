package main

import (
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type File struct {
	Id   bson.ObjectId `bson:"device_id"`
	Name string
	File []byte
}

type Device struct {
	Id     bson.ObjectId `bson:"_id" json:"name"`
	Status string        `json:"status"`
	CPU    int           `json:"cpu"`
	RAM    int           `json:"ram"`
	Model  string        `json:"model"`
}

type Stats struct {
	Id       bson.ObjectId `bson:"device_id" json:"device"`
	CPU      int           `json:"cpu"`
	RAM      int           `json:"ram"`
	Net_up   int           `json:"net_up"`
	Net_down int           `json:"net_down"`
}

type Output struct {
	Id     bson.ObjectId `bson:"device_id" json:"device"`
	Stdout string        `json:"stdout"`
	Stder  string        `json:"stderr"`
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
			c.JSON(http.StatusOK, Device{})
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
			c.JSON(http.StatusOK, Device{})
		}

		c.JSON(http.StatusOK, result)
	})

	r.GET("/api/getStats/:id", func(c *gin.Context) {
		setCorsHeaders(c)

		s := session.Clone()
		defer s.Close()

		id := c.Param("id")

		var result Stats
		q := session.DB("iot_platform").C("stats")
		err = q.Find(bson.M{"device_id": id}).One(&result)

		if err != nil {
			c.JSON(http.StatusOK, Stats{})
		}

		c.JSON(http.StatusOK, result)
	})

	r.GET("/api/getOutput/:id", func(c *gin.Context) {
		setCorsHeaders(c)

		s := session.Clone()
		defer s.Close()

		id := c.Param("id")

		var result Output
		q := session.DB("iot_platform").C("output")
		err = q.Find(bson.M{"device_id": id}).One(&result)

		if err != nil {
			c.JSON(http.StatusOK, Output{})
		}

		c.JSON(http.StatusOK, result)
	})

	r.POST("/api/configure/:id", func(c *gin.Context) {
		setCorsHeaders(c)

		s := session.Clone()
		defer s.Close()

		form, _ := c.MultipartForm()
		files := form.File["file"]
		id := c.Param("id")

		q := session.DB("iot_platform").C("files")

		for _, file := range files {
			fileContent, _ := file.Open()
			bytes, _ := ioutil.ReadAll(fileContent)

			_, err = q.Upsert(bson.M{"device_id": bson.ObjectIdHex(id)}, &File{bson.ObjectIdHex(id), file.Filename, bytes})
			err = session.DB("iot_platform").C("devices").Update(bson.M{"_id": bson.ObjectIdHex(id)}, bson.M{"$set": bson.M{"status": "flash_queued"}})
			if err != nil {
				log.Fatal(err)
			}
		}
	})

	r.GET("/api/getConfiguration/:id", func(c *gin.Context) {
		setCorsHeaders(c)

		s := session.Clone()
		defer s.Close()

		id := c.Param("id")

		var result File
		q := session.DB("iot_platform").C("files")
		err = q.Find(bson.M{"device_id": bson.ObjectIdHex(id)}).One(&result)

		c.Header("Content-Description", "File Transfer")
		c.Header("Content-Transfer-Encoding", "binary")
		c.Header("Content-Disposition", "attachment; filename="+result.Name)
		c.Header("Content-Type", "application/octet-stream")
		c.Data(http.StatusOK, "application/octet-stream", result.File)
		/*if err != nil {
			log.Fatal(err)
		}*/

		//c.JSON(http.StatusOK, result)
	})

	r.Run(":8080")
}

func setCorsHeaders(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Headers", "access-control-allow-origin, access-control-allow-headers")
}
