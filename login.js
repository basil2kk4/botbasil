const facebook = require("./includes/handle/facebook.js")
const config = require("./config.json");
const chalk = require("chalk");
const { spawn } = require("child_process");
const fs = require("fs");
(async () => {
	// rainbow(`Đang đăng nhập với tài khoản ${config['EMAIL']} | ${config['PASSWORD']} | ${config['OTPKEY']}`);
	let facebookHandle = new facebook(config['EMAIL'], config['PASSWORD'], config['OTPKEY']);
	await facebookHandle.login().then(async (data) => {
		const cookies = []
		const validItems = ["sb", "datr", "c_user", "xs"]
		data.forEach(cookie => {
			const cookieParts = cookie.split(";")[0].split("=")
			if (validItems.includes(cookieParts[0])) {
				cookies.push(cookieParts.join("="))
			}
		})
		const appstate = []
		cookies.forEach(cookie => {
			appstate.push({
				key: cookie.split("=")[0],
				value: cookie.split("=")[1],
				domain: "facebook.com",
				path: "/"
			})
		})
		console.log(data)
		fs.writeFileSync("./appstate.json", JSON.stringify(appstate))
		rainbow("Đã lưu appstate vào appstate.json")
		const child = spawn("node", ["./index.js"])
		child.stdout.on("data", (data) => {
			rainbow(data.toString())
		})
	}).catch((err) => {
		rainbow(err)
	})
})()

function rainbow(text) {
	let color = {
		red: chalk.hex("#f04343").bold,
		yellow: chalk.hex("#f0c043").bold,
		green: chalk.hex("#43f0c0").bold,
		blue: chalk.hex("#43aaf0").bold,
		purple: chalk.hex("#f043f0").bold,
		white: chalk.hex("#ffffff").bold
	};
	let colors = [color.red, color.yellow, color.green, color.blue, color.purple, color.white];
	console.log(colors[Math.floor(Math.random() * colors.length)](text));
}