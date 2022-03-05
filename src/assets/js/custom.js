var dragValue; 
let canvas=document.getElementsByTagName("SECTION")[0].getElementsByTagName("DIV")[0];
var form=document.getElementById("form");
var client;

let movable=null;
function dragElement(event){
    movable = document.getElementById(event.target.id);
    // console.log(movable);
    form.style.visibility = "hidden";
    // console.log(event);

    if(movable){
      movable.addEventListener('contextmenu', function(e){
        e.preventDefault();
      })
      movable.addEventListener('dblclick', function(e){
        e.preventDefault();
        //console.log(e.path[0].id);
        var m=movable.id.match(/(\d+)/)[0];

        if(movable.id.startsWith("img-sensor")){
          var newHTML = `<label for="topic">Topic</label><br>
          <input type="text" id="topic" name="topic" value="iot-emulator/"><br>
          <label for="value">Value</label><br>
          <input type="number" id="value" name="value" value=30><br>
          <label for="random">Random</label><br>
          <input id="random" name="random" type="checkbox"><br>
          <label for="ul">UpperLimit</label><br>
          <input type="number" id="ul" name="ul" value=100><br>
          <label for="ll">LowerLimit</label><br>
          <input type="number" id="ll" name="ll" value=50><br>
          <label for="iterations">Iterations</label><br>
          <input type="number" id="iterations" name="iterations" value=10><br>
          <label for="interval">Interval(Sec)</label><br>
          <input type="number" id="interval" name="interval" value=10><br><br>
          <input type="button" name="submit" value="SUBMIT" onclick="sendData(event)"/>
          <input type="button" name="delete" value="DELETE" onclick="deleteData(event)"/>`;

          form.innerHTML = newHTML;
        }
        else if(movable.id.startsWith("img-motor")){
          var newHTML = `<label for="topic">Topic</label><br>
          <input type="text" id="topic" name="topic" value="iot-emulator/"><br><br>
          <input type="button" name="submit" value="SUBMIT" onclick="sendData(event)"/>
          <input type="button" name="delete" value="DELETE" onclick="deleteData(event)"/>`;

          form.innerHTML = newHTML;
        }
        else if(movable.id.startsWith("img-light")){
          var newHTML = `<label for="topic">Topic</label><br>
          <input type="text" id="topic" name="topic" value="iot-emulator/"><br><br>
          <input type="button" name="submit" value="SUBMIT" onclick="sendData(event)"/>
          <input type="button" name="delete" value="DELETE" onclick="deleteData(event)"/>`;

          form.innerHTML = newHTML;
        }
        else if(movable.id.startsWith("img-pir")){
          var newHTML = `<label for="topic">Topic</label><br>
          <input type="text" id="topic" name="topic" value="iot-emulator/"><br><br>
          <input type="button" name="submit" value="SUBMIT" onclick="sendData(event)"/>
          <input type="button" name="delete" value="DELETE" onclick="deleteData(event)"/>
          <input type="button" name="movement" value="MOVE" onclick="pirData(event)"/>`;

          form.innerHTML = newHTML;
        }

        form.elements["topic"].value=movable.alt;
        // form.style.display="inline-block";
        form.style.visibility = "visible";

        canvas.addEventListener('dblclick', function(e){
          e.preventDefault();
        })
        canvas.addEventListener('contextmenu', function(e){
          e.preventDefault();
        })
        //document.body.insertAdjacentHTML("afterend",'<form onsubmit="submit()"><label for="topic">Topic</label><br><input type="text" id="fname" name="topic" value="John"><br><label for="value">Value</label><br><input type="text" id="lname" name="value" value="Doe"><br><br><input type="submit" value="Submit"></form>');
      })
      }
      else{
        canvas.addEventListener('dblclick', function(e){
          e.preventDefault();
        })
        canvas.addEventListener('contextmenu', function(e){
          e.preventDefault();
        })
      // console.log("if-rightclk");
    }
    if(movable){

      let shiftX = event.clientX - movable.getBoundingClientRect().left;
      let shiftY = event.clientY - movable.getBoundingClientRect().top;

      movable.style.position = 'absolute';
      // movable.style.zIndex = 1000;
      //canvas.appendChild(element);

      moveAt(event.pageX, event.pageY);

      // moves the ball at (pageX, pageY) coordinates
      // taking initial shifts into account
      function moveAt(pageX, pageY) {
        // console.log("MoveAt");
        if(movable!=null){
        movable.style.left = pageX - shiftX + 'px';
        movable.style.top = pageY - shiftY + 'px';
        }
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
        document.onmouseup= function(){
          // console.log("insid");
          document.removeEventListener('mousemove', onMouseMove);
          if(movable)
            movable.onmouseup = null;
        }
        // console.log("MouseMove");
      }

      // move the ball on mousemove
      document.addEventListener('mousemove', onMouseMove);


      // drop the ball, remove unneeded handlers
      movable.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        movable.onmouseup = null;
        // console.log("MouseUp");
      };
    movable.ondragstart = function() {
      return false;
    };
  }
}

function sendData(ev){
  var mqtt_server = document.getElementById("mqtt_server").value;
  var mqtt_port = Number(document.getElementById("mqtt_port").value);

  client = new Paho.MQTT.Client(mqtt_server, mqtt_port,"");
  client.connect({onSuccess:onConnect1});

  ev.preventDefault();
  var data= Object.fromEntries(new FormData(form).entries());
  // console.log(data);
  movable.alt=data.topic;
  // msg = new Paho.MQTT.Message(movable.name);
  // msg.destinationName = data.topic;
}

function onConnect1() { 
  var data= Object.fromEntries(new FormData(form).entries());
  console.log(data);
  movable.alt=data.topic;
  if(movable.alt.startsWith("iot-emulator/sensor")){
    var time=1;
    if(data.random=="on"){
      var interval = setInterval(function() { 
        if (time <= data.iterations) { 
          msg = new Paho.MQTT.Message(Math.floor((Math.random() * (parseInt(data.ul)-parseInt(data.ll))) + parseInt(data.ll)).toString());
          msg.destinationName = data.topic;
          client.send(msg);
          time++;
        }
        else { 
           clearInterval(interval);
        }
      }, data.interval*1000);
    }
    else{
      var interval = setInterval(function() { 
        if (time <= data.iterations) { 
          msg = new Paho.MQTT.Message(data.value);
          msg.destinationName = data.topic;
          client.send(msg);
          time++;
        }
        else { 
           clearInterval(interval);
        }
      }, data.interval*1000);
    }
  }
}

function pirData(ev){
  var mqtt_server = document.getElementById("mqtt_server").value;
  var mqtt_port = Number(document.getElementById("mqtt_port").value);

  client = new Paho.MQTT.Client(mqtt_server, mqtt_port,"");
  client.connect({onSuccess:onConnect2});
}

function onConnect2() {
  msg = new Paho.MQTT.Message("Movement Detected");
  msg.destinationName = movable.alt;
  client.send(msg);
  console.log(movable.id);
}

function deleteData(ev){
  movable.remove();
  form.style.visibility="hidden";
}


function allowDrop(ev) {
  ev.preventDefault();
  console.log("allow-drp");
}

function drag(ev) {
  ev.dataTransfer.setData("text/html", ev.target.id);
  // console.log(ev);
}

var id=1;
function drop(ev) {
  var x = ev.dataTransfer.getData("text/html");
  if (canvas.children.length && ev.target.id.match("img")){
    console.log(ev.target.id.match("img"));
    return;
  }
  if(canvas.children.length==0){
    var data = ev.dataTransfer.getData("text/html");
    var nodeCopy = document.getElementById(data).cloneNode(true);
    // console.log(nodeCopy);
    nodeCopy.alt= nodeCopy.alt+'/'+id;
    nodeCopy.id = nodeCopy.id+id; /* We cannot use the same ID */
    ev.target.appendChild(nodeCopy);
    id+=1;
    stop();
  }
  else if(canvas.children.length>0){
    console.log("else");
    var flag=1;
    for(var i=0;i<canvas.children.length;i++){
      if(canvas.children[i].id == x){
        flag=0;
      }
    }
    if(flag){
      var data = ev.dataTransfer.getData("text/html");
      var nodeCopy = document.getElementById(data).cloneNode(true);
      // console.log(nodeCopy);
      nodeCopy.alt= nodeCopy.alt+'/'+id;
      nodeCopy.id = nodeCopy.id+id; /* We cannot use the same ID */
      ev.target.appendChild(nodeCopy);
      id+=1;
      stop();
    }
  }
}



//=======================================================================================================================================================================
var lightStatus = 0;
var motorStatus = 0;

function actionLight(topic){
  if(canvas.children.length){
    for(var i=0;i<canvas.children.length;i++){
      if(canvas.children[i].alt === topic){
        if(lightStatus == 0){
          var bulb=canvas.querySelector("[id^="+canvas.children[i].id+"]");
          bulb.src = "https://previews.123rf.com/images/ericmilos/ericmilos0912/ericmilos091200136/6109526-3d-render-of-light-bulb-on-white.jpg";
          //ad: disabled
          // document.getElementById("button").innerHTML = "Turn ON";
          lightStatus = 1;
        }
        else if(lightStatus == 1){
          var bulb=canvas.querySelector("[id^="+canvas.children[i].id+"]");
          bulb.src = "https://previews.123rf.com/images/murika/murika1511/murika151100069/48123160-bright-glowing-incandescent-light-bulb-on-a-white-background.jpg";
          lightStatus = 0;
        }
      }
    }
  }
}

function actionMotor(topic){
  if(canvas.children.length){
    for(var i=0;i<canvas.children.length;i++){
      if(canvas.children[i].alt === topic){
        if(motorStatus == 0){
          var fan=canvas.querySelector("[id^="+canvas.children[i].id+"]");
          fan.src = "assets/images/static-fan.png";
          motorStatus = 1;
        }
        else if(motorStatus == 1){
          var fan=canvas.querySelector("[id^="+canvas.children[i].id+"]");
          fan.src = "assets/images/spinning-fan.gif";
          motorStatus = 0;
        }
      }
    }
  }
}

//================================================================================================================================
function sub_mqtt_msg() {
// Send an MQTT message
  var mqtt_server = document.getElementById("mqtt_server").value;
  var mqtt_port = Number(document.getElementById("mqtt_port").value);

  client = new Paho.MQTT.Client(mqtt_server, mqtt_port,"");
  client.onMessageArrived = onMessageArrived;
  client.connect({onSuccess:onConnect});
  document.getElementById("msgIncoming").innerHTML = "Trying to connect...";

}
function onConnect() {
  document.getElementById("msgIncoming").innerHTML = "New connection made...";
  var mqtt_subtopic = document.getElementById("mqtt_subtopic").value;  
  client.subscribe(mqtt_subtopic);
  document.getElementById("msgIncoming").innerHTML = "Subscribing to topic: " + mqtt_subtopic + " ...";
}
function onMessageArrived(message) {
  var result = message.destinationName + " : " + message.payloadString + "";
  document.getElementById("msgIncoming").innerHTML = result;

  // ad: added - pass on message to virtual device
  console.log(message.destinationName);
  if(message.destinationName.startsWith('iot-emulator/light/')) {
    var elementId=message.destinationName.match(/(\d+)/)[0];
    if(canvas.children.length==0){
      console.log("nothing");
    }
    else{
      if(canvas.querySelector("[id^=img-light]")){
          if(message.payloadString == 'on')  {lightStatus = 1; actionLight(message.destinationName);}
          if(message.payloadString == 'off') {lightStatus = 0; actionLight(message.destinationName);}
      }
    }
  }
  else if(message.destinationName.startsWith('iot-emulator/motor/')) {
    var elementId=message.destinationName.match(/(\d+)/)[0];
    if(canvas.children.length==0){
      console.log("nothing");
    }
    else{
        if(canvas.querySelector("[id^=img-motor]")){
          if(message.payloadString == 'on')  {motorStatus = 1; actionMotor(message.destinationName);}
          if(message.payloadString == 'off') {motorStatus = 0; actionMotor(message.destinationName);}
      }
    }
  }

}

//--------------------------------------------------------------------------

/*
dragElement(document.getElementById("drag1"));
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
*/
