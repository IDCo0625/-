/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClassInfo, Subject, SkillTreeData } from './types';

export const CLASSES: Record<string, ClassInfo> = {
  storyteller: {
    id: 'storyteller',
    name: '스토리텔러',
    emoji: '✍️',
    icon: 'feather',
    description: '문학과 역사를 바탕으로 몰입감 넘치는 세계관과 이야기를 설계하는 자!',
    statsMultiplier: { logic: 10, inquiry: 15, communication: 20, creativity: 25, insight: 20, ethics: 15 }
  },
  commander: {
    id: 'commander',
    name: '커맨더',
    emoji: '🛡️',
    icon: 'shield',
    description: '사회 규칙과 경제 구조를 정밀히 분석하고 전장의 팀을 승리로 이끄는 지휘관!',
    statsMultiplier: { logic: 20, inquiry: 15, communication: 25, creativity: 10, insight: 25, ethics: 15 }
  },
  buffer: {
    id: 'buffer',
    name: '버퍼',
    emoji: '🌟',
    icon: 'sparkles',
    description: '파티원들의 잠재적 가치를 일깨우고 성장을 밀착 케어하는 세심한 조력자!',
    statsMultiplier: { logic: 15, inquiry: 10, communication: 30, creativity: 15, insight: 15, ethics: 25 }
  },
  alchemist: {
    id: 'alchemist',
    name: '연금술사',
    emoji: '🧪',
    icon: 'beaker',
    description: '물질의 성질과 자연의 수학적 법칙을 파고들어 우주의 진리를 속속들이 파헤치는 탐색가!',
    statsMultiplier: { logic: 25, inquiry: 30, communication: 10, creativity: 15, insight: 15, ethics: 15 }
  },
  mechanic: {
    id: 'mechanic',
    name: '메카닉',
    emoji: '⚙️',
    icon: 'cpu',
    description: '최첨단 코딩 기술과 설계 역량으로 가상세계와 미래형 기계를 눈깜짝할 새 뚝딱해내는 메이커!',
    statsMultiplier: { logic: 30, inquiry: 20, communication: 10, creativity: 25, insight: 15, ethics: 10 }
  },
  healer: {
    id: 'healer',
    name: '힐러',
    emoji: '💖',
    icon: 'heart-pulse',
    description: '생명의 정교하고 신비로운 원리를 다루며 아픈 자들의 생존과 웰빙을 완벽 수호하는 수호천사!',
    statsMultiplier: { logic: 20, inquiry: 25, communication: 15, creativity: 10, insight: 15, ethics: 25 }
  },
  creator: {
    id: 'creator',
    name: '크리에이터',
    emoji: '🎨',
    icon: 'palette',
    description: '예술적 영감과 신체 감각을 대폭 발휘해 세상에 없던 고유한 가치를 창조해내는 감성 예술가!',
    statsMultiplier: { logic: 10, inquiry: 10, communication: 15, creativity: 30, insight: 20, ethics: 15 }
  }
};

export const COMMON_SUBJECTS: Subject[] = [
  { id: 'com-kor1', name: '공통국어1', credits: 4, stats: { communication: 10, logic: 5 }, description: '국어의 기본을 다지며 타인과 공감하고 소통하는 능력 장착!' },
  { id: 'com-kor2', name: '공통국어2', credits: 4, stats: { communication: 10, insight: 5 }, description: '다양한 매체와 문학을 이해하며 생각의 힘 극대화!' },
  { id: 'com-math1', name: '공통수학1', credits: 4, stats: { logic: 15 }, description: '사고력을 자극하고 비판적으로 분석하는 수학 패시브 활성화!' },
  { id: 'com-math2', name: '공통수학2', credits: 4, stats: { logic: 15 }, description: '수학적 명제와 입체적 개념을 증명하는 고오급 연산 스터디!' },
  { id: 'com-eng1', name: '공통영어1', credits: 4, stats: { communication: 12 }, description: '세계 속 다양한 정보와 모험가들과 만날 소통 도구 획득!' },
  { id: 'com-eng2', name: '공통영어2', credits: 4, stats: { communication: 12, insight: 3 }, description: '영어로 표현된 깊은 식견과 인프라를 이해하는 글로벌 스킬!' },
  { id: 'com-hist1', name: '한국사1', credits: 3, stats: { insight: 10, ethics: 5 }, description: '우리나라의 자랑스럽고 눈물겨운 여정을 배우며 정체성 수호!' },
  { id: 'com-hist2', name: '한국사2', credits: 3, stats: { insight: 10, ethics: 5 }, description: '근현대사 속 역사적 선택들을 깊게 파헤치며 통찰력 업그레이드!' },
  { id: 'com-soc1', name: '통합사회1', credits: 4, stats: { insight: 8, ethics: 7 }, description: '지리, 역사, 윤리의 눈으로 우리 삶의 무대를 입체적으로 파악!' },
  { id: 'com-soc2', name: '통합사회2', credits: 4, stats: { communication: 5, ethics: 10 }, description: '다양한 사회 규범과 인권의 소중함을 배워 커뮤니티 정합성 달성!' },
  { id: 'com-sci1', name: '통합과학1', credits: 4, stats: { inquiry: 12, creativity: 3 }, description: '우주 탄생부터 지구 생태계까지, 세상의 물질과 생명의 흐름 파악!' },
  { id: 'com-sci2', name: '통합과학2', credits: 4, stats: { inquiry: 12, logic: 3 }, description: '안정적인 과학적 세계관과 시스템의 평형 상태를 면밀히 분석!' },
  { id: 'com-sciexp1', name: '과학탐구실험1', credits: 1, stats: { inquiry: 5, creativity: 5 }, description: '호기심 가득한 가설을 세우고, 직접 재료를 모아 실전에 대입!' },
  { id: 'com-sciexp2', name: '과학탐구실험2', credits: 1, stats: { inquiry: 5, logic: 5 }, description: '수집한 실험 데이터를 검증하며 완벽한 연역 추론 실현!' },
];

export const SKILL_MAP: SkillTreeData = {
  common: COMMON_SUBJECTS,

  // 1. 스토리텔러 (인문 계열)
  storyteller: {
    general: [
      { id: 'st-g1', name: '화법과 언어', credits: 4, stats: { communication: 15, logic: 5 }, description: '말의 뉘앙스를 마스터해 사람의 마음을 훔치는 기초 레잔도 화술!' },
      { id: 'st-g2', name: '독서와 작문', credits: 4, stats: { creativity: 15, logic: 5 }, description: '남의 글을 날카롭게 파악하고 나의 생각과 철학을 융단작문!' },
      { id: 'st-g3', name: '문학', credits: 4, stats: { creativity: 15, communication: 5 }, description: '명작들을 향유하며 감성의 깊이를 아득히 키우는 스토리텔러의 뿌리!' },
      { id: 'st-g4', name: '영어1', credits: 4, stats: { communication: 15 }, description: '글로벌 네트워크에서 영어로 소통 연계력을 구축하는 패시브!' },
      { id: 'st-g5', name: '영어2', credits: 4, stats: { communication: 15, insight: 5 }, description: '한층 고차원적인 서양 지평의 독서와 고급 학술 영어 라이팅!' },
      { id: 'st-g6', name: '영어 독해와 작문', credits: 4, stats: { communication: 10, creativity: 10 }, description: '자신의 스토리 세계관을 정교하게 영어 원문으로 가공하는 작문!' },
      { id: 'st-g7', name: '세계시민과 지리', credits: 4, stats: { insight: 12, ethics: 8 }, description: '글로벌 위기 상황과 타문화의 환경적 배경을 너른 시각으로 탐색하는 지구 수호단!' },
      { id: 'st-g8', name: '세계사', credits: 4, stats: { insight: 20 }, description: '동서양 거대한 역사 궤적을 짚어가며 시공간 월드빌딩 기틀 완성!' },
      { id: 'st-g9', name: '사회와 문화', credits: 4, stats: { insight: 10, communication: 10 }, description: '사회의 프레임을 깨고 구조의 작동원리와 마찰을 객관적으로 분석!' },
      { id: 'st-g10', name: '현대사회와 윤리', credits: 4, stats: { ethics: 15, insight: 5 }, description: '자율주행, 환경 보존 등 첨단 사회 이슈에서 흔들리지 않을 도덕 장치!' },
    ],
    advanced: [
      { id: 'st-a1', name: '주제탐구독서', credits: 4, stats: { inquiry: 15, insight: 5 }, description: '진짜 파고들고 싶은 테마를 골라 원고를 격정적으로 탐색 후 수집!' },
      { id: 'st-a2', name: '문학과 영상', credits: 4, stats: { creativity: 20 }, description: '활자가 살아 움직이는 영화나 애니메이션, 웹툰으로 다시 태어나는 연출!' },
      { id: 'st-a3', name: '영미 문학 읽기', credits: 4, stats: { communication: 10, creativity: 10 }, description: '클래식 셰익스피어부터 트렌디한 영소설을 번역 없이 가슴으로 맞장!' },
      { id: 'st-a4', name: '윤리와 사상', credits: 4, stats: { insight: 15, ethics: 5 }, description: '동서양 거장 철학자들의 대정령 사상을 깊게 이해하며 자본 수련!' },
      { id: 'st-a5', name: '인문학과 윤리', credits: 4, stats: { ethics: 15, communication: 5 }, description: '가치관, 삶의 참의미를 생각하며 인간의 한계를 극복하는 학문!' },
      { id: 'st-a6', name: '인간과 철학', credits: 4, stats: { insight: 20 }, description: '메타인지를 발동해 "나는 과연 누구인가?" 근원적 심해 질문 해결!' },
      { id: 'st-a7', name: '논리와 사고', credits: 4, stats: { logic: 20 }, description: '모순 없이 완벽한 설득력을 갖춰 말싸움 승률 100%를 보장하는 스킬!' },
    ],
    fusion: [
      { id: 'st-f1', name: '독서 토론과 글쓰기', credits: 4, stats: { communication: 10, logic: 10 }, description: '서로 다른 캐릭터 카드들끼리 난상 토론을 나누며 우정의 연대로 집필!' },
      { id: 'st-f2', name: '매체 의사소통', credits: 4, stats: { creativity: 15, communication: 5 }, description: '유튜브, 웹진, 미디어 인터페이스를 활용해 내 창작물을 빛나게 기획!' },
      { id: 'st-f3', name: '언어생활 탐구', credits: 4, stats: { inquiry: 15, logic: 5 }, description: '매일 쓰는 사소한 언어가 뇌와 사회에 어떻게 작용하는지 면밀한 해부!' },
      { id: 'st-f4', name: '역사로 탐구하는 현대 세계', credits: 4, stats: { insight: 20 }, description: '현대 국제 뉴스와 정세의 뿌리가 된 대사건들을 완벽 동기화!' },
      { id: 'st-f5', name: '윤리문제 탐구', credits: 4, stats: { ethics: 20 }, description: 'AI 시대에 필요한 전지적 인류의 도덕 시나리오 및 판정 세우기!' },
      { id: 'st-f6', name: '논술', credits: 4, stats: { logic: 15, communication: 5 }, description: '주장과 정교한 근거를 탄탄히 엮어 원페이퍼 제안서로 입증!' },
    ],
    creative: [
      { id: 'st-c1', name: '인문학 캠프', credits: 18, stats: { insight: 10, communication: 10 }, description: '철학적 논제와 문학 탐방 등 스토리텔러 지망생들의 끈끈한 인문학 수련 동아리!' }
    ]
  },

  // 2. 커맨더 (사회 계열)
  commander: {
    general: [
      { id: 'cm-g1', name: '대수', credits: 4, stats: { logic: 15, inquiry: 5 }, description: '숫자의 일반적 표기와 계산 원리로 비즈니스 기본 틀 생성!' },
      { id: 'cm-g2', name: '확률과 통계', credits: 4, stats: { logic: 20 }, description: '빅데이터 속에서 승리 확률을 계산하고 시장 리스크를 회피하는 스킬!' },
      { id: 'cm-g3', name: '영어1', credits: 4, stats: { communication: 15 }, description: '해외 지부 커맨더들과 화상 회의를 뛰기 위한 1차 관문 스피킹!' },
      { id: 'cm-g4', name: '영어2', credits: 4, stats: { communication: 15, insight: 5 }, description: '심화된 해외 무역 분쟁과 정세를 읽는 전술 분석 독해!' },
      { id: 'cm-g5', name: '영어 독해와 작문', credits: 4, stats: { communication: 10, logic: 10 }, description: '계약서와 수주 기획서를 영어로 정교하게 작성 가능한 작문 패시브!' },
      { id: 'cm-g6', name: '세계시민과 지리', credits: 4, stats: { insight: 12, ethics: 8 }, description: '에너지 유통망과 아시아, 유라시아 원자재 영토 지도를 한눈에 마스터!' },
      { id: 'cm-g7', name: '사회와 문화', credits: 4, stats: { insight: 15, communication: 5 }, description: '다양성, 격차, 유행의 작동 구조를 다뤄 대중 리더십 획득!' },
      { id: 'cm-g8', name: '정보', credits: 4, stats: { logic: 15, creativity: 5 }, description: '컴퓨터 논리 사고를 활용해 업무 자동화와 경영 효율성을 극대화!' },
    ],
    advanced: [
      { id: 'cm-a1', name: '경제수학', credits: 4, stats: { logic: 20 }, description: '미적분과 확률을 가미해 복리 계산, 한계효용 등 돈의 흐름을 지배!' },
      { id: 'cm-a2', name: '직무 영어', credits: 4, stats: { communication: 20 }, description: '글로벌 바이어들을 사로잡는 마성의 협상 비즈니스 스피킹!' },
      { id: 'cm-a3', name: '도시와 미래 탐구', credits: 4, stats: { creativity: 15, insight: 5 }, description: '스마트 물류 타운과 공공 교통 인프라 혁신을 꿈꾸는 지자체 계획!' },
      { id: 'cm-a4', name: '국제관계의 이해', credits: 4, stats: { insight: 20 }, description: '지정학적 외교 눈치싸움과 자존심 강한 대국들 간 얼라이언스 분석!' },
      { id: 'cm-a5', name: '나라 별 심화 언어 및 회화', credits: 4, stats: { communication: 20 }, description: '제2외국어를 정밀 저격해 타운홀 미팅을 가뿐히 이끌어가는 세컨드 언어!' },
      { id: 'cm-a6', name: '인간과 철학', credits: 4, stats: { insight: 15, ethics: 5 }, description: '지도자로서 어떤 가치 판단을 해야하는가 묵직한 선악 지표 성찰!' },
      { id: 'cm-a7', name: '논리와 사고', credits: 4, stats: { logic: 20 }, description: '시장 분석 보고서에서 한 치의 반박도 허용하지 않도록 치밀한 팩트 구축!' },
    ],
    fusion: [
      { id: 'cm-f1', name: '실용통계', credits: 4, stats: { logic: 20 }, description: '구글폼, 설문조사 실적을 가공해 아름다운 시각화 보고서로 박제!' },
      { id: 'cm-f2', name: '사회문제 탐구', credits: 4, stats: { inquiry: 15, ethics: 5 }, description: '기후위기, 고령화, 빈부격차 던전을 구조적으로 정벌할 대안 연구!' },
      { id: 'cm-f3', name: '금융과 경제생활', credits: 4, stats: { insight: 20 }, description: '주식, 채권, 소득세율, 청약 바이블을 일찍이 마스터해 상생 재테커 도달!' },
      { id: 'cm-f4', name: '언어생활과 한자', credits: 4, stats: { insight: 10, communication: 10 }, description: '법령이나 고급 비즈니스 어휘의 근원인 한자 언어를 전격 정복!' },
      { id: 'cm-f5', name: '인간과 경제활동', credits: 4, stats: { logic: 10, ethics: 10 }, description: '시장의 이기심 속에서 합리적인 소비와 착한 배분이 가능한가 성찰!' },
      { id: 'cm-f6', name: '논술', credits: 4, stats: { communication: 15, logic: 5 }, description: '대사회적 기고나 정책 제안서를 짜며 리더다운 지성의 위상 과시!' },
    ],
    creative: [
      { id: 'cm-c1', name: '모의 투자 및 창업 동아리', credits: 18, stats: { logic: 10, insight: 10 }, description: '가상 경영 시뮬레이션을 뛰며 투자 자금 매칭 및 IR 피치를 실행하는 정찰대!' }
    ]
  },

  // 3. 버퍼 (교육 계열)
  buffer: {
    general: [
      { id: 'bf-g1', name: '화법과 언어', credits: 4, stats: { communication: 15, logic: 5 }, description: '눈높이에 맞춘 다정과 경청으로 신뢰의 성벽을 축조하는 말하기!' },
      { id: 'bf-g2', name: '독서와 작문', credits: 4, stats: { communication: 10, creativity: 10 }, description: '정보 전달과 지적 이해를 돕기 위한 최정예 글쓰기 스킬!' },
      { id: 'bf-g3', name: '문학', credits: 4, stats: { creativity: 15, ethics: 5 }, description: '우리가 지닌 마음의 그늘을 동화나 소설을 통해 아늑히 덮어줌!' },
      { id: 'bf-g4', name: '대수', credits: 4, stats: { logic: 15, inquiry: 5 }, description: '아이들을 계량하고 성장 지표를 수리적으로 관리해줄 실용 대수!' },
      { id: 'bf-g5', name: '확률과 통계', credits: 4, stats: { logic: 20 }, description: '평가 문항의 난이도와 모의고사 변별력을 검증하는 통계 장비!' },
      { id: 'bf-g6', name: '영어1', credits: 4, stats: { communication: 15 }, description: '주변 소외된 환경의 다문화 학생들에게 기꺼이 뻗을 글로벌 손길!' },
      { id: 'bf-g7', name: '사회와 문화', credits: 4, stats: { insight: 15, communication: 5 }, description: '사회 각계각층 계층 구조를 이해하고 공평한 역전 발판을 선사!' },
      { id: 'bf-g8', name: '현대사회와 윤리', credits: 4, stats: { ethics: 20 }, description: '올바른 시민성 함양과 교사로서 지켜야할 고고한 참스승 마인드셋!' },
    ],
    advanced: [
      { id: 'bf-a1', name: '직무 의사소통', credits: 4, stats: { communication: 20 }, description: '학부모, 학생, 동료 교사 간 모든 민원을 보듬는 평화 중재단 화법!' },
      { id: 'bf-a2', name: '직무수학', credits: 4, stats: { logic: 15, inquiry: 5 }, description: '학생 정적 분석 및 교육 통계 연산 처리를 향해 정진하는 실용 세팅!' },
      { id: 'bf-a3', name: '영어 발표와 토론', credits: 4, stats: { communication: 20 }, description: '스마트 클래스 교단에서 유창한 잉글리시 버프를 풀가동하는 무기!' },
      { id: 'bf-a4', name: '직무 영어', credits: 4, stats: { communication: 15, ethics: 5 }, description: '해외 교육 교환 교사 및 글로벌 연수를 위한 직업 맞춤형 잉글리시!' },
      { id: 'bf-a5', name: '한국지리 탐구', credits: 4, stats: { insight: 15, inquiry: 5 }, description: '지방 소멸과 교육 불평등 지역을 찾아다니며 구호할 지리 탐정단!' },
      { id: 'bf-a6', name: '인간과 철학', credits: 4, stats: { insight: 15, ethics: 5 }, description: '에라스무스, 루소 등의 명저를 다루며 참다운 가르침의 철학 정동!' },
      { id: 'bf-a7', name: '교육의 이해', credits: 4, stats: { ethics: 20 }, description: '교육학 개론을 선행 학습하는 버퍼들의 마스터피스 궁극 스킬!' },
    ],
    fusion: [
      { id: 'bf-f1', name: '독서 토론과 글쓰기', credits: 4, stats: { communication: 15, logic: 5 }, description: '자유 학기제 독서 모임을 연상시키는 훈훈한 소그룹 교안 기획!' },
      { id: 'bf-f2', name: '언어생활 탐구', credits: 4, stats: { inquiry: 15, communication: 5 }, description: '국어 오탈자 및 어휘의 정량적 탐구로 올바른 언어 교정사 활약!' },
      { id: 'bf-f3', name: '사회문제 탐구', credits: 4, stats: { ethics: 15, inquiry: 5 }, description: '디지털 교과서 도입 후 아이들의 스마트폰 중독 해결 등 방책 기안!' },
      { id: 'bf-f4', name: '윤리문제 탐구', credits: 4, stats: { ethics: 20 }, description: '인간 본성과 교조적 처우에 대한 치열하고 따뜻한 가치 투쟁!' },
      { id: 'bf-f5', name: '아동발달과 부모', credits: 4, stats: { ethics: 15, insight: 5 }, description: '영유아 건강과 삐아제 발달 이론을 보며 전인적 성장 버프 확보!' },
      { id: 'bf-f6', name: '논술', credits: 4, stats: { logic: 15, communication: 5 }, description: '비교과 및 서술형 평가 문항을 세세히 진단하고 채점하는 메시아!' },
    ],
    creative: [
      { id: 'bf-c1', name: '교육봉사 및 돌봄 동아리', credits: 18, stats: { communication: 10, ethics: 10 }, description: '또래 아동 돌봄, 지역 보육 지점 멘토링 활동으로 버프의 정수 실천!' }
    ]
  },

  // 4. 연금술사 (자연 계열)
  alchemist: {
    general: [
      { id: 'ac-g1', name: '대수', credits: 4, stats: { logic: 20 }, description: '연금술 공식의 변수와 등식을 완성하는 기본 수학적 매트릭스!' },
      { id: 'ac-g2', name: '영어1', credits: 4, stats: { communication: 15 }, description: '세계 과학 저널과 생태 보고서를 정기 교환할 수 있는 글로벌 통신!' },
      { id: 'ac-g3', name: '영어2', credits: 4, stats: { communication: 10, insight: 5 }, description: '서양 자연주의 학술 논문을 깊게 읽는 눈을 뜨는 패시브 장비!' },
      { id: 'ac-g4', name: '영어 독해와 작문', credits: 4, stats: { logic: 10, communication: 10 }, description: '나만의 기후변화 해결 방안서와 영작 원고를 해외 기구에 송신!' },
      { id: 'ac-g5', name: '세계시민과 지리', credits: 4, stats: { insight: 12, ethics: 8 }, description: '사막화, 해수면 상승 지도를 보며 글로벌 지구 회생 시나리오 전개!' },
      { id: 'ac-g6', name: '현대사회와 윤리', credits: 4, stats: { ethics: 20 }, description: '생명 공학 폭주와 무자비한 환경 파괴에 맞서 도덕 브레이크 탑재!' },
      { id: 'ac-g7', name: '물리학', credits: 4, stats: { inquiry: 15, logic: 5 }, description: '역학, 전자기학 등 거대 우주 물리력의 매커니즘을 규정하는 학문!' },
      { id: 'ac-g8', name: '화학', credits: 4, stats: { inquiry: 20 }, description: '연금술사 필수! 전자의 장난과 원소 결합 공식을 지휘하는 실전 마법!' },
      { id: 'ac-g9', name: '지구과학', credits: 4, stats: { inquiry: 15, insight: 5 }, description: '심해 해류 순환, 지각 판게아 이동부터 우주 끝 은하까지 전격 수집!' },
      { id: 'ac-g10', name: '생태와 환경', credits: 4, stats: { ethics: 15, inquiry: 5 }, description: '지구가 망가지지 않게 멸종 위기종을 보듬고 탄소 중립을 견인하는 법!' },
    ],
    advanced: [
      { id: 'ac-a1', name: '한국지리 탐구', credits: 4, stats: { insight: 15, inquiry: 5 }, description: '한반도 지반, 화산 절경, 백두대간의 자연 지리를 추적하는 스키마!' },
      { id: 'ac-a2', name: '도시와 미래 탐구', credits: 4, stats: { creativity: 15, inquiry: 5 }, description: '자연과 테크가 완벽 공존하는 숲세권 기후 혁신 메트로폴리스 설계!' },
      { id: 'ac-a3', name: '동아시아 역사 기행', credits: 4, stats: { insight: 20 }, description: '지리와 결합된 동아시아 숲과 강, 기원 설화를 가득 찾아다니는 모험!' },
      { id: 'ac-a4', name: '물질과 에너지', credits: 4, stats: { logic: 15, inquiry: 5 }, description: '열역학 숲을 빠져나와 쿼크와 광자의 기묘한 에너지를 활용하는 루트!' },
      { id: 'ac-a5', name: '지구시스템 과학', credits: 4, stats: { inquiry: 20 }, description: '대기권, 수권, 생물권의 유기적 상호 순환을 기상 슈퍼컴처럼 시뮬레이션!' },
      { id: 'ac-a6', name: '행성우주과학', credits: 4, stats: { creativity: 15, inquiry: 5 }, description: '화성 이주 탐사와 외계 항성계 탐색으로 지평선을 은하 너머로 퀀텀 점프!' },
    ],
    fusion: [
      { id: 'ac-f1', name: '여행지리', credits: 4, stats: { insight: 15, communication: 5 }, description: '동경하는 전설 속 탐험지들의 현무암 특징을 캐러 떠나는 모험 바이블!' },
      { id: 'ac-f2', name: '윤리문제 탐구', credits: 4, stats: { ethics: 20 }, description: '원자력 에너지나 자원 탐사를 둘러싼 국가들 간의 공해상 타협 이슈 탐구!' },
      { id: 'ac-f3', name: '기후변화와 지속가능한 세계', credits: 4, stats: { inquiry: 15, ethics: 5 }, description: '지구 온난화 상승 곡선을 1.5도 이하로 동결시킬 글로벌 환경 방패막!' },
      { id: 'ac-f4', name: '과학의 역사와 문화', credits: 4, stats: { insight: 20 }, description: '갈릴레이에서 퀴리부인, 아인슈타인에 달하는 과학 혁명 히스토리 동화!' },
      { id: 'ac-f5', name: '기후변화와 환경생태', credits: 4, stats: { inquiry: 15, ethics: 5 }, description: '기상이변으로 인한 대자연 서식지 복원과 생물 다양성 수치 모니터링!' },
      { id: 'ac-f6', name: '융합과학 탐구', credits: 4, stats: { creativity: 15, inquiry: 5 }, description: '연금술사의 최고봉! 화학+지과 융합을 연구해 완전히 새로운 합성 촉매 개발!' },
    ],
    creative: [
      { id: 'ac-c1', name: '기후 데이터 분석 및 생태 캠페인 동아리', credits: 18, stats: { inquiry: 10, ethics: 10 }, description: '교내 이산화탄소 저감 추진, 인근 습지 탐험 등으로 지구 수호 의식 개방!' }
    ]
  },

  // 5. 메카닉 (공학 계열)
  mechanic: {
    general: [
      { id: 'mc-g1', name: '대수', credits: 4, stats: { logic: 20 }, description: '코딩 알고리즘의 시간 복잡도와 정수의 작동 기반을 만드는 단단한 수학!' },
      { id: 'mc-g2', name: '미적분1', credits: 4, stats: { logic: 20 }, description: '움직이는 로봇 궤적과 기하학적 변화율을 0.0001초 단위로 분석하는 마스터키!' },
      { id: 'mc-g3', name: '확률과 통계', credits: 4, stats: { logic: 15, inquiry: 5 }, description: '서버 트래픽 폭증 확률과 인공지능 예측 오파를 통제하는 계산 장비!' },
      { id: 'mc-g4', name: '영어1', credits: 4, stats: { communication: 15 }, description: '에라 모르겠다 스택오버플로우에서 에러 로그를 읽고 한숨 돌리는 스피킹!' },
      { id: 'mc-g5', name: '영어2', credits: 4, stats: { communication: 10, insight: 5 }, description: '구글 본사의 영문 신기술 도큐멘테이션과 테크 백서를 직접 탐독!' },
      { id: 'mc-g6', name: '영어 독해와 작문', credits: 4, stats: { communication: 10, creativity: 10 }, description: '글로벌 오픈소스 커뮤니티인 GitHub에 남길 유려한 리드미 영작!' },
      { id: 'mc-g7', name: '물리학', credits: 4, stats: { inquiry: 20 }, description: '역학, 회로 구성의 원리를 배워 하드웨어 모터 제어 백본 장착!' },
      { id: 'mc-g8', name: '화학', credits: 4, stats: { inquiry: 15, logic: 5 }, description: '반도체 집적 공정과 신소재 배터리 이온 활성화를 촉진할 기초 연금술!' },
      { id: 'mc-g9', name: '기술·가정', credits: 4, stats: { creativity: 15, logic: 5 }, description: '목공소 가공부터 전기 기계 납땜까지 수작업 빌더로서의 첫 조립 개시!' },
      { id: 'mc-g10', name: '정보', credits: 4, stats: { logic: 15, creativity: 5 }, description: '파이썬, C 계열 코드의 뼈대를 다지며 무한 에어로프 코딩 게이지 폭풍 충전!' },
    ],
    advanced: [
      { id: 'mc-a1', name: '기하', credits: 4, stats: { logic: 20 }, description: '3D 그래픽 랜더링과 벡터 엔진, 로봇 팔 관절 설계를 위한 공간 마스터 스킬!' },
      { id: 'mc-a2', name: '미적분2', credits: 4, stats: { logic: 20 }, description: '복잡한 인공지능 인공신경망 역전파(Backpropagation) 기울기 완전 정복!' },
      { id: 'mc-a3', name: '인공지능수학', credits: 4, stats: { logic: 15, creativity: 5 }, description: '선형대수와 행렬 연산, 경사하강법의 기묘한 세계를 수렴시키는 수학!' },
      { id: 'mc-a4', name: '전자기와 양자', credits: 4, stats: { inquiry: 20 }, description: '양자 컴퓨터 큐비트 제어와 초전도 전자기 유도 필드를 설계하는 고급 물리!' },
      { id: 'mc-a5', name: '물질과 에너지', credits: 4, stats: { inquiry: 15, logic: 5 }, description: '안정적인 발전기 냉각과 대전력 전송 터빈을 설계하는 공학 에너지론!' },
      { id: 'mc-a6', name: '인공지능 기초', credits: 4, stats: { creativity: 15, logic: 5 }, description: 'ChatGPT 같은 LLM 에이전트와 인접 뉴럴 네트워크를 구축해보는 실전 코스!' },
      { id: 'mc-a7', name: '데이터 과학', credits: 4, stats: { logic: 15, inquiry: 5 }, description: '지저분한 웹 크롤링 원료들을 파이프라인으로 씻어내 보석 데이터로 가공!' },
    ],
    fusion: [
      { id: 'mc-f1', name: '수학과 문화', credits: 4, stats: { creativity: 15, insight: 5 }, description: '피라미드 구조와 피보나치 패턴 속 숨겨진 예술적 황금 결합 감상!' },
      { id: 'mc-f2', name: '실용통계', credits: 4, stats: { logic: 20 }, description: '센서 로그와 전력 소모량을 정밀 피팅한 시각화 회귀 계수 레포트!' },
      { id: 'mc-f3', name: '수학과제 탐구', credits: 4, stats: { inquiry: 15, logic: 5 }, description: '오일러 공식, 몬테카를로 난수 알고리즘을 파고들어 나만의 시뮬레이터 개발!' },
      { id: 'mc-f4', name: '창의 공학 설계', credits: 4, stats: { creativity: 20 }, description: '3D 프린터, 아두이노, 모터 실드를 엮는 메카닉 전공의 최종 보스 궁극기!' },
      { id: 'mc-f5', name: '지식 재산 일반', credits: 4, stats: { ethics: 15, insight: 5 }, description: '특허 장벽을 쌓아 내 독창적인 아이디어 설계를 지켜내고 무단 도용 방멸!' },
      { id: 'mc-f6', name: '소프트웨어 생활', credits: 4, stats: { creativity: 15, communication: 5 }, description: '모바일 앱, 스마트 웹페이지 버그를 개선해 모험가들에게 문명적 광명 선사!' },
    ],
    creative: [
      { id: 'mc-c1', name: '로봇 제작 및 아두이노 메이커스 동아리', credits: 18, stats: { logic: 10, creativity: 10 }, description: '교내 로보틱스 창작전 참가 및 사물 인터넷 제어를 연구하는 정예 공대 공정!' }
    ]
  },

  // 6. 힐러 (의약·보건 계열)
  healer: {
    general: [
      { id: 'hl-g1', name: '대수', credits: 4, stats: { logic: 15, inquiry: 5 }, description: '약물 희석액 비례율과 신체 가중치 대수 정합 방정식을 위한 수리 패시브!' },
      { id: 'hl-g2', name: '미적분1', credits: 4, stats: { logic: 20 }, description: '혈류 속도 변화량과 시간에 따른 바이러스 백신 작용 곡선 정밀 추적!' },
      { id: 'hl-g3', name: '확률과 통계', credits: 4, stats: { logic: 20 }, description: '신약 후보 물질 임상 실험 환자의 유의미한 완치 확률 p-value 구하기!' },
      { id: 'hl-g4', name: '영어1', credits: 4, stats: { communication: 15 }, description: '세계보건기구(WHO)의 의학 저포와 응급 통역 스피킹 역량 수지!' },
      { id: 'hl-g5', name: '영어2', credits: 4, stats: { communication: 10, insight: 5 }, description: '고급 영문 약리학 텍스트북과 의학 학회 보고서 직독직해 스킬!' },
      { id: 'hl-g6', name: '영어 독해와 작문', credits: 4, stats: { communication: 10, logic: 10 }, description: '해외 의료 봉사 계획 및 병상 소견서를 완벽히 유려한 영문으로 기술!' },
      { id: 'hl-g7', name: '화학', credits: 4, stats: { inquiry: 20 }, description: '체내 pH 농도와 헤모글로빈 배위 결합, 수용성 약물 합성 작용 통제!' },
      { id: 'hl-g8', name: '생명과학', credits: 4, stats: { inquiry: 20 }, description: '힐러의 존재 의의! DNA 복제, 광합성, 신경 세포 호르몬 전송 패시브!' },
      { id: 'hl-g9', name: '지구과학', credits: 4, stats: { inquiry: 15, insight: 5 }, description: '유행병 유입에 기여하는 기후 기압 변화 등 거대 생태학적 조율 능력!' },
      { id: 'hl-g10', name: '기술·가정', credits: 4, stats: { creativity: 10, ethics: 10 }, description: '환아 환아들을 위한 요리 영양 배분과 위생 가사 환경 구축!' },
    ],
    advanced: [
      { id: 'hl-a1', name: '기하', credits: 4, stats: { logic: 15, creativity: 5 }, description: '단층 기하학적 MRI 이미지 조영제 투여 구역의 3D 공간 연산 분석!' },
      { id: 'hl-a2', name: '미적분2', credits: 4, stats: { logic: 20 }, description: '고차 혈류 저항 곡선과 면역 역학 방정식을 극강으로 돌파하는 정수!' },
      { id: 'hl-a3', name: '화학반응의 세계', credits: 4, stats: { inquiry: 20 }, description: '유기 이성질체 제약 조제 연구의 무한 화학적 결합 메트릭스!' },
      { id: 'hl-a4', name: '세포와 물질대사', credits: 4, stats: { inquiry: 20 }, description: '미토콘드리아 ATP 생성 회로를 분자 하나 수준으로 클로즈업!' },
      { id: 'hl-a5', name: '생물의 유전', credits: 4, stats: { inquiry: 15, ethics: 5 }, description: '멘델 유전부터 크리스퍼 유전자 가위의 기묘한 가능성 탐사!' },
      { id: 'hl-a6', name: '인간과 심리', credits: 4, stats: { communication: 15, ethics: 5 }, description: '프로이트, 아들러 등의 분석론으로 환자의 마음 깊은 응어리를 힐링!' },
      { id: 'hl-a7', name: '삶과 종교', credits: 4, stats: { ethics: 20 }, description: '생명 탄생과 소멸을 바라보는 경건함과 고통에 직면한 이들을 위로!' },
      { id: 'hl-a8', name: '보건', credits: 4, stats: { ethics: 20 }, description: '힐러의 고유 권능! 심폐소생술, 감염병 대유행 시나리오 방어 지침!' },
    ],
    fusion: [
      { id: 'hl-f1', name: '수학과제 탐구', credits: 4, stats: { inquiry: 15, logic: 5 }, description: '신경 자극 전도율 방정식을 그래프로 구현하여 전기 모니터 완성!' },
      { id: 'hl-f2', name: '과학의 역사와 문화', credits: 4, stats: { insight: 15, ethics: 5 }, description: '페니실린 대발견부터 백신 보급에 담긴 인류 보건 투쟁의 가슴뜨거운 연대기!' },
      { id: 'hl-f3', name: '기후변화와 환경생태', credits: 4, stats: { inquiry: 15, ethics: 5 }, description: '아프리카 말라리아 창궐 구역 기후 기온 영향도 상관관계 지리학!' },
      { id: 'hl-f4', name: '융합과학 탐구', credits: 4, stats: { creativity: 15, inquiry: 5 }, description: '생물+화학 융합 지식을 토대로 부작용 없는 바이오 패치 연구!' },
      { id: 'hl-f5', name: '인체구조와 원리', credits: 4, stats: { inquiry: 20 }, description: '힐러 마스터의 최고 존엄! 뼈, 힘줄, 심장 판막의 신비로운 전신 원리 타파!' },
    ],
    creative: [
      { id: 'hl-c1', name: '생명과학 정밀실험 및 보건봉사 동아리', credits: 18, stats: { inquiry: 10, ethics: 10 }, description: '식물 엽록소 크로마토그래피 실험, 인근 복지 타운 위생 봉사 대열!' }
    ]
  },

  // 7. 크리에이터 (예체능 계열)
  creator: {
    general: [
      { id: 'cr-g1', name: '문학', credits: 4, stats: { creativity: 15, insight: 5 }, description: '시와 연극적 묘사 속에서 창의적 창작의 아이디어를 분수처럼 길어내기!' },
      { id: 'cr-g2', name: '영어1', credits: 4, stats: { communication: 15 }, description: '디자인 포트폴리오를 Behance 같은 글로벌 사이트에 공유하는 글로벌 소통!' },
      { id: 'cr-g3', name: '영어2', credits: 4, stats: { communication: 10, insight: 5 }, description: '세계 현대 미술 전시회 영문 도슨트 및 가이드를 직접 흡수!' },
      { id: 'cr-g4', name: '사회와 문화', credits: 4, stats: { insight: 12, ethics: 8 }, description: '스트리트 패션, 팝 컬처의 가파른 흐름을 탐구하여 문화 트렌드세터 안착!' },
      { id: 'cr-g5', name: '체육1', credits: 4, stats: { creativity: 10, logic: 5 }, description: '크리에이터의 기초인 강인한 허리와 척추, 바디 밸런스를 위한 기초 모션!' },
      { id: 'cr-g6', name: '체육2', credits: 4, stats: { creativity: 10, inquiry: 5 }, description: '안정적인 산소 섭취율과 파워 러닝으로 지구력과 활력을 정점 도달!' },
      { id: 'cr-g7', name: '음악', credits: 4, stats: { creativity: 15, communication: 5 }, description: '음계의 오묘한 화음과 비트를 튕기며 마음을 감미롭게 위로!' },
      { id: 'cr-g8', name: '미술', credits: 4, stats: { creativity: 20 }, description: '기하학적 투시도와 아름다운 음영 배분으로 캔버스를 불태우는 시각 마술!' },
      { id: 'cr-g9', name: '연극', credits: 4, stats: { creativity: 15, communication: 5 }, description: '인생은 연극! 가상의 인격이 되어 타인과 몸짓 발성으로 긴밀 대면!' },
    ],
    advanced: [
      { id: 'cr-a1', name: '운동과 건강', credits: 4, stats: { inquiry: 10, ethics: 10 }, description: '인바디 수치와 이상적인 식단으로 몸 건강 마스터 라이프 구축!' },
      { id: 'cr-a2', name: '스포츠 문화', credits: 4, stats: { insight: 15, ethics: 5 }, description: '올림픽과 월드컵 역사, 그 안에서 피어난 정정당당한 페어플레이 가치!' },
      { id: 'cr-a3', name: '스포츠 과학', credits: 4, stats: { logic: 15, inquiry: 5 }, description: '중력 가속도, 작용반작용을 활용해 슈팅 궤적과 스피드를 23% 상승!' },
      { id: 'cr-a4', name: '음악 연주와 창작', credits: 4, stats: { creativity: 20 }, description: '기타, 건반 악기로 나만의 로고송과 감동적인 배경음을 자가 제조!' },
      { id: 'cr-a5', name: '음악 감상과 비평', credits: 4, stats: { insight: 15, communication: 5 }, description: '베토벤부터 뉴진스까지, 시대별 음악 앨범 속 숨겨진 시대성 칼분석!' },
      { id: 'cr-a6', name: '미술 창작', credits: 4, stats: { creativity: 20 }, description: '드로잉, 수채화, 3D 조소, 그래피티를 통해 나의 정신세계를 실체화!' },
      { id: 'cr-a7', name: '미술 감상과 비평', credits: 4, stats: { insight: 15, communication: 5 }, description: '밀레, 피카소, 뱅크시 명작의 구도와 시선 이동을 논리적으로 난도질!' },
    ],
    fusion: [
      { id: 'cr-f1', name: '세계 문화와 영어', credits: 4, stats: { communication: 15, insight: 5 }, description: '브로드웨이 뮤지컬과 뉴욕 팝 무대의 생생한 영어 가사를 마스터!' },
      { id: 'cr-f2', name: '스포츠생활1', credits: 4, stats: { creativity: 15 }, description: '배드민턴, 실내 클라이밍을 배우며 생활 속 익스트림 엔도르핀 방출!' },
      { id: 'cr-f3', name: '음악과 미디어', credits: 4, stats: { creativity: 20 }, description: '음치 탈출! 작곡 소프트웨어(DAW)를 사용해 음원을 하이테크하게 믹싱!' },
      { id: 'cr-f4', name: '미술과 매체', credits: 4, stats: { creativity: 20 }, description: '포토샵, 일러스트레이터, 영상 합성 툴로 마케팅 최정예 비주얼 기획!' },
      { id: 'cr-f5', name: '생애 설계와 자립', credits: 4, stats: { ethics: 15, logic: 5 }, description: '대학 졸업 후 보금자리 마련과 고독하지 않게 자산 관리하는 실전 레벨!' },
      { id: 'cr-f6', name: '아동발달과 부모', credits: 4, stats: { ethics: 15, communication: 5 }, description: '영유아 맞춤형 컬러 테라피와 창의 음악 놀이 교안을 영재 설계!' },
    ],
    creative: [
      { id: 'cr-c1', name: '예술 축제 기획 및 스포츠 클럽 동아리', credits: 18, stats: { creativity: 10, communication: 10 }, description: '교내 갤러리 기획, 버스킹 무대 총감독, 스포츠 타운 리그전 완파!' }
    ]
  }
};
