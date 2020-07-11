console.clear();
var projectPath = `https://raw.githubusercontent.com/kunalganglani/tamperMonkeyExtension/master/orderAutomation`;
console.log('############ widget loaded ###########');
var xpath = function (xpathToExecute) {
    var result = [];
    var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
        result.push(nodesSnapshot.snapshotItem(i));
    }
    return result;
}
function findElementTextAndPlayOnce(elementTextToFind, textToPlay) {
    var widgetid = document.getElementById('containerIdInput').value;
    var elements = xpath(`//*[@id="${widgetid}"]//*[contains(text(), '${elementTextToFind}')]`)
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
    var widgetid = document.getElementById('containerIdInput').value;
    var givenPath = `//*[@id="${widgetid}"]//button`;
    var givenPath2 = `//*[@id="${widgetid}"]//*[contains(text(), 'Add')]`;
    var givenPath3 = `//*[@id="${widgetid}"]//input`
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
    var listenTo = document.getElementById('inputHolderForNotification').value;
    findElementTextAndPlayOnce(listenTo, username);
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
function createButton(label, id, clickhandler) {
    var btn = document.createElement("BUTTON");
    btn.id = id;
    btn.innerHTML = label;
    btn.addEventListener('click', clickhandler)
    return btn;
}
var startButton = createButton('Start', 'startButton', startTicker);
var stopButton = createButton('Stop', 'stopButton', stopTicker);
var inputHolderForNotification = document.createElement('INPUT');
inputHolderForNotification.id = 'inputHolderForNotification';
inputHolderForNotification.placeholder = 'Enter text to notifify on';
inputHolderForNotification.value = 'to cart';

var containerIdInput = document.createElement('INPUT');
containerIdInput.id = 'containerIdInput';
containerIdInput.placeholder = 'Enter container id for sale';
containerIdInput.value = 'widgetContent';

var widget = document.createElement('DIV');
label1 = document.createElement('span')
label1.innerText = 'Notify On';

label2 = document.createElement('span')
label2.innerText = 'Sale Container id';
widget.id = 'kg';
widget.append(startButton);
widget.append(stopButton);
widget.append(label1)
widget.append(inputHolderForNotification);
widget.append(label2)
widget.append(containerIdInput);

document.body.append(widget);