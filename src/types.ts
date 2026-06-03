/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CharacterStats {
  logic: number; // 논리력
  inquiry: number; // 탐구력
  communication: number; // 소통력
  creativity: number; // 창의성
  insight: number; // 통찰력
  ethics: number; // 윤리의식
}

export type ClassTitle = 
  | 'storyteller' // 스토리텔러
  | 'commander'   // 커맨더
  | 'buffer'      // 버퍼
  | 'alchemist'   // 연금술사
  | 'mechanic'    // 메카닉
  | 'healer'      // 힐러
  | 'creator';    // 크리에이터

export interface ClassInfo {
  id: ClassTitle;
  name: string;
  icon: string;
  emoji: string;
  description: string;
  statsMultiplier: CharacterStats; // 클래스 기본 가중치 또는 시작 스탯
}

export interface Subject {
  id: string;
  name: string;
  credits: number;
  stats: Partial<CharacterStats>;
  description: string;
}

export interface SkillTreeData {
  common: Subject[];
  storyteller: {
    general: Subject[];
    advanced: Subject[];
    fusion: Subject[];
    creative: Subject[];
  };
  commander: {
    general: Subject[];
    advanced: Subject[];
    fusion: Subject[];
    creative: Subject[];
  };
  buffer: {
    general: Subject[];
    advanced: Subject[];
    fusion: Subject[];
    creative: Subject[];
  };
  alchemist: {
    general: Subject[];
    advanced: Subject[];
    fusion: Subject[];
    creative: Subject[];
  };
  mechanic: {
    general: Subject[];
    advanced: Subject[];
    fusion: Subject[];
    creative: Subject[];
  };
  healer: {
    general: Subject[];
    advanced: Subject[];
    fusion: Subject[];
    creative: Subject[];
  };
  creator: {
    general: Subject[];
    advanced: Subject[];
    fusion: Subject[];
    creative: Subject[];
  };
}

export interface GameState {
  playerName: string;
  schoolName: string;
  selectedClass: ClassTitle | null;
  step: 'opening' | 'gen_selection' | 'dungeon_game' | 'stair_game' | 'class_select' | 'common_intro' | 'adv_selection' | 'fus_selection' | 'creative_intro' | 'result';
  selectedGeneral: string[]; // 일반선택 IDs
  selectedAdvanced: string[]; // 진로선택 IDs
  selectedFusion: string[];  // 융합선택 IDs
  chatbotLogs: ChatLog[];
}

export interface ChatLog {
  id: string;
  sender: 'ddokddi' | 'player';
  text: string;
  timestamp: string;
  status?: 'friendly' | 'happy' | 'thinking' | 'victory' | 'surprised';
}
