const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

function verify(auth) {
	return (auth === process.env.REPLATA_KEY);
}

app.get('/get/', (req, res) => {
	if (!verify(req.headers.authentication)) {
		res.send({status:"failed",message:"Invalid authentication key"});
	}
	let datastore = req.headers.datastore;
	let key = datastore+"/"+req.headers.key;
	fs.open("data.json", "r", function(err, f) {
		if (err) {
			res.send({status:"failed",message:err});
		}
		let data = fs.readFileSync("data.json");
		let parsedData = JSON.parse(data);
		res.send({status:"success",data:parsedData[key]})
	});
});

app.post('/set/', (req, res) => {
	if (!verify(req.headers.authentication)) {
		res.send({status:"failed",message:"Invalid authentication key"});
	}
	let datastore = req.headers.datastore;
	let key = datastore+"/"+req.headers.key;
	let value = req.body.value;
	fs.open("data.json", "r", function(err, f) {
		if (err) {
			res.send({status:"failed",message:err});
		}
		let data = fs.readFileSync("data.json");
		let parsedData = JSON.parse(data);
		parsedData[key] = value;
		let newData = JSON.stringify(parsedData);
		fs.writeFile("data.json", newData, function(err) {
			if (err) {
				res.send({status:"failed",message:err});
			}
			res.send({status:"success"});
		});
	});
});

app.post('/del/', (req, res) => {
	if (!verify(req.headers.authentication)) {
		res.send({status:"failed",message:"Invalid authentication key"});
	}
	let datastore = req.headers.datastore;
	let key = datastore+"/"+req.headers.key;
	let value = req.body.value;
	fs.open("data.json", "r", function(err, f) {
		if (err) {
			res.send({status:"failed",message:err});
		}
		let data = fs.readFileSync("data.json");
		let parsedData = JSON.parse(data);
		delete parsedData[key];
		let newData = JSON.stringify(parsedData);
		fs.writeFile("data.json", newData, function(err) {
			if (err) {
				res.send({status:"failed",message:err});
			}
			res.send({status:"success"});
		});
	});
});

app.listen(3000, () => {
	console.log('server started');
});
