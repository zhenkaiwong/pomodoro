import React, { HTMLProps } from "react";
import { ClockModeProps, FOCUS_MODE } from "../utils/clockMode";
import { Jersey_10 } from "next/font/google";

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
        !isClockRunning ? "shadow-button" : "shadow-none translate-y-1"
      } ${clockMode === FOCUS_MODE ? "text-focus" : "text-rest"}`}
      onClick={clickHandle}
    >
      <span>{text}</span>
    </div>
  );
};

export default Button;
