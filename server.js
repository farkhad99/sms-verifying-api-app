const express = require('express');
const app = express();
const DB = require('./db');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var   history = require('connect-history-api-fallback');
var path = require('path');
var serveStatic = require('serve-static');
require('events').EventEmitter.prototype._maxListeners = 100000;
const db = new DB("sqlitedb")
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

app.use(history());
app.use(express.static(path.join(__dirname, '/dist')))

// CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}

app.use(allowCrossDomain)

router.post('/register', async (req, res) => {
    await db.selectByEmail(req.body.email, (err,user) => {
        if (user) return res.status(501).send("User already exist")
            db.insert([
		        req.body.email,
		        bcrypt.hashSync(req.body.password, 8),
		    	10
		    ],  (err, user) => {
       			 if (err) return res.status(502).send("User already exist")
       			 if (err) console.log(err)
		    	 let token = jwt.sign({ id: user.id }, config.secret, {expiresIn: 84600 // expires in 24 hours
		            });
		    	console.log(user)
		    	db.selectByEmail(user[0], (err, user1)=>{
		    		if(err) console.log(err)
		            res.status(200).send({ auth: true, token: token, user: user1 });
		    	})
		    });
    }); 
});
1

router.post('/login', async (req, res) => {
    await db.selectByEmail(req.body.email, async(err, user) => {
		if (!user) return res.status(503).send('No user with such email');
		if (err)   return res.status(500).send('Error on the server.');
	        if (err) return res.status(500).send('Error on the server.');
	        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass);
	        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
	        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 84600 // expires in 24 hours
	        });
	       		 console.log(user);
	       		 console.log(token);
	        res.status(200).send({ auth: true, token: token, user: user });
    });
})

router.post('/postnumber', async (req, res) => {

	console.log(req.body.user_id);
	console.log(req.body.tzid);
	await db.insertNumber([
			        parseInt(req.body.tzid),
			        parseInt(req.body.user_id)
			    ], (err, number) => {
           			 // if (err) return res.status(502).send("There was a problem getting user")
			            res.status(200).send({ msg: 'posted' });
    });
})

router.get('/getnumbers/:user_id',  (req, res) => {
 	 db.selectNumberById(req.params.user_id, (err, numbers) => {
        if (!numbers) return res.status(401).send('No numbers found.');
 		console.log(numbers);
        res.status(200).send({numbers: numbers});
    });
})

router.get('/getnumber/:tzid/:user_id', (req, res) => {
	 db.selectByTzid(req.params.tzid, req.params.user_id, (err, number) => {
		if (err) console.log(err)
		if (!number) res.send("no number")
		res.send(number);
	});
});

router.get('/getBalance/:email',  (req, res) => {
	db.selectByEmail(req.params.email,  (err, user) => {
		if(err) res.sendStatus("403").send("error on server")
		if(!user) res.sendStatus("403").send("no balance found")
		res.send({balance:user.balance})
	})
})
router.post('/balanceCut', async (req, res)  => {
	let user_id = req.body.user_id;
	let sum     = req.body.sum;
	let tzid    = req.body.tzid;
	await db.subtractBalance(user_id, tzid, sum, async (err, balance) => {
		if (err) res.status(502).send('Some problem with balance check')
			res.status(200).send('OK');
	})
});

router.post('/removeNum', async (req, res) => {
	 await db.removeNum([
	 		req.body.tzid,
	 		req.body.user_id
	 				], (err, numbers) => {
        if (err) 	  return res.status(500).send('Error on the server.');
        if (!numbers) return res.status(404).send('No numbers found.');
 		console.log(numbers);
        res.status(200).send({msg: 'Deleted'});
    });
});

app.use(router)
let port = process.env.PORT || 3000;

let server = app.listen(port, function() {
    console.log('Express server listening on port ' + port)
});