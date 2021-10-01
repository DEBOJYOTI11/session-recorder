##Playback-Client
-All styles are imported from the style.sass files

-HeatMap is imported from the simpleheat package

-Initially data values are defined as follows

```
  this.data = { messageType: null, x: 0, y: 0, time: 0, type: null, scrollX: 0, scrollY: 0 }
  this.scrollPosi = { x: 0, y: 0 }
```

-If the data values of x and y are changed then 

 heatmap is generated as per the values of x and y 

 from the data

-HandleData function is for parsing data into JSON Format

    If the messagetype in data is inital 

    windowHeight,windowWidth,scrollHeight and scrollWidth 

    are initialized from the data

    dom elements are created using createdom function 


    Else according to data type 

    resize,click,scroll and mousemove functions are called
