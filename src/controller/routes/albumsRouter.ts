import express, { Request, Response } from "express"
import albumsService from "../../service/AlbumsServiceImpl.js"
import { auth } from "../../middleware/auth.js"
import logger from "../../logger.js"

const albumsRouter = express.Router()

albumsRouter.get("/", auth("USER", "SUPER_USER"), async (_req: Request, res: Response) => {
    const albums = await albumsService.getAllAlbums()
    logger.debug(`received ${albums.length} album objects`)
    res.json(albums)
})

albumsRouter.get("/:albumId/tracks", auth("USER", "SUPER_USER"),
    async (req: Request<{ albumId: string }>, res: Response) => {
        const albumId = +req.params.albumId
        const tracks = await albumsService.getAlbumTracks(albumId)
        res.json(tracks)
    })

export default albumsRouter
