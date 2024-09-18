import { NextPage } from "next";
import FlexDiv from "../styled/FlexDiv";
import { MainContainer } from "../styled/containers/MainContainer";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Player } from "../types/PlayerTypes";
import { makeSpotifyPlayer } from "../players/Spotify";
import Controls from "../components/Controls";
import InfoBar from "../components/InfoBar";

const Spootify: NextPage = () => {
  const [player, setPlayer] = useState<Player>();
  const [songName, setSongName] = useState<string>();
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = async () => {
      const cb = (p: Player) => setPlayer(p);
      makeSpotifyPlayer(cb);
    };
  }, []);

  useEffect(() => {
    if (player) {
      player.onTrackChange = (name: string) => setSongName(name);
    }
  }, [player]);

  return (
    <>
      <Script src="https://sdk.scdn.co/spotify-player.js"></Script>
      <MainContainer>
        <FlexDiv column>
          <Controls
            player={player}
            setAnimation={() => {}}
          />
        </FlexDiv>
        <FlexDiv column flex1>
          <InfoBar songName={songName} />
        </FlexDiv>
      </MainContainer>
    </>
  );
};

export default Spootify;
