import { CronJob } from "cron";
import https from "node:https";

const serviceUrl = process.env.API_URL || process.env.RENDER_EXTERNAL_URL;
let healthUrl: any;

if (serviceUrl) {
	try {
		healthUrl = new URL("/health", serviceUrl);
		if (healthUrl.protocol !== "https:") {
			throw new Error("Cron service URL must use HTTPS");
		}
	} catch (error: any) {
		console.error("Cron job disabled:", error.message);
		healthUrl = undefined;
	}
} else {
	console.warn("Cron job disabled: set API_URL or RENDER_EXTERNAL_URL");
}

const job = new CronJob("*/14 * * * *", function () {
	if (!healthUrl) return;

	const request = https.get(healthUrl, (res) => {
		res.resume(); // Consume the response so the connection can be released.
		if (res.statusCode === 200) console.log("Cron health request succeeded");
		else console.error("Cron health request failed:", res.statusCode);
	});
	request.setTimeout(10000, () => {
		request.destroy(new Error("Cron health request timed out"));
	});
	request.on("error", (error) => {
		console.error("Cron health request error:", error.message);
	});
});

export default job;
