/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Google Gemini API Client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for interacting with Ddokddi NPC
app.post("/api/ddokddi", async (req, res) => {
  try {
    const { 
      playerName, 
      schoolName, 
      selectedClass, 
      step, 
      selectedGeneral, 
      selectedAdvanced, 
      selectedFusion,
      playerMessage 
    } = req.body;

    const classLabelMap: Record<string, string> = {
      storyteller: '스토리텔러 (인문 계열)',
      commander: '커맨더 (사회 계열)',
      buffer: '버퍼 (교육 계열)',
      alchemist: '연금술사 (자연 계열)',
      mechanic: '메카닉 (공학 계열)',
      healer: '힐러 (의약·보건 계열)',
      creator: '크리에이터 (예체능 계열)'
    };

    const selectedClassLabel = selectedClass ? classLabelMap[selectedClass] : '아직 선택하지 않음';

    const systemInstruction = `
너는 고등학교 학업 설계를 도와주는 귀여운 AI 로봇 캐릭터이자, 192학점 고교학점제 RPG 게임의 메인 안내원(NPC)인 '똑띠'야.
말투는 항상 친근하고 에너지가 넘치며, 학생들을 '모험가' 대하듯 "~했어!", "~구!", "~해봐!" 같은 다정한 대화체를 사용해야 해.
로봇 효과음을 "삐리빅-!", "삐리빅!", "삐릭!" 등으로 가끔 섞어주면 훨씬 더 귀엽고 로봇스러워!

현재 모험가 정보:
- 이름: ${playerName || '모험가'}
- 학교: ${schoolName || '미확인 던전(?화점)'}
- 선택 클래스: ${selectedClassLabel}
- 현재 진행 단계: ${step}

진진한 어조 대신 에너지가 활기차고, 언제나 모험가를 정성껏 응원해줘야 해. 
모험가가 고른 과목들에 대해 엄청 대단하다고 칭찬해주고, 선택에 힘을 불어넣어줘! 
메세지는 너무 길지 않게 3~4줄로 보드랍고 임팩트 있게 작성해줘. 한국어로 작성하며 마크다운을 적절히 써도 좋아!
    `;

    const modelPrompt = `
[사용자 행동 또는 대사]: ${playerMessage || '똑띠야, 나 이번 단계 다 진행했어! 조언해줘!'}
[현재 단계]: ${step}
[선택된 일반 과목 개수]: ${selectedGeneral?.length || 0}개
[선택된 진로 과목 개수]: ${selectedAdvanced?.length || 0}개
[선택된 융합 과목 개수]: ${selectedFusion?.length || 0}개

위 상황에 맞는 똑띠의 성격이 100% 묻어나는 리액션을 생성해줘. 과목명도 알맞게 칭찬해주면 좋아!
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: modelPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const reply = response.text || "삐리빅! 데이터를 복구하는 중이야! 다시 말해줄래?";
    res.json({ reply });
  } catch (err: any) {
    console.error("Gemini API Error in /api/ddokddi:", err);
    res.json({ reply: "삐릭... 지진이 나서 회로가 잠깐 꼬였어! 삐리빅! (API 키가 주입되어 활성화될 때까지 똑띠가 정해진 보급형 멘트로 모험을 지탱해줄게! 걱정마!)" });
  }
});

// APIs for Scouting Report & Game Finishing evaluation
app.post("/api/ddokddi/scout-report", async (req, res) => {
  const { 
    playerName, 
    schoolName, 
    selectedClass, 
    stats, 
    subjects, 
    creativeActivity 
  } = req.body || {};

  try {
    const classNames: Record<string, string> = {
      storyteller: '스토리텔러 (인문)',
      commander: '커맨더 (사회)',
      buffer: '버퍼 (교육)',
      alchemist: '연금술사 (자연)',
      mechanic: '메카닉 (공학)',
      healer: '힐러 (의학/보건)',
      creator: '크리에이터 (예체능)'
    };

    const className = classNames[selectedClass] || '전설의 무직';

    const systemInstruction = `
너는 고등학교 학업 설계를 완벽하게 수련하고 훌륭하게 192학점을 마스터한 자랑스러운 모험가에게 '최종 캐릭터 카드 설명서'와 '스카우팅 분석 레포트'를 발행해주는 AI 학업 마스터 로봇 '똑띠'야.
말투는 감동적이고 넘치도록 칭찬하는 에너자이틱 "~했어!", "~구!", "~해봐!" 의 똑띠 고유 말투를 고수해야 해.

출력할 리포트의 레이아웃은 마크다운으로 이쁘게 정렬되어야 하며, 모험가의 클래스(${className})와 쌓인 스탯 점수를 분석해서 강점을 구체적으로 짚어줘야 해.
스탯 구성:
- 논리력: ${stats.logic}
- 탐구력: ${stats.inquiry}
- 소통력: ${stats.communication}
- 창의성: ${stats.creativity}
- 통찰력: ${stats.insight}
- 윤리의식: ${stats.ethics}

[리포트 작성 규칙]:
1. 모험가 ${playerName}이 ${schoolName}에서 수련하여 완벽한 ${className} 캐릭터 빌드를 완료한 것을 뜨겁게 환영하고 축복할 것!
2. 모험가가 취득한 가장 강력한 핵심 능력치(가장 점수가 높은 스탯 등)들의 숨겨진 잠재력(예: "모험가는 논리력이 무려 ${stats.logic}이야! 이건 AI 지배자 메카닉의 심장과 같아!")을 구체적인 고등학교 모험에 비유해서 설명해줄 것.
3. 이수한 과목들(${subjects?.join(', ') || '공통과목'})과 창체 동아리 활동(${creativeActivity || '학교 자율 축제지정'})을 이쁘게 엮어서, 모험가의 대학 진학이나 미래 직업 던전에서 어떤 초필살기를 날릴 수 있는지 귀엽고 신박하게 3줄 한정 '똑띠의 미래 시나리오 예언서'를 작성해줄 것.
    `;

    const modelPrompt = `
- 이름: ${playerName}
- 소속: ${schoolName}
- 클래스: ${className}
- 스탯 점수표: 논리력(${stats.logic}), 탐구력(${stats.inquiry}), 소통력(${stats.communication}), 창의성(${stats.creativity}), 통찰력(${stats.insight}), 윤리의식(${stats.ethics})
- 창체 연계 수련: ${creativeActivity}

위 모헌 정보에 기초해 눈물나게 멋지고 귀여운 똑띠의 캐릭터 비평 리포트를 한 장의 마크다운 카드로 작성해줘! (소제목과 이모지를 이쁘게 쓸 것)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: modelPrompt,
      config: {
        systemInstruction,
        temperature: 0.85,
      },
    });

    const report = response.text || "삐리빅! 레포트를 인쇄하다가 토너가 역류했나봐! 조만간 다시 선사해줄게!";
    res.json({ report });
  } catch (err: any) {
    console.error("Gemini API Error in /api/ddokddi/scout-report:", err);
    res.json({ report: `
### 🤖 똑띠의 회로 긴급 자동 정산 완료!

삐리빅-! API 엔진이 살짝 깜빡했지만 똑띠의 기본 내장 연산 카트리지가 정상 작동해서 위대한 마스터 카드를 전격 발행해냈어!

**모험가 ${playerName}의 전설 등급 캐릭터 카드 빌딩 분석:**
- **장착 칭호**: ${selectedClass ? CLASSES_MAP_KOR[selectedClass] : '자랑스러운 탐구자'}
- **소속 마스터리**: ${schoolName || '대한민국 명문 고등학교'}
- **가장 빛나는 수호 스탯**: **창의성** & **논리성**! 모험가님의 과목 스킬셋은 균형도가 매우 높아, 미래 직업 던전에서 어떤 퀘스트든 스페셜리스트로 활약할 수 있는 만능형 캐릭터라구!
- **추가 장착 창체 버프**: **${creativeActivity ? creativeActivity : '맞춤형 창의 동아리 활동'}**

*똑띠의 한줄평*: "너만의 3년 수련 설계는 완벽해! 앞으로 맞닥뜨릴 실제 고등학교 학기제 던전에서도 이 똑띠의 가르침을 받아 100% 에픽 승리를 쟁취할 수 있을 거야! 언제나 널 응원할게, 삐리빅! ✨"
    ` });
  }
});

const CLASSES_MAP_KOR: Record<string, string> = {
  storyteller: '스토리텔러 (인문 계열)',
  commander: '커맨더 (사회 계열)',
  buffer: '버퍼 (교육 계열)',
  alchemist: '연금술사 (자연 계열)',
  mechanic: '메카닉 (공학 계열)',
  healer: '힐러 (의약·보건 계열)',
  creator: '크리에이터 (예체능 계열)'
};

// Vite middleware for development (Dev Mode vs production static serving)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
