import { Playlist } from "../models/Playlist.js"
import { Track } from "../models/Track.js"

export default interface PlaylistsService {
    getAllPlaylists(): Promise<Playlist[]>
    getPlaylistTracks(playlistId: number): Promise<Track[]>
}
