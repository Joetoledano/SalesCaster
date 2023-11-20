import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Initialize OpenAI with your API key
const openai = new OpenAI(process.env.OPENAI_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const { text, guidance } = req.body;

		if (!text || !guidance) {
			return res.status(400).json({ error: "Text and guidance are required." });
		}

		try {
			const gptResponse = await openai.complete({
				engine: "davinci-codex",
				prompt: `${text}\n${guidance}`,
				max_tokens: 60,
			});

			return res.status(200).json({ editedText: gptResponse.choices[0].text });
		} catch (error) {
			return res.status(500).json({ error: "Error processing request." });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
