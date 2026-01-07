class Board {
  constructor(prop = {}) {
    this.list = prop.list
  }
  rendering() {
    for (let x = 0; x < 3; x++) {
      const li = document.createElement("li");
      const ol = document.createElement("ol");

      li.appendChild(ol);
      this.element.appendChild(li);
      for (let y = 0; y < 3; y++) {
        const lli = document.createElement("li");
        const btn = document.createElement("button");
        lli.dataset.raw = x;
        lli.dataset.col = y;
        btn.addEventListener("click", () => this.handleCell(x, y));
        lli.appendChild(btn);
        ol.appendChild(lli);
      }
    }
  }
}

export default Board