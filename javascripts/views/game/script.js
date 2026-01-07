/* ========================================================= */
/* 커스텀 태그 등록 */
/* ========================================================= */

WebComponentWrapper.register("board-component", Board, {
  observedAttributes: ["list"],
  attributeToProp: (n) => n,
  useShadow: true,
  styleUrl: "/css/game/Board.css",
});

WebComponentWrapper.register("player-component", Player, {
  observedAttributes: ["list"],
  attributeToProp: (n) => n,
  useShadow: true,
  styleUrl: "/css/game/Player.css",
});

WebComponentWrapper.register("ready-component", Ready, {
  observedAttributes: ["list"],
  attributeToProp: (n) => n,
  useShadow: true,
  styleUrl: "/css/game/Ready.css",
});
