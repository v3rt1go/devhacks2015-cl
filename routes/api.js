'use strict';

var express = require('express');
var router = express.Router();
const request = require('request');
const Clarifai = require('../clarify-node.js');
Clarifai.initAPI('-gX7MzvJdvn1fa156Q43ovzDdNYxJcp6pv7IwQaB', 'UpzkUP6sk8hdZLYbAvv1igi0i6E9zXQ-EU6RL-tF');

/* GET image tags. */
router.get('/', function(req, res, next) {
  console.log('got req');
  Clarifai.tagURL(req.query.url, req.query.imgTag, resultsHandler, res);
  //res.render('index', { title: 'Express' });
  //next();
});

const resultsHandler = (err, res, callRes) => {
  if( err != null ) {
    if( typeof err["status_code"] === "string" && err["status_code"] === "TIMEOUT") {
      console.log("Shit timed out");
    }
    else if( typeof err["status_code"] === "string" && err["status_code"] === "ALL_ERROR") {
      console.log("Shit is FUBAR");       
    }
    else if( typeof err["status_code"] === "string" && err["status_code"] === "TOKEN_FAILURE") {
      console.log("Shit is not legit");       
    }
    else if( typeof err["status_code"] === "string" && err["status_code"] === "ERROR_THROTTLED") {
      console.log("Shit is stubborn");       
    }
    else {
      console.log("Shit is confused");
      console.log(err);       
    }
  }
  else {
    if( typeof res["status_code"] === "string" && 
      ( res["status_code"] === "OK" || res["status_code"] === "PARTIAL_ERROR" )) {

      // the request completed successfully
      for( let i = 0; i < res.results.length; i++ ) {
        if( res["results"][i]["status_code"] === "OK" ) {
          console.log('FINAL IS', callRes);
          console.log(res.results[0].result);
          console.log( 'docid='+res.results[i].docid +
            ' local_id='+res.results[i].local_id +
            ' tags='+res["results"][i].result["tag"]["classes"]);
          // send ok request back to client app
            //
          callRes.json(res.results[0].result.tag.classes); 
        }
        else {
          console.log( 'docid='+res.results[i].docid +
            ' local_id='+res.results[i].local_id + 
            ' status_code='+res.results[i].status_code +
            ' error = '+res.results[i]["result"]["error"]);

          // send fail request to client app
        }
      }

    }
  }     
}

module.exports = router;
