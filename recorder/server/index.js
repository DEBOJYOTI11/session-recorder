var uuid = require('uuid').v4

var useragent = require('useragent');
useragent(true);

var scrape = require('website-scraper')
const recorder = (redisClient, app) => {
    return (ws, req) => {

        console.log("Session was created "+JSON.stringify(req.headers));

        let id = uuid();
        try{
        var agent = useragent.parse(req.headers['user-agent']);
        var url = req.get('origin');
        var domain = url.replace("http://","").replace("https://","").split(/[/?#]/)[0].replace(":","");

        console.log(domain);

        console.log(req.get('cookie'));
        var user  = getUser(req.get('cookie'));

        console.log(user);

        let readbale_id =  id+ '_'+domain + '_' + user;


        console.log(id);

        // let reqUrl=req.protocol+"://"+req.get('host').slice()+req.originalUrl
        // reqUrl=reqUrl.slice(0,reqUrl.length-10);
        // console.log("req",reqUrl);


        
        var ob  = {"name":readbale_id,"entry_point":domain, "agent":agent.os.toString() , "time":Date.now(),
            "location":"Inida/Bangalore"
        };
        console.log(ob);

        redisClient.lpush("live",id)
        console.log(JSON.stringify(ob));
        redisClient.lpush("liveDetails", JSON.stringify(ob));

        }catch(err){
            console.log(err);
        }    
        // scrape({urls:[reqUrl],directory:"./website/"+id+"/"}).then(console.log).catch(console.log)
        

        
        ws.on("message", (data) => {
            redisClient.duplicate().rpush(id, data)
            redisClient.publish(id,data)
            let message = JSON.parse(data)
             if (message.messageType === "initial"){
                 
             }
            if (message.messageType === "initial") {
                scrape({
                    urls: [message.url], directory: "./website/" + id + "/", httpResponseHandler: (response) => {
                        return Promise.resolve({
                            body: response.headers['content-type'].indexOf('html') > -1 ? response.body.replace(/\<script([^.]*)recorder.js.*\<\/script\>/g, "") : response.body,
                            metadata: {
                                headers: response.headers,
                            }
                        });
                    }
                }).then().catch()
            }
            //  console.log("dataa",test.messageType)
        });
        ws.on("close", (data) => {
            redisClient.lpop("live")
            redisClient.lpush("sessions",id)
            console.log(JSON.stringify(ob))
            redisClient.lpush("sessionsDetails", JSON.stringify(ob))
        });
    }
}

function getUser(us){
    // console.log("d"+us)
    // sp =  us.split("=");
    // console.log(sp)
    // for(i=0;i<sp.length;i++){
    //     console.log(i)
    //     if(sp[i]=='wfx_unq'){
    //         return splits[i+1];
    //     }
    // }
    // console.log('dewd')
    return "user1";
}
module.exports = recorder;