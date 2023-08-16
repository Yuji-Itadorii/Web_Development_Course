const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
const path = require("path");
const express = require("express");
const https = require("node:https");
const bodyParser = require("body-parser");
const port = 3000 || process.env.PORT;
const ejs = require("ejs");
const got = require("got");
const dotenv = require("dotenv").config();

var Request;

// ***********************************************************************************

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(msg, projectId = "ar-bot-dasn") {
  // A unique identifier for the given session

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: "secrets.json",
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: msg,
        // The language used by the client (en-US)
        languageCode: "en-US",
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  Request = responses;
  // console.log(responses);
  // console.log('Detected intent');
  const result = responses[0].queryResult;
  // console.log(`  Query: ${result.queryText}`);
  // console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    // console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    // console.log('  No intent matched.');
  }

  return result.fulfillmentText;
}

// ***********************************************************************************

var array = [];

const sessionId = uuid.v4();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // res.render("index");z
  res.render("index");
});

app.get("/reset", (req, res) => {
  while (array.length != 0) {
    array.pop();
  }

  res.render("index");
});

app.post("/reply", (req, res) => {
  // console.log();
  // res.render("index");

  runSample(req.body.msg).then((data) => {
    var place_name;

    const parameter = Request[0].queryResult.parameters.fields.place_name;
    if (parameter != undefined) {
      place_name = parameter.stringValue;
      const id = process.env.ID;
      const unit = "metric";

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${place_name}&appid=${id}&units=${unit}`;

      https.get(url, (response) => {
        response.on("data", (response_data) => {
          const weatherData = JSON.parse(response_data);
          const lon = weatherData.coord.lon;
          const lat = weatherData.coord.lat;
          // console.log(lon);
          const place_url = `https://api.geoapify.com/v2/places?categories=tourism&filter=circle:${lon},${lat},5000&bias=proximity:${lon},${lat}&limit=3&apiKey=${process.env.APIKEY}`;

          https.get(place_url, (response2) => {
            let chunks = [];
            response2
              .on("data", (data) => {
                chunks.push(data);
              })
              .on("end", () => {
                let data = Buffer.concat(chunks);
                const place_Data = JSON.parse(data);
                const place1 = place_Data.features[0].properties.name;
                const place2 = place_Data.features[1].properties.name;
                const place3 = place_Data.features[2].properties.name;
                const famous_place = place1 + " , " + place2 + " , " + place3;
                // console.log(famous_place);
                const reply = {
                  personal_message: req.body.msg,
                  message: "Some tourist places are:- " + famous_place,
                };

                array.push(reply);

                res.render("reply", { repond: array });
              });
          });
        });
      });
    } else {
      const reply = {
        personal_message: req.body.msg,
        message: data,
      };

      array.push(reply);
      res.render("reply", { repond: array });
    }
  });
});

app.listen(port, () => {
  console.log("Starting http://localhost:3000");
});
