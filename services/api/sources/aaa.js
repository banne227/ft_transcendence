const mongoose = require("mongoose");
const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@mangodb/databases`;

try {
	await mongoose.connect(url).then(() => {
		console.log(`Connected to ${url}`);
	});
} catch (err) {
	console.log(err);
}
