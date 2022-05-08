//Select DOM
const calculator = document.querySelector(".calculator");
const calcClearBlock = document.querySelector("#calc-clear");
let clearAllPushCount = 0;
let allHistory = [];
let history = [];
let tempNumber = "";
let operationType = "";
let isPercent = false;
let isEqual = false;

//Event Listeners
calculator.addEventListener("click", function (event) {
  const target = event.target;
  if (target.classList.contains("calculator__col")) {
    const data = target.dataset.type;
    const totalBlock = calculator.querySelector(".calculator__total");
    const historyBlock = calculator.querySelector(".calculator__history");
    operationTypeHandling(data);
    totalBlock.innerHTML = tempNumber;
    historyBlock.innerHTML = renderHistory(history);
    historyPanelRender(allHistory);
  }
});

//Functions
//Обработка операций на калькуляторе
function operationTypeHandling(data) {
  if (data !== "clear" && data !== "history") {
    calcClearBlock.innerHTML = "C";
  }
  if (data >= 0) {
    operationType = "number";
    tempNumber = tempNumber == "0" ? data : tempNumber + data;
  } else if (data == "float") {
    operationType = "number";
    if (!/\./.test(tempNumber)) {
      tempNumber = tempNumber + ".";
    } else {
      tempNumber = "0.";
    }
  } else if (data == "delete" && operationType == "number") {
    tempNumber = tempNumber.substring(0, tempNumber.length - 1);
    tempNumber = tempNumber ? tempNumber : "0";
    isPercent = false;
  } else if (["+", "-", "/", "*"].includes(data) && tempNumber) {
    operationType = data;
    history.push(tempNumber, operationType);
    tempNumber = "";
    isPercent = false;
  } else if (data == "clear") {
    history = [];
    tempNumber = "0";
    isPercent = false;
    if (calcClearBlock.innerText == "C") {
      calcClearBlock.innerHTML = "CA";
    } else {
      calcClearBlock.innerHTML = "C";
      allHistory = [];
    }
  } else if (data == "history") {
    openHistoryPanel();
  } else if (data == "%") {
    history.push(tempNumber);
    isPercent = true;
    isEqual = false;
    tempNumber = calculate(history, isPercent, isEqual);
  } else if (data == "=") {
    const historySegment = [];
    if (!isPercent) {
      history.push(tempNumber);
    }
    historySegment.push(history);
    isEqual = true;
    tempNumber = calculate(history, isPercent, isEqual);
    historySegment.push(tempNumber);
    allHistory.push(historySegment);
    history = [];
    isPercent = false;
  }
}

//Формирование HTML-кода и выведа блока истории операций
function renderHistory(histortArray) {
  let htmlElements = "";
  histortArray.forEach((item) => {
    if (item >= 0) {
      htmlElements = htmlElements + `&nbsp;<span>${item}</span>`;
    } else if (["+", "-", "/", "*"].includes(item)) {
      item = item == "*" ? "х" : item == "/" ? "÷" : item;
      htmlElements = htmlElements + `&nbsp;<strong>${item}</strong>`;
    }
  });
  return htmlElements;
}

//Функция отрисовки всей истории в панели истории
function historyPanelRender(allHistory) {
  const historyContent = document.querySelector("#history-content");
  let historyPanelHtml = "";
  allHistory.forEach((item) => {
    const html = `
		<div>
				<div class="calculator__history">
						${renderHistory(item[0])}
				</div>
				<div class="calculator__total">${item[1]}</div>
		</div>`;
    historyPanelHtml = historyPanelHtml + html;
  });
  historyContent.innerHTML = historyPanelHtml;
}

//Подсчет конечного значения
function calculate(histortArray, isPercent, isEqual) {
  let total = 0;
  histortArray.forEach((item, index) => {
    item = parseFloat(item);
    if (index == 0) {
      total = item;
    } else if (
      index - 2 >= 0 &&
      isPercent &&
      index - 2 == histortArray.length - 3
    ) {
      const x = total;
      const operation = histortArray[index - 1];
      const n = item;
      if (!isEqual) {
        total = calculatePersent(x, operation, n);
      } else {
        total = calculatePersentWhenPushEqual(x, operation, n);
      }
    } else if (index - 2 >= 0) {
      const prevItem = histortArray[index - 1];
      if (item >= 0) {
        if (prevItem == "+") {
          total = total + item;
        } else if (prevItem == "-") {
          total = total - item;
        } else if (prevItem == "*") {
          total = total * item;
        } else if (prevItem == "/") {
          total = total / item;
        } else if (prevItem == "%") {
          total = (total / 100) * item;
        }
      }
    }
  });
  return String(total);
}

//Пересчет процента, когда нажат процент
function calculatePersent(x, operation, n) {
  let total;
  if (["+", "-"].includes(operation)) {
    total = x * (n / 100);
  } else if (["*", "/"].includes(operation)) {
    total = n / 100;
  }
  return total;
}

//Пересчет процента когда нажали равно, после нажатия процента
function calculatePersentWhenPushEqual(x, operation, n) {
  let total;
  if (operation == "+") {
    total = x + (n / 100) * x;
  } else if (operation == "-") {
    total = x - (n / 100) * x;
  } else if (operation == "*") {
    total = x * (n / 100);
  }
  return total;
}

//Переключение темы калькулятора
const theme = document.querySelector(".theme");
theme.addEventListener("click", function () {
  if (theme.classList.contains("theme__dark")) {
    theme.classList.remove("theme__dark");
    calculator.classList.add("calculator__dark");
  } else {
    theme.classList.add("theme__dark");
    calculator.classList.remove("calculator__dark");
  }
});

//Открытие/Скрытие панели истории
const historyPanel = document.querySelector("#history-panel");
const closeHistoryBtn = historyPanel.querySelector("#close");

closeHistoryBtn.addEventListener("click", function () {
  historyPanel.classList.remove("open");
});
//Функция открытия панели истории
function openHistoryPanel() {
  historyPanel.classList.add("open");
}
