console.log("location", location.href)
var websocket = new WebSocket("ws://localhost:8080/recorder")
var sessionstart = false
var events = "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu"
    .split(" ")
websocket.addEventListener("message", function (data) {
    console.log(data.data)
})
// document.getElementById("startButton").addEventListener("click", () => {
//     sessionstart = true;
// })
// document.getElementById("stopButton").addEventListener("click", () => {
//     sessionstart = false;
// })
var multipleEvents = [];
events.map((a, i) => {
    websocket.addEventListener("open", function () {
        if (i === 0) {
            websocket.send(JSON.stringify({
                messageType: "initial",
                height: window.innerHeight,
                width: window.innerWidth,
                scrollX: window.scrollX,
                scrollY: window.scrollY,
                scrollHeight: document.body.scrollHeight,
                url: location.href
            }))
        }
        window.addEventListener(a, (e) => {
            // if (sessionstart) {
            if (e.type === 'click' && e.target.className.includes("btn")) {
                console.log(e.target)
            }
            else {
                multipleEvents.push({
                    messageType: "event",
                    height: window.innerHeight,
                    width: window.innerWidth,
                    x: e.clientX,
                    y: e.clientY,
                    time: e.timeStamp,
                    type: e.type,
                    scrollX: window.scrollX,
                    scrollY: window.scrollY
                })
                // console.log(multipleEvents)
                // websocket.send(JSON.stringify({
                //     messageType: "event",
                //     height: window.innerHeight,
                //     width: window.innerWidth,
                //     x: e.clientX,
                //     y: e.clientY,
                //     time: e.timeStamp,
                //     type: e.type,
                //     scrollX: window.scrollX,
                //     scrollY: window.scrollY
                // }))
            }
            // }
        })
    })
})
setInterval(function () {
    multipleEvents.map(a=>{  
        // websocket.send(a)
        websocket.send(JSON.stringify(a))
    })
    multipleEvents = [];
}, 100)