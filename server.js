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
    let licenseNo = req.body.code;
    con.query("select * from licence_master where linenceNumber = '" + licenseNo + "'", (err, rows, fields) => {
        if (err) throw err;
            if(rows.length > 0) {
                res.json({
                    validated: true,
                    data: rows[0]
                });
            } else {
                res.json({
                    validated: false
                });
            }
    })
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
    const administrativeNo = req.body.administrativeNo;
    console.log(administrativeNo);
    const fines = req.body.fines;
    var someDate = new Date();
    var numberOfDaysToAdd = 6;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

    var dd = someDate.getDate();
    var mm = someDate.getMonth() + 1;
    var y = someDate.getFullYear();


    let date = new Date().toJSON().slice(0, 10);
    let expDate = y + '/' + mm + '/' + dd;


    con.query("insert into finesheet_master(policemanID, dateOfIssue, dateOfExpiry, administativeNumber) values(" + policeman.policemanID + ", '" + date + "', '" + expDate + "', '" + administrativeNo + "')", (err, row, fields) => {
        if (err) throw err;
        if (row.affectedRows > 0) {
            let finesheetNo = row.insertId;
            
            fines.forEach(fine => {
                
                con.query("insert into finesheet_header(finesheetNumber, fineNo) values(" + finesheetNo + ", " + fine.no + ")", (err, rows, fields) => {
                        if (err) throw err;

                })
            })

            res.json({
                desp: "FINE ADDED"
            });
        }
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

app.get('/get-history', (req, res) => {

    const administrativeNo = req.query.administrativeNo;
    
    con.query("select * from finesheet_master where administativeNumber = '" + administrativeNo + "'", (err, rows, fields) => {
        if (err) throw err;
            if(rows.length > 0) {
                res.json({
                    data: rows
                });
                //console.log(rows);
            } else {
                
            }
    })
})



