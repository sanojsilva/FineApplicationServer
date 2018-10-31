const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'police_local_db'
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


server.listen(process.env.PORT || 4200, () => {
    console.log('server running on port 4200');
});



con.connect((err) => {
    if (err) throw err;
    console.log('Database Connected Succefully');
})



app.post('/validate-code', (req, res) => {
    console.log(req.body);
    res.json({
        validated: true
    });
    // con.query("select * from account where username = '" + username + "' and password = '" + password + "'", (err, rows, fields) => {
    //     if (err) throw err;
    //         if(rows.length > 0) {
    //             res.json({
    //                 permission: 'GRANTED'
    //             });
    //         } else {
    //             res.json({
    //                 permission: "ACCESS DENIED"
    //             });
    //         }
    // })
});


app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

   // console.log(req.body);

    con.query("select * from account where username = '" + username + "' and password = '" + password + "'", (err, rows, fields) => {
        
        if (err) throw err;
            if(rows.length > 0) {
                res.json({
                    username: rows[0]['username'],
                    policemanID: rows[0]['policemanID'],
                    permission: 'GRANTED'
                });
            } else {
                res.json({
                    permission: "ACCESS DENIED"
                });
            }
    })
});

app.post('/add-fines', (req, res) => {
    const policeman = req.body.policeman;
    const fines = req.body.fines;
    let date = new Date().toJSON().slice(0, 10);

    fines.forEach(fine => {
        con.query("insert into finesheet_master(policemanID, dateOfIssue, dateOfExpiry) values(" + policeman.policemanID + ", '" + date + "', '" + date + "')", (err, rows, fields) => {
            if (err) throw err;

            if (rows.length > 0) {
                res.json({
                    desp: "FINE ADDED"
                });
            }
        })
    })
    
});

app.get('/get-fines', (req, res) => {
    con.query("select * from fine", (err, rows, fields) => {
        if (err) throw err;
            if(rows.length > 0) {
                res.json({
                    fines: rows
                })
            } else {
                
            }
    })
})



