console.log('widget loaded');
var xpath = function (xpathToExecute) {
    var result = [];
    var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
        result.push(nodesSnapshot.snapshotItem(i));
    }
    return result;
}
function findElementTextAndPlayOnce(elementTextToFind, textToPlay) {
    var elements = xpath(`//*[@id="widgetContent"]//*[contains(text(), '${elementTextToFind}')]`)
    for (let ele of elements) {
        if (ele.dataset.played == undefined || ele.dataset.played === 'false') {
            playSound(textToPlay);
            ele.dataset.played = true;
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

    var givenPath = `//*[@id="widgetContent"]//button`;
    var givenPath2 = `//*[@id="widgetContent"]//*[contains(text(), 'Add')]`;
    var givenPath3 = `//*[@id="widgetContent"]//input`
    var buttons;
    var givenPaths = [givenPath, givenPath2, givenPath3];
    for (let k = 0; k < givenPaths.length; k++) {
        buttons = xpath(givenPaths[k]);
        if (buttons.length > 0) break;
    }
    console.log('buttons found', buttons);
    for (let i = 0; i < buttons.length; i++) {
        if (!buttons[i]) {
            console.log('button not found');
        }
        if (buttons[i].click) {
            buttons[i].click();
        } else {
            console.log('button click method not found');
        }

    }
};
var readerAction = function () {
    var username = xpath(`//span[contains(text(), 'Hello,')]`)[0].textContent.split(', ')[1];
    findElementTextAndPlayOnce('to Card', username);
}

var startTicker = function () {
    console.log('ticker started');
    var everyMSeconds = 1;
    var id = setInterval(
        tickerAction,
        everyMSeconds);
    tickerID.push(id);
    // start ticker for reader function
    var everyXSeconds = 3000;
    var idForReader = setInterval(
        readerAction,
        everyXSeconds
    );
    tickerID.push(idForReader);
}

var stopTicker = function () {
    console.log('ticker stopped');
    for (let ticker of tickerID) {
        clearInterval(ticker);
    }
}

function createButton(label, style, clickhandler) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = label;
    btn.style.height = style.height;
    btn.style.background = style.background;
    btn.addEventListener('click', clickhandler)
    return btn;
}

var startButton = createButton('Start Ticker', {
    position: 'absolute',
    top: '50px',
    right: '80px',
    background: 'greeen',
    height: '100px',
}, startTicker);

var stopButton = createButton('Stop Ticker', {
    position: 'absolute',
    top: '50px',
    background: 'greeen',
    right: '30px',
    height: '100px',
}, stopTicker);
var widget = document.createElement('DIV');
widget.id = 'kg';
function addCss(fileName) {
    var head = document.head;
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = fileName;
    head.appendChild(link);
}
document.body.append(widget);
addCss();
document.getElementById('kg').append(startButton);
document.getElementById('kg').append(startButton);