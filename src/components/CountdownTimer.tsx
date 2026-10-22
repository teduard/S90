import { useEffect, useRef, useState } from "react";
import { Alert, Button } from "@cloudscape-design/components";

interface ICountdownTimerProps {
  durationSeconds?: number;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
};

const CountdownTimer = ({ durationSeconds = 90 }: ICountdownTimerProps) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [cancelled, setCancelled] = useState(false);

  const deadlineRef = useRef(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    deadlineRef.current = Date.now() + durationSeconds * 1000;

    const interval = setInterval(() => {
      if (cancelledRef.current) return;
      const left = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000),
      );
      setRemaining(left);
    }, 250);

    return () => clearInterval(interval);
  }, [durationSeconds]);

  const handleCancel = () => {
    cancelledRef.current = true;
    setCancelled(true);
    setRemaining(durationSeconds);
  };

  const handleRestart = () => {
    cancelledRef.current = false;
    deadlineRef.current = Date.now() + durationSeconds * 1000;
    setCancelled(false);
    setRemaining(durationSeconds);
  };

  const isFinished = !cancelled && remaining === 0;

  return (
    <div className="countdown-timer">
      <div className="countdown-timer-value">{formatTime(remaining)}</div>

      {isFinished && (
        <Alert type="error" header="Time is up!">
          The countdown has reached zero.
        </Alert>
      )}

      {cancelled && (
        <Alert type="info" header="Timer cancelled">
          The countdown was stopped and reset.
        </Alert>
      )}

      <div className="countdown-timer-actions">
        <Button variant="normal" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleRestart}>
          Restart
        </Button>
      </div>
    </div>
  );
};

export default CountdownTimer;
