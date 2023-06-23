const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export const fetchAccessToken = (req, res, next) => {
    const authParameters = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
        .then((result) => result.json())
        .then((data) => {
            req.accessToken = data.access_token; // Attach the access token to the request object
            next(); // Proceed to the next middleware or route handler
        })
        .catch((error) => {
            console.error("Error fetching access token:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};
