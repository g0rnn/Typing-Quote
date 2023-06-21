const RANDOM_QUOTE_URL = "https://api.quotable.io/random";
const quoteDisplayElement = document.getElementById("quoteDisplay");
const textareaElement = document.getElementById("quoteTyping");
const speedElement = document.getElementById("speed");
const accuracyEmoji = document.getElementById("accuracy");
const refreshElement = document.getElementById("refresh");
const containerElement = document.getElementById("containerDiv");

function callQuote() {
  return fetch(RANDOM_QUOTE_URL)
    .then((response) => response.json())
    .then((data) => data.content);
}

async function renderQuote() {
  const quote = await callQuote();
  quote.split("").forEach((charactor) => {
    const characterSpan = document.createElement("span");
    characterSpan.innerText = charactor;
    quoteDisplayElement.appendChild(characterSpan);
  });
  if (window.innerWidth <= 698) {
    if (quote.split("").length > 141) {
      textareaElement.style.height = "113px";
    } else if (quote.split("").length > 89) {
      textareaElement.style.height = "93px";
    } else if (quote.split("").length > 51) {
      textareaElement.style.height = "73px";
    } else {
      textareaElement.style.height = "43px";
    }
  } else if (window.innerWidth <= 1100) {
    if (quote.split("").length > 111) {
      textareaElement.style.height = "93px";
    } else if (quote.split("").length > 59) {
      textareaElement.style.height = "73px";
    } else {
      textareaElement.style.height = "43px";
    }
  } else {
    if (quote.split("").length > 87) {
      textareaElement.style.height = "84px";
    } else {
      textareaElement.style.height = "43px";
    }
  }
}

//특정키를 누르면 다시 타자연습을 할 수 있도록
function reRenderQuote() {
  while (quoteDisplayElement.firstChild)
    quoteDisplayElement.firstChild.remove();
  renderQuote();
  inputBegin = true;
  speedElement.innerText = "0";
  textareaElement.value = "";
  textareaElement.disabled = false;
  accuracyEmoji.querySelector("img").src = `./emoji/Expressionless.png`;
  refreshElement.style.visibility = "hidden";
  refreshElement.classList.add("shadow");
  containerElement.classList.remove("shadow");
}

function displaySpeed(startTime) {
  endTime = new Date().getTime();
  let duringTyping = (endTime - startTime) / 60000;
  const CPM = Math.floor(textareaElement.textLength / duringTyping);
  speedElement.innerText = `${CPM}`;
}

let inputBegin = true;
let startTime, endTime;
let intervalSpeed;

textareaElement.addEventListener("input", (event) => {
  const inputValue = textareaElement.value.split("");
  const quoteValue = quoteDisplayElement.textContent.split("");
  const quoteAllSpan = quoteDisplayElement.querySelectorAll("span");
  const RATE_OF_TYPO = quoteValue.length * 0.1;
  let equality = true;
  let countTypo = 0;

  if (inputBegin) {
    startTime = new Date().getTime();
    speedElement.innerText = "";
    intervalSpeed = setInterval(() => {
      displaySpeed(startTime);
    }, 100);
    inputBegin = false;
  }

  //API로부터 받은 quote를 입력한 문자와 하나씩 비교
  quoteAllSpan.forEach((each, index) => {
    const inputChar = inputValue[index];
    if (inputChar === undefined) {
      each.classList.remove("typoline");
    } else if (inputChar === each.innerText) {
      equality = true;
      each.classList.remove("typoline");
    } else {
      equality = false;
      countTypo++;
      each.classList.add("typoline");
    }
  });

  //정확도를 90퍼이상으로 유지
  if (countTypo > RATE_OF_TYPO) equality = false;

  //오타가 발생하면 이모지가 바뀜
  if (equality === true) {
    accuracyEmoji.querySelector("img").src = `./emoji/Sunglasses.png`;
  } else {
    accuracyEmoji.querySelector("img").src = `./emoji/Frowning.png`;
  }

  //입력을 마치면 속도 측정은 멈추고 더이상의 입력은 못함
  if (quoteValue.length <= textareaElement.textLength) {
    clearInterval(intervalSpeed);
    textareaElement.disabled = true;
    refreshElement.style.visibility = "visible";
    refreshElement.classList.add("shadow");
    containerElement.classList.remove("shadow");
  }
});

refreshElement.addEventListener("click", () => {
  reRenderQuote();
});

renderQuote();
