class EixtModal {
  constructor(sender) {
    this.sender = sender;
    this.initHistoryTrap();
  }

  initHistoryTrap() {
    history.pushState(null, "", location.href);

    window.onpopstate = () => {
      history.pushState(null, "", location.href);
      //모달창 중복 방지
      if (document.querySelector("dialog.exit")) {
        return;
      }
      this.rendering();
    };
  }

  rendering() {
    const dialog = document.createElement("dialog");
    dialog.className = "exit";

    const title = document.createElement("h3");
    title.textContent = "게임에서 나가시겠습니까?";

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "dialog-actions";

    const stayButton = document.createElement("button");
    stayButton.textContent = "머무르기";
    stayButton.addEventListener("click", () => {
      dialog.close();
      document.body.removeChild(dialog);
    });

    const leaveButton = document.createElement("button");
    leaveButton.textContent = "나가기";
    leaveButton.addEventListener("click", () => {
      dialog.close();
      this.sender.handleLeave();
      window.sessionStorage.removeItem("roomId");
      window.location.href = "/";
    });

    buttonContainer.appendChild(stayButton);
    buttonContainer.appendChild(leaveButton);
    dialog.appendChild(title);
    dialog.appendChild(buttonContainer);

    document.body.appendChild(dialog);
    dialog.showModal();
  }
}

export default EixtModal;
