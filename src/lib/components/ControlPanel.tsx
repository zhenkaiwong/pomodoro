"use client";
import { ClockModeProps } from "../utils/clockMode";
import Button from "./Button";

export type ControlPanelProps = {
  isClockRunning: boolean;
  startButtonClickHandle: () => void;
  pauseButtonClickHandle: () => void;
  stopButtonClickHandle: () => void;
} & ClockModeProps;

const ControlPanel = (props: ControlPanelProps) => {
  const {
    isClockRunning,
    startButtonClickHandle,
    pauseButtonClickHandle,
    stopButtonClickHandle,
    clockMode,
  } = props;
  return (
    <div>
      <Button
        text={!isClockRunning ? "START" : "PAUSE"}
        isClockRunning={isClockRunning}
        clockMode={clockMode}
        clickHandle={
          !isClockRunning ? startButtonClickHandle : pauseButtonClickHandle
        }
      />
      {/* <Button text="STOP" clickHandle={stopButtonClickHandle} /> */}
    </div>
  );
};

export default ControlPanel;
