'use strict'

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.set('port', (process.env.PORT || 1340))

// Process data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// ROUTES
app.get('/', function(req, res) {
  res.send("Howdy! I am a chatbot!");
});

// Facebook page token
const token = "EAAcAuxG36YUBAMg9dJYD4lbNqNUS2o4p8fCTZCUA7oKSbDiuFw4JeCa3CkpOZBBwhZCbQDHbTJaob1cw9QorfPII91LOyAezV0tZAqgMLjn5hS2Xq1TcteFdi3N41dk55TLMPFRfexqCVazyP2urFU5OCZAUWt7RTke3uHoOpGwFdONRY2Xy8"

// Facebook
app.get('/webhook/', function(req, res) {
  if(req.query['hub.verify_token'] === 'someTokenHere') {
    res.send(req.query['hub.challenge'])
  }

  res.send("Wrong token");
});

// SEND Facebook
app.post('/webhook/', function(req, res) {
  let messaging_events = req.body.entry[0].messaging;

  for(let i = 0; i < messaging_events.length; i++) {
    let event = messaging_events[i];
    let sender = event.sender.id;

    if(event.message && event.message.text) {
      let text = event.message.text;
      sendMessage(sender, "Text echo: " +text.substring(0, 100))
    }
  }
  res.sendStatus(200)
});

// Send messag back.
function sendMessage(sender, message) {
  let messageData = { text: message };
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: token },
    method: "POST",
    json: {
      recipient: { id: sender },
      message: messageData
    }
  }, function(error, response, body) {
    if(error) {
      console.log("Something went wrong!");
    }else if(response.body.error) {
      console.log("Response body error!");
    }
  })
}

app.listen(app.get('port'), function() {
  console.log("Running on port: " + app.get("port"));
});
