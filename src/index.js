const fs = require('fs');
const yaml = require('js-yaml');
const axios = require('axios');

main();

async function main() {
	const [success, failure] = getSvgs();
	const docs_dir = __dirname+"/../docs/"
	const urllist = yaml.load(fs.readFileSync(__dirname+"/../urllist.yaml", 'utf8'));

	for (const obj of urllist) {
		let url = obj.url;
		const flag = await checkUrl(url, obj.params, obj.type);
		console.log(`check : ${obj.url} => ${(flag ? "〇" : "×")}`);
		const svg = flag ? success : failure;
		const dir_name = obj.name || encodeURIComponent(obj.url);
		const dir = docs_dir+dir_name+"/";
		!fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });
		fs.writeFileSync(dir+"check.svg", svg);
		fs.writeFileSync(dir+"update.txt", new Date().toString());
	}
	fs.writeFileSync(docs_dir+"update.txt", new Date().toString());
}

async function checkUrl(url, params, type) {
	params = params || [];
	type = type || "GET";
	console.log(url);
	let flag = false;
	try {
		let res;
		if (type.match(/get/i)) {
			res = await axios.get(url, {
				params
			});
		} else {
			res = await axios.post(url, {
				...params
			}, {
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
		}
		flag = true;
	} catch (e) {
		//console.error(e);
		console.error(e.response ? e.response.status : e.errno);
	}
	return flag;
}

function getSvgs() {
	const path = __dirname+"/../assets/";
	const success = fs.readFileSync(path+"success.svg", "UTF8");
	const failure = fs.readFileSync(path+"failure.svg", "UTF8");
	return [success, failure];
}