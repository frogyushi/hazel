import SpotifyUri from './spotify-uri';
export default class Show extends SpotifyUri {
    type: string;
    id: string;
    constructor(uri: string, id: string);
    static is(v: any): v is Show;
    toURI(): string;
    toURL(): string;
}
