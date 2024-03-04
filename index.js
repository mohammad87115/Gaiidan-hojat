const express = require('express');
const app = express();
const { QuickDB } = require("quick.db");
const { JSONDriver } = require("quick.db");
const axios = require("axios")
const jsonDriver = new JSONDriver();
const db = new QuickDB({ driver: jsonDriver });

(async () => {
    await db.init();
})()
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.static('public'));

let count = 5;

app.get("/count", async (req, res) => {
    
    const count = await db.get("count")
    res.json({"data":count})
})

app.post("/add", async (req, res) => {
    let capt = req.body['g-recaptcha-response'];
    console.log(capt)
    if (!capt) return res.send("INVALID CAPTCHA");

    const cap = await axios.post("https://www.google.com/recaptcha/api/siteverify", `secret=6Lc0YIkpAAAAALjaKYx4EcRDofjsub1zXYUpWz9v&response=${capt}`)

    console.log(cap.data)

    if (cap.data.success) {
        await db.add("count", 1)

        await res.redirect("/")
    } else {
        await res.send("INVALID CAPTCHA")
    }
})

app.listen(5000, () => {
    console.log('listening on *:80');
});
