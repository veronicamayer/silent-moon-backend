import express from "express";
import {
    videos,
    videoById,
    playlists,
    playlistById,
} from "../controller/dataController.js";
import { verifyUser } from "../middleware/verifyUser.js";
import { fetchAccessToken } from "../middleware/getSpotifyAccess.js";

//data_router erstellt und in index.js importiert
export const data_router = new express.Router();

// ----------------------------------------- GET Routes
data_router.get("/videos", verifyUser, videos);
data_router.get("/videos/:id", verifyUser, videoById);
data_router.get("/playlists", verifyUser, fetchAccessToken, playlists);
data_router.get("/playlists/:id", verifyUser, fetchAccessToken, playlistById);
