import { Album } from "../models/Album.js"
import { Track } from "../models/Track.js"
import AlbumsService from "./AlbumsService.js"
import db from "../utils/db.js"
import { AlbumNotFound } from "./shared/service-errors.js"
import logger from "../logger.js"

class AlbumsServiceKnex implements AlbumsService {

    async getAllAlbums(): Promise<Album[]> {
        const rows = await db("album")
            .join("artist", "album.artist_id", "artist.artist_id")
            .select("album.album_id", "album.title", "artist.name as artist_name")
        logger.debug(`received ${rows.length} album objects`)
        return rows
    }

    async getAlbumTracks(albumId: number): Promise<Track[]> {
        const tracks: Track[] = await db("track")
            .leftJoin("genre", "track.genre_id", "genre.genre_id")
            .leftJoin("media_type", "track.media_type_id", "media_type.media_type_id")
            .select(
                "track.name",
                "genre.name as genre_name",
                "media_type.name as media_type_name"
            )
            .where("track.album_id", albumId)
        if (tracks.length === 0) {
            throw new AlbumNotFound(albumId)
        }
        logger.debug(`received ${tracks.length} tracks for album ${albumId}`)
        return tracks
    }
}

const albumsService: AlbumsService = new AlbumsServiceKnex()
export default albumsService
