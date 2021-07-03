const fs = require('fs');
const axios = require('axios');

main();

async function main() {
	const [success, failure] = getSvgs();
	const docs_dir = __dirname+"/../docs/"
	let url;
	url = "https://uedayou.net/";

	const flag = await check(url);
	const svg = flag ? success : failure;
	console.log(flag);
	const dir = docs_dir+encodeURIComponent(url)+"/";
	!fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(dir+"check.svg", success);
}

async function check(url) {
	let flag = false;
	try {
		const res = await axios(url);
		flag = true;
	} catch (e) {
		console.error(e);
	}
	return flag;
}

function getSvgs() {
	const path = __dirname+"/../assets/";
	const success = fs.readFileSync(path+"success.svg", "UTF8");
	const failure = fs.readFileSync(path+"failure.svg", "UTF8");
	return [success, failure];
}