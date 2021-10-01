##Recorder-Client
-All EventListeners are added if MouseEvents are triggered
If message type is inital then url is send via websocket 

-Else Data is store in a array and after someInterval 
Data from the array is send to server and all the data 
in array is deleted and process is repeated.

-If We want to not record a particular element from the 
page then class and type of event are added in if condition

```
if (e.type === 'click' && e.target.className.includes("btn")) {
                console.log(e.target)
            }
```