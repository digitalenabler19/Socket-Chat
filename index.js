var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var request = require('request');

const bodyParser     = require('body-parser');
app.use(bodyParser.json());
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/sendToChat', function(req, res) {
	console.log("inside send to chat");
	console.log(req.body);
	var socket = io.sockets.connected[req.body.outputVariables.socketID.string]; // Find socket by id
       if (socket) {
          socket.emit('chat message', req.body.outputVariables.State.string);
       }
       else
       	console.log("socket not available")
	//io.sockets.emit('chat message', "req.body.outputVariables.State.stri");
  //io.emit('chat message', req.body.outputVariables.State.string);
});

io.on('connection', function(socket){
	console.log("SOCKET ID:"+socket.id);
	var socketID=socket.id;
  socket.on('chat message', function(msg){

 //SPLIT MESSAGE TO RETRIEVE THE PLACE HOLDER VALUE
 var inputVariable="No input variable recieved"
 var valuesFromChatStart=msg.split("<");
 if(valuesFromChatStart.length>1){
 var valuesFromChatEnd=valuesFromChatStart[1].split(">");
 console.log(valuesFromChatStart[1]);
 console.log(valuesFromChatEnd[0]);
 inputVariable=valuesFromChatEnd[0];


//---------------------------------------------------------------
var botDetails={
  "fileId": "9",
  "deviceIds": [
    "2"
  ],
  "runWithRdp": false,
  "callbackInfo": {
   "url": "http://localhost:3000/sendToChat",
   //"url":"https://httpbin.org/get",
  /*  "headers": {
      "X-Authorization":"mnb"
    }*/
  },
   "botVariables": {
    "Country": {
      "string": inputVariable
    },
     "socketID": {
      "string": socketID
    }
   }
};

    console.log(botDetails);
   request(
   // 'http://aablr0195.aaspl-brd.com:81/v1/authentication',
   // { json: { Username:req.body.loginID, Password:req.body.password } },
    {headers: {
      //'Content-Length': contentLength,
      'Content-Type': 'application/json',
      'X-Authorization':"eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiIxIiwiY2xpZW50VHlwZSI6IldFQiIsImxpY2Vuc2VzIjpbXSwiYW5hbHl0aWNzTGljZW5zZXNQdXJjaGFzZWQiOnsiQW5hbHl0aWNzQ2xpZW50Ijp0cnVlLCJBbmFseXRpY3NBUEkiOnRydWV9LCJpYXQiOjE1NjEwNDY5MjAsImV4cCI6MTU2MTA0ODEyMCwiaXNzIjoiQXV0b21hdGlvbkFueXdoZXJlIiwibmFub1RpbWUiOjc2ODU4NDY1MTgyOTAwfQ.kYdwd4m3ZDnrY7IRrp4yHT5jqKR6SYj4_1PiY-y6e9VX5jFs1qKb-JPePY7QGTVbz1ouoP6VCZHWUesd5tGt7VZMReuKclzYaQEDHLYslx3VCpymBfT7MDE8z2T67PkcYxcYnARnRiYoevCRVikIYvbRVDpwkRlxwjL2kVbQAncZtbdllDta9delidsrhuM_fMWbhLRVE9UQ_jUUnIpk4IoP2pxZ_yj_Wn9K5XCfnGqY27kl4UQYJqccC89QboywYw-ZUAUqWzdLNvafQoAssLhebj1Tc8sxETwOURkKawU5iNCDxfYXbuF-DO6PUgwUF6yMFd_A9zxOar3YQqBpZw"
  },
   // url: global.gConfig.controlRoom_URL+'/v1/schedule/automations/deploy',
    url: 'http://aablr0195.aaspl-brd.com:81/v2/automations/deploy',
    body: JSON.stringify(botDetails),
    method: 'POST'},
    function (error, response, body) {
    	
        /*if (!error && response.statusCode == 200) {
        	
            res.send({status:"Deployment success"});
         
        }
        else if(response.statusCode == 404 )
        	res.send({status:"Device not found"});
         else if(response.statusCode == 401 )
        	res.send({status:"Token Expired.Login again before deploying the bot"});
        else  if (body.code=="UM1110" && response.statusCode != 200 )
        	res.send({status:"Deployment Failed"});
        else
        	console.log(error);*/
    }
    )
  


//----------------------------------------------------------------
}

    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
