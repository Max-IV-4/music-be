import { Playlist } from "../models/Playlist.js"
import { Track } from "../models/Track.js"
import PlaylistsService from "./PlaylistsService.js"
import db from "../utils/db.js"
import { PlaylistNotFound } from "./shared/service-errors.js"
import logger from "../logger.js"

class PlaylistsServiceKnex implements PlaylistsService {

    async getAllPlaylists(): Promise<Playlist[]> {
        const playlists = await db("playlist")
            .select("playlist_id", "name")
        logger.debug(`received ${playlists.length} playlist objects`)
        return playlists
    }

    async getPlaylistTracks(playlistId: number): Promise<Track[]> {
        const playlist = await db("playlist")
            .where("playlist_id", playlistId)
            .first()
        if (!playlist) {
            throw new PlaylistNotFound(playlistId)
        }
        const tracks: Track[] = await db("playlist_track")
            .join("track", "playlist_track.track_id", "track.track_id")
            .leftJoin("genre", "track.genre_id", "genre.genre_id")
            .leftJoin("media_type", "track.media_type_id", "media_type.media_type_id")
            .select(
                "track.name",
                "genre.name as genre_name",
                "media_type.name as media_type_name"
            )
            .where("playlist_track.playlist_id", playlistId)
        logger.debug(`received ${tracks.length} tracks for playlist ${playlistId}`)
        return tracks
    }
}

const playlistsService: PlaylistsService = new PlaylistsServiceKnex()
export default playlistsService
