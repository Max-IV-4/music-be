import { Album } from "../models/Album.js"
import { Track } from "../models/Track.js"

export default interface AlbumsService {
    getAllAlbums(): Promise<Album[]>
    getAlbumTracks(albumId: number): Promise<Track[]>
}
