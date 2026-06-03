import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Shield, Sparkles, ChevronLeft, ChevronRight, Zap, Play, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClassTitle } from '../types';

interface StairGameProps {
  onClear: () => void;
  playerName: string;
  selectedClass: ClassTitle | null;
}

// Map class to representing emoji
const CLASS_EMOJIS: Record<string, string> = {
  storyteller: '✍️',
  commander: '⚔️',
  buffer: '🎤',
  alchemist: '🧪',
  mechanic: '🔧',
  healer: '💖',
  creator: '🎨',
};

function SchoolUniformBoy({ direction }: { direction: 'left' | 'right' }) {
  return (
    <div className="relative w-12 h-14 flex items-center justify-center">
      <svg 
        width="44" 
        height="52" 
        viewBox="0 0 44 52" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
      >
        {/* Hair Back */}
        <path d="M12 11C12 7 15 4 22 4C29 4 32 7 32 11L33 16H11L12 11Z" fill="#1e1b4b" />
        
        {/* Face */}
        <rect x="13" y="11" width="18" height="16" rx="5" fill="#fef08a" />

        {/* Cute Ears */}
        <circle cx="11" cy="18" r="2.5" fill="#fef08a" />
        <circle cx="33" cy="18" r="2.5" fill="#fef08a" />

        {/* Hair - neat bangs cut */}
        <path d="M11 11C12 8 15 6 22 6C29 6 32 8 33 11C33 11 29 12 28 13C27 14 25 12 22 12C19 12 17 14 16 13C15 12 11 11 11 11Z" fill="#1e293b" />
        <path d="M11 11V14L14 11H11Z" fill="#1e293b" />
        <path d="M33 11V14L30 11H33Z" fill="#1e293b" />

        {/* Eyes */}
        <circle cx="18" cy="17" r="1.5" fill="#0f172a" />
        <circle cx="26" cy="17" r="1.5" fill="#0f172a" />
        <path d="M17 14.5C18 14 19 14 19.5 14.5" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />
        <path d="M25 14.5C26 14 27 14 27.5 14.5" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />

        {/* Shy cheeks blush */}
        <circle cx="16" cy="20.5" r="1.5" fill="#f43f5e" opacity="0.6" />
        <circle cx="28" cy="20.5" r="1.5" fill="#f43f5e" opacity="0.6" />

        {/* Smile */}
        <path d="M20 21C21 21.8 23 21.8 24 21" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />

        {/* Uniform Collar & Neck */}
        <rect x="20" y="26" width="4" height="2" fill="#fef08a" />
        {/* Crisp White Shirt Collar */}
        <path d="M17 28L22 31L27 28L24 31H20L17 28Z" fill="#ffffff" />
        {/* Neat Red Tie */}
        <path d="M21 31L23 31L23.5 37L22 39L20.5 37L21 31Z" fill="#b91c1c" />

        {/* Navy Blazer */}
        <path d="M10 28C13 28 15 27 17 30L17 44H27L27 30C29 27 31 28 34 28V41C34 43 32.5 44 31 44H13C11.5 44 10 43 10 41V28Z" fill="#1e1b4b" />
        
        {/* Golden Buttons */}
        <circle cx="22" cy="34" r="0.8" fill="#eab308" />
        <circle cx="22" cy="38" r="0.8" fill="#eab308" />
        <line x1="17" y1="30" x2="19" y2="35" stroke="#1e293b" strokeWidth="0.8" />
        <line x1="27" y1="30" x2="25" y2="35" stroke="#1e293b" strokeWidth="0.8" />

        {/* School Badge */}
        <rect x="13.5" y="31" width="2.5" height="2.5" rx="0.5" fill="#eab308" />

        {/* Arms */}
        <path d="M8 29.5C7.5 31.5 7 35 8.5 38C9 39 10 38 9.8 35.5L10 29.5" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M36 29.5C36.5 31.5 37 35 35.5 38C35 39 34 38 34.2 35.5L34 29.5" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />

        {/* Grey Trousers */}
        <rect x="15" y="44" width="6" height="5" fill="#475569" rx="0.8" />
        <rect x="23" y="44" width="6" height="5" fill="#475569" rx="0.8" />

        {/* Black School Shoes */}
        <rect x="14.5" y="48.5" width="6.5" height="3.5" rx="1.5" fill="#0f172a" />
        <rect x="23" y="48.5" width="6.5" height="3.5" rx="1.5" fill="#0f172a" />
      </svg>
    </div>
  );
}

export default function StairGame({ onClear, playerName, selectedClass }: StairGameProps) {
  const TOTAL_STAIRS = 32;

  // Generate directions sequence: 'left' or 'right'
  const [directions, setDirections] = useState<('left' | 'right')[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playerDir, setPlayerDir] = useState<'left' | 'right'>('right');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'failed' | 'cleared'>('idle');
  const [shake, setShake] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [highestStep, setHighestStep] = useState(0);

  // Screen optimization states for different devices / tablets / PC sizes
  const [layoutMode, setLayoutMode] = useState<'portrait' | 'landscape'>('landscape');
  const [zoomScale, setZoomScale] = useState<number>(0.9);

  // Auto detect best orientation & scale on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isWider = window.innerWidth > window.innerHeight;
      const isTabletOrShorter = window.innerHeight < 720;
      
      setLayoutMode(isWider ? 'landscape' : 'portrait');
      if (isWider && isTabletOrShorter) {
        setZoomScale(0.8); // Scale down slightly to fit short tablet orientations perfectly
      } else if (isWider) {
        setZoomScale(0.9);
      } else {
        setZoomScale(1.0);
      }
    }
  }, []);

  // Generate directions when mounting or restarting
  const initGame = () => {
    const list: ('left' | 'right')[] = [];
    let cur: 'left' | 'right' = 'right';
    for (let i = 0; i < TOTAL_STAIRS + 10; i++) {
      // 55% chance to alternate, to make it fun but playable
      if (Math.random() < 0.55) {
        cur = cur === 'left' ? 'right' : 'left';
      }
      list.push(cur);
    }
    setDirections(list);
    setCurrentStep(0);
    setPlayerDir('right');
    setGameState('playing');
    setHighestStep(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Sync highscore
  useEffect(() => {
    if (currentStep > highestStep) {
      setHighestStep(currentStep);
    }
    if (currentStep >= TOTAL_STAIRS && gameState === 'playing') {
      playSound('clear');
      setGameState('cleared');
    }
  }, [currentStep, highestStep, gameState]);

  // Handle keyboard control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      const key = e.key.toLowerCase();
      // ArrowLeft or Z -> Change Direction
      if (e.key === 'ArrowLeft' || key === 'z') {
        e.preventDefault();
        triggerChangeDir();
      }
      // ArrowRight or X or Space -> Climb
      else if (e.key === 'ArrowRight' || key === 'x' || e.key === ' ') {
        e.preventDefault();
        triggerClimb();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, currentStep, playerDir, directions]);

  // Audio synths using Web Audio API
  const playSound = (type: 'climb' | 'fail' | 'clear' | 'turn') => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      if (type === 'climb') {
        osc.frequency.setValueAtTime(300 + currentStep * 15, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(450 + currentStep * 15, audioCtx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'turn') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260 + currentStep * 15, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(380 + currentStep * 15, audioCtx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'fail') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(120, audioCtx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'clear') {
        osc.type = 'sine';
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
        notes.forEach((freq, idx) => {
          const oscNode = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          oscNode.type = 'sine';
          oscNode.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime + idx * 0.1);
          gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.1 + 0.25);
          oscNode.connect(gain);
          gain.connect(audioCtx.destination);
          oscNode.start(audioCtx.currentTime + idx * 0.1);
          oscNode.stop(audioCtx.currentTime + idx * 0.1 + 0.3);
        });
      }
    } catch (e) {
      // Ignored if browser blocks audio autoplay
    }
  };

  // Game mechanis: CLIMB
  const triggerClimb = () => {
    if (gameState !== 'playing') return;

    // The stair direction we need to go to reach the next step is directions[currentStep]
    const targetDir = directions[currentStep];

    if (playerDir === targetDir) {
      // Correct!
      playSound('climb');
      setCurrentStep(prev => prev + 1);
    } else {
      // Wrong orientation! Fail
      handleFailure();
    }
  };

  // Game mechanics: CHANGE DIRECTION
  const triggerChangeDir = () => {
    if (gameState !== 'playing') return;

    // Flip direction
    const nextDir = playerDir === 'left' ? 'right' : 'left';
    setPlayerDir(nextDir);

    const targetDir = directions[currentStep];

    if (nextDir === targetDir) {
      // Correct!
      playSound('turn');
      setCurrentStep(prev => prev + 1);
    } else {
      // Fail
      handleFailure();
    }
  };

  const handleFailure = () => {
    playSound('fail');
    setShake(true);
    setTimeout(() => setShake(false), 300);
    setGameState('failed');
  };

  // Cheat logic / accessible bypass options
  const bypassSuccess = () => {
    playSound('clear');
    setCurrentStep(TOTAL_STAIRS);
    setGameState('cleared');
  };

  // Calculate stair offsets for rendering
  // Stair coordinates are built cumulative
  const stairsToRender = [];
  let accumX = 0;
  let accumY = 0;

  for (let i = 0; i < directions.length; i++) {
    stairsToRender.push({
      index: i,
      x: accumX,
      y: accumY,
      dir: directions[i],
    });
    // Offset for next step
    const stepDir = directions[i];
    if (stepDir === 'left') {
      accumX -= 55;
    } else {
      accumX += 55;
    }
    accumY -= 40;
  }

  // Find coordinates of the current active step to center the viewport on it
  const activeStair = stairsToRender[currentStep] || { x: 0, y: 0 };

  const chrEmoji = selectedClass ? CLASS_EMOJIS[selectedClass] || '🧑‍🎓' : '🧑‍🎓';

  return (
    <div className="w-full flex flex-col items-center justify-center p-1 md:p-2">
      {/* Game Card Container with dynamic responsive sizing */}
      <div 
        className={`w-full transition-all duration-300 bg-slate-950/85 border-2 border-slate-800/80 rounded-3xl p-3 md:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden relative flex flex-col gap-2.5 ${
          layoutMode === 'landscape' ? 'max-w-2xl' : 'max-w-md'
        }`}
      >
        
        {/* Dynamic Customization Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 z-10 border-b border-slate-800/60 pb-2">
          <div className="flex gap-1.5 items-center">
            <span className="p-1 px-2 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-amber-400" />
              <span>진로관문 2단계 시련</span>
            </span>
          </div>

          {/* Quick Resolution Optimizer UI */}
          <div className="flex items-center gap-2 font-mono text-[10px]">
            {/* Aspect/Layout switch */}
            <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg select-none">
              <button
                type="button"
                onClick={() => { setLayoutMode('portrait'); setZoomScale(1.0); }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition ${
                  layoutMode === 'portrait' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                세로형
              </button>
              <button
                type="button"
                onClick={() => { setLayoutMode('landscape'); setZoomScale(0.85); }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-semibold transition flex items-center gap-0.5 ${
                  layoutMode === 'landscape' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                가로 👐
              </button>
            </div>

            {/* Game Scale Switcher */}
            <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg select-none">
              <button
                type="button"
                onClick={() => setZoomScale(0.75)}
                className={`px-1 rounded text-[9px] ${zoomScale === 0.75 ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
                title="돋보기 축소"
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(0.9)}
                className={`px-1 rounded text-[9px] ${zoomScale === 0.9 ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
                title="보통 배율"
              >
                90%
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(1.0)}
                className={`px-1 rounded text-[9px] ${zoomScale === 1.0 ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
                title="크게 보기"
              >
                100%
              </button>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isMuted ? "음소거 해제" : "음소거"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Outer Layout Routing based on layoutMode */}
        {layoutMode === 'landscape' ? (
          /* Landscape Dual Columns Layout - Perfect for shortest tablet landscape views! */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 z-10">
            
            {/* Left Hand: Full interactive Game Viewport (占用 7/12 width) */}
            <div className="md:col-span-7 flex flex-col gap-2">
              <div 
                className={`w-full h-52 md:h-60 bg-slate-950/50 border border-slate-900 rounded-2xl overflow-hidden relative ${shake ? 'animate-shake' : ''}`}
                id="stair-viewport-landscape"
              >
                {/* Subtle grid background */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Scaling & Translating Game Canvas - Mathematically locked to the 2/3rd height mark of the screen with zero drift */}
                <div 
                  className="absolute left-1/2 top-1/2 transition-all duration-150 ease-out"
                  style={{
                    transform: `translate(-50%, -50%) translate(0px, 40px) scale(${zoomScale}) translate(${-activeStair.x}px, ${-activeStair.y}px)`,
                    transformOrigin: 'center center'
                  }}
                >
                  <div>
                    
                    {/* Stairs */}
                    {stairsToRender.map((stair) => {
                      const isActive = stair.index === currentStep;
                      const isPassed = stair.index < currentStep;
                      const isGoal = stair.index === TOTAL_STAIRS;

                      if (Math.abs(stair.index - currentStep) > 9) return null;

                      return (
                        <div
                          key={stair.index}
                          className="absolute pointer-events-none transition-all duration-300"
                          style={{
                            left: stair.x,
                            top: stair.y,
                          }}
                        >
                          <div 
                            className={`w-14 h-4 rounded-sm border-b-[3px] flex items-center justify-center transition-all ${
                              isActive 
                                ? 'bg-amber-400 border-amber-600 text-amber-950 scale-105 shadow-[0_0_12px_rgba(251,191,36,0.6)] font-bold' 
                                : isGoal
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 border-emerald-600 text-slate-100 font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                : isPassed
                                ? 'bg-slate-800 border-slate-950 text-slate-500 opacity-40'
                                : 'bg-slate-700 border-slate-900 text-slate-300'
                            }`}
                            style={{ transform: 'skewX(-20deg)' }}
                          >
                            <span className="text-[8px] font-mono block transform skewX(20deg) leading-none select-none">
                              {stair.index === TOTAL_STAIRS ? '👑 32' : `${stair.index}`}
                            </span>
                          </div>
                          {!isActive && stair.index > 0 && stair.index % 8 === 0 && stair.index < TOTAL_STAIRS && (
                            <div className="absolute top-4 left-2 -translate-x-1/2 bg-slate-900/95 border border-slate-700 px-1 py-0.5 rounded text-[7px] text-amber-400 font-mono whitespace-nowrap z-10 shadow-md">
                              {stair.index}학점 돌파!
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* School Uniform Boy Character standing safely on the center focus activeStair */}
                    <motion.div
                      className="absolute z-20 transition-transform duration-100"
                      style={{
                        left: activeStair.x + 6,
                        top: activeStair.y - 46,
                      }}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.12, ease: "easeOut" }}
                      key={currentStep}
                    >
                      <div 
                        className="transition-transform"
                        style={{ transform: playerDir === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
                      >
                        <SchoolUniformBoy direction={playerDir} />
                      </div>
                    </motion.div>

                  </div>
                </div>

                {/* HUD Overlay Info */}
                <div className="absolute top-2 left-2 bg-slate-950/80 border border-slate-800/80 px-2 py-1 rounded-lg z-20 flex flex-col font-mono text-[9px] select-none">
                  <span className="text-slate-400">학업 방향 자세</span>
                  <span className={`font-bold mt-0.5 flex items-center gap-0.5 ${playerDir === 'left' ? 'text-blue-400' : 'text-orange-400'}`}>
                    {playerDir === 'left' ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    {playerDir === 'left' ? '왼쪽 바라봄' : '오른쪽 바라봄'}
                  </span>
                </div>

                {/* Tablet Thumb Overlay Triggers - Floating directly on left & right sides of the screen! */}
                {gameState === 'playing' && (
                  <>
                    {/* DIRECTION CHANGE TRIGGER (Left overlay thumb pad) */}
                    <button
                      type="button"
                      onTouchStart={(e) => { e.preventDefault(); triggerChangeDir(); }}
                      onMouseDown={(e) => { e.preventDefault(); triggerChangeDir(); }}
                      className="absolute left-2.5 bottom-2.5 w-24 h-16 md:w-28 md:h-18 z-40 bg-indigo-600/30 active:bg-indigo-600/70 border border-indigo-400/40 hover:bg-indigo-600/40 rounded-2xl flex flex-col items-center justify-center text-white shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all active:scale-95 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4 text-white animate-pulse" />
                        <span className="text-[11px] font-black tracking-wide">방향전환</span>
                      </div>
                      <span className="text-[8px] text-indigo-200 mt-0.5">Z키 / 터치</span>
                    </button>

                    {/* CLIMB UP TRIGGER (Right overlay thumb pad) */}
                    <button
                      type="button"
                      onTouchStart={(e) => { e.preventDefault(); triggerClimb(); }}
                      onMouseDown={(e) => { e.preventDefault(); triggerClimb(); }}
                      className="absolute right-2.5 bottom-2.5 w-24 h-16 md:w-28 md:h-18 z-40 bg-orange-500/35 active:bg-orange-500/75 border border-orange-400/40 hover:bg-orange-500/45 rounded-2xl flex flex-col items-center justify-center text-white shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all active:scale-95 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xs">🏃‍♂️</span>
                        <span className="text-[11px] font-black tracking-wide">올라가기</span>
                      </div>
                      <span className="text-[8px] text-orange-200 mt-0.5">X키 / Space / 터치</span>
                    </button>
                  </>
                )}

                {/* Integrated Overlays */}
                <AnimatePresence>
                  {gameState === 'idle' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-3 z-30 text-center"
                    >
                      <Play className="w-8 h-8 text-orange-400 animate-bounce mb-2" />
                      <h3 className="text-sm font-bold text-white">학점 계단 기믹 보충전</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs leading-normal">
                        양손으로 태블릿을 쥐고, 좌우 하단의 반투명 오버레이 버튼을 엄지로 톡톡 눌러 등반하세요!
                      </p>
                      <button
                        onClick={initGame}
                        className="mt-3 px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md transition"
                      >
                        시작하기!
                      </button>
                    </motion.div>
                  )}

                  {gameState === 'failed' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-3 z-30 text-center"
                    >
                      <h3 className="text-sm font-bold text-red-400">발을 헛디뎠어요! 💥</h3>
                      <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                        계단 진행 방향과 학생의 방향이 맞지 않으면 추락합니다! 천천히 짚어보세요.
                      </p>
                      <span className="text-amber-400 font-mono text-xs mt-1 font-semibold">
                        기록: {currentStep} / {TOTAL_STAIRS}
                      </span>
                      <div className="flex gap-2 mt-3 justify-center">
                        <button
                          onClick={initGame}
                          className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>다시하기</span>
                        </button>
                        <button
                          onClick={bypassSuccess}
                          className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white text-[10px] font-bold rounded-lg transition"
                        >
                          패스하기
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {gameState === 'cleared' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-3 z-30 text-center"
                    >
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 mb-2 font-bold animate-pulse text-xs">
                        ✓
                      </div>
                      <h3 className="text-sm font-bold text-emerald-400">32계단 등반 극적 완료! 🎉</h3>
                      <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                        기록 완료! 진로던전 2단계 자격을 시원하게 정복하셨습니다.
                      </p>
                      <button
                        onClick={onClear}
                        className="mt-3 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-[10px] shadow-lg transition"
                      >
                        2차 과목 배치하러 가기! 🚀
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Hand: Specs panel & compact logs (占用 5/12 width) */}
            <div className="md:col-span-5 flex flex-col justify-between p-1 bg-slate-900/40 border border-slate-800/60 rounded-2xl h-full min-h-[200px]">
              <div className="p-1 flex flex-col gap-2">
                <div className="text-center md:text-left select-none">
                  <h3 className="text-base font-extrabold text-white">무한의 학점 계단</h3>
                  <p className="text-[9px] text-slate-400 leading-normal mt-0.5">
                    캐릭터의 정면/측면 머리방향을 보고, 다음 계단 진행방향과 일치시킨 후 정진하세요!
                  </p>
                </div>

                {/* Progress Mini Info */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono select-none">
                    <span className="text-slate-400">등반 진척도:</span>
                    <span className="text-orange-400 font-bold">{currentStep} / {TOTAL_STAIRS} 학점 완료</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                      animate={{ width: `${Math.min(100, (currentStep / TOTAL_STAIRS) * 100)}%` }}
                      transition={{ duration: 0.12 }}
                    />
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 font-sans p-1 bg-slate-950/30 rounded border border-slate-900 leading-normal">
                  <div className="font-bold text-amber-400 mb-0.5">※ 등반 조작 힌트:</div>
                  • 다음 계단이 꺾여있으면 <strong className="text-white">방향전환</strong> 먼저!<br />
                  • 다음 계단 방향과 내 캐릭터 방향이 같다면 주저없이 <strong className="text-white">올라가기</strong>!
                </div>
              </div>

              {/* Extra Backup Controls (Compact for mouse or desk alignment) */}
              <div className="mt-2 pt-2 border-t border-slate-900/80 flex justify-between items-center text-[10px]">
                <span className="text-[9px] text-slate-500 font-mono">기록: {highestStep}계단</span>
                <button 
                  type="button" 
                  onClick={bypassSuccess}
                  className="hover:text-amber-400 text-slate-400 font-mono transition underline decoration-dotted text-[9px]"
                >
                  시련 건너뛰기
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Classical Portrait Stack Layout - Optimized & tighter padding than original to prevent tablet browser edge cutoffs! */
          <div className="flex flex-col gap-2 z-10 text-center select-none">
            
            <div className="py-0.5">
              <h2 className="text-base font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                무한의 학점 계단 🏃‍♂️💨
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs mx-auto">
                좌우 방향을 맞춰 학생 캐릭터가 떨어지지 않도록 마스터하세요!
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                animate={{ width: `${Math.min(100, (currentStep / TOTAL_STAIRS) * 100)}%` }}
                transition={{ duration: 0.15 }}
              />
              <span className="absolute top-0 right-2 text-[8px] font-mono font-bold text-white leading-normal">
                {currentStep} / {TOTAL_STAIRS}
              </span>
            </div>

            {/* Smaller viewport area */}
            <div 
              className={`w-full h-48 bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center ${shake ? 'animate-shake' : ''}`}
              id="stair-viewport-portrait"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Viewport scrolling anchor - Mathematically locked to the 2/3rd height mark of the screen with zero drift */}
              <div 
                className="absolute left-1/2 top-1/2 transition-all duration-150 ease-out"
                style={{
                  transform: `translate(-50%, -50%) translate(0px, 32px) scale(${zoomScale}) translate(${-activeStair.x}px, ${-activeStair.y}px)`,
                  transformOrigin: 'center center'
                }}
              >
                <div>
                  {stairsToRender.map((stair) => {
                    const isActive = stair.index === currentStep;
                    const isPassed = stair.index < currentStep;
                    const isGoal = stair.index === TOTAL_STAIRS;

                    if (Math.abs(stair.index - currentStep) > 9) return null;

                    return (
                      <div
                        key={stair.index}
                        className="absolute pointer-events-none transition-all"
                        style={{
                          left: stair.x,
                          top: stair.y,
                        }}
                      >
                        <div 
                          className={`w-14 h-4 rounded-sm border-b-[3px] flex items-center justify-center transition-all ${
                            isActive 
                              ? 'bg-amber-400 border-amber-600 text-amber-950 scale-105 shadow-[0_0_12px_rgba(251,191,36,0.6)] font-bold' 
                              : isGoal
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 border-emerald-600 text-slate-100 font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                              : isPassed
                              ? 'bg-slate-800 border-slate-950 text-slate-500 opacity-40'
                              : 'bg-slate-700 border-slate-900 text-slate-300'
                          }`}
                          style={{ transform: 'skewX(-20deg)' }}
                        >
                          <span className="text-[8px] font-mono block transform skewX(20deg) leading-none">
                            {stair.index === TOTAL_STAIRS ? '👑 32' : `${stair.index}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <motion.div
                    className="absolute z-20 transition-transform duration-100"
                    style={{
                      left: activeStair.x + 6,
                      top: activeStair.y - 46,
                    }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                    key={currentStep}
                  >
                    <div 
                      className="transition-transform"
                      style={{ transform: playerDir === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}
                    >
                      <SchoolUniformBoy direction={playerDir} />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Status flag overlay */}
              <div className="absolute top-2 left-2 bg-slate-950/80 border border-slate-850 px-2 py-1 rounded-lg z-20 flex flex-col font-mono text-[9px]">
                <span className="text-slate-400 text-left">나의 방향</span>
                <span className={`font-bold mt-0.5 flex items-center gap-0.5 ${playerDir === 'left' ? 'text-blue-400' : 'text-orange-400'}`}>
                  {playerDir === 'left' ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  {playerDir === 'left' ? '왼쪽' : '오른쪽'}
                </span>
              </div>

              {/* Game state overlays for Portrait */}
              <AnimatePresence>
                {gameState === 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-3 z-30"
                  >
                    <Play className="w-8 h-8 text-orange-400 mx-auto animate-bounce mb-2" />
                    <h3 className="text-xs font-bold text-white">무한의 학점 계단 훈련</h3>
                    <button
                      onClick={initGame}
                      className="mt-3 px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition"
                    >
                      게임 시작!
                    </button>
                  </motion.div>
                )}

                {gameState === 'failed' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-3 z-30"
                  >
                    <h3 className="text-xs font-bold text-red-400">발을 헛디뎠어! 💥</h3>
                    <span className="text-amber-400 font-mono text-[11px] mt-1 font-semibold">
                      기록: {currentStep}계단
                    </span>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={initGame}
                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>다시 기회</span>
                      </button>
                      <button
                        onClick={bypassSuccess}
                        className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-orange-500 text-white text-[10px] font-bold rounded-lg transition"
                      >
                        패스하기
                      </button>
                    </div>
                  </motion.div>
                )}

                {gameState === 'cleared' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-3 z-30 text-center"
                  >
                    <h3 className="text-xs font-bold text-emerald-400">32계단 등반 극적 완료! 🎉</h3>
                    <button
                      onClick={onClear}
                      className="mt-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-[10px] transition"
                    >
                      2차 배치하러 가기! 🚀
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons for Normal Portrait View */}
            <div className="grid grid-cols-2 gap-2 mt-1 z-10 font-mono">
              <button
                onTouchStart={(e) => { e.preventDefault(); triggerChangeDir(); }}
                onMouseDown={(e) => { e.preventDefault(); triggerChangeDir(); }}
                disabled={gameState !== 'playing'}
                className="h-12 bg-gradient-to-br from-indigo-600 to-blue-500 border border-indigo-400/20 text-white font-bold rounded-xl flex flex-col items-center justify-center shadow-lg active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition select-none cursor-pointer p-1"
              >
                <div className="flex gap-1 items-center">
                  <ChevronLeft className="w-3 h-3 text-indigo-200 animate-pulse" />
                  <span className="text-xs font-extrabold">방향 바꾸기</span>
                  <ChevronRight className="w-3 h-3 text-indigo-400/30" />
                </div>
                <span className="text-[7.5px] text-indigo-200 font-normal">Z키 / 터치</span>
              </button>

              <button
                onTouchStart={(e) => { e.preventDefault(); triggerClimb(); }}
                onMouseDown={(e) => { e.preventDefault(); triggerClimb(); }}
                disabled={gameState !== 'playing'}
                className="h-12 bg-gradient-to-br from-orange-500 to-amber-500 border border-orange-400/20 text-slate-950 font-bold rounded-xl flex flex-col items-center justify-center shadow-lg active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition select-none cursor-pointer p-1"
              >
                <div className="flex gap-1 items-center">
                  <span className="text-[10px]">🏃‍♂️</span>
                  <span className="text-xs font-extrabold text-white">올라가기</span>
                </div>
                <span className="text-[7.5px] text-white/80 font-normal">X키 / Space</span>
              </button>
            </div>

            {/* Touch Bypass */}
            <div className="flex justify-between text-[9px] text-slate-500 font-mono select-none px-1 mt-1">
              <span>※ 모바일/태블릿 터치 터치 완료</span>
              <button 
                type="button" 
                onClick={bypassSuccess}
                className="hover:text-amber-400 text-slate-600 transition underline decoration-dotted"
              >
                건너뛰기
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

