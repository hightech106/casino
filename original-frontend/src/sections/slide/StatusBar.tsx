import { useEffect, useRef, useState } from "react";

enum STATUS {
    WAITTING,
    STARTING,
    BETTING,
    PLAYING
}

interface Props {
    status: STATUS
}

const StatusBar = ({ status }: Props) => {
    const time = useRef<number>(-1);
    const [statustime, setstatustime] = useState(0);
    useEffect(() => {
        let interval: any;
        /* eslint-disable */
        switch (status) {
            case STATUS.BETTING:
                time.current = 2000;
                setstatustime(2000);
                interval = setInterval(() => {
                    if (time.current > 0) {
                        time.current--;
                        setstatustime(time.current);
                    }
                }, 10)
                break;
            case STATUS.PLAYING:
                time.current = -1;
                setstatustime(-1);
                break;
            case STATUS.STARTING:
                break;
            case STATUS.WAITTING:
                break;
            default:
                break;
        }
        /* eslint-enable */
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [status])


    return (
        <div className="w-full h-2 flex-col justify-between">
            {statustime === -1 && <></>}
            {statustime === 0 && <div className="text-white">Starting...</div>}
            {statustime > 0 && <div className="h-2 bg-cyan-600" style={{
                width: `${(100 / 2000) * statustime}%`
            }} />}
        </div>
    )

}

export default StatusBar;