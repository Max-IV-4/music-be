import { Playlist } from "../models/Playlist.js"
import { Track } from "../models/Track.js"
import PlaylistsService from "./PlaylistsService.js"
import supabase from "../utils/supabase.js"
import { PlaylistNotFound } from "./shared/service-errors.js"
import logger from "../logger.js"

class PlaylistsServiceSupabase implements PlaylistsService {

    async getAllPlaylists(): Promise<Playlist[]> {
        const { data, error } = await supabase
            .from("playlist")
            .select("playlist_id, name")
        if (error) throw error
        logger.debug(`received ${data.length} playlist objects`)
        return data
    }

    async getPlaylistTracks(playlistId: number): Promise<Track[]> {
        const { data: playlist, error: playlistError } = await supabase
            .from("playlist")
            .select("playlist_id")
            .eq("playlist_id", playlistId)
            .maybeSingle()
        if (playlistError) throw playlistError
        if (!playlist) {
            throw new PlaylistNotFound(playlistId)
        }
        const { data, error } = await supabase
            .from("playlist_track")
            .select("track(name, genre(name), media_type(name))")
            .eq("playlist_id", playlistId)
        if (error) throw error
        const tracks: Track[] = data.map((row: any) => ({
            name: row.track.name,
            genre_name: row.track.genre?.name ?? null,
            media_type_name: row.track.media_type?.name ?? null
        }))
        logger.debug(`received ${tracks.length} tracks for playlist ${playlistId}`)
        return tracks
    }
}

const playlistsService: PlaylistsService = new PlaylistsServiceSupabase()
export default playlistsService
