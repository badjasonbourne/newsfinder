'use client';
import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

const LoadingSpinner = () => {
  const textRef = useRef(null);

  useEffect(() => {
    const animation = anime({
      targets: textRef.current,
      translateY: [-20, 0],
      duration: 800,
      easing: 'easeInOutQuad',
      loop: true,
      direction: 'alternate'
    });

    return () => {
      animation.pause();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div 
        ref={textRef}
        className="text-[32px] font-light tracking-widest"
      >
        资讯准备中
      </div>
    </div>
  );
};

export default LoadingSpinner;
