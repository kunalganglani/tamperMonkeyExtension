console.clear();
document.body.style.zoom=0.8;this.blur();
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
        if (ele.getAttribute('played') == null || ele.getAttribute('played') === 'false') {
            playSound(textToPlay);
            ele.setAttribute('played', 'true');
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
    startLoader();
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
    stopLoader();
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
function htmlToElem(html) {
    let temp = document.createElement('template');
    html = html.trim(); // Never return a space text node as a result
    temp.innerHTML = html;
    return temp.content.firstChild;
  }

var loader = htmlToElem(`<div id="loader">
<img id="loaderImage" 
src="https://media0.giphy.com/media/9CffOPMLx0Hf2/giphy.gif?cid=ecf05e47fcdff774bdb38787e7846e18912561f1d82808c5&amp;rid=giphy.gif"
alt="typing email GIF">
</div>`)

function startLoader() {
    document.getElementById('loader').style.display= 'inline-block'
}
function stopLoader() {
    document.getElementById('loader').style.display= 'none'
}
widget.append(startButton);
widget.append(stopButton);
widget.append(label1)
widget.append(inputHolderForNotification);
widget.append(label2)
widget.append(containerIdInput);
widget.append(loader);

document.body.append(widget);

function autoStart() {
    setInterval(() => {
        const timeSpan = xpath(`//span[contains(text(), 'Starts in')]/following-sibling::span`);
        if(timeSpan && timeSpan[0]) {
            const timerOnSaleSpan = timeSpan[0];
            const minutes = parseInt(timerOnSaleSpan.innerText.split(':')[0], 10);
            const seconds = parseInt(timerOnSaleSpan.innerText.split(':')[1], 10);
            if(minutes<=2) {
                startButton && startButton.click();
            }
        }
    }, 1000)
}
autoStart();