import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import SwitchTab from 'src/components/custom/SwitchTab';
import { CopyIcon } from 'src/components/svgs';
import CustomInput from 'src/components/custom/CustomInput';

import { generateHash } from 'src/utils/custom';

import bombImg from 'src/assets/images/games/bomb.png';
import { GRIDS, hashToColumnPosition } from './config';

interface Props {
  publicSeed: string;
  privateHash: string;
  privateSeed: string;
}

const FairnessView = ({ publicSeed, privateHash, privateSeed }: Props) => {
  const [active, setActiveTab] = useState(0);
  const [_privateSeed, setPrivateSeed] = useState('');
  const [_publicSeed, setPublicSeed] = useState('');
  const [activeLevel, setLevel] = useState<0 | 1 | 2>(0);
  const [bombs, setBombs] = useState<number[]>([]);
  const currentGrid = GRIDS[activeLevel];

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  useEffect(() => {
    setPrivateSeed(privateSeed);
  }, [privateSeed]);

  useEffect(() => {
    setPublicSeed(publicSeed);
  }, [publicSeed]);

  useEffect(() => {
    if (_privateSeed !== '' && _publicSeed !== '') {
      const _bombs = [];
      for (let i = 0; i < currentGrid.h; i += 1) {
        const roundHash = generateHash(_privateSeed + _publicSeed + i);
        _bombs.push(hashToColumnPosition(roundHash, currentGrid.w));
      }
      setBombs(_bombs);
    }
  }, [_privateSeed, _publicSeed, activeLevel]);

  return (
    <>
      <SwitchTab
        options={['Seeds', 'Verify']}
        active={active}
        onChange={(e) => setActiveTab(e)}
        type="sub"
      />
      {active === 0 ? (
        <>
          <CustomInput
            disabled
            value={_privateSeed === '' ? publicSeed : ''}
            label="Active Client Seed"
            type="text"
            icon={
              <button
                type="button"
                onClick={() => copyToClipboard(publicSeed)}
                className="px-1 py-2 w-full "
              >
                <CopyIcon />
              </button>
            }
          />
          <CustomInput
            disabled
            value={_privateSeed === '' ? privateHash : ''}
            label="Active Server Seed (Hashed)"
            type="text"
            icon={
              <button
                type="button"
                onClick={() => copyToClipboard(privateHash)}
                className="px-1 py-2 w-full "
              >
                <CopyIcon />
              </button>
            }
          />

          <div className="mt-4" />
          <CustomInput
            disabled
            value={_privateSeed === '' ? '' : _publicSeed}
            label="Previous Client Seed "
            type="text"
            icon={
              <button
                type="button"
                onClick={() => copyToClipboard(publicSeed)}
                className="px-1 py-2 w-full "
              >
                <CopyIcon />
              </button>
            }
          />
          <CustomInput
            disabled
            value={_privateSeed === '' ? '' : _privateSeed}
            label="Previous Server Seed"
            type="text"
            icon={
              <button
                type="button"
                onClick={() => copyToClipboard(privateHash)}
                className="px-1 py-2 w-full "
              >
                <CopyIcon />
              </button>
            }
          />
        </>
      ) : (
        <>
          <div className="p-2 border-dashed mt-3 px-5 border-[1px] min-h-52 border-[#3dff23b4] rounded-md flex items-center justify-center font-bold text-[20px]">
            <div className="flex flex-col space-y-[1px] w-[300px]">
              {Array.from({ length: currentGrid.h }).map((_, index) => {
                const postion = currentGrid.h - index - 1;
                return (
                  <div className="flex space-x-[1px] w-full" key={index}>
                    {Array.from({ length: currentGrid.w }).map((e, indexw) => (
                      <div
                        className="flex items-center justify-cente bg-[#538124b4] relative"
                        style={{ width: `${100 / currentGrid.w}%` }}
                        key={indexw}
                      >
                        <div className="w-full aspect-[1/0.5]" />
                        {indexw === bombs[postion] && (
                          <div className="absolute flex justify-center items-center w-full">
                            <img src={bombImg} className="w-[20%] animate-zoom" alt="" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <SwitchTab
            options={['Small', 'Middle', 'Big']}
            type="sub"
            onChange={(v) => {
              setLevel(v as 0 | 1 | 2);
            }}
            active={activeLevel}
          />
          <CustomInput
            onChange={setPrivateSeed}
            value={_privateSeed}
            label="Server Seed"
            type="text"
          />
          <CustomInput
            disabled
            value={_privateSeed === '' ? '' : generateHash(_privateSeed || '')}
            label="Server Seed(Hash)"
            type="text"
          />
          <CustomInput
            onChange={setPublicSeed}
            value={_publicSeed}
            label="Client Seed"
            type="text"
          />
        </>
      )}
    </>
  );
};

export default FairnessView;
