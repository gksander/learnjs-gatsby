import * as React from "react";
import { Player } from "video-react";

const AppVideo: React.FC<{ src: string }> = ({ src }) => (
  <div className="rounded overflow-hidden border shadow mx-auto max-w-xl mb-4">
    <Player src={src} playsInline />
  </div>
);

export default AppVideo;
