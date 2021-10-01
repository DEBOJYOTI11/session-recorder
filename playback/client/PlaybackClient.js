import "./style.sass"
import cursorImgURL from "./assets/cursor.svg"
import arrowImgURL from "./assets/arrow.svg"
import simpleheat from 'simpleheat'

export class PlaybackClient {
    constructor(url, id) {
        console.log(url + id)
        this.websocket = new WebSocket(url + id);
        this.PlaybackId = id
        this.data = { messageType: null, x: 0, y: 0, time: 0, type: null, scrollX: 0, scrollY: 0 }
        this.scrollPosi = { x: 0, y: 0 }
        this.websocket.addEventListener("message", this.handleData.bind(this))
        document.getElementById("heatmap").
            addEventListener("change", (e) =>
                document.getElementById("canvas").style.opacity = e.target.checked ? "1" : "0")
    }
    handleData({ data }) {
        let prevData = this.data;
        this.data = JSON.parse(data)
        if (this.data.messageType === "initial") {
            this.windowHeight = this.data.height
            this.windowWidth = this.data.width,
                this.scrollHeight = this.data.scrollHeight
            document.body.scrollTop = this.data.scrollX
            document.body.scrollLeft = this.data.scrollY
            this.createDOM()
        }
        else {
            switch (this.data.type) {
                case "click":
                    this.showClickAlert()
                    break;
                case "scroll":
                    this.showScrollAlert(prevData)
                    break;
                case "resize":
                    this.resize()
                default:
                    this.cursorMove()
            }
        }
    }
    createDOM() {
        let playbackContainer = document.createElement("div")
        playbackContainer.style.height = this.windowHeight + "px"
        playbackContainer.style.width = this.windowWidth + "px"
        let canvas = document.createElement("canvas")
        canvas.height = this.windowHeight
        canvas.width = this.windowWidth
        canvas.id = 'canvas'
        let slider = document.createElement("input")
        slider.className="slider"
        slider.min=0
        slider.value=10
        slider.max=100
        slider.type="range"
        this.slider=slider
        let cursorImage = document.createElement("img")
        let iframe = document.createElement("iframe")
        iframe.className = "iframe"
        iframe.style.zIndex = "1"
        iframe.src = "/website/" + this.PlaybackId + "/"
        console.log("/website/" + this.PlaybackId)
        iframe.style.height = "100%"
        iframe.style.width = "100%"
        this.iframe = iframe
        this.canvas = canvas
        playbackContainer.id = "playback-container"
        cursorImage.className = "cursor"
        cursorImage.src = "/build/" + cursorImgURL
        this.cursor = cursorImage
        playbackContainer.appendChild(this.iframe)
        playbackContainer.appendChild(this.renderScrollAlert(this.scrollPosi))
        playbackContainer.appendChild(this.cursor)
        playbackContainer.appendChild(this.canvas)
        this.playbackContainer = playbackContainer
        document.body.appendChild(this.playbackContainer)
        this.iframeBody = document.getElementsByClassName("nav")[0]
        this.heatmap()
    }
    heatmap() {
        this.heat = simpleheat('canvas').max(10)
        this.draw()
    }
    draw() {
        this.heat.draw()
    }
    cursorMove() {
        this.cursor.style.transform = `translate(${this.data.x}px,${this.data.y}px)`
        this.heat.add([this.data.x, this.data.y, 1])
        // this.heat.draw()
        window.requestAnimationFrame(this.draw.bind(this))
    }
    resize() {
        // console.log(this.playbackContainer)
        this.playbackContainer.style.height = this.data.height + "px"
        this.playbackContainer.style.width = this.data.width + "px"
        this.canvas.height=this.data.height
        this.canvas.width=this.data.width
    }
    showClickAlert() {
        let alert = this.renderClickAlert()
        alert.style.transform = `translate(${this.data.x}px,${this.data.y}px)`
        alert.style.zIndex = "1111"
        this.playbackContainer.appendChild(alert)
        this.click(this.data.x, this.data.y)
        setTimeout((function () {
            this.playbackContainer.removeChild(alert)
        }).bind(this), 2000)
    }
    click(x, y) {
        console.log(x, y)
        var ev = document.createEvent("MouseEvent");
        var el = this.iframe.contentWindow.document.elementFromPoint(x, y);
        ev.initMouseEvent(
            "click",
            true /* bubble */, true /* cancelable */,
            window, null,
            x, y, 0, 0, /* coordinates */
            false, false, false, false, /* modifier keys */
            0 /*left*/, null
        );
        el.dispatchEvent(ev);
    }
    renderClickAlert() {
        let clickAlertContainer = document.createElement("div")
        clickAlertContainer.className = "click-alert-container"
        clickAlertContainer.style.zIndex = "12121"
        let tail = document.createElement("div")
        tail.className = "tail"
        let alertText = document.createElement("div")
        alertText.className = "alert-text"
        alertText.textContent = "Clicked"
        clickAlertContainer.appendChild(tail)
        clickAlertContainer.appendChild(alertText)
        return clickAlertContainer
    }
    showScrollAlert(prevData) {
        let scrollPosi = { x: 0, y: 0 }
        if (prevData.scrollX > this.data.scrollX)
            scrollPosi.x = -1
        else if (prevData.scrollX < this.data.scrollX)
            scrollPosi.x = 1
        else
            scrollPosi.x = 0
        if (prevData.scrollY > this.data.scrollY)
            scrollPosi.y = -1
        else if (prevData.scrollY < this.data.scrollY)
            scrollPosi.y = 1
        else
            scrollPosi.y = 0
        this.updateScrollAlert(scrollPosi)
    }
    updateScrollAlert(scrollPosi) {
        this.arrow.style = "display:block"
        setTimeout((() => {
            this.arrow.style = "display:none"
        }), 2000)
        // if(scrollPosi.x==1){
        //     document.body.scrollLeft=this.data.scrollX
        // }
        // console.log(this.iframeBody)
        if (scrollPosi.x == -1) {
            this.arrow.style.transform = 'rotate(180deg)'
            this.iframe.contentWindow.document.body.scrollLeft = this.data.scrollX
        }
        if (scrollPosi.y == 1) {
            this.arrow.style.transform = 'rotate(90deg)'
            // console.log("down")
            // console.log(this.iframeBody,this.data.scrollY)
            this.iframe.contentWindow.document.body.scrollTop = this.data.scrollY
        }
        if (scrollPosi.y == -1) {
            // console.log("up")
            this.arrow.style.transform = 'rotate(-90deg)'
            // console.log(this.data.scrollY)
            this.iframe.contentWindow.document.body.scrollTop = this.data.scrollY
        }
    }
    renderScrollAlert(scrollPosi) {
        scrollPosi = this.scrollPosi;
        let arrowImg = document.createElement("img")
        arrowImg.className = "arrow-img"
        arrowImg.src = "/build/" + arrowImgURL
        this.arrow = arrowImg
        return arrowImg
    }
}