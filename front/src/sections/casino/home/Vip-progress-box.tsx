import React from 'react';
import { useDispatch } from 'react-redux';
import { ChangePage } from 'src/store/reducers/menu';

interface VIPProgressBoxProps {
  isLoggedIn?: boolean;
}

const VIPProgressBox = ({ isLoggedIn = false }: VIPProgressBoxProps) => {
  const dispatch = useDispatch();

  const pulseRings = `
    @keyframes pulseRings {
      0% {
        transform: scale(1);
        opacity: 0.9;
      }
      50% {
        transform: scale(2);
        opacity: 0.5;
      }
      100% {
        transform: scale(3);
        opacity: 0;
      }
    }
    
    .vip-progress-container {
      margin-left: 0;
      margin-right: 0;
      height: 32vh;
      min-height: 280px;
    }
    
    @media (max-width: 520px) {
      .vip-progress-container {
        margin-left: 16px;
        margin-right: 16px;
        width: calc(100% - 32px) !important;
        height: 40vh !important;
        min-height: 320px !important;
      }
    }
  `;

  const handleRegisterClick = () => {
    // Your register logic here
    console.log('Register clicked');
  };

  return (
    <>
      <style>{pulseRings}</style>
      <div
        className="vip-progress-container"
        style={{
          position: 'relative',
          border: '2px solid #24ee89',
          borderRadius: '20px',
          marginBottom: '8px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: 'rgba(26, 29, 41, 0.8)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
        }}
      >
        {/* Top gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '90%',
            background:
              'linear-gradient(180deg,rgba(94, 74, 227, 0.67) 0%, rgba(138,43, 226, 0.1) 50%, transparent 100%)',
            zIndex: 1,
          }}
        />

        {/* Avatar container with pulsing rings */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            marginBottom: '16px',
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Pulsing rings */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(138,43, 226, 0.8)',
              borderRadius: '50%',
              animation: 'pulseRings 2.5s infinite',
              animationDelay: '0s',
              zIndex: 1,
              transformOrigin: 'center center',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(138,43, 226, 0.6)',
              borderRadius: '50%',
              animation: 'pulseRings 2.5s infinite',
              animationDelay: '0.8s',
              zIndex: 1,
              transformOrigin: 'center center',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(138,43, 226, 0.4)',
              borderRadius: '50%',
              animation: 'pulseRings 2.5s infinite',
              animationDelay: '1.6s',
              zIndex: 1,
              transformOrigin: 'center center',
            }}
          />

          {/* Avatar */}
          <div
            style={{
              width: '80px',
              height: '80px',
              border: '2px solid #FFD700',
              borderRadius: '50%',
              zIndex: 2,
              backgroundColor: '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundImage: 'url(/assets/images/casino/ava_vip.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Fallback if image doesn't load */}
          </div>
        </div>

        {/* Text above percentage */}
        <div
          style={{
            color: '#FFFFFF',
            textAlign: 'center',
            fontSize: '14px',
            paddingTop: '3rem',
            zIndex: 2,
            position: 'relative',
          }}
        >
          Your VIP Progress
        </div>

        {/* VIP Progress Text */}
        <div
          style={{
            color: '#fff',
            fontWeight: '800', // extra-bold
            fontStyle: 'oblique', // italic tilt
            textAlign: 'center',
            zIndex: 2,
            position: 'relative',
            fontSize: '35px',
          }}
        >
          00.00%
        </div>

        {/* Register text/button */}
        {!isLoggedIn && (
          <div
            style={{
              color: '#FFFFFF',
              textAlign: 'center',
              fontWeight: 400,
              zIndex: 2,
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
            }}
          // onClick={handleRegisterClick}
          >
            <span
              style={{
                backgroundColor: '#FFD700',
                color: 'black',
                padding: '4px 8px',
                fontWeight: 'bolder',
                borderRadius: '3px',
                display: 'inline-block',   // required for transform to work
                transform: 'rotate(2deg)' // tilt text a bit
              }}
            >
              0
            </span>
            &nbsp; To Get A Rating,{' '}
            <span style={{ color: '#FFD700', fontWeight: 'semibold' }}>Register</span>
          </div>
        )}
      </div>
    </>
  );
};

export default VIPProgressBox;
