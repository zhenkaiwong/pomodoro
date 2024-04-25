"use client";

import { useEffect, useState } from "react";
import ControlPanel, { ControlPanelProps } from "./ControlPanel";
import { Jersey_10 } from "next/font/google";
import * as ClockMode from "../utils/clockMode";

type ClockState = {
  isRunning: boolean;
  mode: "focus" | "rest";
  duration: number;
  audio: {
    background: {
      focus: HTMLAudioElement | null;
      rest: HTMLAudioElement | null;
    };
    effect: {
      button: {
        click: HTMLAudioElement | null;
      };
    };
  };
};

type ClockProps = {
  focusDuration: number;
  restDuration: number;
};

const jerseyFont = Jersey_10({ weight: "400", subsets: ["latin"] });

const Clock = (props: ClockProps) => {
  const { FOCUS_MODE, REST_MODE } = ClockMode;
  const { focusDuration, restDuration } = props;
  const getNewFocusDuration = () => {
    return focusDuration * 60;
  };
  const getNewRestDuration = () => {
    return restDuration * 60;
  };
  const getDurationString = (duration: number): string => {
    const min = Math.floor(duration / 60);
    const seconds = duration % 60;

    const getTimeInTwoDigits = (time: number) =>
      time.toLocaleString("en-US", { minimumIntegerDigits: 2 });

    return `${getTimeInTwoDigits(min)}:${getTimeInTwoDigits(seconds)}`;
  };

  const [clockState, setClockState] = useState<ClockState>({
    isRunning: false,
    mode: FOCUS_MODE,
    duration: getNewFocusDuration(),
    audio: {
      background: {
        focus: null,
        rest: null,
      },
      effect: {
        button: {
          click: null,
        },
      },
    },
  });

  useEffect(() => {
    const focus = new Audio("/audios/background-music-focus.mp3");
    const rest = new Audio("/audios/background-music-rest.mp3");
    const click = new Audio("/audios/button-click.mp3");

    focus.loop = true;
    rest.loop = true;

    setClockState((previousClockState) => ({
      ...previousClockState,
      audio: {
        background: {
          focus,
          rest,
        },
        effect: {
          button: {
            click,
          },
        },
      },
    }));
  }, []);

  useEffect(() => {
    const interval =
      clockState.isRunning &&
      setInterval(() => {
        setClockState((previousClockState) => {
          const { duration, mode } = previousClockState;

          if (duration === 0) {
            if (mode === FOCUS_MODE) {
              playRestBackgroundMusic(true);
              return {
                ...previousClockState,
                duration: getNewRestDuration(),
                mode: REST_MODE,
              };
            } else {
              playFocusBackgroundMusic(true);
              return {
                ...previousClockState,
                duration: getNewFocusDuration(),
                mode: FOCUS_MODE,
              };
            }
          }
          return { ...previousClockState, duration: duration - 1 };
        });
      }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [clockState.isRunning]);

  const playFocusBackgroundMusic = (startFromBeginning: boolean = false) => {
    const { focus, rest } = clockState.audio.background;
    if (!focus || !rest) {
      console.error("Unable to play focus or rest background music");
      return;
    }
    if (!rest.paused) {
      rest.pause();
    }

    if (focus.paused) {
      if (startFromBeginning) {
        focus.currentTime = 0;
      }
      focus.play();
    }
  };

  const playRestBackgroundMusic = (startFromBeginning: boolean = false) => {
    const { focus, rest } = clockState.audio.background;
    if (!focus || !rest) {
      console.error("Unable to play focus or rest background music");
      return;
    }
    if (!focus.paused) {
      focus.pause();
    }
    if (rest.paused) {
      if (startFromBeginning) {
        rest.currentTime = 0;
      }
      rest.play();
    }
  };

  const pauseBackgroundMusic = () => {
    const { focus, rest } = clockState.audio.background;
    if (!focus || !rest) {
      console.error("Unable to play focus or rest background music");
      return;
    }
    if (!rest.paused) {
      rest.pause();
    }

    if (!focus.paused) {
      focus.pause();
    }
  };

  const playButtonClickSoundEffect = () => {
    if (!clockState.audio.effect.button.click) {
      console.error("Unable to play button click sound effect");
      return;
    }
    clockState.audio.effect.button.click.play();
  };

  const buttonClickHandle = () => {
    playButtonClickSoundEffect();
  };

  const startButtonClickHandle = () => {
    buttonClickHandle();
    if (clockState.mode === FOCUS_MODE) {
      playFocusBackgroundMusic();
    } else {
      playRestBackgroundMusic();
    }

    setClockState((previousClockState) => ({
      ...previousClockState,
      isRunning: true,
    }));
  };
  const pauseButtonClickHandle = () => {
    buttonClickHandle();
    pauseBackgroundMusic();
    setClockState((previousClockState) => ({
      ...previousClockState,
      isRunning: false,
    }));
  };
  const stopButtonClickHandle = () => {
    buttonClickHandle();
    pauseBackgroundMusic();
    setClockState((previousClockState) => ({
      ...previousClockState,
      isRunning: false,
      mode: FOCUS_MODE,
      duration: getNewFocusDuration(),
    }));
  };

  const controlPanelProps: ControlPanelProps = {
    isClockRunning: clockState.isRunning,
    clockMode: clockState.mode,
    startButtonClickHandle,
    pauseButtonClickHandle,
    stopButtonClickHandle,
  };

  return (
    <main
      className={`${jerseyFont.className} ${
        clockState.mode === FOCUS_MODE ? "bg-focus" : "bg-rest"
      } transition-colors duration-500 text-white w-screen h-screen flex flex-col justify-center items-center text-center`}
    >
      <section>
        <div className="mb-5 underline text-8xl">
          <p>{clockState.mode.toUpperCase()}</p>
        </div>
        <div>
          <p className={`text-6xl`}>{getDurationString(clockState.duration)}</p>
        </div>
      </section>
      <section className="mt-5">
        <ControlPanel {...controlPanelProps} />
      </section>
    </main>
  );
};

export default Clock;
