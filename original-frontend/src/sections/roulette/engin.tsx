import { useEffect, useRef } from 'react';
import wheelImg from 'src/assets/images/games/wheel.webp';
import { playAudio, WHEELNUMBERS } from './config';

const WheelImg = new Image();
WheelImg.src = wheelImg;

class GameEngine {
  sectorAngle = 360 / 37;

  width: number = 400;

  height: number = 400;

  canvas: HTMLCanvasElement | null = null;

  radius: number = 200;

  wheelAngle: number = 0;

  ballAngle: number = 0;

  ballSpeed: number = 15;

  wheelSpeed: number = 0.5; // Initial wheel speed

  maxSpeed: number = 4; // Maximum speed when starting a new round

  normalSpeed: number = 0.5; // Normal rotation speed for the wheel

  acceleration: number = 0.05; // Speed increment for acceleration

  outcomeNumber = 0;

  targetBallAngle: number = 0;

  ballRadius: number = 190;

  currentBallRaidus: number = 190;

  ctx: CanvasRenderingContext2D | null = null;

  timer: any;

  state: 0 | 1 | 2 = 0; // 0: idle, 1: running, 2: round ended

  onAnimationEnd: Function | null = null;

  contain: HTMLElement | null = null;

  constructor() {
    this.timer = setInterval(() => {
      if (this.contain && this.canvas) {
        this.width = this.contain.offsetWidth;
        this.height = this.contain.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.radius = this.contain.offsetWidth / 2;
        if (this.ballRadius !== this.radius * 0.8) {
          this.ballRadius = this.radius * 0.8;
          this.currentBallRaidus = this.radius * 0.8;
        }
      }
      this.animate();
    }, 1000 / 60);
  }

  setCanvas(contain: HTMLElement, canvas: HTMLCanvasElement) {
    this.contain = contain;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = contain.offsetWidth;
    this.height = contain.offsetHeight;
    canvas.width = this.width;
    canvas.height = this.height;
    this.radius = contain.offsetWidth / 2;
    this.ballRadius = this.radius * 0.8;
    this.currentBallRaidus = this.radius * 0.8;
  }

  setOutComeNumber(outcomeNumber: number) {
    if (this.state !== 1) {
      this.outcomeNumber = outcomeNumber;
      this.state = 1;
      this.ballSpeed = 15;
      this.ballRadius = this.radius * 0.8;
      this.currentBallRaidus = this.radius * 0.8;
      this.wheelSpeed = this.normalSpeed;
      this.ballAngle = 0;
      this.targetBallAngle = this.getBallTargetAngle(outcomeNumber);
      playAudio('spin', true);
    }
  }

  getBallTargetAngle(outcomeNumber: number) {
    const index = WHEELNUMBERS.findIndex((n) => n.Number === outcomeNumber);
    return index * this.sectorAngle;
  }

  drawWheel(angle: number) {
    const { ctx } = this;
    if (!ctx) return;
    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.drawImage(WheelImg, -this.radius, -this.radius, this.radius * 2, this.radius * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawBall(angle: number) {
    const { ctx } = this;
    if (!ctx) return false;
    this.currentBallRaidus -=
      this.state === 2 && this.currentBallRaidus > this.radius * 0.6 ? 3 : 0;
    const ballX = this.width / 2 + this.currentBallRaidus * Math.cos((angle * Math.PI) / 180);
    const ballY = this.height / 2 + this.currentBallRaidus * Math.sin((angle * Math.PI) / 180);

    const gradient = ctx.createRadialGradient(
      ballX,
      ballY,
      this.radius * 0.04 * 0.1,
      ballX,
      ballY,
      this.radius * 0.04
    );

    // Define gradient colors (from center to edge)
    gradient.addColorStop(0, 'white'); // Center of the ball
    gradient.addColorStop(1, 'gray'); // Edge of the ball

    ctx.beginPath();
    ctx.arc(ballX, ballY, this.radius * 0.04, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    return true;
  }

  drawWheelAndBall() {
    if (this.state !== 0) {
      if (this.ballSpeed > 1) {
        this.ballAngle = (this.ballAngle + this.ballSpeed) % 360;
        this.ballSpeed *= 0.99;
      } else {
        const delta = (this.targetBallAngle - this.ballAngle + 270) % 360;

        if (delta > 1) {
          this.ballAngle += Math.min(delta, this.ballSpeed);
          this.ballAngle %= 360;
        } else if (this.state !== 2) {
          this.state = 2;
          this.ballSpeed = 0;
          if (this.onAnimationEnd) {
            this.onAnimationEnd();
            playAudio('spin', false);
          }
        }
      }
    }
    this.wheelAngle = (this.wheelAngle + this.wheelSpeed) % 360;
    this.ctx?.clearRect(0, 0, this.width, this.height);
    const relativeAngle = (this.ballAngle + this.wheelAngle + 360) % 360;

    this.drawWheel(this.wheelAngle);
    if (this.state !== 0) {
      this.drawBall(relativeAngle);
    }
  }

  animate() {
    this.drawWheelAndBall();
  }
}

(window as any).rouletteGame = new GameEngine();

export const RouletteCanvas = ({
  outcomeNumber,
  onAnimationEnd,
}: {
  outcomeNumber: number;
  onAnimationEnd: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | any>(null);
  const containRef = useRef<HTMLElement | any>(null);

  useEffect(() => {
    const setCanvas = () => {
      if (canvasRef.current)
        (window as any).rouletteGame.setCanvas(containRef.current, canvasRef.current);
    };
    window.onresize = () => {
      setCanvas();
    };

    (containRef.current as HTMLElement)?.addEventListener('resize', setCanvas);

    setCanvas();

    return () => {
      (containRef.current as HTMLElement)?.removeEventListener('resize', setCanvas);
    };
  }, []);

  useEffect(() => {
    if (outcomeNumber !== -1) {
      (window as any).rouletteGame.setOutComeNumber(outcomeNumber);
      (window as any).rouletteGame.onAnimationEnd = onAnimationEnd;
    }
  }, [outcomeNumber]);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
      ref={containRef}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};
