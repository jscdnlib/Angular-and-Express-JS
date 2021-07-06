const express = require('express');
const app = express();
const port = 3000;
var cors = require('cors');
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'db_ilcs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors({origin:true,credentials: true}));

function LihatNikTerakhirDivisiKaryawan (req, callback) {
	const sqlProcedure = 'CALL LihatNikTerakhirDivisiKaryawan(?);';
    pool.query(
        sqlProcedure,['HRD'],
        function(err, rows) {
            if (err) {
            	console.log(err); 
                callback(0); 
            }
            console.log(rows[0]);
            var resultArray = Object.values(JSON.parse(JSON.stringify(rows[0])))
            callback(resultArray);
        }
    );
} 


function suffixTahunSekarang (callback) {
	var kalender = new Date(); 
	var tahun = kalender.getFullYear(); 
	var duadigit = tahun.toString().substr(-2);
	callback(duadigit); 
} 


app.get('/karyawan', (req, res) => {
	const sqlProcedure = 'CALL GetAllKaryawan();';
    pool.query(
        sqlProcedure,['str','rnd'],
        function(err, rows) {
            if (err) {
	            res.send(resultArray);
            }
            var resultArray = Object.values(JSON.parse(JSON.stringify(rows[0])))            
            res.send(resultArray);
        });
});


app.post('/insertkaryawan', (req, res) => {
	var tahundigit = new Date(); 
		tahundigit = tahundigit.getFullYear(); 
		tahundigit = tahundigit.toString().substr(-2);
	const divisi = req.body.divisi; //interger value
	const nama = req.body.nama;
	const alamat = req.body.alamat;
	const tgllahir = req.body.tgllahir;
	const status = req.body.status;
	const niksuf = divisi == 10 ? "IT" : (divisi == 11 ? "HRD" : "Finance");
    const nikTerkhir = LihatNikTerakhirDivisiKaryawan(niksuf, function(existNik){
		var newnik; 
	    if(existNik == 404) {
			throw 'ErrorValidatingData';
	    } 
	    else if(existNik.length == 0) {
		    newnik = divisi + tahundigit + "0001";
	    } else {
	    	let fourdigit = existNik[0]["nik"].toString().slice(-4); 
	    	let number = Number(fourdigit) + 1;
	    	let newfourdigit = number.toString().padStart(4, '0');
		    newnik = divisi + tahundigit + newfourdigit;	    	
	    }

		const sqlProcedure = 'CALL InsertNewKaryawan(?,?,?,?,?,?);';

	    pool.query(
	        sqlProcedure,[newnik, nama, alamat, tgllahir, niksuf, status],
	        function(err, rows) {
	            if (err) {
	                console.log(err);
	                res.send([]);
	            }
	            console.log(rows[0]);
	            res.send(rows[0]);
	        }
	    );
    });     
});


app.post('/updatekaryawan', (req, res) => {
	const nama = req.body.nama;
	const alamat = req.body.alamat;
	const tgllahir = req.body.tgllahir;
	const status = req.body.status;
	const nik = req.body.nik;

	const sqlProcedure = 'CALL UpdateKaryawan(?,?,?,?,?);';
    pool.query(
        sqlProcedure,[nama, alamat, tgllahir, status, nik],
        function(err, rows) {
            if (err) {
                res.send([]);
            }
            res.json({"status":"OK"});
        });
});



app.post('/deletekaryawan', (req, res) => {
	const nik = req.body.nik;

	const sqlProcedure = 'CALL DeleteKaryawan(?);';
    pool.query(
        sqlProcedure,[nik],
        function(err, rows) {
            if (err) {
                res.status(404).send("Ada kesalahan teknis");
            }
            res.json({"status":"OK"});
        });
});



app.listen(port, () => {
  console.log('listening at http://localhost:${port}')
});



