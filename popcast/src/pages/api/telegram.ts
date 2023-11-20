import { NextApiRequest, NextApiResponse } from "next";
import Telegraf, { ContextMessageUpdate } from "telegraf";

const bot = new Telegraf<ContextMessageUpdate>(process.env.TELEGRAM_BOT_TOKEN);

bot.on("message", (ctx) => {
	console.log(ctx.message);
});

bot.launch();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		try {
			const chatId = req.body.chatId;
			const text = req.body.text;

			await bot.telegram.sendMessage(chatId, text);

			res.status(200).json({ status: "Message sent" });
		} catch (error) {
			res.status(500).json({ error: "Error sending message" });
		}
	} else if (req.method === "GET") {
		try {
			const updates = await bot.telegram.getUpdates();

			res.status(200).json({ status: "Success", updates });
		} catch (error) {
			res.status(500).json({ error: "Error fetching updates" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
