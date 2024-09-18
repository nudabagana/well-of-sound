import { NextPage } from "next";
import Script from "next/script";
import { useEffect } from "react";
import Controls from "../components/Controls";
import InfoBar from "../components/InfoBar";
import { usePlayerContext } from "../context/playerContext";
import { makeSpotifyPlayer } from "../players/Spotify";
import FlexDiv from "../styled/FlexDiv";
import { MainContainer } from "../styled/containers/MainContainer";
import { Player } from "../types/PlayerTypes";

const Spootify: NextPage = () => {
  const { setPlayer, player } = usePlayerContext();

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = async () => {
      const cb = (p: Player) => setPlayer(p);
      makeSpotifyPlayer(cb);
    };
  }, [setPlayer]);

  return (
    <>
      <Script src="https://sdk.scdn.co/spotify-player.js"></Script>
      <MainContainer>
        <FlexDiv column>
          <Controls animation={undefined} setAnimation={() => {}} />
        </FlexDiv>
        <FlexDiv column flex1>
          <InfoBar />
        </FlexDiv>
      </MainContainer>
    </>
  );
};

export default Spootify;
