import { useState } from "react";

export default function ConnectButton() {
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		setLoading(true);
		try {
			const clientId = process.env.REACT_APP_CLIENT_ID;
			const redirectUri = process.env.REACT_APP_REDIRECT_URI;
			const scope = "https://www.googleapis.com/auth/gmail.readonly";
			const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;

			// Redirect the user to Google's OAuth 2.0 server
			window.location.href = url;
		} catch (error) {
			console.error("Failed to connect to Gmail:", error);
			setLoading(false);
		}
	};

	return (
		<button onClick={handleClick} disabled={loading} aria-label="Connect to Gmail">
			{loading ? "Connecting..." : "Connect Gmail Account"}
		</button>
	);
}
