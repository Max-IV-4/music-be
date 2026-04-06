import { Album } from "../models/Album.js"
import { Track } from "../models/Track.js"
import AlbumsService from "./AlbumsService.js"
import supabase from "../utils/supabase.js"
import { AlbumNotFound } from "./shared/service-errors.js"
import logger from "../logger.js"

class AlbumsServiceSupabase implements AlbumsService {

    async getAllAlbums(): Promise<Album[]> {
        const { data, error } = await supabase
            .from("album")
            .select("album_id, title, artist(name)")
        if (error) throw error
        const albums: Album[] = data.map((row: any) => ({
            album_id: row.album_id,
            title: row.title,
            artist_name: row.artist?.name ?? null
        }))
        logger.debug(`received ${albums.length} album objects`)
        return albums
    }

    async getAlbumTracks(albumId: number): Promise<Track[]> {
        const { data, error } = await supabase
            .from("track")
            .select("name, genre(name), media_type(name)")
            .eq("album_id", albumId)
        if (error) throw error
        if (data.length === 0) {
            throw new AlbumNotFound(albumId)
        }
        const tracks: Track[] = data.map((row: any) => ({
            name: row.name,
            genre_name: row.genre?.name ?? null,
            media_type_name: row.media_type?.name ?? null
        }))
        logger.debug(`received ${tracks.length} tracks for album ${albumId}`)
        return tracks
    }
}

const albumsService: AlbumsService = new AlbumsServiceSupabase()
export default albumsService
