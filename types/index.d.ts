export interface SocketMessage {
  id: string;
  type: string;
  answerId?: string;
  score?: number;
  body?: string;
  name?: string;
  user_id?: string;
}

export interface Card {
  id: string;
  name: string;
  type: string;
  strength: number;
  skill: number;
  magical_force: number;
  weapons: number;
  power: number;
}
