console.clear();
const ON_ADD_TEXT = "This deal is in your Cart";
const BUTTON_TEXT_TO_CLICK = "Add";
const TEXT_NOTIFICATION_LABEL = "Enter text to notifify on";
const USERNAME_PREFIX = "Hello,";
const SALE_START_TEXT = "Starts in";
const START_BUTTON_TEXT = "Start";
const STOP_BUTTON_TEXT = "Stop";
const INPUT_ONE_LABEL = "Age group, 18/ 45?";
const TICKER_ACTION_INTERVAL = 5000;
const INPUT_TWO_LABEL = "Vaccine wanted";
const LOADER_GIF =
  "https://media0.giphy.com/media/9CffOPMLx0Hf2/giphy.gif?cid=ecf05e47fcdff774bdb38787e7846e18912561f1d82808c5&amp;rid=giphy.gif";
const DEFAULT_ZOOM_RESET = 0.8;
const FORM_FIELDS = [
  {
    id: "ageGroup",
    placeholder: "group - 18/45 ?",
    defaultValue: "18",
    type: "input",
  },
  {
    id: "vacineWanted",
    placeholder: "Vacine wanted?",
    defaultValue: "Covaxin,Covishield",
    type: "input",
  },
];

document.body.style.zoom = DEFAULT_ZOOM_RESET;
this.blur();
var projectPath = `https://raw.githubusercontent.com/kunalganglani/tamperMonkeyExtension/master/orderAutomation`;
console.log("############ widget loaded ###########");
var xpath = function (xpathToExecute) {
  var result = [];
  var nodesSnapshot = document.evaluate(
    xpathToExecute,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
    result.push(nodesSnapshot.snapshotItem(i));
  }
  return result;
};
function findElementAndPlayOnce(elementXpathToFind, textToPlay) {
  var elements = xpath(elementXpathToFind);
  for (let i = 0; i < elements.length; i += 1) {
    if (
      elements[i].getAttribute("played") == null ||
      elements[i].getAttribute("played") === "false"
    ) {
      playSound(textToPlay);
      elements[i].setAttribute("played", "true");
    }
  }
}
function playSound(str) {
  var msg = new SpeechSynthesisUtterance();
  msg.text = str;
  window.speechSynthesis.speak(msg);
}
var tickerID = [];
var tickerAction = function () {
  if (xpath(`//h3[@class="appoint-success"]`).length === 0) {
    var searchButton = xpath(
      `//ion-button[contains(@class,'district-search')]`
    )[0];
    var targetAgeGroup = document.getElementById('ageGroup').value;
    var LabelSelector = xpath(`//label[.='Age ${targetAgeGroup}+']`)[0];
    
    searchButton && searchButton.click && searchButton.click();
    LabelSelector && LabelSelector.click && LabelSelector.click();
    var vaccineList = document
      .getElementById("vacineWanted")
      .value.split(",")
      .map((x) => x.trim());
    for(var vIndex = 0; vIndex < vaccineList.length; vIndex++) {
       var vacineLabel = xpath(`//label[.='${vaccineList[vIndex]}']`)[0];
       vacineLabel && vacineLabel.click && vacineLabel.click();
    }
    var centers = xpath(`//div[@class="mat-list-text"]`);
    for (var i = 0; i < centers.length; i++) {
      var slots = centers[i].querySelectorAll("div.slots-box");
      var slotsAvailable =
        [...slots]
          .map((item) => item.innerText)
          .filter((item) => !item.includes("Booked") && item !== "NA").length >
        0;
      if (!slotsAvailable) {
        centers[i].style.display = "none";
      } else {
        for (var k = 0; k < slots.length; k++) {
          if (
            slots[k].innerText !== "NA" &&
            !slots[k].innerText.includes("Booked")
          ) {
            slots[k].click();
            findElementAndPlayOnce(
              `//h3[@class="appoint-success"]`,
              "Appointment booked buddy"
            );
            break;
          }
        }
      }
    }
  }
};
var startTicker = function () {
  console.log("ticker started");
  startLoader();
  var id = setInterval(tickerAction, TICKER_ACTION_INTERVAL);
  tickerID.push(id);
};
var stopTicker = function () {
  console.log("ticker stopped");
  stopLoader();
  for (let ticker of tickerID) {
    clearInterval(ticker);
  }
};
function createButton(label, id, clickhandler) {
  var btn = document.createElement("BUTTON");
  btn.id = id;
  btn.innerHTML = label;
  btn.addEventListener("click", clickhandler);
  return btn;
}
function createInput(id, placeholder, value) {
  var inp = document.createElement("INPUT");
  inp.id = id;
  inp.placeholder = placeholder;
  inp.value = value;
  return inp;
}

var startButton = createButton(
  `${START_BUTTON_TEXT}`,
  "startButton",
  startTicker
);
var stopButton = createButton(`${STOP_BUTTON_TEXT}`, "stopButton", stopTicker);
var inputFields = FORM_FIELDS.map((field) => {
  return createInput(field.id, field.placeholder, field.defaultValue);
});

var widget = document.createElement("DIV");
label1 = document.createElement("span");
label1.innerText = INPUT_ONE_LABEL;

label2 = document.createElement("span");
label2.innerText = INPUT_TWO_LABEL;
widget.id = "kg";
function htmlToElem(html) {
  let temp = document.createElement("template");
  html = html.trim(); // Never return a space text node as a result
  temp.innerHTML = html;
  return temp.content.firstChild;
}

var loader = htmlToElem(`<div id="loader">
<img id="loaderImage" 
src=${LOADER_GIF}
alt="typing email GIF">
</div>`);

function startLoader() {
  document.getElementById("loader").style.display = "inline-block";
}
function stopLoader() {
  document.getElementById("loader").style.display = "none";
}
widget.append(startButton, stopButton, ...inputFields, loader);
document.body.append(widget);
