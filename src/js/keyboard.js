export class Keyboard {
  #swichEl; // ES2019부터 적용되는 문법) class 내에서 #를 필드(속성, 메서드, static 등) 는 private 변수가 됨
  #fontSelectEl;
  #containerEl;
  #keyboardEl;
  #inputGroupEl;
  #inputEl;
  #keyPress = false; // key가 눌리고 있을 때, 마우스를 이용한 조작을 막도록
  #mouseDown = false; // mouse가 눌리고 있을 때, 키보드를 이용한 조작을 막도록

  constructor() {
    this.#assignElement();
    this.#addEvent();
  }

  #assignElement() {
    this.#containerEl = document.getElementById("container");
    this.#swichEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
    this.#inputGroupEl = this.#containerEl.querySelector("#input-group");
    this.#inputEl = this.#inputGroupEl.querySelector("#input");
  }

  #addEvent() {
    this.#swichEl.addEventListener("change", this.#onChangeTheme);
    this.#fontSelectEl.addEventListener("change", this.#onChangeFont);

    // keydown : 키보드 누를 때. 누르고 있으면 계속 실행됨.
    // keyup : 키보드 누르다가 뗐을 때.
    document.addEventListener("keydown", this.#onKeyDown.bind(this)); // 전역 객체를 가리키는 this와 객체의 인스턴스를 가리키는 this를 bind 해줌 (bind에 대해서 좀 더 공부해보기! 잘 이해 안됨..)
    document.addEventListener("keyup", this.#onKeyUp.bind(this));

    // input event : 사용자가 값을 수정할 때마다 발생
    this.#inputEl.addEventListener("input", this.#onInput);

    // mousedown, mouseup : 마우스를 누르고, 뗄 때
    this.#keyboardEl.addEventListener(
      "mousedown",
      this.#onMouseDown.bind(this)
    );
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));
  }

  #onMouseUp(event) {
    if (this.#keyPress) return;
    this.#mouseDown = false;

    const keyEl = event.target.closest("div.key");
    // keyEl 값이 undefined 라면, keyEl의 type은 undefined 이고 값도 undefined 인데, falsy(거짓으로 해석 될 수 있는) 값이므로
    // !!라고 앞에 해주면, false 가 된다! 즉, 정리를 하자면,

    //           느낌표 없음       느낌표 하나     느낌표 둘
    // Type      undefined         boolean         boolean
    // 값        undefined         true            false
    const isActive = !!keyEl?.classList.contains("active");

    // dataset 속성 => html의 data-val 속성의 값을 가져올 수 있다.
    const val = keyEl?.dataset.val;

    // 조건 1) isActive 가 True 여야 하는 이유 : 눌린 키가 아닌 다른 키에서 마우스를 떼는 경우를 방지하기 위해
    // a 키를 누르고, f 키에서 마우스를 뗐을 때 => f 키에는 active 클래스가 존재하지 않으므로 isActive 가 false이다.

    // 조건 2) val이 True 여야 하는 이유 : 키보드에서 data-val 속성 값이 있는 키만 onMouseUp 이벤트를 작동시키도록 하기 위해서
    // 특수문자 등은 data-val 속성을 부여하지 않았다. 즉, 마우스로는 특수문자를 클릭해도 입력되지 않게끔 설계하였다.

    // 조건 3) space 키와 backspace 키는 특수문자(?) 이지만, data-val이 존재함. 예외처리 해주기 위해서!

    // !!val : val을 Boolean 값으로 Typecasting 하는 것
    if (isActive && !!val && val !== "Space" && val !== "Backspace") {
      this.#inputEl.value += val;
    }

    if (isActive && val === "Space") {
      this.#inputEl.value += " ";
    }
    if (isActive && val === "Backspace") {
      this.#inputEl.value = this.#inputEl.value.slice(0, -1);
    }

    // element 를 this.#keyboardEl 로 한 이유
    // element를 keyEl로 하면, 혹여나 mousedown 한 곳과 mouseup 한 곳이 일치하지 않을 때 mousedown 한 곳의 active 클래스는 remove 되지 않는다.
    this.#keyboardEl.querySelector(".active")?.classList.remove("active");
  }

  #onMouseDown(event) {
    if (this.#keyPress) return;
    this.#mouseDown = true;

    // closest 메서드 쓰는 이유 : div.key가 아닌 다른 곳에서 클릭을 했을 때,
    // 엄한 곳에 active 클래스가 부여되는 것을 방지하기 위해서
    // closest 문법을 사용하지 않으면, 다른 곳에다가 클릭을 하면 다른 곳에 active 클래스가 추가된다.
    // 바로 문제가 발생하지는 않지만, 괜히 이상한 곳에다가 active 클래스를 덕지덕지 붙일 필요는 없다.

    event.target.closest("div.key")?.classList.add("active"); // 클릭한 키에 active 클래스 줘서, 해당 키 강조하기
  }

  #onChangeTheme(event) {
    document.documentElement.setAttribute(
      "theme",
      event.target.checked ? "dark-mode" : ""
    ); // document.documentElement : 문서의 루트 요소를 나타내는 Element를 반환합니다. HTML 문서를 예로 들면 <html> 요소를 반환합니다.
  }

  #onChangeFont(event) {
    // 전체 폰트 바꾸는 법 (fontFamily를 조작하면 된다.)
    document.body.style.fontFamily = event.target.value;
  }

  #onKeyDown(event) {
    if (this.#mouseDown) return;
    this.#keyPress = true;

    // 정규표현식을 이용한 한글 필터링이 안되네?
    // 이럴 때는 event.key 가 Process 일때로 하면 된다. (한글일때만 event.key 가 Process 이다.)
    // 하지만, 이런 경우에는 keydown 이벤트 말고 input 이벤트가 발생했을 때 (onInput 메서드) 에다가 정의하는 것이 더 적절하다.
    // keyboard_copy.js 에서 구현한 것 참고!
    // https://circus7.tistory.com/6 참고!

    this.#inputGroupEl.classList.toggle(
      "error",
      // /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(event.key)
      event.key == "Process"
    );

    // 특정 속성(date-code)을 바로 이렇게 찾을 수도 있다! (문자열 리터럴 이용하는 방법)
    this.#keyboardEl
      .querySelector(`[data-code=${event.code}]`)
      // optional chaining (구글 검색해보기) => if 문을 이용해서 this.#keyboardEl.querySelector(`[data-code=${event.code}]`)가 존재하는지의 여부를 따질 필요 없다.
      // object.first?.second : object.first가 없으면 Error가 나지 않고, 그냥 undefined 를 리턴하고 object.first.second를 찾아들어가지 않는다!
      ?.classList.add("active"); // optional chaining
  }

  #onKeyUp(event) {
    if (this.#mouseDown) return;
    this.#keyPress = false;

    // 특정 속성(date-code)을 바로 이렇게 찾을 수도 있다! (문자열 리터럴 이용하는 방법)
    this.#keyboardEl
      .querySelector(`[data-code=${event.code}]`)
      ?.classList.remove("active"); // optional chaining
  }

  // 한글이 입력되면 그 글자를 빈문자열로 치환하기 (그럼 한글이 입력이 안되는 효과가 나타남)
  #onInput(event) {
    event.target.value = event.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, "");
  }
}
