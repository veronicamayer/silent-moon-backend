// --------------------------------------------- IMPORTS
import { getDb } from "../util/dbConfig.js";
import { ObjectId } from "mongodb";

// --------------------------------------------- DB_COLLECTION
const VIDEO_COL = process.env.VIDEO_COL;
const PLAYLIST_COL = process.env.PLAYLIST_COL;

// --------------------------------------------- DATA_VIDEOS
export const videos = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.collection(VIDEO_COL).find().toArray();
        res.json(result);
    } catch (err) {
        res.status(500).end();
        console.log(err);
    }
};

// --------------------------------------------- DATA_VIDEOBYID
export const videoById = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db
            .collection(VIDEO_COL)
            .findOne({ _id: `${req.params.id}` });
        if (!result) {
            res.status(404).json({ error: "Video not found" });
        } else {
            res.json(result);
        }
    } catch (err) {
        res.status(500).end();
        console.log(err);
    }
};

// --------------------------------------------- DATA_PLAYLISTS
export const playlists = async (req, res) => {
    const { accessToken } = req;

    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    // Fetch playlist IDs from MongoDB collection
    const db = await getDb();
    const collection = await db.collection(PLAYLIST_COL);

    collection
        .find()
        .toArray()
        .then((documents) => {
            const playlistIds = documents.map((doc) => doc.playlistId);

            console.log(playlistIds);

            // Use the fetched playlist IDs to fetch playlists from Spotify API
            const promises = playlistIds.map((playlistId) =>
                fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                    headers: headers,
                }).then((result) => result.json())
            );

            Promise.all(promises)
                .then((data) => {
                    res.json(data); // Return the playlists as JSON response
                })
                .catch((error) => {
                    console.error("Error fetching playlists:", error);
                    res.status(500).json({ error: "Internal Server Error" });
                });
        })
        .catch((error) => {
            console.error("Error fetching playlist IDs from MongoDB:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

// --------------------------------------------- DATA_PLAYLISTBYID
export const playlistById = async (req, res) => {
    const { accessToken } = req;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };
    const playlistId = req.params.id;

    fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: headers,
    })
        .then((result) => result.json())
        .then((data) => {
            res.json(data); // Return the playlists as JSON response
        })
        .catch((error) => {
            console.error("Error fetching playlist:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};
