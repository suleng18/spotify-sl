'use client';

import useSound from 'use-sound';
import { useEffect, useState } from 'react';
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai';

import { Song } from '@/types';
import usePlayer from '@/hooks/usePlayer';

import LikeButton from './LikeButton';
import MediaItem from './MediaItem';
import Slider from './Slider';

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  };

  const onPlayPrev = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ['mp3'],
  });

  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  return (
    <div className="grid h-full grid-cols-2 md:grid-cols-3">
      <div className="flex justify-start w-full">
        <div className="flex items-center gap-x-4">
          <MediaItem data={song} />
          <LikeButton songId={song.id} />
        </div>
      </div>

      <div className="flex items-center justify-end w-full col-auto md:hidden">
        <div
          onClick={() => {}}
          className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-full cursor-pointer"
        >
          <Icon size={30} className="text-black" />
        </div>
      </div>

      <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
        <AiFillStepBackward
          onClick={onPlayPrev}
          size={30}
          className="transition cursor-pointer text-neutral-400 hover:text-white"
        />
        <div
          className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-full cursor-pointer"
          onClick={handlePlay}
        >
          <Icon size={30} className="text-black" />
        </div>
        <AiFillStepForward
          onClick={onPlayNext}
          size={30}
          className="transition cursor-pointer text-neutral-400 hover:text-white"
        />
      </div>

      <div className="justify-end hidden w-full pr-2 md:flex">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon size={34} onClick={toggleMute} className="cursor-pointer" />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;

// https://youtu.be/2aeMRB8LL4o?list=PL4ijJLFXAjusx7JJnv6aunjNuX_bCWw4R
