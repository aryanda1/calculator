const themeButtons = document.querySelectorAll(".button");
const numberBtns = document.querySelectorAll(".number");
const operatorBtn = document.querySelectorAll(".operator");
const inputBtns = document.querySelectorAll(".inputs button");
const currentOperandElement = document.querySelector(".current");
const previousOperandElement = document.querySelector("#prevOperand");
const operatorElement = document.querySelector("#operator");

let currentOperand = "";
let previousOperand = "";
let operator = "";

themeButtons.forEach((element, index) => {
  element.addEventListener("click", () => {
    for (let i = 0; i < themeButtons.length; i++) {
      themeButtons[i].style.opacity = index == i ? "1" : "0";
      index == i? document.body.classList.add("theme"+(i+1)): document.body.classList.remove("theme"+(i+1));
    }
    localStorage.setItem("theme", index);
  });
});

if(localStorage.getItem("theme"))
  themeButtons[localStorage.getItem("theme")].click();

inputBtns.forEach((btn) =>
  btn.addEventListener("click", function () {
    btn.classList.add("button-pressed");

    setTimeout(function () {
      btn.classList.remove("button-pressed");
    }, 300);
  })
);

numberBtns.forEach((btn) =>
  btn.addEventListener("click", function () {
    if (
      currentOperand == "NaN" ||
      currentOperand == "Infinity" ||
      currentOperand == "-Infinity"
    )
      resetAll(true);
    let curCharac = btn.textContent;
    let isDecimalPresent = currentOperand.includes(".");
    if (curCharac == "." && isDecimalPresent) return;
    if (currentOperand == "0" && curCharac == "0") return;
    else currentOperand += curCharac;
    update();
  })
);

operatorBtn.forEach((btn) =>
  btn.addEventListener("click", function () {
    if (previousOperand == "" && currentOperand) {
      previousOperand = currentOperand;
      operator = btn.textContent;
      currentOperand = "";
    } else if (previousOperand && currentOperand == "") {
      operator = btn.textContent;
    } else if (previousOperand && currentOperand) {
      let res = calculate(previousOperand, currentOperand, operator);
      if (res == "NaN" || res == "Infinity" || res == "-Infinity") {
        resetAll(true);
        currentOperand = res;
      } else {
        previousOperand = res;
        operator = btn.textContent;
        currentOperand = "";
      }
    }
    update();
  })
);

equal.addEventListener("click", function () {
  if (operatorBtn[0].disabled) resetAll(true);
  if (previousOperand.length == 0 || currentOperand.length == 0) return;
  let res = calculate(previousOperand, currentOperand, operator);
  if (res == "NaN" || res === "Infinity" || res == "-Infinity") resetAll(true);
  currentOperand = res;
  previousOperand = "";
  operator = "";
  update();
});

del.addEventListener("click", function () {
  if (operatorBtn[0].disabled) resetAll(true);
  currentOperand = currentOperand.slice(0, -1);
  update();
});

reset.addEventListener("click", function () {
  resetAll(operatorBtn[0].disabled);
  update();
});

function resetAll(toggle = false) {
  currentOperand = "";
  previousOperand = "";
  operator = "";
  update();
  if (toggle) operatorBtnToggler();
}

function operatorBtnToggler() {
  operatorBtn.forEach((btn) => (btn.disabled = !btn.disabled));
}

function calculate(prevOp, curOp, op) {
  function decimalLength(numStr) {
    let decimalPart = numStr.split(".");
    return decimalLength ? decimalLength.length : 0;
  }

  const precision = Math.pow(
    10,
    Math.max(decimalLength(prevOp), decimalLength(curOp))
  );
  curOp = +curOp * precision;
  prevOp = +prevOp * precision;
  let computed_res;

  switch (op) {
    case "+":
      computed_res = prevOp + curOp;
      break;
    case "-":
      computed_res = prevOp - curOp;
      break;
    case "x":
      computed_res = (prevOp * curOp) / precision;
      break;
    case "/":
      computed_res = (prevOp / curOp) * precision;
      break;
  }
  computed_res /= precision;
  return computed_res.toString();
}

function update() {
  currentOperandElement.textContent = format_string(currentOperand);
  previousOperandElement.textContent = format_string(previousOperand);
  operatorElement.textContent = operator;
}

function format_string(number) {
  const split = number.split(".");
  split[0] = split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return split.join(".");
}

//adding blinking cursor
let cursor = true;
setInterval(() => {
  if (cursor) {
    currentOperandElement.classList.add("noafter");
    cursor = false;
  } else {
    currentOperandElement.classList.remove("noafter");
    cursor = true;
  }
}, 750);