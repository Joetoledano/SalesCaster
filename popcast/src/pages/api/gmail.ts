import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const { token } = req.query;

		const oAuth2Client = new google.auth.OAuth2();
		oAuth2Client.setCredentials({ access_token: token as string });

		const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

		try {
			// List the messages in the user's mailbox
			const { data } = await gmail.users.messages.list({
				userId: "me",
			});

			// Get all messages
			const messages = await Promise.all(
				data.messages?.map(async (message) => {
					return gmail.users.messages.get({
						userId: "me",
						id: message.id,
					});
				})
			);

			res.status(200).json(messages);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	} else if (req.method === "POST") {
		const { token, to, from, subject, message } = req.body;

		const oAuth2Client = new google.auth.OAuth2();
		oAuth2Client.setCredentials({ access_token: token });

		const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

		const raw = makeBody(to, from, subject, message);
		const encodedMessage = Buffer.from(raw).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");

		try {
			const result = await gmail.users.messages.send({
				userId: "me",
				requestBody: {
					raw: encodedMessage,
				},
			});

			res.status(200).json(result);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}

function makeBody(to: string, from: string, subject: string, message: string) {
	const str = [
		'Content-Type: text/plain; charset="UTF-8"\n',
		"MIME-Version: 1.0\n",
		"Content-Transfer-Encoding: 7bit\n",
		"to: ",
		to,
		"\n",
		"from: ",
		from,
		"\n",
		"subject: ",
		subject,
		"\n\n",
		message,
	].join("");

	return str;
}
