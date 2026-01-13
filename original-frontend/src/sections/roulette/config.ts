import betaudio from 'src/assets/audio/bet.mp3';
import spinaudio from 'src/assets/audio/spin.mp3';
import winaudio from 'src/assets/audio/win.mp3';
import loseaudio from 'src/assets/audio/lose.mp3';
import successaudio from 'src/assets/audio/success.wav';

const spinAuido = new Audio();

export const CHIP_VALUES = [1, 10, 100, 1000, 10000, 100000, 1000000];

export const WHEELNUMBERS = [
  { Number: 0, Color: 'Green' },
  { Number: 32, Color: 'Red' },
  { Number: 15, Color: 'Black' },
  { Number: 19, Color: 'Red' },
  { Number: 4, Color: 'Black' },
  { Number: 21, Color: 'Red' },
  { Number: 2, Color: 'Black' },
  { Number: 25, Color: 'Red' },
  { Number: 17, Color: 'Black' },
  { Number: 34, Color: 'Red' },
  { Number: 6, Color: 'Black' },
  { Number: 27, Color: 'Red' },
  { Number: 13, Color: 'Black' },
  { Number: 36, Color: 'Red' },
  { Number: 11, Color: 'Black' },
  { Number: 30, Color: 'Red' },
  { Number: 8, Color: 'Black' },
  { Number: 23, Color: 'Red' },
  { Number: 10, Color: 'Black' },
  { Number: 5, Color: 'Red' },
  { Number: 24, Color: 'Black' },
  { Number: 16, Color: 'Red' },
  { Number: 33, Color: 'Black' },
  { Number: 1, Color: 'Red' },
  { Number: 20, Color: 'Black' },
  { Number: 14, Color: 'Red' },
  { Number: 31, Color: 'Black' },
  { Number: 9, Color: 'Red' },
  { Number: 22, Color: 'Black' },
  { Number: 18, Color: 'Red' },
  { Number: 29, Color: 'Black' },
  { Number: 7, Color: 'Red' },
  { Number: 28, Color: 'Black' },
  { Number: 12, Color: 'Red' },
  { Number: 35, Color: 'Black' },
  { Number: 3, Color: 'Red' },
  { Number: 26, Color: 'Black' },
];

let isSoundEnable = false;

export const playAudio = (key: string, bool?: boolean) => {
  if (!isSoundEnable) return;
  try {
    if (key === 'bet') {
      if (betaudio) {
        const auido = new Audio();
        auido.src = betaudio;
        auido
          .play()
          .then(() => {})
          .catch((error: any) => {
            console.log('Failed to autoplay audio:', error);
          });
      }
    } else if (key === 'success') {
      if (successaudio) {
        const auido = new Audio();
        auido.src = loseaudio;
        auido.volume = 0.5;
        auido
          .play()
          .then(() => {})
          .catch((error: any) => {
            console.log('Failed to autoplay audio:', error);
          });
      }
    } else if (key === 'spin') {
      if (spinaudio) {
        if (spinAuido.src === '') {
          spinAuido.src = spinaudio;
          spinAuido.loop = false;
          spinAuido.volume = 0.7;
        }
        if (bool) {
          spinAuido
            .play()
            .then(() => {})
            .catch((error: any) => {
              console.log('Failed to autoplay audio:', error);
            });
        } else {
          spinAuido.pause();
        }
      }
    } else if (key === 'win') {
      const audio = new Audio();
      audio.src = winaudio;
      audio
        .play()
        .then(() => {})
        .catch((error: any) => {
          console.log('Failed to autoplay audio:', error);
        });
    } else if (key === 'loss') {
      const audio = new Audio();
      audio.src = loseaudio;
      audio
        .play()
        .then(() => {})
        .catch((error: any) => {
          console.log('Failed to autoplay audio:', error);
        });
    }
  } catch (error) {
    console.log(error);
  }
};

export const enableSound = () => {
  isSoundEnable = true;
};
