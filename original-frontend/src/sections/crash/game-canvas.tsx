import { useEffect, useRef, useState } from 'react';

import crash from '../../assets/crash/crash.png';
import snowimg from '../../assets/crash/snow.png';
import rocket_explosion from '../../assets/crash/rocket-explosion.png';

interface propsState {
  status: number;
  payout: number;
  startTime: number;
}

const GAME_STATES = {
  NotStarted: 1,
  Starting: 2,
  InProgress: 3,
  Over: 4,
  Blocking: 5,
  Refunded: 6,
};

const crashImage = new Image();
crashImage.srcset = crash;

const snowImg = new Image();
snowImg.srcset = snowimg;

const explosionImage = new Image();
explosionImage.srcset = rocket_explosion;

const STARS: any[] = [];
let RX_N: number = 1;
let RY_N: number = 1;

const GAME_INFO: any = {
  prePayout: 0,
  preTimoeOut: 0,
  x: 100,
  y: 0,
  camerax: 0,
  cameray: 0,
  angle: -Math.PI / 6,
  X_RULER: [],
  Y_RULER: [],
  PARTICLES: [],
};

let TIME_DT: number = 0;
let PRE_TIME: number = 0;
let PRE_PAYOUT: number = 0;
let PAY_OUT: number = 1;
/* eslint-disable */
const GameCanvas = (_infos: propsState) => {
  const ref = useRef(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();

  const loop = () => {
    if (canvas) {
      if (new Date().getTime() - TIME_DT > 4) {
        TIME_DT = new Date().getTime();
      } else {
        return;
      }
      const { status, payout, startTime } = _infos;
      const ctx = canvas.getContext('2d');
      const width: number = canvas.clientWidth;
      const height: number = canvas.clientHeight - 50;
      const heightSpeed = height / 50;
      const widthSpeed = width / 100;
      const crashWidth = width * 0.3;
      let statusText = '';
      let subText = '';
      let currentTime = new Date().getTime();
      if (status === GAME_STATES.Over) {
        PAY_OUT = payout;
        statusText = `${PAY_OUT.toFixed(2)}x`;
        subText = 'Current payout';
      } else if (status === GAME_STATES.InProgress) {
        PAY_OUT = payout;
        statusText = `${payout.toFixed(2)}x`;
        subText = 'Current payout';
        PRE_PAYOUT = (PAY_OUT - 1) * 10;
        PRE_TIME = (currentTime - new Date(startTime).getTime()) / 100;
      } else {
        const endTime = new Date(new Date(startTime).getTime());
        let timeCount = Math.floor((endTime.getTime() - currentTime) / 10) / 100;
        if (timeCount < 0) {
          statusText = 'waiting...';
        } else {
          statusText = `${timeCount.toFixed(1)}0s`;
        }
        subText = 'Starting...';
      }

      let speedx = 0;
      let speedy = 0;
      if (status === GAME_STATES.InProgress) {
        GAME_INFO.angle = -Math.atan2(PRE_PAYOUT, PRE_TIME) / 10 - Math.PI / 6;
        speedx = (widthSpeed * PRE_TIME - GAME_INFO.x) / 50;
        speedy = (height - heightSpeed * PRE_PAYOUT - GAME_INFO.y) / 50;
        if (speedx > 0) {
          GAME_INFO.x += speedx;
        }
        GAME_INFO.y += speedy;
        if (GAME_INFO.x > width * 0.85) {
          GAME_INFO.camerax = -GAME_INFO.x + width * 0.85;
        }
        if (GAME_INFO.y < height * 0.35) {
          GAME_INFO.cameray = -GAME_INFO.y + height * 0.35;
        }
      } else {
        if (status !== GAME_STATES.Over) {
          GAME_INFO.camerax = 0;
          GAME_INFO.cameray = 0;
          GAME_INFO.x = 70;
          GAME_INFO.y = height;
          GAME_INFO.angle = -Math.PI / 6;
          GAME_INFO.PARTICLES = [];
          RX_N = 1;
          RY_N = 1;
          PRE_TIME = 0;
          PAY_OUT = 1;
        } else {
          if (GAME_INFO.X_RULER[0] && GAME_INFO.X_RULER[0].n !== 1) {
            if (GAME_INFO.X_RULER.length > 0) {
              GAME_INFO.X_RULER = [];
            }
            if (GAME_INFO.Y_RULER.length > 0) {
              GAME_INFO.Y_RULER = [];
            }
          }
          if (GAME_INFO.PARTICLES.length === 0) {
            let n = Math.random() * 6;
            for (var a = 0; a < n; a++) {
              GAME_INFO.PARTICLES.push({
                x: GAME_INFO.x + Math.random() * 3,
                y: GAME_INFO.y + Math.random() * 3,
                t: 10 + Math.random() * 50,
                a: Math.random() * Math.PI * 2,
                s: 40 + Math.random() * 40,
              });
            }
          }
        }
      }

      if (ctx) {
        ctx.clearRect(0, 0, width, canvas.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.save();
        ctx.font = `${height * 0.12}px Public Sans,sans-serif`;
        ctx.fillText(statusText, width / 2, height * 0.23);
        ctx.font = `${height * 0.04}px Public Sans,sans-serif`;
        ctx.fillText(subText, width / 2, height * 0.33);
        ctx.restore();
        ctx.font = '15px Arial';
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'white';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'end';
        let _runtime = PRE_TIME < 50 ? 50 : PRE_TIME;
        let rxn = _runtime / 10 / RX_N;
        let rxw = width / rxn;
        if (rxw < width * 0.15) {
          // Time incrasing per 3s
          RX_N += 2;
        }
        // time line
        for (var r_x = 0; r_x <= Math.floor(rxn); r_x++) {
          ctx.fillText(`${(r_x * RX_N).toFixed(1)}s`, rxw * r_x + 50, canvas.height - 20);
        }
        let ryn = PAY_OUT < 4 ? 4 / RY_N : PAY_OUT / RY_N;
        let oddSpacing = height / ryn - 15;
        if (oddSpacing < height * 0.15) {
          // Odd incrasing x3
          RY_N += 2;
        }

        let oddCount = Math.floor(ryn) + 2; // default oddx display

        for (var oindex = oddCount; 0 <= oindex; oindex--) {
          // if (oindex != oddCount) {
          //   ctx.beginPath();
          //   let _ry1 = height - (oddSpacing * oindex - oddSpacing / 2);
          //   ctx.moveTo(40, _ry1);
          //   ctx.lineTo(43, _ry1);
          //   ctx.closePath();
          // }
          const odd = RY_N === 3 && oindex < 3 ? oindex * RY_N + 1 : (oindex + 1) * RY_N;

          ctx.fillText(`${odd >= 10 ? odd : odd.toFixed(1)}x`, 38, height - oddSpacing * oindex);
          ctx.beginPath();
          let _ry3 = height - oddSpacing * oindex;
          ctx.moveTo(40, _ry3);
          ctx.lineTo(47, _ry3);
          ctx.stroke();
          ctx.closePath();
          ctx.beginPath();
          let _ry2 = height - (oddSpacing * oindex + oddSpacing / 2);
          ctx.moveTo(40, _ry2);
          ctx.lineTo(43, _ry2);
          ctx.closePath();
          ctx.stroke();
        }

        let startX = 70;
        let startY = height;
        let controlX = (GAME_INFO.camerax + GAME_INFO.x) * 0.75;
        let controlY = height;
        let endX = GAME_INFO.camerax + GAME_INFO.x - 2;
        let endY = GAME_INFO.cameray + GAME_INFO.y - 2;
        let derivativeX = 2 * (endX - controlX);
        let derivativeY = 2 * (endY - controlY);
        let angleInRadians = Math.atan2(derivativeY, derivativeX);
        ctx.beginPath();
        var gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, '#8d2cee00');
        gradient.addColorStop(1, '#A955FF');
        ctx.strokeStyle = gradient;
        ctx.moveTo(startX, startY);
        ctx.lineWidth = crashWidth * 0.04;
        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
        ctx.stroke();
        ctx.closePath();
        ctx.save();
        ctx.translate(GAME_INFO.camerax, GAME_INFO.cameray);

        for (var i = 0; i < STARS.length; i++) {
          ctx.save();
          // ctx.beginPath();
          // ctx.fillStyle = 'white';
          // ctx.globalAlpha = 0.6;
          ctx.translate(STARS[i].x, STARS[i].y);
          ctx.drawImage(
            snowImg,
            -STARS[i].size / 2,
            -STARS[i].size / 2,
            STARS[i].size,
            STARS[i].size
          );
          // ctx.arc(0, 0, STARS[i].size, 0, 2 * Math.PI);
          // ctx.fill();
          // ctx.closePath();
          ctx.restore();
          if (status === GAME_STATES.InProgress) {
            STARS[i].x -= 0.7;
            STARS[i].y += 0.7;
          } else {
            STARS[i].x -= 0.2;
            STARS[i].y += 0.2;
          }
          if (STARS[i].t < 0) {
            STARS.splice(i, 1);
          } else {
            STARS[i].t--;
          }
        }

        if (status !== GAME_STATES.Over) {
          ctx.translate(GAME_INFO.x, GAME_INFO.y);
          ctx.rotate(angleInRadians);
          ctx.globalAlpha = 1;
          ctx.drawImage(
            crashImage,
            -crashWidth / 2,
            -crashWidth / 2 + 3,
            crashWidth,
            crashWidth - 10
          );
        } else {
          GAME_INFO.PARTICLES.forEach((p: any, i: number) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            GAME_INFO.PARTICLES[i].x -= 0.5 * Math.sin(p.a);
            GAME_INFO.PARTICLES[i].y += 0.5 * Math.cos(p.a);
            ctx.globalAlpha = p.t / 60;
            ctx.rotate(p.a);
            ctx.drawImage(explosionImage, -p.s / 2, -p.s / 2, p.s, p.s);
            ctx.restore();
            p.t -= 0.2;
            if (p.t < 0) {
              GAME_INFO.PARTICLES.splice(i, 1);
            }
          });
          ctx.translate(GAME_INFO.x, GAME_INFO.y);
          ctx.globalAlpha = 1;
          ctx.drawImage(
            explosionImage,
            -crashWidth / 4,
            -crashWidth / 4,
            crashWidth / 2,
            crashWidth / 2
          );
        }
        ctx.restore();
      }
      if (STARS.length < 100) {
        STARS.push({
          x: GAME_INFO.x - width + Math.random() * width * 2,
          y: GAME_INFO.y - height + Math.random() * height * 2,
          size: Math.random() * 20,
          t: Math.random() * 500,
        });
      }
    }
  };

  useEffect(() => {
    TIME_DT = new Date().getTime();
    const interval = setInterval(() => {
      loop();
    }, 5);
    return () => {
      clearInterval(interval);
    };
  }, [canvas, _infos]);

  useEffect(() => {
    const _canvas: HTMLCanvasElement = document.createElement('canvas');
    const container: any = ref.current;
    _canvas.width = container.offsetWidth;
    _canvas.height = container.offsetHeight - 5;
    window.onresize = () => {
      _canvas.width = container.offsetWidth;
      _canvas.height = container.offsetHeight;
    };
    container.appendChild(_canvas);
    setCanvas(_canvas);
    return () => {
      container.removeChild(_canvas);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: 400,
        minHeight: 400,
        paddingTop: 5,
        backgroundBlendMode: 'multiply',
        backgroundColor: 'rgb(19 15 35)',
        backgroundImage:
          'url(https://img.freepik.com/premium-photo/vector-christmas-snow-overlay-banner-mountain-snow_1000408-559.jpg)',
        backgroundSize: 'cover',
      }}
    />
  );
};

export default GameCanvas;
