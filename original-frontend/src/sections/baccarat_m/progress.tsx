import { useEffect, useState } from "react";

type Props = { elapsed: number, delay: number, disabled: boolean }

const ProgressBar = ({ elapsed, delay, disabled }: Props) => {

    const [progress, setPercent] = useState<number>(100);

    useEffect(() => {
        if (progress > 0 && delay && (elapsed + delay) > Date.now()) {
            setTimeout(() => {
                setPercent((100 / delay) * (Date.now() - elapsed));
            }, 80)
        }
    }, [progress, elapsed]);

    return (
        <div className="px-2">
            <div className="flex w-full md:h-[5px] h-[3px] bg-[#181818] rounded-sm">
                <div
                    className="h-full  transition-all duration-75 "
                    style={{
                        width: `${100 - progress}%`,
                        backgroundColor: disabled ? "#c58634" : "#1b8b46"
                    }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;

