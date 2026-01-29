# 프로젝트 발전 전략 분석

> 문제정의 → 가설수립 → 액션 수행 프레임워크를 통한 Tic Tac Toe 게임 프로젝트 발전 계획

---

## 1️⃣ 문제정의 (Problem Definition)

### 1.1 기술적 문제

- **테스트 커버리지 부족**: 현재 예제 테스트만 존재하고 실제 컴포넌트 테스트 부재
- **타입 안정성 미흡**: `strict: false`로 설정되어 있어 TypeScript의 이점 미활용
- **에러 처리 미흡**: Socket.io 통신 에러, API 실패 등 에러 핸들링 로직 부족
- **성능 최적화 부재**: 컴포넌트 렌더링 최적화, 메모리 누수 방지 로직 미흡
- **상태 관리**: 전역 상태 관리 솔루션(Redux, Zustand 등) 부재로 Props Drilling 발생 가능

### 1.2 기능적 문제

- **게임 기능 제한**: 1대1 게임만 지원, 다중 플레이어나 토너먼트 모드 부재
- **사용자 경험**: 네트워크 지연 시 사용자 피드백 부족
- **점수 시스템**: 실시간 순위, 배치, 통계 기능 미흡
- **모바일 대응**: 반응형 디자인 미완성 가능성

### 1.3 운영 및 배포 문제

- **배포 파이프라인**: CI/CD 파이프라인 미구성
- **모니터링**: 에러 로깅, 사용자 분석 미흡
- **문서화**: API 문서, 개발 가이드 부족
- **성능 모니터링**: 번들 사이즈, 로드 시간 분석 도구 부재

---

## 2️⃣ 가설수립 (Hypothesis)

### 2.1 기술 개선 가설

#### 가설 1: 테스트 커버리지 증대 → 버그 감소 및 개발 생산성 향상

```
"테스트 커버리지를 70% 이상으로 증대하면,
버그 발생 확률이 50% 감소하고 리팩토링 시간이 30% 단축될 것이다."
```

**근거:**

- 테스트된 코드는 변경 시 문제 파악이 빠름
- 회귀 버그 방지 가능
- 코드 품질 자동 검증

#### 가설 2: TypeScript Strict 모드 전환 → 런타임 에러 사전 방지

```
"Strict 모드 적용 시, 타입 관련 버그 70%를 개발 단계에서
사전에 발견할 수 있을 것이다."
```

**근거:**

- 타입 안정성 강화
- IDE 자동완성 개선
- 리팩토링 안전성 증대

#### 가설 3: 전역 상태 관리 도입 → Props Drilling 제거 및 유지보수성 향상

```
"Zustand/Redux 같은 상태 관리 도구 도입 시,
컴포넌트 복잡도가 40% 감소할 것이다."
```

**근거:**

- Props 체인 제거
- 상태 변화 추적 용이
- 디버깅 효율성 향상

### 2.2 기능 확장 가설

#### 가설 4: 게임 모드 다양화 → 사용자 체류시간 50% 증대

```
"AI 플레이어, 토너먼트 모드, 랭킹 시스템 추가 시,
사용자 DAU가 40% 증가하고 평균 플레이 시간이 50% 증가할 것이다."
```

**근거:**

- 다양한 콘텐츠 제공으로 재미 증대
- 경쟁 요소 강화
- 플레이어 리텐션 향상

#### 가설 5: 모바일 최적화 → 모바일 사용자 40% 확보

```
"반응형 디자인 완성 시, 모바일 유입이 현재 대비 3배 증가할 것이다."
```

**근거:**

- 모바일 사용 비중 증가 추세
- 접근성 개선
- 사용자 기반 확대

### 2.3 운영 개선 가설

#### 가설 6: 모니터링 시스템 구축 → 문제 해결 시간 70% 단축

```
"에러 로깅과 분석 대시보드 구축 시,
장애 해결 시간이 1시간에서 20분으로 단축될 것이다."
```

**근거:**

- 실시간 문제 감지
- 사용자 이슈 빠른 파악
- 데이터 기반 의사결정

---

## 3️⃣ 액션 수행 (Action Plan)

### Phase 1: 기초 강화 (1-2주)

#### 액션 1.1: 테스트 커버리지 70% 달성

```
📋 TODO:
□ 각 컴포넌트별 유닛 테스트 작성
  - Board, Player, Chat, Ready 컴포넌트
  - Avatar, Modal 컴포넌트
  - 유틸리티 함수 테스트

□ 통합 테스트 추가
  - 게임 플로우 테스트
  - 소켓 통신 모킹 및 테스트

□ E2E 테스트 (Playwright/Cypress)
  - 사용자 여정 테스트
  - 게임 시나리오 자동화

📊 성공 지표:
- 테스트 커버리지: 70% 이상
- 테스트 통과율: 100%
```

**구현 예시:**

```typescript
// src/features/game/__tests__/Board.integration.test.tsx
describe('Board 통합 테스트', () => {
  it('게임판 클릭 시 서버 이벤트 발생', async () => {
    const mockSocket = vi.fn();
    const { getByTestId } = render(
      <Board socket={mockSocket} />
    );

    await user.click(getByTestId('cell-0'));
    expect(mockSocket).toHaveBeenCalledWith('move', { position: 0 });
  });
});
```

#### 액션 1.2: TypeScript Strict 모드 전환

```
📋 TODO:
□ tsconfig.json strict 모드 활성화
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  ...

□ 기존 코드 타입 수정
  - Props 인터페이스 정의
  - 반환값 타입 명시
  - 제네릭 활용

□ 타입 정의 파일 정리
  - src/types/ 디렉토리 생성
  - 공통 타입 정의 (User, Game, Room 등)

📊 성공 지표:
- TypeScript 에러: 0개
- 타입 커버리지: 90% 이상
```

**구현 예시:**

```typescript
// src/types/game.ts
export interface GameState {
  board: Cell[];
  currentPlayer: PlayerType;
  winner: PlayerType | null;
  status: "waiting" | "playing" | "finished";
}

export type PlayerType = "X" | "O" | null;
export type Cell = PlayerType;
```

---

### Phase 2: 상태 관리 및 아키텍처 개선 (2-3주)

#### 액션 2.1: 전역 상태 관리 도입 (Zustand 권장)

```
📋 TODO:
□ Zustand 설치 및 설정
  npm install zustand

□ 스토어 생성
  - gameStore: 게임 상태 관리
  - userStore: 사용자 정보 관리
  - lobbyStore: 로비 상태 관리

□ 컴포넌트 리팩토링
  - Props Drilling 제거
  - 커스텀 훅으로 상태 접근

📊 성공 지표:
- 상태 관리 중앙화
- Props 전달 깊이: 3단계 이하
```

**구현 예시:**

```typescript
// src/stores/gameStore.ts
import { create } from "zustand";

interface GameStore {
  board: Cell[];
  currentPlayer: PlayerType;
  winner: PlayerType | null;
  updateBoard: (position: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  board: Array(9).fill(null),
  currentPlayer: "X",
  winner: null,
  updateBoard: (position: number) => {
    set((state) => ({
      board: [...state.board].splice(position, 1, state.currentPlayer),
      currentPlayer: state.currentPlayer === "X" ? "O" : "X",
    }));
  },
  resetGame: () =>
    set({
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
    }),
}));
```

#### 액션 2.2: 에러 처리 및 통신 추상화

```
📋 TODO:
□ 에러 처리 전략 수립
  - 에러 바운더리 컴포넌트 작성
  - 소켓 연결 오류 핸들링
  - API 에러 재시도 로직

□ 통신 레이어 추상화
  - ApiManager 강화
  - Socket.io 래퍼 클래스 작성
  - 요청/응답 인터셉터 구현

□ 사용자 피드백 시스템
  - 토스트 알림
  - 에러 메시지 표시
  - 네트워크 상태 표시

📊 성공 지표:
- 에러 처리 커버리지: 90% 이상
- 사용자 피드백 응답 시간: < 200ms
```

**구현 예시:**

```typescript
// src/shared/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logErrorToService(error, info);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

// src/shared/utils/socketManager.ts
export class SocketManager {
  private socket: Socket;

  connect() {
    this.socket.on('connect_error', this.handleError);
    this.socket.on('disconnect', this.handleDisconnect);
  }

  private handleError(error: Error) {
    // 재연결 로직
    // 에러 로깅
    // 사용자 알림
  }
}
```

---

### Phase 3: 기능 확장 (3-4주)

#### 액션 3.1: AI 플레이어 구현

```
📋 TODO:
□ AI 알고리즘 구현
  - Minimax 알고리즘으로 최적 수 계산
  - 난이도 레벨 추가 (쉬움, 보통, 어려움)

□ AI 게임 모드 추가
  - 싱글플레이 게임 로직
  - AI 턴 시간 지연으로 자연스러운 표현

□ 게임 모드 선택 UI
  - 플레이 타입 선택 화면
  - AI 난이도 선택

📊 성공 지표:
- AI 승률: 어려움 모드 80% 이상
- 응답 시간: < 1초
```

**구현 예시:**

```typescript
// src/shared/utils/aiPlayer.ts
export class AIPlayer {
  private difficulty: "easy" | "normal" | "hard";

  calculateMove(board: Cell[]): number {
    switch (this.difficulty) {
      case "easy":
        return this.randomMove(board);
      case "normal":
        return this.randomWeightedMove(board);
      case "hard":
        return this.minimaxMove(board);
    }
  }

  private minimaxMove(board: Cell[]): number {
    // Minimax 알고리즘 구현
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        const score = this.minimax(board, 0, false);
        board[i] = null;

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  private minimax(board: Cell[], depth: number, isMaximizing: boolean): number {
    const winner = this.checkWinner(board);

    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "O";
          bestScore = Math.max(
            bestScore,
            this.minimax(board, depth + 1, false),
          );
          board[i] = null;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "X";
          bestScore = Math.min(bestScore, this.minimax(board, depth + 1, true));
          board[i] = null;
        }
      }
      return bestScore;
    }
  }
}
```

#### 액션 3.2: 랭킹 및 통계 시스템

```
📋 TODO:
□ 게임 통계 수집
  - 승패 기록
  - 플레이 시간
  - 승률 계산

□ 랭킹 시스템 구현
  - 전체 랭킹
  - 주간/월간 랭킹
  - 친구 랭킹

□ 마이페이지 UI
  - 개인 통계 표시
  - 게임 히스토리
  - 배치/뱃지 시스템

📊 성공 지표:
- 랭킹 조회 시간: < 500ms
- 통계 데이터 정확도: 100%
```

**구현 예시:**

```typescript
// src/shared/utils/statisticsManager.ts
export interface UserStats {
  userId: string;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  totalPlayTime: number;
  winRate: number;
  currentRank: number;
  badges: Badge[];
}

export class StatisticsManager {
  calculateWinRate(wins: number, total: number): number {
    return total === 0 ? 0 : (wins / total) * 100;
  }

  calculateRank(wins: number, losses: number): number {
    // 랭킹 알고리즘
    const score = wins * 10 - losses * 5;
    return Math.floor(score / 100);
  }

  awardBadges(stats: UserStats): Badge[] {
    const badges: Badge[] = [];

    if (stats.wins >= 10) badges.push("Beginner");
    if (stats.wins >= 50) badges.push("Veteran");
    if (stats.winRate >= 80) badges.push("Champion");

    return badges;
  }
}
```

#### 액션 3.3: 모바일 반응형 디자인

```
📋 TODO:
□ Tailwind CSS 반응형 클래스 적용
  - 모바일 우선 접근
  - 각 브레이크포인트별 레이아웃 최적화

□ 터치 인터페이스 최적화
  - 탭 영역 최소 44px
  - 터치 피드백 추가
  - 스와이프 제스처 지원

□ 모바일 테스트
  - 다양한 기기 크기 테스트
  - 성능 최적화 (번들 사이즈 < 500KB)

📊 성공 지표:
- 모바일 로드 시간: < 3초 (LTE)
- 모바일 Lighthouse 점수: 90 이상
```

**구현 예시:**

```typescript
// 반응형 컴포넌트 예시
export const GameBoard = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-8">
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {/* 게임판 셀 */}
        <button className="
          aspect-square
          bg-blue-500
          rounded
          text-2xl md:text-4xl
          hover:bg-blue-600
          active:scale-95
          transition-transform
        ">
          X
        </button>
      </div>
    </div>
  );
};
```

---

### Phase 4: 모니터링 및 배포 (2-3주)

#### 액션 4.1: 모니터링 및 분석 시스템 구축

```
📋 TODO:
□ 에러 로깅 시스템
  - Sentry 또는 LogRocket 통합
  - 콘솔 에러 자동 수집
  - 소켓 에러 로깅

□ 사용자 분석
  - Google Analytics 또는 Mixpanel
  - 게임 플레이 통계
  - 사용자 경로 추적

□ 성능 모니터링
  - Web Vitals 측정
  - 번들 분석
  - 메모리 누수 감지

📊 성공 지표:
- 에러 감지율: 95% 이상
- 모니터링 오버헤드: < 5%
```

**구현 예시:**

```typescript
// src/shared/utils/monitoring.ts
import * as Sentry from "@sentry/react";

export function initMonitoring() {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    environment: process.env.MODE,
    tracesSampleRate: 1.0,
  });
}

export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    contexts: { extra: context },
  });
}

// 성능 모니터링
export function reportWebVitals(metric: any) {
  console.log(metric);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/metrics", JSON.stringify(metric));
  }
}
```

#### 액션 4.2: CI/CD 파이프라인 구축

```
📋 TODO:
□ GitHub Actions 설정
  - 자동 테스트 (Pull Request)
  - 자동 빌드 및 배포
  - 코드 커버리지 리포트

□ 배포 자동화
  - Vercel/Netlify 통합
  - 스테이징 환경 배포
  - 프로덕션 배포 자동화

□ 버전 관리
  - 시맨틱 버저닝 적용
  - 자동 CHANGELOG 생성
  - Release 자동화

📊 성공 지표:
- 빌드 성공률: 99% 이상
- 배포 시간: < 5분
```

**구현 예시:**

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - run: npm install
      - run: npm test -- --coverage
      - run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: vercel --prod
```

#### 액션 4.3: 성능 최적화

```
📋 TODO:
□ 코드 스플리팅
  - 라우트별 레이지 로딩
  - 컴포넌트별 동적 임포트

□ 번들 최적화
  - Tree shaking
  - 사용하지 않는 라이브러리 제거
  - 이미지 최적화

□ 런타임 성능
  - 메모이제이션 (React.memo, useMemo)
  - 가상화 (대량 리스트)
  - 웹 워커 활용

📊 성공 지표:
- 초기 로드 시간: < 2초
- 상호작용 시간: < 100ms
- 번들 사이즈: < 200KB (gzip)
```

**구현 예시:**

```typescript
// 라우트별 코드 스플리팅
import { lazy, Suspense } from 'react';

const GamePage = lazy(() => import('./features/game/GamePage'));
const LobbyPage = lazy(() => import('./features/lobby/LobbyPage'));
const AuthPage = lazy(() => import('./features/auth/AuthPage'));

export const Router = () => (
  <Routes>
    <Route
      path="/game"
      element={
        <Suspense fallback={<Loading />}>
          <GamePage />
        </Suspense>
      }
    />
    {/* ... */}
  </Routes>
);

// 컴포넌트 메모이제이션
const Board = React.memo(({ board, onMove }: Props) => {
  return (
    <div className="board">
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          onClick={() => onMove(idx)}
        />
      ))}
    </div>
  );
});
```

---

## 📊 타임라인 및 마일스톤

```
Week 1-2   | Phase 1: 기초 강화
           ├─ 테스트 커버리지 70% 달성
           └─ TypeScript Strict 모드 전환

Week 3-5   | Phase 2: 상태 관리 및 아키텍처
           ├─ Zustand 상태 관리 도입
           └─ 에러 처리 및 모니터링

Week 6-9   | Phase 3: 기능 확장
           ├─ AI 플레이어 구현
           ├─ 랭킹 및 통계 시스템
           └─ 모바일 반응형 디자인

Week 10-12 | Phase 4: 모니터링 및 배포
           ├─ 모니터링 시스템 구축
           ├─ CI/CD 파이프라인
           └─ 성능 최적화
```

---

## 🎯 예상 효과

### 정량적 효과

| 지표            | 현재    | 목표   | 개선율  |
| --------------- | ------- | ------ | ------- |
| 테스트 커버리지 | 5%      | 70%    | 1400% ↑ |
| 버그 리포트     | 월 30건 | 월 5건 | 83% ↓   |
| 평균 응답 시간  | 500ms   | 100ms  | 80% ↓   |
| 모바일 유입     | 10%     | 40%    | 300% ↑  |
| DAU 증가        | -       | 40%    | 40% ↑   |

### 정성적 효과

- ✅ 코드 품질 및 유지보수성 향상
- ✅ 사용자 경험 개선
- ✅ 팀 생산성 증대
- ✅ 기술 부채 감소
- ✅ 개발 속도 가속화

---

## 📈 성공 측정 기준

### 1. 기술 지표

```
□ 코드 품질
  - SonarQube 점수: A 등급
  - 순환 복잡도: 평균 5 이하
  - 코드 커버리지: 70% 이상

□ 성능 지표
  - First Contentful Paint (FCP): < 1.5s
  - Largest Contentful Paint (LCP): < 2.5s
  - Cumulative Layout Shift (CLS): < 0.1

□ 신뢰성 지표
  - 에러율: < 0.1%
  - 가용성: > 99.9%
  - 평균 장애 복구 시간: < 30분
```

### 2. 비즈니스 지표

```
□ 사용자 지표
  - 월 활성 사용자 (MAU): 100% 증가
  - 평균 세션 시간: 50% 증가
  - 재방문율: 70% 이상

□ 참여도 지표
  - 게임 완료율: 80% 이상
  - 다시 플레이 비율: 60% 이상
  - NPS 점수: 50 이상
```

---

## 🚀 다음 단계

1. **우선순위 결정**: 팀과 함께 각 Phase의 우선순위 재검토
2. **리소스 할당**: 필요한 인력 및 시간 견적 수립
3. **실행**: Phase 1부터 단계적 진행
4. **모니터링**: 각 마일스톤에서 효과 측정 및 피드백 반영
5. **반복**: PDCA 사이클을 통한 지속적 개선

---

## 📚 참고 자료

### 테스트

- [Vitest 공식 문서](https://vitest.dev/)
- [Testing Library 공식 문서](https://testing-library.com/)

### 상태 관리

- [Zustand 공식 문서](https://github.com/pmndrs/zustand)
- [Redux 공식 문서](https://redux.js.org/)

### 성능 최적화

- [Web Vitals](https://web.dev/vitals/)
- [성능 최적화 체크리스트](https://www.smashingmagazine.com/2021/01/front-end-performance-2021-free-checklist-pdf/)

### 모니터링

- [Sentry 공식 문서](https://docs.sentry.io/)
- [Google Analytics](https://analytics.google.com/)

---

**작성일**: 2026년 1월 21일  
**최종 수정**: 진행 상황에 따라 지속 업데이트
