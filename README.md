Modest Chat
====
Back in the day, we had a company named modest.com. We were relatively remote friendly. One of the biggest parts of this was this silly app that allowed us to do video chat without a lot of overhead. It was great (well, until we had about 15 people. it got unweildy then). 

Originally it was based on the [OpenTokNodeJS](https://github.com/songz/OpenTokNodeJS) example from OpenTok and we refactored it to work how we wanted it. It worked super well. 

This version is the [same kind of example](https://github.com/twilio/video-quickstart-js), but from [twilio](http://twilio.com). Again, it is refactored to work out we want it.

The app runs on firebase and uses some firebase specific things (auth, functions). It shouldn't be too hard to migrate it to another host (maybe netlify?). 

## TODO

* [authentication](https://github.com/harperreed/modest-chat/issues/1)
* [make room handling be based on URL](https://github.com/harperreed/modest-chat/issues/2)
* clean up design
* rainbows

---

## Getting started

Before we begin, we need to collect all the config values we need to run the application:

- Account SID: Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).
- API Key SID: Used to authenticate - [generate one here](https://www.twilio.com/console/runtime/api-keys).
- API Key Secret: Used to authenticate - [just like the above, you'll get one here](https://www.twilio.com/console/runtime/api-keys).


### A Note on API Keys

When you generate an API key pair at the URLs above, your API Key Secret will only be shown once - make sure to save this in a secure location.


## Running chat locally

to run the locally, you need to place the following into the `.runtimeconfig.json` file in your functions dir. 


    {
    "twilio": {
        "account_sid": "xxx",
        "api_secret": "xxx",
        "api_key": "xx"
        }
    }

Then run the app : 

`harper@ {~/modest-video-chat/}$ firebase serve`
