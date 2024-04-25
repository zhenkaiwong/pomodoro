import React from "react";
import { ClockModeProps, FOCUS_MODE } from "../utils/clockMode";

type ButtonProps = {
  text: string;
  clickHandle: () => void;
  isClockRunning: boolean;
} & ClockModeProps;

const Button = (props: ButtonProps) => {
  const { text, clickHandle, isClockRunning, clockMode } = props;
  return (
    <div
      className={`hover:cursor-pointer bg-neutral text-5xl rounded-lg w-32 h-16 flex flex-col justify-center ${
        clockMode === FOCUS_MODE ? "text-focus" : "text-rest"
      } ${!isClockRunning ? "shadow-button" : "shadow-none translate-y-1"}`}
      onClick={clickHandle}
    >
      <span>{text}</span>
    </div>
  );
};

export default Button;
