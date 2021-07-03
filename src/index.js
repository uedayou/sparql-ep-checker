const fs = require('fs');
const yaml = require('js-yaml');
const axios = require('axios');

main();

async function main() {
	const [success, failure] = getSvgs();
	const docs_dir = __dirname+"/../docs/"
	const urllist = yaml.safeLoad(fs.readFileSync(__dirname+"/../urllist.yaml", 'utf8'));

	for (const obj of urllist) {
		let url = obj.url;
		let param;
		for (const key in obj.params) {
			param = param+"&" || "?";
			param += key+"="+encodeURI(obj.params[key]);
		}
		if (param) url += param;
		const flag = await checkUrl(url);
		const svg = flag ? success : failure;
		const dir = docs_dir+encodeURIComponent(obj.url)+"/";
		!fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });
		fs.writeFileSync(dir+"check.svg", success);
	}
}

async function checkUrl(url) {
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