import { useEffect, useState } from 'react';

enum GameStatus {
  WATTING,
  BETTING,
  CALCULATIONG,
}

const StatusBar = ({
  dt,
  delyTime,
  status,
}: {
  dt: number;
  delyTime: number;
  status: GameStatus;
}) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      const pro = (100 / delyTime) * (Date.now() - dt);
      setProgress(pro > 100 ? 100 : pro);
    }, 30);
    return () => {
      clearInterval(timer);
    };
  }, [dt, delyTime, status]);

  return (
    <div className="flex flex-col w-full">
      <p
        style={{
          color: status === GameStatus.CALCULATIONG ? '#ff682c' : '#2ddf2dde',
          fontSize: 10,
        }}
      >
        {GameStatus[status]}
      </p>

      <div className="text-white font-bold text-sm">
        {Math.floor((delyTime - (Date.now() - dt)) / 1000) + 1}s
      </div>
      <div className="flex w-full justify-start overflow-hidden rounded-md bg-[#4e4e4e]">
        <div
          className={`md:h-[3px] h-[2px] rounded-md ${
            status === GameStatus.CALCULATIONG ? 'bg-[#ff682c]' : 'bg-[#2ddf2dde]'
          }`}
          style={{ width: `${100 - progress}%` }}
        />
      </div>
    </div>
  );
};

export default StatusBar;
