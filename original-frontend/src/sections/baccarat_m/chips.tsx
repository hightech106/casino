import { useMediaQuery, useTheme } from "@mui/material";

import { ChipButton } from "src/components/custom/ChipButtonGroup";

import { IChip, IPlace } from "./type";
import { CHIP_VALUES } from "./config";

interface Props {
    chips: {
        playerId: string,
        chip: IChip,
        place: IPlace,
        x: number,
        y: number,
        r: number,
        self?: boolean
    }[],
    label: string
}

const PlacedChips = ({ chips, label }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <div className="absolute left-1/2 top-1/2" >
            <div className="relative">
                {chips.map((chip, i: number) => (
                    <div
                        className={`w-[0px] h-[0px] ${chip.self ? "animate-actionChip" : "animate-actionChip1"}`}
                        key={i}
                        style={{
                            translate: `${isMobile ? (chip.x) / 10 : (chip.x)}px ${isMobile ? (chip.y) / 10 : (chip.y)}px`,
                            transform: `rotateZ(${chip.r}deg)`
                        }}
                    >
                        <ChipButton
                            value={CHIP_VALUES[chip.chip]}
                            style={isMobile ? { minWidth: "15px !important", maxWidth: "15px", maxheight: "15px", minHeight: "15px", fontSize: "6px" } :
                                { minWidth: "25px !important", maxWidth: "25px", fontSize: "10px" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlacedChips;