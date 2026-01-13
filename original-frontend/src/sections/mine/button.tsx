import { ExpolitionBombSvg, JewlSvg } from 'src/components/svgs';

import { MINE_OBJECT, MineArea } from './types';
import mineEffect from './assets/mineEffect.webp';

export const MINE_API = '/mine';

interface Props {
  point: number;
  mine: MineArea | undefined;
  isAuto: boolean;
  onClick: (point: number) => void;
}

const MineButton = ({ point, mine, isAuto, onClick }: Props) => {
  const handleClick = () => {
    onClick(point);
  };

  const renderMineContent = (area: MineArea | undefined) => {
    if (!area?.mined) return null;

    const isGem = area.mine === MINE_OBJECT.GEM;
    const isBomb = area.mine === MINE_OBJECT.BOMB;

    if (isGem) {
      return (
        <div className="animate-bounding flex justify-center items-center">
          <JewlSvg />
        </div>
      );
    }

    if (isBomb) {
      return (
        <div className="animate-bounding flex justify-center items-center relative">
          <img src={mineEffect} alt="mine" className="z-10 absolute inset-0 w-full h-full" />
          <ExpolitionBombSvg />
        </div>
      );
    }

    return null;
  };

  const renderHiddenMineContent = (area: MineArea | undefined) => {
    if (area?.mined) return null;

    const isGem = area?.mine === MINE_OBJECT.GEM;
    const isBomb = area?.mine === MINE_OBJECT.BOMB;

    if (isGem) {
      return (
        <div className="animate-bounding flex justify-center items-center opacity-40">
          <JewlSvg />
        </div>
      );
    }

    if (isBomb) {
      return (
        <div className="animate-bounding flex justify-center items-center opacity-40">
          <ExpolitionBombSvg />
        </div>
      );
    }

    return null;
  };

  const svgContent = renderMineContent(mine) || renderHiddenMineContent(mine) || (
    <div className="w-full relative pb-full" />
  );

  return (
    <button
      type="button"
      className={
        (mine?.mine &&
          `p-2 w-full h-full rounded-lg aspect-square bg-[#071824] 
          ${isAuto && 'border-[5px] border-[#9000ff]'}`) ||
        (mine
          ? `p-2 animate-bounding1 w-full h-full rounded-lg aspect-square 
          ${isAuto ? 'bg-[#9000ff]' : 'bg-[#395985]'}`
          : `p-2 w-full h-full rounded-lg aspect-square ${
              isAuto ? 'bg-[#9000ff]' : 'bg-[#395985]'
            }`)
      }
      onClick={handleClick}
    >
      {svgContent}
    </button>
  );
};

export default MineButton;
