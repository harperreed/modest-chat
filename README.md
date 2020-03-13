chat
====
Back in the day, we had a company named modest.com. We were relatively remote friendly. One of the biggest parts of this was this silly app that allowed us to do video chat without a lot of overhead. It was great (well, until we had about 15 people. it got unweildy then). 

Originally it was based on the [OpenTokNodeJS](https://github.com/songz/OpenTokNodeJS) example from OpenTok and we refactored it to work how we wanted it. It worked super well. 

This version is the same kind of example, but from twilio. Again, it is refactored to work out we want it.


## TODO

* authentication
* clean up design
* rainbows
* make room handling be based on URL

---

## Running the locally

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