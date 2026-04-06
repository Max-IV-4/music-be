import express, { Request, Response } from "express"
import playlistsService from "../../service/PlaylistsServiceImpl.js"
import { auth } from "../../middleware/auth.js"
import logger from "../../logger.js"

const playlistsRouter = express.Router()

playlistsRouter.get("/", auth("USER", "SUPER_USER"), async (_req: Request, res: Response) => {
    const playlists = await playlistsService.getAllPlaylists()
    logger.debug(`received ${playlists.length} playlist objects`)
    res.json(playlists)
})

playlistsRouter.get("/:playlistId/tracks", auth("USER", "SUPER_USER"),
    async (req: Request<{ playlistId: string }>, res: Response) => {
        const playlistId = +req.params.playlistId
        const tracks = await playlistsService.getPlaylistTracks(playlistId)
        res.json(tracks)
    })

export default playlistsRouter
