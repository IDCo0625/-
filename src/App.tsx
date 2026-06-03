/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Shield, 
  Sparkles, 
  Beaker, 
  Cpu, 
  Heart, 
  Palette, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  User, 
  GraduationCap, 
  ChevronRight, 
  HelpCircle, 
  Trophy, 
  MessageSquare,
  Sparkle,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { CLASSES, COMMON_SUBJECTS, SKILL_MAP } from './data';
import { ClassTitle, GameState, CharacterStats, Subject, ChatLog } from './types';
import WatermelonGame from './components/WatermelonGame';
import StairGame from './components/StairGame';

export default function App() {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    playerName: '',
    schoolName: '',
    selectedClass: null,
    step: 'opening',
    selectedGeneral: [],
    selectedAdvanced: [],
    selectedFusion: [],
    chatbotLogs: []
  });

  const [inputName, setInputName] = useState('');
  const [inputSchool, setInputSchool] = useState('');
  const [typedMessage, setTypedMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [scoutReport, setScoutReport] = useState<string>('');
  const [ddokddiEmotion, setDdokddiEmotion] = useState<'friendly' | 'happy' | 'thinking' | 'victory' | 'surprised'>('friendly');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.chatbotLogs]);

  // Initial greeting once on opening
  useEffect(() => {
    if (gameState.chatbotLogs.length === 0) {
      const initialLogs: ChatLog[] = [
        {
          id: 'welcome-1',
          sender: 'ddokddi',
          text: '삐리빅-! 안녕, 모험가! 🤖✨\n여기는 나만의 특별한 3년을 설계하는 **[LV.192 고교학점제 캐릭터 빌딩 던전]**이야! 나는 네 학업 설계를 무사히 도와줄 안내 로봇 **"똑띠"**라고 해!\n\n너만의 멋진 전설의 캐릭터 카드를 만들기 위해 먼저 통행증을 끊어볼까? 모험가의 **이름**과 **학교**를 나에게 알려줘! 삐리빅!',
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          status: 'friendly'
        }
      ];
      setGameState(prev => ({ ...prev, chatbotLogs: initialLogs }));
    }
  }, []);

  const addChatLog = (sender: 'ddokddi' | 'player', text: string, status?: any) => {
    const newLog: ChatLog = {
      id: Math.random().toString(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      status
    };
    setGameState(prev => ({
      ...prev,
      chatbotLogs: [...prev.chatbotLogs, newLog]
    }));
  };

  // call server gemini api for ddokddi voice
  const askDdokddiAI = async (messageText: string, currentStep: string, nextState: Partial<GameState>) => {
    setIsAiLoading(true);
    setDdokddiEmotion('thinking');

    try {
      const response = await fetch('/api/ddokddi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: gameState.playerName || inputName,
          schoolName: gameState.schoolName || inputSchool,
          selectedClass: gameState.selectedClass || nextState.selectedClass,
          step: currentStep,
          selectedGeneral: nextState.selectedGeneral || gameState.selectedGeneral,
          selectedAdvanced: nextState.selectedAdvanced || gameState.selectedAdvanced,
          selectedFusion: nextState.selectedFusion || gameState.selectedFusion,
          playerMessage: messageText
        })
      });

      const data = await response.json();
      
      // Update state together
      setGameState(prev => ({
        ...prev,
        ...nextState,
        chatbotLogs: [
          ...prev.chatbotLogs,
          {
            id: Math.random().toString(),
            sender: 'ddokddi',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            status: 'friendly'
          }
        ]
      }));
      setDdokddiEmotion('happy');
    } catch (e) {
      console.error("AI ddokddi call failed:", e);
      // fallback reply
      let fallbackText = "삐리빅... 네트워크 전송로에 정전기가 일어서 우주 전파가 방해받았어! 하지만 걱정하지 마! 똑띠의 안전 보조 로직이 작동해서 훈련을 가이드해줄게!";
      setGameState(prev => ({
        ...prev,
        ...nextState,
        chatbotLogs: [
          ...prev.chatbotLogs,
          {
            id: Math.random().toString(),
            sender: 'ddokddi',
            text: fallbackText,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            status: 'friendly'
          }
        ]
      }));
      setDdokddiEmotion('friendly');
    } finally {
      setIsAiLoading(false);
    }
  };

  const getGeneralSubjects = () => {
    if (gameState.selectedClass) {
      return SKILL_MAP[gameState.selectedClass].general;
    }
    // Extract unique general subjects from across ALL classes!
    const allGen = Object.keys(CLASSES).flatMap(key => SKILL_MAP[key].general);
    const uniqueMap = new Map<string, typeof allGen[0]>();
    allGen.forEach(sub => {
      uniqueMap.set(sub.id, sub);
    });
    return Array.from(uniqueMap.values());
  };

  const handleStartAdventure = () => {
    if (!inputName.trim() || !inputSchool.trim()) return;

    const welcomeGreeting = `나는 ${inputSchool}의 자랑스러운 모험가, ${inputName}이야! 준비는 끝났어, 똑띠야!`;
    const nextState: Partial<GameState> = {
      playerName: inputName,
      schoolName: inputSchool,
      step: 'common_intro'
    };

    addChatLog('player', welcomeGreeting);

    const matchMessage = `삐릭빅! ${inputSchool}의 ${inputName} 모험가님 환영해! ✨\n\n본격적인 전직 모험 설계에 앞서, 고교 3개년 스킬트리의 가장 기본이자 든든한 뼈대가 되어 줄 **'공통 필수 패시브(48학점 자동 획득 - 공통국어, 공통수학, 공통영어, 통합사회, 통합과학 등)'** 보급 던전이 소환되어 주입 완료되었어!\n\n이 튼튼한 기본 패시브 영양소를 흡수한 뒤, 곧바로 다음 단계인 '1차 전직 대성당' 관문으로 함께 떠나보자구! 삐리빅-!`;
    
    // Smooth scroll and set up with delay or direct call
    setGameState(prev => ({
      ...prev,
      ...nextState,
      chatbotLogs: [
        ...prev.chatbotLogs,
        {
          id: Math.random().toString(),
          sender: 'ddokddi',
          text: matchMessage,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          status: 'happy'
        }
      ]
    }));
    setDdokddiEmotion('happy');
  };

  const handleNextToClassSelect = () => {
    addChatLog('player', `수박게임 시련 융합 기믹 돌파 완료! 1차 전직던전 공식 통과!`);

    const nextState: Partial<GameState> = {
      step: 'class_select'
    };

    const introText = `삐리리빅! 대박 성공이야 🏆! 모험가님은 수박게임 시련을 머리 좋게 돌파해내셨어! 똑띠의 지능 수치 계측기가 환호성을 지르는 중이라구!\n\n지혜의 시련을 성공적으로 극복해 자격을 완벽히 증명했으니, 드디어 네 영혼의 정체성을 투영할 **'계열 클래스 영혼 칭호(스토리텔러, 연금술사, 메카닉 등)'** 교감 대성당에 무사히 입장 완료했어!\n\n너의 지적인 취향에 가장 알맞고 가슴을 설레게 하는 고결한 진로 클래스를 간택해줘! 정체성 장착 즉시 다음 32학점 과목 수집 던전 슬롯이 자동 전위된다구! 삐리빅-!`;
    
    setGameState(prev => ({
      ...prev,
      ...nextState,
      chatbotLogs: [
        ...prev.chatbotLogs,
        {
          id: Math.random().toString(),
          sender: 'ddokddi',
          text: introText,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          status: 'victory'
        }
      ]
    }));
    setDdokddiEmotion('victory');
  };

  const handleClassSelect = (classId: ClassTitle) => {
    const classKorean = CLASSES[classId].name;
    const playerMsg = `나는 전설의 칭호 [${classKorean}] 클래스를 선택하겠어! 삐리빅!`;
    addChatLog('player', playerMsg);

    const nextState: Partial<GameState> = {
      selectedClass: classId,
      step: 'gen_selection'
    };

    const aiCallPrompt = `나는 공통패시브 이수 후, 대성당 시련(수박게임)을 돌파하고 드디어 자랑스러운 [${classKorean}] 클래스로 각성했어! 이제 계열 성장에 필요한 '1차 전직하는란 (일반 선택 과목 32학점 - 8과목)' 수집 슬롯으로 넘어갈래 똑띠야!`;
    askDdokddiAI(aiCallPrompt, 'gen_selection', nextState);
  };

  const handleAcceptCommon = () => {
    addChatLog('player', `공통 필수 패시브 48학점 보급 수령 확인 완료! 이제 똑띠학점 수박게임 기믹을 풀어서 전직 자격을 증명하러 가자!`);

    const nextState: Partial<GameState> = {
      step: 'dungeon_game'
    };

    const matchMessage = `삐리빅! 공통과목 48학점 패시브 보급을 아주 든든하게 장착했구나!\n\n이제 1차 전직 대성당에 온전히 들어가기 위해, 똑띠가 특별 소환한 첫 번째 관문인 **'똑띠학점 수박게임(RPG 시련)'**을 멋지게 극복할 시간이야! 🍉\n\n지혜의 과일(학점 블록)들을 충돌시켜 최고의 똑띠학점 수박을 만들어내거나 보충 훈련법을 달성해서 진수를 얻어봐! 돌파에 비전 성공하면 곧이어 너를 대변하는 **계열 클래스 칭호**가 수여될 거야! 삐리빅-!`;
    
    setGameState(prev => ({
      ...prev,
      ...nextState,
      chatbotLogs: [
        ...prev.chatbotLogs,
        {
          id: Math.random().toString(),
          sender: 'ddokddi',
          text: matchMessage,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          status: 'friendly'
        }
      ]
    }));
    setDdokddiEmotion('friendly');
  };

  const toggleSubject = (subjectId: string, type: 'general' | 'advanced' | 'fusion') => {
    const key = type === 'general' ? 'selectedGeneral' : type === 'advanced' ? 'selectedAdvanced' : 'selectedFusion';
    const limit = type === 'general' ? 8 : type === 'advanced' ? 6 : 4;
    const currentList = gameState[key];

    if (currentList.includes(subjectId)) {
      setGameState(prev => ({
        ...prev,
        [key]: prev[key].filter(id => id !== subjectId)
      }));
    } else {
      if (currentList.length >= limit) return; // limit reached
      setGameState(prev => ({
        ...prev,
        [key]: [...prev[key], subjectId]
      }));
    }
  };

  const handleNextToStairGame = () => {
    if (gameState.selectedGeneral.length < 8) return;
    const selectedObjList = SKILL_MAP[gameState.selectedClass!].general.filter(s => gameState.selectedGeneral.includes(s.id));
    const isCompletedText = selectedObjList.map(s => s.name).join(', ');

    addChatLog('player', `일반 선택 32학점 빌드 완료! 장착 과목: [${isCompletedText}]`);

    const nextState: Partial<GameState> = {
      step: 'stair_game'
    };

    const matchMessage = `삐리리빅! 1차 전직하는란 일반 선택 32학점 빌드 배치를 모두 완료했구나! 🛠️\n\n하지만 고등학교 2·3학년 시기의 꽃인 **'2차 진로 선택 24학점 (6과목)'**에 정식 도전하기 위해서는, 고착화된 관념을 일깨우는 특별한 두뇌 반응성 시련을 돌파해내야만 해!\n\n그 이름하여 **'무한의 학점 계단'**! 방향 전환 요령과 한 번의 낙하도 없이 똑띠가 깔아놓은 32학점(32계단) 골인 지점까지 무사히 우회하여 등정해봐! 등정 완료 즉시 다음 비전 과목 슬롯이 해방될 거라구! 삐리빅!`;

    setGameState(prev => ({
      ...prev,
      ...nextState,
      chatbotLogs: [
        ...prev.chatbotLogs,
        {
          id: Math.random().toString(),
          sender: 'ddokddi',
          text: matchMessage,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          status: 'surprised'
        }
      ]
    }));
    setDdokddiEmotion('surprised');
  };

  const handleFinishStairGame = () => {
    addChatLog('player', `무한의 32학점 계단 기믹 정복 성공! 2차 진로 선택 비전 슬롯 해방!`);

    const nextState: Partial<GameState> = {
      step: 'adv_selection'
    };

    const classKorean = gameState.selectedClass ? CLASSES[gameState.selectedClass].name : '클래스';
    const aiCallPrompt = `나는 일반선택 32학점 매칭을 성공하고 똑띠가 수여한 32계단 등반 시련(무한의 계단)을 우아하게 타파했어! 이제 나의 계열 클래스 [${classKorean}]에 적합한 실전 '2차 진로 선택 24학점(6과목)' 비전 슬롯 전송 가이드 및 지시를 내려줘 똑띠야!`;
    askDdokddiAI(aiCallPrompt, 'adv_selection', nextState);
  };

  const handleNextToFusion = () => {
    if (gameState.selectedAdvanced.length < 6) return;
    const selectedObjList = SKILL_MAP[gameState.selectedClass!].advanced.filter(s => gameState.selectedAdvanced.includes(s.id));
    const isCompletedText = selectedObjList.map(s => s.name).join(', ');

    addChatLog('player', `진로 선택 24학점 심화 보석 장착 완료! 장착 과목: [${isCompletedText}]`);

    const nextState: Partial<GameState> = {
      step: 'fus_selection'
    };

    const aiCallPrompt = `진로선택 24학점까지 정체성을 다졌어! 선택한 과목은 ${isCompletedText}야. 이제 대망의 3차 전직인 '융합 선택 16학점(4과목)' 던전을 개방해줘 똑띠야!`;
    askDdokddiAI(aiCallPrompt, 'fus_selection', nextState);
  };

  const handleNextToCreative = () => {
    if (gameState.selectedFusion.length < 4) return;
    const selectedObjList = SKILL_MAP[gameState.selectedClass!].fusion.filter(s => gameState.selectedFusion.includes(s.id));
    const isCompletedText = selectedObjList.map(s => s.name).join(', ');

    addChatLog('player', `융합 선택 16학점 균형 슬롯 체결 완료! 장착 과목: [${isCompletedText}]`);

    const creativeActivity = SKILL_MAP[gameState.selectedClass!].creative[0];

    const nextState: Partial<GameState> = {
      step: 'creative_intro'
    };

    const introText = `삐리리빅-! 최정예 교과 학습 던전 성벽(인문/수학/융합 등)을 모두 완파했어! 눈이 번쩍 뜨이는 성취도군! 🌟\n\n이제 고교학점제의 완성이자 던전 정산의 별미! **'창의적 체험활동(창체) 18학점 라이프'**를 수여할게!\n\n네 클래스 맞춤형으로 활성화된 교내 수련은 **[${creativeActivity.name}]** 동아리 활동 및 모험이야! (활동 요약: ${creativeActivity.description})\n\n자, 똑띠의 축하 포탈을 타서 최종 전설의 캐릭터 카드를 소환해보겠어? 삐리빅! 어서 포션 버튼을 눌러줘!`;

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        ...nextState,
        chatbotLogs: [
          ...prev.chatbotLogs,
          {
            id: Math.random().toString(),
            sender: 'ddokddi',
            text: introText,
            timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            status: 'victory'
          }
        ]
      }));
      setDdokddiEmotion('victory');
    }, 500);
  };

  const handleGenerateResult = async () => {
    addChatLog('player', `창체 18학점까지 자동 수지하고, 나의 영광스러운 전설 카드 정산을 확인해줘 똑띠야!`);
    
    // Move to result step first
    setGameState(prev => ({
      ...prev,
      step: 'result'
    }));

    setIsAiLoading(true);
    setDdokddiEmotion('thinking');

    const totalStats = calculateTotalStatsByState();
    const allSelectedSubjectNames = [
      ...COMMON_SUBJECTS.map(s => s.name),
      ...SKILL_MAP[gameState.selectedClass!].general.filter(s => gameState.selectedGeneral.includes(s.id)).map(s => s.name),
      ...SKILL_MAP[gameState.selectedClass!].advanced.filter(s => gameState.selectedAdvanced.includes(s.id)).map(s => s.name),
      ...SKILL_MAP[gameState.selectedClass!].fusion.filter(s => gameState.selectedFusion.includes(s.id)).map(s => s.name)
    ];
    const creativeTitle = SKILL_MAP[gameState.selectedClass!].creative[0].name;

    try {
      const response = await fetch('/api/ddokddi/scout-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: gameState.playerName,
          schoolName: gameState.schoolName,
          selectedClass: gameState.selectedClass,
          stats: totalStats,
          subjects: allSelectedSubjectNames,
          creativeActivity: creativeTitle
        })
      });

      const data = await response.json();
      setScoutReport(data.report);
      setDdokddiEmotion('victory');
    } catch (e) {
      console.error("Scout Report generation failed:", e);
      // fallback scouting report
      setScoutReport(`
### 🤖 똑띠의 회로 자동 정산 완료!

삐리빅-! API 엔진이 살짝 깜빡했지만 똑띠의 기본 내장 연산 카트리지가 정상 작동해서 마스터 카드를 전격 발행해냈어!

**모험가 ${gameState.playerName}의 캐릭터 카드 분석:**
- **장착 칭호**: ${CLASSES[gameState.selectedClass!].name}
- **소속 마스터리**: ${gameState.schoolName}
- **가장 빛나는 수호 스탯**: **창의성** & **논리성**! 모험가님의 과목 스킬셋은 균형도가 매우 높아, 미래 직업 던전에서 어떤 퀘스트든 훌륭하게 완수해낼 수 있는 에픽 스페셜리스트라구!
- **추가 장착 창체 버프**: **${creativeTitle}**

*똑띠의 한줄평*: "너만의 3년 수련 설계는 완벽해! 앞으로 맞닥뜨릴 실제 고등학교 학기제 던전에서도 이 똑띠의 가르침을 받아 100% 에픽 승리를 쟁취할 수 있을 거야! 언제나 널 응원할게, 삐리빅! ✨"
      `);
      setDdokddiEmotion('happy');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCustomChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || isAiLoading) return;

    const userMsg = typedMessage;
    setTypedMessage('');
    addChatLog('player', userMsg);

    setIsAiLoading(true);
    setDdokddiEmotion('thinking');

    try {
      const response = await fetch('/api/ddokddi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: gameState.playerName,
          schoolName: gameState.schoolName,
          selectedClass: gameState.selectedClass,
          step: gameState.step,
          selectedGeneral: gameState.selectedGeneral,
          selectedAdvanced: gameState.selectedAdvanced,
          selectedFusion: gameState.selectedFusion,
          playerMessage: userMsg
        })
      });

      const data = await response.json();
      addChatLog('ddokddi', data.reply, 'friendly');
      setDdokddiEmotion('happy');
    } catch (error) {
      console.error("Custom chat error:", error);
      addChatLog('ddokddi', "삐릿... 주위의 주파수가 너무 강해서 똑띠의 오디오 서브 기어에 혼선이 빚어졌어! 삐리빅! 한 번만 더 말해줄래?", 'friendly');
      setDdokddiEmotion('friendly');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRestart = () => {
    setGameState({
      playerName: '',
      schoolName: '',
      selectedClass: null,
      step: 'opening',
      selectedGeneral: [],
      selectedAdvanced: [],
      selectedFusion: [],
      chatbotLogs: [
        {
          id: 'welcome-reset',
          sender: 'ddokddi',
          text: '삐리빅-! 던전 차원축을 리셋했어 🌀! 새로운 이름과 새로운 계열로 찬란한 3년 서사시를 다시 설계해보자구! 네 이름과 학교부터 다시 입구에 적어줘!',
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          status: 'friendly'
        }
      ]
    });
    setScoutReport('');
    setInputName('');
    setInputSchool('');
    setTypedMessage('');
  };

  // Helper selectors and calculator
  const calculateTotalStatsByState = (): CharacterStats => {
    // Starting values of Class
    const selClass = gameState.selectedClass ? CLASSES[gameState.selectedClass] : null;
    const baseStats = selClass 
      ? { ...selClass.statsMultiplier } 
      : { logic: 10, inquiry: 10, communication: 10, creativity: 10, insight: 10, ethics: 10 };

    // common subjects (48 credits)
    COMMON_SUBJECTS.forEach(sub => {
      Object.entries(sub.stats).forEach(([statKey, value]) => {
        const key = statKey as keyof CharacterStats;
        baseStats[key] = (baseStats[key] || 0) + (value || 0);
      });
    });

    // general (32 credits)
    if (gameState.selectedClass) {
      const activeGen = SKILL_MAP[gameState.selectedClass].general.filter(s => gameState.selectedGeneral.includes(s.id));
      activeGen.forEach(sub => {
        Object.entries(sub.stats).forEach(([statKey, value]) => {
          const key = statKey as keyof CharacterStats;
          baseStats[key] = (baseStats[key] || 0) + (value || 0);
        });
      });

      // advanced (24 credits)
      const activeAdv = SKILL_MAP[gameState.selectedClass].advanced.filter(s => gameState.selectedAdvanced.includes(s.id));
      activeAdv.forEach(sub => {
        Object.entries(sub.stats).forEach(([statKey, value]) => {
          const key = statKey as keyof CharacterStats;
          baseStats[key] = (baseStats[key] || 0) + (value || 0);
        });
      });

      // fusion (16 credits)
      const activeFus = SKILL_MAP[gameState.selectedClass].fusion.filter(s => gameState.selectedFusion.includes(s.id));
      activeFus.forEach(sub => {
        Object.entries(sub.stats).forEach(([statKey, value]) => {
          const key = statKey as keyof CharacterStats;
          baseStats[key] = (baseStats[key] || 0) + (value || 0);
        });
      });

      // creative (18 credits)
      const activeCr = SKILL_MAP[gameState.selectedClass].creative[0];
      if (gameState.step === 'creative_intro' || gameState.step === 'result') {
        Object.entries(activeCr.stats).forEach(([statKey, value]) => {
          const key = statKey as keyof CharacterStats;
          baseStats[key] = (baseStats[key] || 0) + (value || 0);
        });
      }
    }

    return baseStats;
  };

  const getStepProgressCredits = () => {
    let credits = 48; // basic commons
    credits += 54;    // automatic background specified subjects required by school

    if (gameState.selectedClass) {
      const gC = SKILL_MAP[gameState.selectedClass].general.filter(s => gameState.selectedGeneral.includes(s.id)).length * 4;
      const aC = SKILL_MAP[gameState.selectedClass].advanced.filter(s => gameState.selectedAdvanced.includes(s.id)).length * 4;
      const fC = SKILL_MAP[gameState.selectedClass].fusion.filter(s => gameState.selectedFusion.includes(s.id)).length * 4;
      
      credits += gC + aC + fC;

      if (gameState.step === 'creative_intro' || gameState.step === 'result') {
        credits += 18; // Creative active points
      }
    }
    return Math.min(credits, 192);
  };

  const totalCredits = getStepProgressCredits();
  const progressPercent = (totalCredits / 192) * 100;
  const computedStats = calculateTotalStatsByState();

  const radarData = [
    { name: '논리력', score: computedStats.logic },
    { name: '탐구력', score: computedStats.inquiry },
    { name: '소통력', score: computedStats.communication },
    { name: '창의성', score: computedStats.creativity },
    { name: '통찰력', score: computedStats.insight },
    { name: '윤리의식', score: computedStats.ethics },
  ];

  const getDdokddiAvatarUrl = () => {
    switch (ddokddiEmotion) {
      case 'happy':
        return "🤖💖";
      case 'thinking':
        return "🤖🧠";
      case 'victory':
        return "🤖🌟";
      case 'surprised':
        return "🤖⚡";
      default:
        return "🤖✨";
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E0E0E0] font-sans flex flex-col relative overflow-hidden" id="applet-root">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.04] rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/[0.04] rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none"></div>

      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#15181E]/85 backdrop-blur-md sticky top-0 z-40 px-6 py-5 shadow-2xl" id="applet-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] transition duration-300 hover:scale-105 shrink-0">
              <span className="text-white font-black text-xl font-display">T</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-widest uppercase font-display flex items-center gap-2">
                LV.192 똑띠 고교학점제 던전
                <span className="text-[10px] bg-orange-500/20 text-orange-400 font-mono tracking-normal border border-orange-500/30 px-1.5 py-0.5 rounded uppercase">ACTIVE</span>
              </h1>
              <p className="text-[10px] text-orange-400 font-mono">SYSTEM STATUS: INTERACTIVE_READY_BETA</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {gameState.playerName && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 py-2 px-4 rounded-xl text-xs font-semibold text-white/90 shadow-lg">
                <User className="w-3.5 h-3.5 text-white/50" />
                <span className="font-mono tracking-tight">{gameState.playerName} <span className="text-white/40">@{gameState.schoolName}</span></span>
                {gameState.selectedClass && (
                  <span className="bg-orange-500 text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                    {CLASSES[gameState.selectedClass].emoji} {CLASSES[gameState.selectedClass].name}
                  </span>
                )}
              </div>
            )}
            <button 
              onClick={handleRestart}
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white hover:rotate-90 bg-white/5 hover:bg-white/10 border border-white/10 p-2.5 rounded-xl cursor-pointer transition-all duration-300 pointer-events-auto shadow-md"
              title="던전 리셋"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-5 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch" id="applet-main-view">
        
        {/* Left Side: Ddokddi Helper and Live Chat Log */}
        <section className="lg:col-span-5 bg-[#1A1D24] border border-white/10 rounded-3xl p-5 flex flex-col h-[calc(100vh-170px)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden" id="helper-panel">
          
          {/* 똑띠 미니 포트레이트 */}
          <div className="flex items-center gap-4 bg-[#15181E]/60 p-4 border border-white/10 rounded-2xl mb-4 shrink-0 shadow-inner">
            <div className="w-14 h-14 rounded-2xl bg-[#1A1D24] border-2 border-orange-500/50 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(249,115,22,0.25)] relative overflow-hidden shrink-0">
              <span className="z-10">{getDdokddiAvatarUrl()}</span>
              {isAiLoading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div>
              <div className="inline-block bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[9px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-md mb-1.5">
                {isAiLoading ? '뇌 회로 기어 연산중...' : '똑띠 에이전트'}
              </div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                똑띠 가이드봇 🤖
                <span className="text-[10px] text-white/40 font-mono font-normal">({ddokddiEmotion})</span>
              </h2>
            </div>
          </div>

          {/* 대화기록 타임라인 */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {gameState.chatbotLogs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3.5 ${log.sender === 'player' ? 'justify-end' : 'justify-start'}`}
                >
                  {log.sender === 'ddokddi' && (
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm shadow-md shrink-0 mt-1">
                      🤖
                    </div>
                  )}
                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    log.sender === 'player' 
                    ? 'bg-orange-600 border border-orange-500/50 text-white rounded-tr-none shadow-[0_4px_15px_rgba(234,88,12,0.2)]' 
                    : 'bg-[#15181E] text-white/90 rounded-tl-none border border-white/10'
                  }`}>
                    {log.sender === 'ddokddi' ? (
                      <div className="prose prose-invert prose-sm prose-orange max-w-none text-white/90">
                        <ReactMarkdown>{log.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{log.text}</p>
                    )}
                    <span className="text-[9px] text-white/30 font-mono mt-1.5 block text-right">
                      {log.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* 대화 입력 기어 */}
          <form onSubmit={handleCustomChatMessage} className="mt-auto pt-4 border-t border-white/10 flex gap-2 shrink-0">
            <input 
              type="text" 
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              disabled={gameState.step === 'opening' || isAiLoading}
              placeholder={gameState.step === 'opening' ? '통행증을 먼저 끊어주세요!' : '똑띠에게 고교학점제 질문을 건네봐!'} 
              className="flex-1 border border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:bg-white/10 focus:border-orange-500/50 text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-orange-500/50 transition-all duration-200 disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={gameState.step === 'opening' || isAiLoading}
              className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-5 py-3 rounded-xl text-sm font-bold hover:brightness-110 shadow-[0_4px_12px_rgba(234,88,12,0.2)] active:scale-95 transition disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>전송</span>
            </button>
          </form>
        </section>

        {/* Right Side: Adventure Game Machine */}
        <section className="lg:col-span-7 flex flex-col gap-6" id="rpg-dashboard">
          
          {/* status bar & credit bar-graph */}
          <div className="bg-[#15181E] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-3.5 shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/[0.02] rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-cyan-400 font-mono tracking-widest font-extrabold uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse" />
                Dungeon Progress XP
              </span>
              <span className="font-mono text-white/60">
                <strong className="text-cyan-400 text-sm font-bold">{totalCredits}</strong> / 192 Credits (학점 완료율 <span className="text-white font-bold">{progressPercent.toFixed(1)}%</span>)
              </span>
            </div>

            {/* Exp bar */}
            <div className="h-3.5 bg-white/10 p-0.5 rounded-full overflow-hidden w-full border border-white/5 relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3 text-[9px] text-white/30 font-mono pointer-events-none">
                <span>START</span>
                <span className="text-cyan-200/50 font-bold">140학점선</span>
                <span>MAX 192</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-white/40 border-t border-white/10 pt-3.5 font-mono">
              <div>🧬 <strong className="text-white/60 font-medium">공통필수:</strong> 48학점</div>
              <div>📖 <strong className="text-white/60 font-medium">학교지정:</strong> 54학점</div>
              <div className={gameState.selectedGeneral.length === 8 ? "text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" : ""}>⚔️ <strong className="text-white/60 font-medium">일반선택 (32):</strong> {gameState.selectedGeneral.length * 4} / 32</div>
              <div className={gameState.selectedAdvanced.length === 6 ? "text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" : ""}>💎 <strong className="text-white/60 font-medium">진로선택 (24):</strong> {gameState.selectedAdvanced.length * 4} / 24</div>
              <div className={gameState.selectedFusion.length === 4 ? "text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" : ""}>🔮 <strong className="text-white/60 font-medium">융합선택 (16):</strong> {gameState.selectedFusion.length * 4} / 16</div>
              <div className={gameState.step === 'creative_intro' || gameState.step === 'result' ? "text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]" : ""}>🏆 <strong className="text-white/60 font-medium">창체 (18):</strong> {gameState.step === 'creative_intro' || gameState.step === 'result' ? 18 : 0} / 18</div>
            </div>
          </div>

          {/* dynamic game play step core box */}
          <div className="bg-[#1A1D24] border border-white/10 rounded-3xl shadow-2xl p-6 flex-1 flex flex-col justify-between overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" style={{ minHeight: '420px' }}>
            
            <AnimatePresence mode="wait">
              
              {/* OPENING STEP */}
              {gameState.step === 'opening' && (
                <motion.div 
                  key="opening"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col justify-center items-center text-center gap-6 py-6"
                >
                  <div className="w-20 h-20 rounded-3xl bg-[#15181E] border-2 border-orange-500/50 flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(249,115,22,0.3)] mb-2 animate-bounce">
                    🤖
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight font-display">
                      똑띠와 고교학점제 레전드 카드 빌딩!
                    </h2>
                    <p className="text-sm text-white/50 mt-2 max-w-md mx-auto">
                      귀여운 인텔리전트 로봇 "똑띠(똑소리나는 학업설계 똑똑이)"와 대화하며, 오롯이 나를 표현하는 최고의 학력 설계표를 획득해 보세요.
                    </p>
                  </div>

                  <div className="w-full max-w-sm flex flex-col gap-4 border border-white/10 p-5 rounded-2xl bg-[#15181E]">
                    <div>
                      <label className="block text-left text-[10px] font-bold text-orange-400 mb-1.5 uppercase tracking-wider font-mono">
                        Adventurer Name (모험가 닉네임)
                      </label>
                      <input 
                        type="text" 
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder="예시) 전설의학생"
                        className="w-full border border-white/10 bg-white/5 text-white placeholder:text-white/20 text-sm px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-left text-[10px] font-bold text-orange-400 mb-1.5 uppercase tracking-wider font-mono">
                        Guild Name (소속학교명)
                      </label>
                      <input 
                        type="text" 
                        value={inputSchool}
                        onChange={(e) => setInputSchool(e.target.value)}
                        placeholder="예시) 똑띠고등학교"
                        className="w-full border border-white/10 bg-white/5 text-white placeholder:text-white/20 text-sm px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleStartAdventure}
                    disabled={!inputName.trim() || !inputSchool.trim()}
                    className="w-full max-w-sm bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-base px-6 py-4 rounded-xl shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 font-mono"
                  >
                    <span>던전 입장하기</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* CLASS SELECT STEP */}
              {gameState.step === 'class_select' && (
                <motion.div 
                  key="class_select"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col gap-6"
                >
                  <div className="border-b border-white/10 pb-3 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full inline-block">1단계: 전설의 영혼 칭호 조율</span>
                      <h3 className="text-lg font-bold text-white mt-1">나를 대변하는 계열 클래스 획득</h3>
                    </div>
                    <GraduationCap className="w-6 h-6 text-white/30" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[365px] overflow-y-auto pr-1 scrollbar-thin">
                    {Object.values(CLASSES).map((cls) => (
                      <div 
                        key={cls.id}
                        onClick={() => handleClassSelect(cls.id)}
                        className="group border border-white/10 bg-[#15181E] hover:border-orange-500/50 hover:bg-orange-500/5 rounded-2xl p-4 cursor-pointer transition-all duration-200 text-left shadow-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] flex gap-3"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 group-hover:bg-orange-500/10 group-hover:border-orange-500/25 text-2xl flex items-center justify-center shrink-0 transition-colors">
                          {cls.emoji}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-white group-hover:text-orange-400 flex items-center justify-between">
                            {cls.name}
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-orange-500 transition" />
                          </h4>
                          <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">{cls.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {Object.entries(cls.statsMultiplier)
                              .filter(([_, value]) => value > 15)
                              .map(([k, _]) => (
                                <span key={k} className="text-[9px] bg-white/5 border border-white/5 text-white/50 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 tracking-tight group-hover:text-orange-400 font-bold px-2 py-0.5 rounded-full transition-colors">
                                  {k === 'logic' ? '논리특화' : k === 'inquiry' ? '탐구지향' : k === 'communication' ? '사교달인' : k === 'creativity' ? '감성크리' : k === 'insight' ? '통찰력' : '도덕수호'}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* COMMON RE-ROUTING ACTION */}
              {gameState.step === 'common_intro' && (
                <motion.div 
                  key="common_intro"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col justify-center items-center text-center gap-6 py-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-3xl shadow-lg shadow-black/30 text-center">
                    📖
                  </div>
                  <div className="max-w-md">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full inline-block">0단계: 기초 패시브 활성화</span>
                    <h3 className="text-xl font-bold text-white mt-2">공통 필수 48학점 완수 포탈</h3>
                    <p className="text-sm text-white/50 mt-2 leading-relaxed">
                      공통국어, 공통수학, 공통영어, 통합사회, 통합과학 등 공통 필수 전설서 14권이 자동으로 모험가 지혜서 슬롯에 평생 주입 완료되었습니다!
                    </p>
                  </div>

                  {/* 공통과목 칩 다이어그램 */}
                  <div className="flex flex-wrap gap-1.5 justify-center max-w-lg bg-[#15181E] p-4 border border-white/10 rounded-2xl max-h-[140px] overflow-y-auto scrollbar-thin">
                    {COMMON_SUBJECTS.map((sub) => (
                      <span key={sub.id} className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg font-medium text-white/80 shadow-inner flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{sub.name} ({sub.credits}학점)</span>
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handleAcceptCommon}
                    className="w-full max-w-sm bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5 font-mono"
                  >
                    <span>1차 전직 대성당 입장!</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* GENERAL SELECTION STEP (32 CREDITS) */}
              {gameState.step === 'gen_selection' && (
                <motion.div 
                  key="gen_selection"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col gap-4"
                >
                  <div className="border-b border-white/10 pb-3 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full inline-block">1단계: 1차 전직하는란</span>
                      <h3 className="text-base font-bold text-white mt-1">일반 선택 과목 수집 던전 (32학점)</h3>
                    </div>
                    <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono font-bold px-2.5 py-1 rounded-lg">
                      장착: {gameState.selectedGeneral.length} / 8 과목
                    </span>
                  </div>

                  <div className="max-h-[290px] overflow-y-auto space-y-2 pr-1 scrollbar-thin font-sans">
                    {getGeneralSubjects().map((sub) => {
                      const isSelected = gameState.selectedGeneral.includes(sub.id);
                      const isLimitReached = gameState.selectedGeneral.length >= 8;
                      return (
                        <div 
                          key={sub.id}
                          onClick={() => toggleSubject(sub.id, 'general')}
                          className={`border rounded-xl p-3 text-left transition duration-150 cursor-pointer flex gap-3 ${
                            isSelected 
                            ? 'bg-orange-500/5 border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                            : isLimitReached 
                              ? 'opacity-30 border-white/5 cursor-not-allowed'
                              : 'border-white/10 bg-[#15181E] hover:border-white/20 hover:bg-white/5'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            readOnly
                            disabled={!isSelected && isLimitReached}
                            className="mt-1 pointer-events-none accent-orange-500 shrink-0" 
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-xs text-white">{sub.name}</h4>
                              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-1.5 py-0.5 rounded">{sub.credits}학점</span>
                            </div>
                            <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{sub.description}</p>
                            <div className="flex gap-2.5 mt-2">
                              {Object.entries(sub.stats).map(([stat, val]) => (
                                <span key={stat} className="text-[10px] text-white/40 font-mono">
                                  • {stat === 'logic' ? '논리' : stat === 'inquiry' ? '탐구' : stat === 'communication' ? '소통' : stat === 'creativity' ? '창의' : stat === 'insight' ? '통찰' : '윤리'} +{String(val)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextToStairGame}
                    disabled={gameState.selectedGeneral.length < 8}
                    className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer flex items-center justify-center gap-1.5 mt-2 font-mono"
                  >
                    <span>2차 진로선택 (진로 선택 24학점) 던전 무장하기!</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* DUNGEON GAME STEP */}
              {gameState.step === 'dungeon_game' && (
                <motion.div 
                   key="dungeon_game"
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -15 }}
                   className="flex flex-col gap-4 h-full"
                >
                   <WatermelonGame 
                     onClear={handleNextToClassSelect} 
                     playerName={gameState.playerName} 
                   />
                </motion.div>
              )}

              {/* STAIR GAME STEP */}
              {gameState.step === 'stair_game' && (
                <motion.div 
                   key="stair_game"
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -15 }}
                   className="flex flex-col gap-4 h-full"
                >
                   <StairGame 
                     onClear={handleFinishStairGame} 
                     playerName={gameState.playerName} 
                     selectedClass={gameState.selectedClass}
                   />
                </motion.div>
              )}

              {/* ADVANCED SELECTION STEP (24 CREDITS) */}
              {gameState.step === 'adv_selection' && (
                <motion.div 
                  key="adv_selection"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col gap-4"
                >
                  <div className="border-b border-white/10 pb-3 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full inline-block">4단계: 2차 전직 슬롯</span>
                      <h3 className="text-base font-bold text-white mt-1">진로 선택 과목 심화 던전 (24학점)</h3>
                    </div>
                    <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono font-bold px-2.5 py-1 rounded-lg">
                      장착: {gameState.selectedAdvanced.length} / 6 과목
                    </span>
                  </div>

                  <div className="max-h-[290px] overflow-y-auto space-y-2 pr-1 scrollbar-thin font-sans">
                    {SKILL_MAP[gameState.selectedClass!].advanced.map((sub) => {
                      const isSelected = gameState.selectedAdvanced.includes(sub.id);
                      const isLimitReached = gameState.selectedAdvanced.length >= 6;
                      return (
                        <div 
                          key={sub.id}
                          onClick={() => toggleSubject(sub.id, 'advanced')}
                          className={`border rounded-xl p-3 text-left transition duration-150 cursor-pointer flex gap-3 ${
                            isSelected 
                            ? 'bg-orange-500/5 border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                            : isLimitReached 
                              ? 'opacity-30 border-white/5 cursor-not-allowed'
                              : 'border-white/10 bg-[#15181E] hover:border-white/20 hover:bg-white/5'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            readOnly
                            disabled={!isSelected && isLimitReached}
                            className="mt-1 pointer-events-none accent-orange-500 shrink-0" 
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-xs text-white">{sub.name}</h4>
                              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-1.5 py-0.5 rounded">{sub.credits}학점</span>
                            </div>
                            <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{sub.description}</p>
                            <div className="flex gap-2.5 mt-2">
                              {Object.entries(sub.stats).map(([stat, val]) => (
                                <span key={stat} className="text-[10px] text-white/40 font-mono">
                                  • {stat === 'logic' ? '논리' : stat === 'inquiry' ? '탐구' : stat === 'communication' ? '소통' : stat === 'creativity' ? '창의' : stat === 'insight' ? '통찰' : '윤리'} +{String(val)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextToFusion}
                    disabled={gameState.selectedAdvanced.length < 6}
                    className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer flex items-center justify-center gap-1.5 mt-2 font-mono"
                  >
                    <span>3차 융합선택 가기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* FUSION SELECTION STEP (16 CREDITS) */}
              {gameState.step === 'fus_selection' && (
                <motion.div 
                  key="fus_selection"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col gap-4"
                >
                  <div className="border-b border-white/10 pb-3 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full inline-block">5단계: 3차 전직 슬롯</span>
                      <h3 className="text-base font-bold text-white mt-1">융합 선택 과목 다변화 던전 (16학점)</h3>
                    </div>
                    <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono font-bold px-2.5 py-1 rounded-lg">
                      장착: {gameState.selectedFusion.length} / 4 과목
                    </span>
                  </div>

                  <div className="max-h-[290px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                    {SKILL_MAP[gameState.selectedClass!].fusion.map((sub) => {
                      const isSelected = gameState.selectedFusion.includes(sub.id);
                      const isLimitReached = gameState.selectedFusion.length >= 4;
                      return (
                        <div 
                          key={sub.id}
                          onClick={() => toggleSubject(sub.id, 'fusion')}
                          className={`border rounded-xl p-3 text-left transition duration-150 cursor-pointer flex gap-3 ${
                            isSelected 
                            ? 'bg-orange-500/5 border-orange-500/60 shadow-[0_0_15px_rgba(249,115,22,0.15)] font-sans' 
                            : isLimitReached 
                              ? 'opacity-30 border-white/5 cursor-not-allowed font-sans'
                              : 'border-white/10 bg-[#15181E] hover:border-white/20 hover:bg-white/5 font-sans'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            readOnly
                            disabled={!isSelected && isLimitReached}
                            className="mt-1 pointer-events-none accent-orange-500 shrink-0" 
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-xs text-white">{sub.name}</h4>
                              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-1.5 py-0.5 rounded">{sub.credits}학점</span>
                            </div>
                            <p className="text-[11px] text-white/50 mt-1 leading-relaxed">{sub.description}</p>
                            <div className="flex gap-2.5 mt-2">
                              {Object.entries(sub.stats).map(([stat, val]) => (
                                <span key={stat} className="text-[10px] text-white/40 font-mono">
                                  • {stat === 'logic' ? '논리' : stat === 'inquiry' ? '탐구' : stat === 'communication' ? '소통' : stat === 'creativity' ? '창의' : stat === 'insight' ? '통찰' : '윤리'} +{String(val)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextToCreative}
                    disabled={gameState.selectedFusion.length < 4}
                    className="bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer flex items-center justify-center gap-1.5 mt-2 font-mono"
                  >
                    <span>창체 동아리 이팩트 정산 가기</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* CREATIVE ACTIVITY AUTO INTEGRATION STEP */}
              {gameState.step === 'creative_intro' && (
                <motion.div 
                  key="creative_intro"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col justify-center items-center text-center gap-6 py-6"
                >
                  <div className="w-20 h-20 rounded-3xl bg-[#15181E] border border-orange-500/30 flex items-center justify-center text-5xl text-center shadow-[0_0_20px_rgba(249,115,22,0.2)] relative mb-2">
                    🏆
                    <span className="absolute top-0 right-0 text-xl animate-bounce">✨</span>
                  </div>
                  <div className="max-w-md">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full inline-block">6단계: 창의 체험 최종 수련</span>
                    <h3 className="text-xl font-bold text-white mt-2">창의적 체험활동 18학점 최종 각성 완료!</h3>
                    <p className="text-sm text-white/50 mt-2 leading-relaxed">
                      네 개성과 계열 클래스에 맞추어 보급된 연계 전설 동아리에 가입해 특수 보너스 스탯을 완전히 획득했습니다!
                    </p>
                  </div>

                  <div className="bg-[#15181E] border border-white/10 p-5 rounded-2xl w-full max-w-sm text-left shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkle className="w-4 h-4 text-orange-500 animate-spin" />
                      <span className="font-bold text-[10px] uppercase text-white/40 font-mono tracking-wider">교내 장착 동아리</span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{SKILL_MAP[gameState.selectedClass!].creative[0].name}</h4>
                    <p className="text-xs text-white/55 mt-1 leading-relaxed">
                      {SKILL_MAP[gameState.selectedClass!].creative[0].description}
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateResult}
                    disabled={isAiLoading}
                    className="w-full max-w-sm bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-base px-6 py-4 rounded-xl shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-sans"
                  >
                    {isAiLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>똑띠 성적표 제작설비 운전중...</span>
                      </>
                    ) : (
                      <>
                        <span>최종 전설의 캐릭터 카드 소환!</span>
                        <Trophy className="w-5 h-5 ml-1 animate-bounce text-orange-200" />
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* FINAL CARD SHOWCASE & SCOUTING EXCEL REPORT */}
              {gameState.step === 'result' && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col gap-6"
                >
                  <div className="border-b border-white/10 pb-5 flex justify-between items-center bg-[#15181E]/60 -mx-6 -mt-6 p-6 rounded-t-3xl shadow-md border-t border-white/10">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Award className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-orange-400">성공의 보석 정산</span>
                      </div>
                      <h3 className="text-lg font-black text-white font-sans">전설 등급 고교 아키타이프 탄생!</h3>
                    </div>
                    <button 
                      onClick={handleRestart}
                      className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs border border-white/10 px-4 py-2 rounded-full cursor-pointer transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>다시 설계</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                    
                    {/* Character Card Box (Holographic Card concept) */}
                    <div className="md:col-span-5 bg-gradient-to-br from-[#1E2330] to-[#15181E] text-white rounded-2xl p-5 shadow-2xl flex flex-col justify-between border-2 border-orange-500/40 relative overflow-hidden group min-h-[310px]">
                      
                      {/* background pattern decor */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition duration-500"></div>

                      <div>
                        {/* High-Contrast Class and School Badge */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-orange-400 font-mono tracking-wider font-extrabold uppercase">EPIC MASTER CHANGER</span>
                            <h4 className="text-sm font-semibold tracking-wide text-white/90">{gameState.schoolName}</h4>
                          </div>
                          <span className="text-2xl mt-0.5 shrink-0 bg-white/5 p-1.5 rounded-lg border border-white/10 shadow-lg select-none">
                            {CLASSES[gameState.selectedClass!].emoji}
                          </span>
                        </div>

                        {/* Player name displaying display text */}
                        <div className="mt-8">
                          <span className="text-[11px] text-white/40 uppercase tracking-widest font-mono">Character Name</span>
                          <h2 className="text-3xl font-black tracking-tight leading-tight mt-0.5 text-white font-display">{gameState.playerName}</h2>
                          <div className="inline-block bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-bold leading-none mt-2 shadow-[0_0_15px_rgba(249,115,22,0.4)] select-none">
                            👑 전설의 {CLASSES[gameState.selectedClass!].name}
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom status indicators */}
                      <div className="border-t border-white/10 pt-4 mt-6 flex justify-between items-end bg-[#1A1D24]/40 -mx-5 px-5 -mb-5 pb-5 rounded-b-2xl">
                        <div>
                          <p className="text-[10px] text-white/40 font-mono">이수한 총 학점</p>
                          <p className="text-lg font-mono font-black tracking-wide text-cyan-400">192 / 192 <span className="text-xs font-normal text-white/40">Credits</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-white/40 font-mono">자격증인증</p>
                          <span className="p-1.5 bg-orange-500 text-white text-[10px] rounded-lg inline-block font-extrabold border border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.4)] select-none">퓨쳐캔버스공인인증</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats analysis Radar chart visualization (using Recharts) */}
                    <div className="md:col-span-7 border border-white/10 rounded-2xl p-4 bg-[#15181E]/80 flex flex-col justify-center items-center shadow-2xl min-h-[310px] relative overflow-hidden">
                      <div className="absolute top-2.5 left-3.5 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-white/30 text-cyan-400" />
                        <span className="text-[10px] text-white/40 font-sans tracking-wide">6체적 교육 성장 스킬트리 밸런스</span>
                      </div>
                      
                      <div className="w-full h-64 shrink-0 mt-3">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
                            <PolarAngleAxis 
                              dataKey="name" 
                              tick={{ fill: '#E0E0E0', fontSize: 11, fontWeight: 'bold' }} 
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 'auto']} 
                              tick={{ fill: '#64748B', fontSize: 9 }}
                            />
                            <Radar 
                              name={gameState.playerName} 
                              dataKey="score" 
                              stroke="#F97116" 
                              fill="#F97116" 
                              fillOpacity={0.3} 
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>

                  {/* Future Canvas Selected Course Transcript Board */}
                  {gameState.selectedClass && (() => {
                    const selClass = gameState.selectedClass;
                    const generalChosen = SKILL_MAP[selClass].general.filter(s => gameState.selectedGeneral.includes(s.id));
                    const advancedChosen = SKILL_MAP[selClass].advanced.filter(s => gameState.selectedAdvanced.includes(s.id));
                    const fusionChosen = SKILL_MAP[selClass].fusion.filter(s => gameState.selectedFusion.includes(s.id));
                    const creativeCh = SKILL_MAP[selClass].creative[0];

                    return (
                      <div className="border border-white/10 rounded-2xl p-5 bg-[#15181E]/80 text-left relative overflow-hidden shadow-2xl">
                        {/* Title badge */}
                        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3 relative z-10">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <h4 className="font-extrabold text-sm text-white flex items-center gap-2 uppercase tracking-wide font-sans">
                            📜 퓨쳐캔버스 고교 교육과정 이수 명세서 (Selected Course Curriculum)
                          </h4>
                          <span className="ml-auto text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
                            총 192학점 이수 완료
                          </span>
                        </div>

                        {/* Interactive list grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          
                          {/* 1. General choice */}
                          <div className="bg-[#1A1D24]/60 rounded-xl p-3 border border-white/5 flex flex-col gap-2">
                            <div className="flex justify-between items-center border-b border-white/10 pb-1.5 mb-1">
                              <span className="text-[11px] font-extrabold text-orange-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                일반선택 (8과목)
                              </span>
                              <span className="text-[10px] font-mono text-white/50">32학점</span>
                            </div>
                            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                              {generalChosen.map((sub, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-xs text-white/80 py-0.5 hover:text-white transition">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                  <span className="truncate" title={sub.name}>{sub.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 2. Advanced choice */}
                          <div className="bg-[#1A1D24]/60 rounded-xl p-3 border border-white/5 flex flex-col gap-2">
                            <div className="flex justify-between items-center border-b border-white/10 pb-1.5 mb-1">
                              <span className="text-[11px] font-extrabold text-cyan-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                진로선택 (6과목)
                              </span>
                              <span className="text-[10px] font-mono text-white/50">24학점</span>
                            </div>
                            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                              {advancedChosen.map((sub, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-xs text-white/80 py-0.5 hover:text-white transition">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                  <span className="truncate" title={sub.name}>{sub.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 3. Fusion choice */}
                          <div className="bg-[#1A1D24]/60 rounded-xl p-3 border border-white/5 flex flex-col gap-2">
                            <div className="flex justify-between items-center border-b border-white/10 pb-1.5 mb-1">
                              <span className="text-[11px] font-extrabold text-purple-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                융합선택 (4과목)
                              </span>
                              <span className="text-[10px] font-mono text-white/50">16학점</span>
                            </div>
                            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                              {fusionChosen.map((sub, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-xs text-white/80 py-0.5 hover:text-white transition">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                                  <span className="truncate" title={sub.name}>{sub.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 4. Creative Activities */}
                          <div className="bg-[#1A1D24]/60 rounded-xl p-3 border border-white/5 flex flex-col gap-2">
                            <div className="flex justify-between items-center border-b border-white/10 pb-1.5 mb-1">
                              <span className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                창의체험 (동아리)
                              </span>
                              <span className="text-[10px] font-mono text-white/50">선택장착</span>
                            </div>
                            <div className="text-xs text-white/80 leading-relaxed bg-[#15181E]/80 p-2.5 rounded-lg border border-white/5 flex flex-col gap-1">
                              {creativeCh ? (
                                <>
                                  <div className="font-extrabold text-amber-400 flex items-center gap-0.5 text-[11px]">
                                    🌟 {creativeCh.name}
                                  </div>
                                  <p className="text-[10px] text-white/60 leading-normal mt-0.5">
                                    {creativeCh.description}
                                  </p>
                                </>
                              ) : (
                                <span className="text-white/40 italic text-[11px]">미선택</span>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })()}

                  {/* Scout detailed evaluation report panel */}
                  <div className="border border-white/10 rounded-2xl p-5 bg-[#15181E]/60 text-left relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2.5 relative z-10">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping shadow-[0_0_8px_#F97116]"></div>
                      <h4 className="font-extrabold text-sm text-white flex items-center gap-2 uppercase tracking-wide font-sans">
                        📝 퓨쳐캔버스의 에이징 학술 스카우팅 정밀 심사보고서
                      </h4>
                    </div>

                    {isAiLoading ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs text-white/50 animate-pulse">
                          퓨쳐캔버스와 실시간 AI 학업 평가 위원회가 최고의 3년 예측 분석서를 수공예 인쇄하고 있습니다! 🤖...
                        </p>
                      </div>
                    ) : (
                      <div className="prose prose-invert prose-sm text-white/80 leading-relaxed max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                        <ReactMarkdown>{scoutReport}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>
        </section>

      </main>

      {/* Footer system credit notation */}
      <footer className="border-t border-white/10 bg-[#15181E]/60 py-6 px-6 text-center text-xs text-white/30 select-none" id="applet-footer">
        <p>© 2026 똑띠 AI 고교학점제 던전 RPG. All coordinates aligned for elegant path builders.</p>
        <p className="mt-1.5 font-mono text-[10px] text-white/20">SYSTEM STATUS: STABLE • ENVELOPE SECURE ENCRYPTED 256-BIT • V1.0.4-BETA</p>
      </footer>
    </div>
  );
}
