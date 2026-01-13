

import { Flower1Icon, Flower2Icon, Flower3Icon, Flower4Icon, Flower5Icon } from "src/components/svgs";

const Flowericons =
    [<Flower1Icon />, <Flower2Icon />, <Flower3Icon />, <Flower4Icon />, < Flower5Icon />];

const RankColors = ["#78CBCF", "#66B5FE", "#9e62f1", "#f449e2", "#ff6f65", "#ff6f65", "#fce035"];

const combinations = [
    {
        name: "Bust",
        flowers: [Flowericons[0], Flowericons[1], Flowericons[2], Flowericons[3], Flowericons[4]]
    },
    {
        name: "1 Pair",
        flowers: [Flowericons[0], Flowericons[0], Flowericons[2], Flowericons[3], Flowericons[4]]
    },
    {
        name: "2 Pair",
        flowers: [Flowericons[0], Flowericons[3], Flowericons[0], Flowericons[3], Flowericons[4]]
    },
    {
        name: "3 Oak",
        flowers: [Flowericons[0], Flowericons[0], Flowericons[0], Flowericons[3], Flowericons[4]]
    },
    {
        name: "Full House",
        flowers: [Flowericons[0], Flowericons[0], Flowericons[0], Flowericons[2], Flowericons[2]]
    },
    {
        name: "4 Oak",
        flowers: [Flowericons[0], Flowericons[0], Flowericons[0], Flowericons[0], Flowericons[4]]
    },
    {
        name: "5 Oak",
        flowers: [Flowericons[4], Flowericons[4], Flowericons[4], Flowericons[4], Flowericons[4]]
    }
]
const CombinationView = () => (
    <div className="flex flex-col space-y-1 mt-5">
        <div className="flex text-white text-sm">
            POSSIBLE COMBINATIONS
        </div>
        {
            combinations.map((item, j) => (
                <div key={j} className="flex justify-between items-center p-2 bg-panel rounded-sm">
                    <div className="flex space-x-1">
                        {
                            item.flowers.map((flower, i) => <div className="w-6 h-6" key={i}>{flower}</div>)
                        }
                    </div>
                    <div style={{ color: RankColors[j] }}>
                        {item.name}
                    </div>
                </div>
            ))
        }
    </div>
);

export default CombinationView;
