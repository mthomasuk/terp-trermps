# CLAUDE.md — Super Terp Trermps

Session notes and guidance for LLM-assisted development on this repo.

## Repository Overview

Top Trumps-style card battle game. Go backend + React/TypeScript frontend.

- `backend/` — Go, Echo framework, PostgreSQL (sqlx), gorilla/websocket
- `frontend/` — React 17, TypeScript, React Router v5, styled-components, Context API
- `tests/` — integration tests

## Git / Push Workflow

The git remote uses a local rotating-port proxy. Direct pushes will return 403.

**Always push via PAT URL:**
```
git push https://<PAT>@github.com/mthomasuk/terp-trermps.git <branch-name>
```

The PAT is a classic token with `repo` scope — obtain from the repo owner or GitHub settings.

Active branches:
- `claude/audit-codebase-bugs-fu5uC` — backend bug fixes + performance
- `claude/frontend-logic-audit` — frontend bug fixes + performance

## Known Intentional Non-Fixes

These items were identified as bugs/issues but were **intentionally left as-is** (reverted by linter or user decision):

- `backend/handler/ws.go` — connection upgrade and send logic
- `backend/handler/null.go` — null handling
- `backend/handler/hand.go` — hand play logic
- `backend/database/random.go` — random selection
- `backend/database/hand.go` — hand queries
- `backend/database/battle.go` — battle queries
- `backend/database/deck.go` (original SQL in `RetrieveDeck`) — incorrect `card_in_deck` query still present
- `backend/database/round.go` (`Conn.Exec` vs `Conn.NamedExec` for attribute reset) — linter prefers `Conn.Exec`
- Hardcoded secrets: session secret `"poopyass"` and password salt `"fartypants"` — not fixed by request
- `hub.go` channel buffering and JSON parsing — reverted by linter

Do **not** re-apply fixes to these files unless the user explicitly asks.

## Architecture Notes

### Backend

- **Entry point:** `backend/main.go` → starts Echo server + WebSocket hub
- **Database:** `backend/database/` — each entity has its own file; `database.go` initialises schema + connection pool
- **Handlers:** `backend/handler/` — Echo route handlers; `hub.go` / `ws.go` manage WebSocket connections
- **Types:** `backend/types/` — shared structs
- **Auth:** Session cookie (`gorilla/sessions`) + bcrypt passwords. Session secret and password salt are hardcoded env-fallback strings.

### Frontend

- **Routes:** `/login` → `Landing` page (auth), `/` → home, `/battle/:id` → `Battle` page
- **Context:** `UserControlStore` (auth state), `BattleControlStore` (API calls)
- **WebSocket:** `useSocket(id)` hook in `Websocket.ts` — call only once per battle page; passing `attributeSelected` as a prop avoids multiple connections
- **`Battle.tsx`** is the main game page — manages round state, derives `isLeader` from `currentRound.leader` (server-assigned), not deck order
- **`isLeader`** must be derived from `currentRound?.leader === currentUser?.id` — the first deck owner is NOT necessarily the leader

### WebSocket Message Types (`frontend/src/constants.ts`)

| Constant | Value |
|---|---|
| `BATTLE_START` | `"battle-started"` |
| `BATTLE_END` | `"battle-ended"` |
| `USER_JOINED_BATTLE` | `"user-joined-battle"` |
| `WINNING_HAND_PLAYED` | `"winning-hand-played"` |
| `ROUND_ATTRIBUTE_SELECTED` | `"round-attribute-selected"` |
| `ROUND_IS_A_DRAW` | `"round-is-a-draw"` |

## Bugs Fixed (backend branch)

1. Missing DB indexes — `round.battle_id`, `card_in_deck.card_id`, `hand.deck_id`
2. Connection pool tuning — `SetMaxIdleConns(5)`, `SetMaxOpenConns(25)`, `SetConnMaxLifetime(5min)`
3. Batch INSERT in `GenerateDecks` — replaced per-card `AddCardToDeck` loop with single `addCardsToDeck` batch query per deck

## Bugs Fixed (frontend branch)

1. `isLeader` derived from `currentRound.leader` (server field) instead of `decks[0].user_id`
2. `winningHand` now resets to `undefined` when `WINNING_HAND_PLAYED` arrives (prevents stale overlay on next round)
3. `ROUND_ATTRIBUTE_SELECTED` clears `winningHand` in addition to setting attribute
4. Single `useSocket` call in `Battle.tsx`; `attributeSelected` passed as prop to `BattleStatus` and `Cards`
5. Bad `<Redirect to="/battle/:id/results">` removed — route doesn't exist; `EnemiesCrushed` renders inline
6. `getSignedInUser()?.name` null-safe in `Landing.tsx`
7. `response.ok` checks added in `BattleControlStore` fetch calls
8. `useEffect` dependency cycle in `UserControlStore` — `[isSignedIn]` → `[]`
9. `Combatants` — removed internal state accumulation; fixed duplicate React keys
10. `Card` — wrapped with `React.memo`
11. `BattleControlStore` provider value wrapped in `useMemo`
12. `EnemiesCrushed` — confetti stops after 10 bursts; `ref` removed from deps
13. WebSocket ping reduced 1s → 30s; `reconnect`/`pingPong`/`socketRetries` moved from module scope into `useRef`
14. `fetchBattle` `useCallback` deps cleaned up; `totalCards` `useMemo` deps use `.length` not array refs

## MCP / GitHub Tools

The GitHub MCP server tools are scoped to `mthomasuk/terp-trermps` only. MCP write operations (create PR, comment, etc.) require a classic PAT with `repo` scope — the default Copilot integration token returns 403 for write ops.
