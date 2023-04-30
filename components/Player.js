import NchanSubscriber from "nchan";
import PlayerAudio from "./PlayerAudio";
import PlayerImage from "./PlayerImage";
import PlayerVolume from "./PlayerVolume";
import { useState, useEffect, useRef } from "react";
import playerStyles from "../styles/Player.module.css";

function Player() {
  const streamInfo = useRef(null);
  const [, setForceUpdate] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(process.env.NEXT_PUBLIC_NOWPLAYING_ENDPOINT);

    socket.onopen = function(e) {
      socket.send(JSON.stringify({
        "subs": {
          "station:melocue": {}
        }
      }));
    }

    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      const np = data?.pub?.data?.np || null;
      if (np) {        
        streamInfo.current = np;
        setForceUpdate(Date.now());        
      }
    }    
  }, []);

      // let opt = {
    //   subscriber: "websocket",
    //   reconnect: "persist",
    // };

    // const sub = new NchanSubscriber(
    //   process.env.NEXT_PUBLIC_NOWPLAYING_ENDPOINT,
    //   opt
    // );
    // sub.start();

    // sub.on("message", function (message) {
    //   streamInfo.current = JSON.parse(message);
    //   setForceUpdate(Date.now());
    // });

    // return function cleanup() {
    //   sub.stop();
    // };

  return (
    <div className={playerStyles.container}>
      <PlayerImage stream={streamInfo} />
      <PlayerAudio stream={streamInfo} />
      <PlayerVolume />
    </div>
  );
}

export default Player;
