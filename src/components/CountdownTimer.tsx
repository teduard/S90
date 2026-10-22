import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button } from "@cloudscape-design/components";

interface ICountdownTimerProps {
  durationSeconds?: number;
}

const STORAGE_KEY = "s90.countdown";
const ALARM_URL = `${import.meta.env.BASE_URL}assets/alarm.mp3`;

interface IStoredTimer {
  /** Absolute epoch timestamp (ms) when the countdown reaches zero. */
  deadline: number;
  cancelled: boolean;
  durationSeconds: number;
}

const readStoredTimer = (): IStoredTimer | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as IStoredTimer;
    if (
      typeof parsed?.deadline !== "number" ||
      typeof parsed?.cancelled !== "boolean"
    ) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn("CountdownTimer: unable to read stored timer:", error);
    return null;
  }
};

const writeStoredTimer = (value: IStoredTimer) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.warn("CountdownTimer: unable to store timer:", error);
  }
};

const formatTime = (seconds: number) => `${seconds}`;

const CountdownTimer = ({ durationSeconds = 5 }: ICountdownTimerProps) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [cancelled, setCancelled] = useState(false);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [alarmPlaying, setAlarmPlaying] = useState(false);

  const deadlineRef = useRef(0);
  const cancelledRef = useRef(false);
  const armedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isFinished = !cancelled && remaining === 0;

  const playAlarm = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio
      .play()
      .then(() => {
        setSoundBlocked(false);
        setAlarmPlaying(true);
      })
      .catch((error: unknown) => {
        // Browsers block autoplay until the user interacts with the page.
        console.warn("CountdownTimer: alarm playback was blocked:", error);
        setSoundBlocked(true);
      });
  }, []);

  const stopAlarm = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setAlarmPlaying(false);
  }, []);

  // Restores the countdown from localStorage, or starts a fresh one.
  const applyStored = useCallback(
    (stored: IStoredTimer | null) => {
      if (stored && stored.durationSeconds === durationSeconds) {
        deadlineRef.current = stored.deadline;
        cancelledRef.current = stored.cancelled;
        setCancelled(stored.cancelled);

        const left = stored.cancelled
          ? durationSeconds
          : Math.max(0, Math.ceil((stored.deadline - Date.now()) / 1000));
        setRemaining(left);
        // Only ring the alarm for a countdown that is still running.
        armedRef.current = !stored.cancelled && left > 0;
        return;
      }

      const deadline = Date.now() + durationSeconds * 1000;
      deadlineRef.current = deadline;
      cancelledRef.current = false;
      armedRef.current = true;
      setCancelled(false);
      setRemaining(durationSeconds);
      writeStoredTimer({ deadline, cancelled: false, durationSeconds });
    },
    [durationSeconds],
  );

  useEffect(() => {
    const audio = new Audio(ALARM_URL);
    audio.preload = "auto";
    audioRef.current = audio;

    const handleEnded = () => setAlarmPlaying(false);
    audio.addEventListener("ended", handleEnded);

    // Restore on the next tick so the initial render stays free of side effects.
    const timeout = setTimeout(() => {
      applyStored(readStoredTimer());
    }, 0);

    const interval = setInterval(() => {
      if (cancelledRef.current) return;
      setRemaining(
        Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000)),
      );
    }, 250);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [applyStored]);

  // Keep other open tabs in sync with the stored countdown.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      applyStored(readStoredTimer());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [applyStored]);

  // Ring the alarm when a running countdown reaches zero.
  useEffect(() => {
    if (!isFinished) return;
    if (!armedRef.current) return;
    armedRef.current = false;
    playAlarm();
  }, [isFinished, playAlarm]);

  // If the browser blocked the alarm, play it on the next user interaction.
  useEffect(() => {
    if (!soundBlocked) return;

    const handleGesture = () => playAlarm();
    window.addEventListener("pointerdown", handleGesture, { once: true });
    return () => window.removeEventListener("pointerdown", handleGesture);
  }, [soundBlocked, playAlarm]);

  const handleCancel = () => {
    const deadline = Date.now() + durationSeconds * 1000;
    deadlineRef.current = deadline;
    cancelledRef.current = true;
    armedRef.current = false;
    setCancelled(true);
    setRemaining(durationSeconds);
    writeStoredTimer({ deadline, cancelled: true, durationSeconds });
  };

  const handleRestart = () => {
    const deadline = Date.now() + durationSeconds * 1000;
    deadlineRef.current = deadline;
    cancelledRef.current = false;
    armedRef.current = true;
    setCancelled(false);
    setRemaining(durationSeconds);
    writeStoredTimer({ deadline, cancelled: false, durationSeconds });
  };

  return (
    <div className="countdown-timer">
      <div className="countdown-timer-value">
        {formatTime(remaining)}
        <span className="countdown-timer-unit">seconds</span>
      </div>

      {isFinished && (
        <Alert type="error" header="Time is up!">
          The countdown has reached zero.
        </Alert>
      )}

      {soundBlocked && !alarmPlaying && (
        <Alert type="warning" header="Alarm sound blocked">
          <div className="countdown-timer-sound-blocked">
            <span>Your browser blocked the alarm. Click to play it now.</span>
            <Button variant="primary" onClick={playAlarm}>
              Play alarm
            </Button>
          </div>
        </Alert>
      )}

      {cancelled && (
        <Alert type="info" header="Timer cancelled">
          The countdown was stopped and reset.
        </Alert>
      )}

      {alarmPlaying ? (
        <div className="countdown-timer-actions">
          <Button variant="primary" onClick={stopAlarm}>
            Stop alarm
          </Button>
        </div>
      ) : (
        <div className="countdown-timer-actions">
          <Button variant="normal" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRestart}>
            Restart
          </Button>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
