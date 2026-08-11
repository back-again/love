# LOVE APP - 에이전트 지침 및 개발 규격 (AGENTS.md)

이 파일은 LOVE APP 프로젝트에서 AI 에이전트가 코드를 작성, 수정, 리팩토링할 때 예외 없이 준수해야 하는 최우선 개발 규칙 및 컨벤션 모음입니다.

---

## 1. 자동화 워크플로우 (Automated Workflow)

- **`git add` 자동화**: 파일 생성, 추가, 수정 시 작업 직후 자동으로 `git add` 명령을 실행합니다.
- **타입 검증 자동화**: 코드 변경 후 반드시 `npx tsc --noEmit`을 실행하여 프로젝트 전반의 타입 에러 0건을 확인합니다.
- **결과 중심 즉시 반영**: 작업 과정 및 완료 후 장황한 요약을 생략하고 변경 사항을 코드베이스에 즉각 반영합니다.

---

## 2. 데이터베이스 스키마 규격 (DB Schema Rules)

본 프로젝트는 Supabase PostgreSQL 스키마(11개 정규화 테이블 + 2개 View)를 기반으로 동작합니다.

### 1) 주요 스키마 구성

- **테이블**: `categories`, `users`, `posts`, `post_images`, `votes`, `comments`, `comment_likes`, `review_requests`, `notifications`, `user_blocks`, `user_reports`, `inquiries_feedback`
- **SQL View 1 (`post_details_view`)**: 투표 수(`vote_o_count`, `vote_x_count`), 후기 유무(`has_review`), 댓글 수(`comment_count`), 이미지 URL 콤마 구분 결합(`image_urls`)을 집계/조인하여 반환.
- **SQL View 2 (`comment_details_view`)**: 댓글별 좋아요 수(`like_count`) 집계.

### 2) 데이터베이스 접근 및 Auth Fallback 규칙

- Expo Go 테스트 및 비로그인 상태 호환성을 위해 Supabase 인증 사용자 식별 시 **Fallback Auth ID**를 반드시 사용합니다.
  ```typescript
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id || '00000000-0000-0000-0000-000000000001';
  ```
- 데이터 조회 및 좋아요/댓글 쿼리 작성 시 `getCommentsLib` 및 `toggleCommentLikeLib` 등 모든 쿼리 함수에서 동일한 Fallback ID를 적용하여 쿼리 불일치를 방지합니다.

---

## 3. 아키텍처 및 폴더/파일 네이밍 규격 (Architecture & Naming)

모든 기능 모듈은 `src/screens/[feature]` 하위에 역할별 `_` 접두사 서브 폴더로 엄격히 분리합니다.

- **`_action/` (`*.action.tsx`)**: 클라이언트 액션 모듈 (상단 `'use client';` 지시어 필수).
- **`_area/` (`*.area.tsx`)**: 화면 내 특정 기능 구역 레이아웃 컴포넌트 (`CommentInput.area.tsx`, `CommentList.area.tsx` 등).
- **`_component/` (`*.tsx` / `*.component.tsx`)**: 독립형/재사용 가능 UI 아이템 카드 컴포넌트 (`CommentItem.tsx`, `ReplyItem.tsx` 등).
- **`_handler/` (`*.handler.tsx`)**: 비즈니스 로직 조율 및 이벤트 통제를 담당하는 컨트롤러.
- **`_lib/` (`*.lib.ts`)**: Supabase 등 순수 비동기 데이터 통신 모듈 (`getComments.lib.ts`, `toggleCommentLike.lib.ts` 등).
- **`_model/` (`*.model.ts`)**: TypeScript 인터페이스 및 모델 정의 (`comment.model.ts` 등).
- **`_state/` (`use*Store.ts` / `use*.ts`)**: Zustand 기반 스토어 (`useCommentStore.ts` 등).
- **`_svg/` (`*.svg.tsx` / `*Svg.tsx`)**: 독립 벡터 SVG 아이콘 컴포넌트.

---

## 4. _area와 _action 분기 아키텍처 규칙 (Area & Action Separation)

1. **`_area/` (`*.area.tsx`) - 구역 레이아웃 컨테이너**:
   - **역할**: 화면 내 특정 기능 구역의 **섹션 제목(Title), 설명글(Description), 레이아웃 구조, 마진**을 담당하는 정적 Container.
   - **규칙**: 디바이스 API(이미지 피커, 폼 제출, 복잡한 비동기 로직) 코드를 직접 포함하지 않고, 동적 기능은 하위 `_action` 컴포넌트로 분리 위임합니다.

2. **`_action/` (`*.action.tsx`) - 클라이언트 인터랙션 유닛**:
   - **역할**: 사용자의 **동적 터치/입력 이벤트, 폼 상태(Zustand) 업데이트, 디바이스 API 및 서버 제출**을 100% 독립적으로 처리하는 Interaction Unit.
   - **규칙**: 파일 최상단에 `'use client';` 지시어를 필수로 선언하며, 하나의 액션 기능에만 집중하는 단일 책임 원칙(SRP)을 준수합니다.

3. **`Screen.tsx` - 최상위 조율자(Orchestrator)**:
   - 메인 Screen은 각 `_area` 및 `_action` 컴포넌트를 순서대로 배치/조립하는 최소한의 레이아웃 조율자 역할만 수행합니다.

---

## 5. 상태 관리 및 쿼리 규칙 (State & Query Rules)

1. **Zustand 선택자 최적화**:
   - 불필요한 리렌더링 방지를 위해 Zustand 구하기 시 반드시 `useShallow` 구문을 적극 활용합니다.

2. **낙관적 업데이트 (Optimistic Update) 한정 규칙**:
   - **낙관적 업데이트(`onMutate`)는 오직 '좋아요(Like)' 기능에만 한정하여 적용합니다.**
   - 댓글 작성, 답글 등록, 게시글 추가/삭제 등 기타 비즈니스 작업은 서버 응답 완료 후 `invalidateQueries` 패턴을 사용합니다.

3. **익명 유저 고유 번호 부여 규칙**:
   - 댓글 및 답글 목록 조회 시 `user_id`를 작성 순서대로 `Map<string, number>`에 할당하여, 동일한 작성자에게는 항상 동일한 익명 번호(`익명1`, `익명2`...)가 일관되게 붙도록 구현합니다.

---

## 6. UI/UX 및 바텀시트 제스처 규칙 (UI/UX & BottomSheet Rules)

1. **`@gorhom/bottom-sheet` 스크롤 락 방지**:
   - 스크롤 목록이 있는 바텀시트는 `useScrollView={true}` 옵션을 사용하여 `<BottomSheetScrollView>`가 `@gorhom/bottom-sheet` 최상위 스크롤러로 직접 바인딩되도록 합니다.
   - `BottomSheetView` 하위에 스크롤 뷰를 중첩 배치하여 발생하는 터치 제스처 락(`LOCKED`)을 철저히 방지합니다.
   - 풀스크린 모달 시 `enableContentPanningGesture={false}`를 설정하여 스크롤 제스처 차단을 예방합니다.

2. **키보드 동기화 하단 입력바 (`BottomSheetFooter`)**:
   - 입력 영역(`CommentInputArea`)은 `BottomSheetFooter`에 탑재하고 `bottomInset={0}` 및 `useSafeAreaInsets()`를 적용하여, 키보드 애니메이션(60/120fps) 및 세이프 에어리어를 매끄럽게 대응합니다.

3. **중앙 토스트 메세지 시스템**:
   - Toast UI는 `ToastProvider` 하나로 통일하고, 전역 어디서나 `useToastStore.showToast('메시지')`로 제어합니다.

4. **신규 모달 공통 컴포넌트 탑재**:
   - 새로 모달을 개발하거나 생성할 때에는 `src/components/modal/` (예: `BottomSheetModal.tsx`)에 공통/재사용 컴포넌트로 구축하여 활용합니다.

---

## 7. 🚫 에이전트 개발 금지 사항 (Anti-Patterns & Prohibitions)

1. ❌ **`BottomSheetView` 하위에 `ScrollView`/`FlatList` 중첩 금지** (제스처 락 발생 방지, `useScrollView={true}` + `<BottomSheetScrollView>` 사용)
2. ❌ **좋아요 외의 다른 기능에 낙관적 업데이트(`onMutate`) 적용 금지** (댓글/게시글 등록 등은 서버 응답 후 `invalidateQueries` 사용)
3. ❌ **댓글 작성자 표시 시 단순 배열 index 기반 (`익명${index+1}`) 표기 금지** (`user_id` 기반 `Map<string, number>`로 동일 익명 번호 부여)
4. ❌ **Supabase 데이터 통신 시 Auth Fallback ID 누락 금지** (미인증/테스트 세션 매칭용 `'00000000-0000-0000-0000-000000000001'` 사용)
5. ❌ **`_area` 컴포넌트에 디바이스 API / 서버 제출 / 비동기 액션 직접 작성 금지** (100% `'use client';` 지정된 `_action` 컴포넌트로 위임)
6. ❌ **코드 내 임시 더미(Mock/Dummy) 데이터 및 설명용 주석 작성 금지** (하드코딩 데이터 및 old code 주석 잔재 금지)
7. ❌ **신규 모달 생성 시 `src/components/modal/` 공통 모듈화 미적용 금지** (페이지 인라인 모달 작성 금지)
8. ❌ **1,000줄 넘는 거대 모놀리식 단일 파일 방치 금지** (`_area`, `_component`, `_action`, `_lib` 서브 폴더 분리)
9. ❌ **`_` 서브 폴더 구조 파괴 및 화면 루트에 파일 방치 금지** (`_component` 또는 `src/components/modal/`에 배치)
10. ❌ **가짜 하드코딩 더미 데이터 배열 선언 금지** (`_lib/*.lib.ts` 비동기 함수 및 Supabase DB 연동)
11. ❌ **UI 렌더링 파일 안에서 Supabase DB 직접 호출 금지** (`_lib/` 순수 async 함수로 격리)
12. ❌ **컴포넌트 내부 `useState` 상태 무분별 남발 금지** (Zustand 스토어로 선언적 관리)
13. ❌ **작업 완료 후 장황한 설명 답변 작성 금지** (즉시 코드 수정 및 `git add`, `npx tsc --noEmit` 검증 완료할 것)
