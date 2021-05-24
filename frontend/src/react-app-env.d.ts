/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }
}

declare module "*.avif" {
  const src: string;
  export default src;
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare interface SocketMessage {
  id: string;
  body: string;
  type: string;
}

declare interface CardInterface {
  id: string;
  name: string;
  type: string;
  strength: number;
  skill: number;
  magical_force: number;
  weapons: number;
  power: number;
}

declare interface DeckInterface {
  id: string;
  name: string;
  user_id: string;
  battle_id: string;
  cards: CardInterface[];
}

declare interface HandInterface {
  id?: string;
  deck_id: string;
  round_id: string;
  card_id: string;
  value?: number;
  name?: string;
  user_id?: string;
}

declare interface RoundInterface {
  id: string;
  battle_id: string;
  attribute?: string;
  leader?: string;
  started_at?: string;
  winning_hand: HandInterface;
}

declare interface BattleInterface {
  id: string;
  started_at?: string;
  winner?: string;
  decks: DeckInterface[];
  rounds: RoundInterface[];
}
