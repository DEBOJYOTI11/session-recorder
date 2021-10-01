const Rx = require("rxjs");
const playback = (redisClient) => {
    
    return (ws, req) => {
        let id=req.params.playbackId
        let array$;
        let array = redisClient.duplicate().lrange(id, 0, -1, function (err, data) {
            if (!err)
                array$ = Rx.Observable.from(data)
    
                    .delayWhen((d) => {
                        let time = JSON.parse(d).time
                        return Rx.Observable.timer(time)
                    })
                    .subscribe(a => ws.send(a))
        })
        redisClient.subscribe(id)
        redisClient.on("message",(c,msg)=>{
            ws.send(msg)
        })
        ws.on("close", (data) => {
            if (array$)
                array$.unsubscribe()
            redisClient.unsubscribe()
        });

    }
}
module.exports = playback;