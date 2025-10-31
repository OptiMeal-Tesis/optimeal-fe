import { useEffect, useState } from 'react';
import CheckIcon from '../assets/icons/CheckIcon';

interface SuccessAnimationProps {
  onComplete: () => void;
}

export default function SuccessAnimation({ onComplete }: SuccessAnimationProps) {
  const [show, setShow] = useState(true);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    // Start circle expansion after check animation completes
    const expandTimer = setTimeout(() => {
      setExpand(true);
    }, 1500);

    // Start fade out after expansion completes
    const fadeTimer = setTimeout(() => {
      setShow(false);
    }, 2500);

    // Call onComplete after fade out animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background - starts as dark overlay, then becomes blue */}
      <div 
        className={`absolute inset-0 transition-colors duration-300 ${
          expand ? 'bg-[#0D47A1]' : 'bg-black/50 backdrop-blur-sm'
        }`}
      />

      {/* Expanding blue circle from center */}
      <div
        className={`absolute rounded-full bg-[#0D47A1] transition-all duration-1000 ease-out ${
          expand ? 'scale-[30]' : 'scale-0'
        }`}
        style={{
          width: '96px',
          height: '96px',
          transformOrigin: 'center',
        }}
      />

      <div
        className={`relative z-10 flex flex-col items-center justify-center gap-4 transition-all duration-500 ${
          show ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Animated Check Circle */}
        <div className="relative flex items-center justify-center">
          {/* Outer circle with scale animation */}
          <div
            className="absolute inset-0 rounded-full bg-[#0D47A1] animate-ping"
            style={{
              animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) 1',
              width: '96px',
              height: '96px',
            }}
          />
          
          {/* Main circle */}
          <div
            className="relative flex items-center justify-center rounded-full bg-[#0D47A1] animate-bounce-in"
            style={{
              width: '96px',
              height: '96px',
              animation: 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            }}
          >
            {/* Check icon with draw animation */}
            <div
              className="animate-check-draw"
              style={{
                animation: 'checkDraw 0.5s ease-in-out 0.3s forwards',
                opacity: 0,
              }}
            >
              <CheckIcon className="w-12 h-12 text-white stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Success text */}
        <div
          className="text-center animate-fade-in-up"
          style={{
            animation: 'fadeInUp 0.5s ease-out 0.4s forwards',
            opacity: 0,
          }}
        >
          <h2 className="text-h3 font-bold text-white">
            Pedido completado con éxito
          </h2>
        </div>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes checkDraw {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

