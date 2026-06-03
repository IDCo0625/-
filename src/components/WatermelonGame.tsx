import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, AlertTriangle, Sparkles, Trophy, Play, CheckCircle2 } from 'lucide-react';

interface Tier {
  id: number;
  emoji: string;
  name: string;
  radius: number;
  color: string;
  score: number;
}

const TIERS: Tier[] = [
  { id: 0, emoji: '🍇', name: '인문독서', radius: 14, color: '#A855F7', score: 5 },
  { id: 1, emoji: '🍓', name: '연산수리', radius: 18, color: '#EC4899', score: 10 },
  { id: 2, emoji: '🍊', name: '사회탐구', radius: 22, color: '#F97316', score: 15 },
  { id: 3, emoji: '🍋', name: '자연물리', radius: 26, color: '#EAB308', score: 20 },
  { id: 4, emoji: '🍏', name: '메카코딩', radius: 31, color: '#22C55E', score: 30 },
  { id: 5, emoji: '🍑', name: '의약보건', radius: 37, color: '#EF4444', score: 40 },
  { id: 6, emoji: ' Pineapple 🍍', name: '예술감성', radius: 44, color: '#06B6D4', score: 55 },
  { id: 7, emoji: '🍉', name: '똑띠학점', radius: 52, color: '#10B981', score: 80 },
];

// Normalize the Pineapple object to standard emoji
TIERS[6] = { id: 6, emoji: '🍍', name: '예술감성', radius: 44, color: '#06B6D4', score: 55 };

interface Ball {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  tier: number;
  emoji: string;
  name: string;
  color: string;
  scale: number; // For merge spring pop animation
  isMerging: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number;
  maxLife: number;
}

interface WatermelonGameProps {
  onClear: () => void;
  playerName: string;
}

export default function WatermelonGame({ onClear, playerName }: WatermelonGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [watermelonCreated, setWatermelonCreated] = useState<boolean>(false);
  const [supplementClearing, setSupplementClearing] = useState<boolean>(false);

  // Score threshold for dungeon completion
  const GOAL_SCORE = 200;

  // Drop configuration states
  const [nextBallTier, setNextBallTier] = useState<number>(0);
  const [currentBallTier, setCurrentBallTier] = useState<number>(0);
  const [dropCooldown, setDropCooldown] = useState<boolean>(false);
  const [mouseX, setMouseX] = useState<number>(160);

  // References for live rendering (avoid closure lag in animation loops)
  const ballsRef = useRef<Ball[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const audioContextReady = useRef<boolean>(false);

  // Warning thresholds
  const warningLineY = 85;
  const [dangerTimer, setDangerTimer] = useState<number>(0); // countdown before game over when overflow

  // Setup random initial/next drop balls
  const pickRandomInitialTier = () => {
    // Players can drop Grape(0), Strawberry(1), or Orange(2) initially
    return Math.floor(Math.random() * 3);
  };

  useEffect(() => {
    setNextBallTier(pickRandomInitialTier());
    setCurrentBallTier(pickRandomInitialTier());
  }, []);

  // Web audio synthesized buzz on merge (keeps the game clean & immersive)
  const playMergeSound = (tier: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      // Pitch goes up as the tier expands
      osc.frequency.setValueAtTime(220 + tier * 60, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440 + tier * 100, audioCtx.currentTime + 0.15);

      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.22);
    } catch (e) {
      // Ignored if browser blocks audio autoplay
    }
  };

  const initGame = () => {
    ballsRef.current = [];
    particlesRef.current = [];
    setScore(0);
    setGameOver(false);
    setWatermelonCreated(false);
    setSupplementClearing(false);
    setDangerTimer(0);
    setNextBallTier(pickRandomInitialTier());
    setCurrentBallTier(pickRandomInitialTier());
  };

  // Click / Drop triggers falling object
  const handleContainerClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameOver || dropCooldown) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    // Radius constraints
    const radius = TIERS[currentBallTier].radius;
    const clampedX = Math.max(radius + 10, Math.min(canvas.width - radius - 10, clickX));

    // Spawn ball
    const newBall: Ball = {
      id: Math.random().toString(),
      x: clampedX,
      y: 40, // Drop entry level
      vx: (Math.random() - 0.5) * 1.5, // Subtle initial drift
      vy: 2.5,
      radius: radius,
      tier: currentBallTier,
      emoji: TIERS[currentBallTier].emoji,
      name: TIERS[currentBallTier].name,
      color: TIERS[currentBallTier].color,
      scale: 1.0,
      isMerging: false
    };

    ballsRef.current.push(newBall);

    // Cooldown trigger
    setDropCooldown(true);
    setTimeout(() => {
      setDropCooldown(false);
      // Bring next ball forward
      setCurrentBallTier(nextBallTier);
      setNextBallTier(pickRandomInitialTier());
    }, 450);
  };

  // Track hover coordinate
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  // Sparkle particle emitter
  const spawnMergeParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 2.8;
      particlesRef.current.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5, // slight upward gravity float
        color: color,
        radius: 2 + Math.random() * 3,
        life: 0,
        maxLife: 25 + Math.floor(Math.random() * 20),
      });
    }
  };

  // Core Physics and Render Core Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;

    const updatePhysics = () => {
      const balls = ballsRef.current;

      // Gravity and Friction factors
      const gravity = 0.28;
      const rebound = 0.32; // Wall bouncing elasticy 
      const boundaryFriction = 0.94; // slows down sliding
      const drag = 0.993; // Air friction damping

      // 1. Move and bounded updates
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        
        // Apply acceleration
        b.vy += gravity;
        
        // Fluid drag
        b.vx *= drag;
        b.vy *= drag;

        // Apply velocities
        b.x += b.vx;
        b.y += b.vy;

        // Wall collisions
        if (b.x < b.radius) {
          b.x = b.radius;
          b.vx = -b.vx * rebound;
        } else if (b.x > canvas.width - b.radius) {
          b.x = canvas.width - b.radius;
          b.vx = -b.vx * rebound;
        }

        // Floor collision
        if (b.y > canvas.height - b.radius) {
          b.y = canvas.height - b.radius;
          b.vy = -b.vy * rebound;
          b.vx *= boundaryFriction;
          
          if (Math.abs(b.vy) < 0.2) b.vy = 0;
          if (Math.abs(b.vx) < 0.15) b.vx = 0;
        }

        // Scale pop animation bounce easing
        if (b.scale < 1.0) {
          b.scale += 0.08;
          if (b.scale > 1.0) b.scale = 1.0;
        }
      }

      // 2. Pairwise Circle overlap solver and Merge trigger
      let nextBalls = [...balls];
      let mergesThisFrame: string[] = [];

      for (let pass = 0; pass < 2; pass++) { // 2 passes makes simulation stiffer and overlapping rarer
        for (let i = 0; i < nextBalls.length; i++) {
          for (let j = i + 1; j < nextBalls.length; j++) {
            const b1 = nextBalls[i];
            const b2 = nextBalls[j];

            if (mergesThisFrame.includes(b1.id) || mergesThisFrame.includes(b2.id)) {
              continue;
            }

            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = b1.radius + b2.radius;

            if (dist < minDist) {
              const overlap = minDist - dist;

              // Check if they trigger a Merge (Same tier logic!)
              if (b1.tier === b2.tier && !b1.isMerging && !b2.isMerging) {
                b1.isMerging = true;
                b2.isMerging = true;
                mergesThisFrame.push(b1.id);
                mergesThisFrame.push(b2.id);

                // Midpoint center for upgraded spawn
                const midX = (b1.x + b2.x) / 2;
                const midY = (b2.y + b2.y) / 2;

                const nextTierId = b1.tier + 1;

                // Handle maximum tier caps
                if (nextTierId < TIERS.length) {
                  // Merge points addition
                  const earnedPoints = TIERS[nextTierId].score;
                  setScore(prev => prev + earnedPoints);

                  // Detect watermelon creation (level 7🍉)
                  if (nextTierId === 7) {
                    setWatermelonCreated(true);
                  }

                  // Update b1 parameters dynamically instead of full rebuild
                  b1.tier = nextTierId;
                  b1.radius = TIERS[nextTierId].radius;
                  b1.emoji = TIERS[nextTierId].emoji;
                  b1.name = TIERS[nextTierId].name;
                  b1.color = TIERS[nextTierId].color;
                  b1.x = midX;
                  b1.y = midY - 3; // tiny vertical pop jump
                  b1.vx = (b1.vx + b2.vx) / 2;
                  b1.vy = -2.2; // tiny jump reaction!
                  b1.scale = 0.35; // spring visual pop
                  b1.isMerging = false;

                  playMergeSound(nextTierId);
                  spawnMergeParticles(midX, midY, b1.color);

                  // Filter out the engulfed ball
                  nextBalls = nextBalls.filter(b => b.id !== b2.id);
                } else {
                  // Max tier watermelon double merge bonus!
                  setScore(prev => prev + 120);
                  setWatermelonCreated(true);
                  spawnMergeParticles(midX, midY, '#FFD700');
                  playMergeSound(9);
                  // Double delete elements since fully completed tier
                  nextBalls = nextBalls.filter(b => b.id !== b1.id && b.id !== b2.id);
                }
                break;
              }

              // Resolve static overlap pushing
              if (dist === 0) continue; // safety zero division guard
              const nx = dx / dist;
              const ny = dy / dist;

              // Elastic impulse resolution
              b1.x -= nx * overlap * 0.51;
              b1.y -= ny * overlap * 0.51;
              b2.x += nx * overlap * 0.51;
              b2.y += ny * overlap * 0.51;

              // Relative speed damping
              const kx = b1.vx - b2.vx;
              const ky = b1.vy - b2.vy;
              const vn = kx * nx + ky * ny;

              if (vn > 0) {
                const impulse = vn * 0.44; // friction impulse reduction
                b1.vx -= nx * impulse;
                b1.vy -= ny * impulse;
                b2.vx += nx * impulse;
                b2.vy += ny * impulse;
              }
            }
          }
        }
      }

      ballsRef.current = nextBalls;

      // 3. Particles physics updates
      let particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // subtle gravity drift
        p.life++;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }
    };

    const drawGame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Warning baseline backdrop line at top
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(0, warningLineY);
      ctx.lineTo(canvas.width, warningLineY);
      ctx.stroke();
      ctx.setLineDash([]); // clear dash

      // Overflow indicator glow
      const balls = ballsRef.current;
      let isOverlyHigh = false;
      balls.forEach(b => {
        // Only trigger overflow warning if resting high (meaning velocity is low)
        if (b.y < warningLineY + b.radius && Math.abs(b.vy) < 0.5) {
          isOverlyHigh = true;
        }
      });

      if (isOverlyHigh) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.06)';
        ctx.fillRect(0, 0, canvas.width, warningLineY);

        ctx.strokeStyle = 'rgba(239,68,68,0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, warningLineY);
        ctx.lineTo(canvas.width, warningLineY);
        ctx.stroke();

        ctx.fillStyle = 'rgba(239,68,68,0.7)';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ OVERFLOW DANGER ZONE ⚡', canvas.width / 2, warningLineY - 12);
      }

      // 1. Draw dropped balls
      balls.forEach((b) => {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.scale(b.scale, b.scale);

        // Circular background glow
        const grad = ctx.createRadialGradient(0, 0, b.radius * 0.1, 0, 0, b.radius);
        grad.addColorStop(0, 'white');
        grad.addColorStop(0.3, b.color + 'A0');
        grad.addColorStop(1, b.color);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius - 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Stroke boundary
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        // Draw inner emoji and text descriptors
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Font sizing according to physical circle scaling
        const emojiSize = Math.max(12, b.radius * 0.85);
        ctx.font = `${emojiSize}px sans-serif`;
        ctx.fillText(b.emoji, 0, -1);

        // Class name shorthand label for detailed stats
        if (b.radius > 24) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.font = 'bold 8px system-ui';
          // Label shadow overlay
          ctx.fillText(b.name, 0, b.radius * 0.45);
        }

        ctx.restore();
      });

      // 2. Draw sparkles particles
      const particles = particlesRef.current;
      particles.forEach((p) => {
        const opacity = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * opacity, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0; // reset

      // 3. Drop Position Cursor Guide Floating element (top)
      if (!gameOver && !dropCooldown) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,165,0,0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        // Clamped mouse line
        const r_preview = TIERS[currentBallTier].radius;
        const clampedPreviewX = Math.max(r_preview + 10, Math.min(canvas.width - r_preview - 10, mouseX));

        ctx.moveTo(clampedPreviewX, 40);
        ctx.lineTo(clampedPreviewX, canvas.height);
        ctx.stroke();
        ctx.restore();

        // Draw preview bubble
        ctx.save();
        ctx.translate(clampedPreviewX, 35);
        ctx.globalAlpha = 0.85;

        ctx.fillStyle = TIERS[currentBallTier].color;
        ctx.beginPath();
        ctx.arc(0, 0, r_preview, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'white';
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${r_preview * 0.85}px sans-serif`;
        ctx.fillText(TIERS[currentBallTier].emoji, 0, 0);

        ctx.restore();
      }
    };

    // Game interval ticks
    let lastTime = 0;
    const loop = (timestamp: number) => {
      updatePhysics();
      drawGame();

      // Monitor danger stack timer
      const balls = ballsRef.current;
      let hasOverflow = false;
      balls.forEach(b => {
        // Resting on top of line
        if (b.y < warningLineY + b.radius && Math.abs(b.vy) < 0.2) {
          hasOverflow = true;
        }
      });

      if (hasOverflow) {
        setDangerTimer(prev => {
          const next = prev + 1;
          if (next > 400) { // roughly 6 seconds resting on top
            setGameOver(true);
            return 0;
          }
          return next;
        });
      } else {
        setDangerTimer(0);
      }

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [currentBallTier, mouseX, gameOver, nextBallTier, dropCooldown]);

  return (
    <div className="flex flex-col gap-4 text-left w-full h-full font-sans" id="suika-game-container">
      {/* Title block */}
      <div className="border-b border-white/10 pb-3 flex justify-between items-center sm:items-end">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full inline-block">
            2단계: 1차 전직던전 시련 (수박게임)
          </span>
          <h3 className="text-base font-bold text-white mt-1">학업 수박 머지 던전 (목표: 🍉 수박 만들기)</h3>
        </div>
        <div className="bg-[#15181E] text-white/90 px-3 py-1 text-xs rounded-xl font-mono border border-white/10 text-right">
          <span className="text-white/40 block text-[9px] uppercase tracking-wider mb-0.5">DIAGNOSTIC SCORE</span>
          <span className="text-base font-black text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">
            {score}
          </span>
          <span className="text-white/40 font-normal"> pt</span>
        </div>
      </div>

      <div className="text-xs text-white/55 leading-relaxed bg-[#15181E]/40 border border-white/5 p-3 rounded-xl flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5 animate-spin" />
        <p>
          <strong>던전 전직 규칙:</strong> 마우스나 손가락을 움직여 전설 과목들을 낙하시키세요! <strong>동일한 전직 과목끼리 충돌</strong>하여 계속 융합시키고, 최종 등급인 <strong>🍉 똑띠학점(수박 과목)</strong>을 완성하면 전설의 영물 칭호 획득권이 즉시 열립니다! 혹시 가득 차 실패하더라도 <strong>🎓 보충수업 통과</strong>를 통해 안전하게 칭호를 획득할 수 있습니다.
        </p>
      </div>

      {/* Main Board and Info split layout */}
      <div className="flex flex-col sm:flex-row gap-5 items-stretch justify-center w-full relative">
        
        {/* Playable Cargo Board Canvas */}
        <div className="relative border-4 border-[#2D3139] bg-[#0E1014] rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex-1 select-none flex items-center justify-center max-w-[328px] mx-auto">
          <canvas
            ref={canvasRef}
            width={320}
            height={460}
            onClick={handleContainerClick}
            onMouseMove={handleMouseMove}
            className="cursor-crosshair block bg-transparent"
          />

          {/* Core Danger/Overflow Gauge */}
          {dangerTimer > 50 && !gameOver && (
            <div className="absolute top-28 left-0 right-0 bg-red-600/90 text-white text-[11px] font-bold text-center py-1.5 px-3 uppercase tracking-widest animate-pulse shadow-lg">
              ⚠️ 과목 포화 경보! {Math.ceil((400 - dangerTimer) / 60)}초 전 폭발! ⚠️
            </div>
          )}

          {/* Game Over Modal overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm z-30">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-2 animate-bounce" />
              <h4 className="text-sm font-bold text-white font-sans">앗! 과목 전조 포화 상태 돌입!</h4>
              <p className="text-[11px] text-white/50 mt-1 max-w-[240px] leading-relaxed">
                일정 높이를 초과하여 학업 정체 현상이 터졌습니다! 다시 시작해서 수박에 재도전하거나, 편안하게 보충수업 상담 훈련을 받아 던전을 통과해 보세요!
              </p>
              
              <div className="flex flex-col gap-2 w-full max-w-[220px] mt-4">
                <button
                  onClick={initGame}
                  className="bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>던전 정화 다시 도전</span>
                </button>
                
                <button
                  onClick={() => {
                    setSupplementClearing(true);
                    setGameOver(false);
                    setWatermelonCreated(false);
                  }}
                  className="bg-gradient-to-r from-cyan-600 to-blue-500 hover:brightness-110 text-white font-extrabold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition cursor-pointer"
                >
                  <span>🎓 보충수업으로 전직 통과</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Legend sidebar showing merge sequence */}
        <div className="flex flex-col justify-between w-full sm:w-[130px] p-3 border border-white/5 bg-[#14171D] rounded-2xl shrink-0 gap-3">
          <div>
            <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider">Merge Synergy (융합도)</span>
            <div className="space-y-1.5 mt-2">
              {TIERS.map((tier) => (
                <div key={tier.id} className="flex items-center gap-2 text-[10px] text-white/70">
                  <span className="text-sm bg-white/5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border border-white/5 select-none font-sans">
                    {tier.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate leading-none mb-0.5">{tier.name}</p>
                    <p className="font-mono text-[8px] text-white/30">Lv.{tier.id + 1} {tier.id === 7 ? '⭐최종' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-3 flex flex-row sm:flex-col gap-2 items-center justify-between">
            {/* Display pending next indicators */}
            <div className="flex sm:flex-col gap-1 items-center bg-[#0E1013] p-2 rounded-xl border border-white/5 w-full">
              <span className="text-[8px] text-white/30 uppercase font-mono leading-none tracking-wider sm:mb-1 block text-center">Next Drop</span>
              <span className="text-xl w-8 h-8 rounded-full border border-orange-500/20 bg-orange-500/5 flex items-center justify-center select-none shadow-[0_0_10px_rgba(249,115,22,0.1)] font-sans">
                {TIERS[nextBallTier]?.emoji}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <button
                onClick={initGame}
                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] py-1.5 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer w-full"
                title="게임 리셋"
              >
                <RotateCcw className="w-3" />
                <span>시련 초기화</span>
              </button>

              <button
                onClick={() => {
                  setSupplementClearing(true);
                  setGameOver(false);
                  setWatermelonCreated(false);
                }}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 hover:text-cyan-300 text-[10px] py-1.5 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer w-full font-bold"
              >
                <span>🎓 보충수업하기</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Main stage completed actions portal - CASE 1: WATERMELON MERGE COMPLETE */}
      {watermelonCreated && (
        <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 mt-1 shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-pulse">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-red-500 to-green-500 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(239,68,68,0.4)] select-none">
              🍉
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-400 font-sans">전설의 수박(똑띠학점) 과목 합체 대성공! 🏆</h4>
              <p className="text-[10px] text-white/70 mt-0.5">
                과목 설계의 끝판왕인 <strong>똑띠학점 융합 수박</strong>을 완벽히 창조해냈어! 어마어마한 전직 통과 자격증을 손에 넣었습니다!
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:brightness-110 active:scale-95 cursor-pointer transition flex items-center gap-1.5 font-mono ml-auto"
          >
            <span>전설의 클래스 칭호 획득하기</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main stage completed actions portal - CASE 2: SUPPLEMENTARY LESSON BYPASS */}
      {supplementClearing && (
        <div className="bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/30 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 mt-1 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] select-none">
              🎓
            </div>
            <div>
              <h4 className="text-xs font-black text-cyan-400 font-sans">과정 중심 똑띠 보충수업 정식 이수 완료!</h4>
              <p className="text-[10px] text-white/70 mt-0.5">
                학업 정체 구간 치료를 위해 <strong>개별 똑띠 보충강의 및 교과 성실 상담</strong>을 정직하게 수강해 1차 전직자격을 획득하였습니다!
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-[0_4px_15px_rgba(6,182,212,0.3)] hover:brightness-110 active:scale-95 cursor-pointer transition flex items-center gap-1.5 font-sans ml-auto"
          >
            <span>보충이수 확인 및 클래스 칭호 획득하기</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
