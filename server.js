const express = require("express")
const { ObjectId, MongoClient } = require('mongodb')

const app = express()
const url = "mongodb://localhost:27017"

let db, trips, expenses

app.use(express.json())

MongoClient.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err, client) => {
        if (err) {
            console.error(err)
            return
        }
        db = client.db("tripcost")
        trips = db.collection("trips")
        expenses = db.collection("expenses")
    }
)

app.post("/trip", (req, res) => {
    const name = req.body.name
    trips.insertOne({ name: name }, (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
        }
        console.log(result)
        res.status(200).json({ ok: true })
    })
})

app.get("/trips", (req, res) => {
    trips.find().toArray((err, items) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
        }
        res.status(200).json({ trips: items })
    })
})

app.post("/expense", (req, res) => {
    expenses.insertOne({
        trip: req.body.trip,
        date: req.body.date,
        amount: req.body.amount,
        category: req.body.category,
        description: req.body.description
    },
        (err, result) => {
            if (err) {
                res.status(500).json({ err: err })
                return
            }
            res.status(200).json({ ok: true })
        }
    )
})

app.get("/expenses", (req, res) => {
    expenses.find({trip: req.body.trip}).toArray((err, items) => {
        if (err) {
            console.error(err)
            res.status(500).json({err: err})
            return
        }
        res.status(200).json({expenses: items})
    })
})

app.get('/removetrip', (req, res) => {
    id = req.query.id
    console.log(`The ID from the URL is: ${id}`)
    removeTrip(id, (err) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
        }
    })
    res.status(200).json({ ok: true })
})

let removeTrip = (id) => {
    //const id = req.body.id
    trips.deleteOne({ _id: ObjectId(id) }, (err, result) => {
        if (err) {
            return err
        }
        console.log(result)
        console.log("trying to delete id " + id)

    })
}

app.listen(3000, () => console.log("Server ready"))