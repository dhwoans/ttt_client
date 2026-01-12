import { css } from "lit";

/* ========================================================= */
/* 방 목록 (ul) 스타일 */
/* ========================================================= */
export const RoomList = css`
  .room-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem 0;

    flex-grow: 1;
    overflow-y: auto;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;
