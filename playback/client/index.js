console.log(location.pathname.split("/")[2])

import { PlaybackClient } from "./PlaybackClient";
let playbackClient = new PlaybackClient("ws://localhost:8080/playback/",location.pathname.split("/")[2])
