// keyboard.js 복습하면서 다시 타이핑해본 결과물
export class Keyboard {
  #switchEl;
  #switchEl2;
  #containerEl;
  #fontSelectEl;
  #keyboardEl;
  #inputGroupEl;
  #inputEl;
  #keyPress = false;
  #mouseDown = false;

  constructor() {
    this.#assignElement(); // 요소 가져와서 저장, 할당
    this.#addEvent(); // 이벤트 부여, 추가
  }

  #assignElement() {
    // 요소 가져와서 저장, 할당
    this.#containerEl = document.getElementById("container");
    this.#switchEl = document.querySelector("#switch");
    this.#fontSelectEl = document.querySelector("#font");
    this.#keyboardEl = document.querySelector(".keyboard");
    this.#inputGroupEl = document.querySelector("#input-group");
    this.#inputEl = document.querySelector("#input");
  }

  #addEvent() {
    // 이벤트 부여, 추가
    this.#switchEl.addEventListener("change", this.#onChangeTheme.bind(this));
    this.#fontSelectEl.addEventListener(
      "change",
      this.#onChangeFont.bind(this)
    );

    this.#inputEl.addEventListener("input", this.#onInput.bind(this));
    document.addEventListener("keydown", this.#onKeyDown.bind(this));
    document.addEventListener("keyup", this.#onKeyUp.bind(this));
    document.addEventListener("mousedown", this.#onMouseDown.bind(this));
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));
  }

  // 테마 변경 이벤트 (다크모드, 일반모드)
  #onChangeTheme(event) {
    document.documentElement.setAttribute(
      "theme",
      event.target.checked ? "dark-mode" : ""
    );
  }

  // 폰트 변경 이벤트
  #onChangeFont(event) {
    document.body.style.fontFamily = event.target.value;
  }

  // 마우스 이벤트 (down, up)
  #onMouseDown(event) {
    if (this.#keyPress) return;
    this.#mouseDown = true;

    event.target.closest("div.key")?.classList.add("active");
  }

  #onMouseUp(event) {
    if (this.#keyPress) return;
    this.#mouseDown = false;

    const keyEl = event.target.closest("div.key");
    const isActive = !!keyEl?.classList.contains("active");
    const val = keyEl?.dataset.val;

    if (isActive && val === "Space") {
      this.#inputEl.value += " ";
    } else if (isActive && val === "Backspace") {
      this.#inputEl.value = this.#inputEl.value.slice(0, -1);
    } else if (isActive && !!val) {
      this.#inputEl.value += val;
    }

    this.#keyboardEl.querySelector(".active")?.classList.remove("active");
  }

  // 키보드 이벤트 (down, up)
  #onKeyDown(event) {
    if (this.#mouseDown) return;
    this.#keyPress = true;
    // this.#inputGroupEl.classList.toggle("error", event.key == "Process");
    this.#keyboardEl
      .querySelector(`[data-code=${event.code}]`)
      ?.classList.add("active");
  }

  #onKeyUp(event) {
    if (this.#mouseDown) return;
    this.#keyPress = false;
    this.#keyboardEl
      .querySelector(`[data-code=${event.code}]`)
      ?.classList.remove("active");
  }

  // 입력 이벤트
  #onInput(event) {
    // id가 input 인 inputEl 에 변화가 있을 때마다 작동하는 이벤트

    // 한글이 입력되면 error 메세지 띄움
    this.#inputGroupEl.classList.toggle(
      "error",
      /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(event.data)
    );

    // 한글이 입력되면 그 글자를 빈문자열로 치환하기 (한글 입력 방지 기능)
    event.target.value = event.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, "");
  }
}
