# Cognitive Services Demo

## Sentiment Analysis Bot Demo

### Overview

This demo uses the Microsoft Bot Framework to call the Cognitive Services Sentiment API, passing in text and returning a score between 0 and 1, representing the sentiment of that text. A lower score represents a negative sentiment; a higher score represents a positive sentiment.

The bot responds with either "That's the spirit!" (for scores above 0.5) or "Why so serious?" (for scores below 0.5)

### Setup

The following steps are required to run this sample code:

1. Sign up for an Azure account
2. Create a Text Analytics API key
3. Create the getkey.js file

Details:

#### Sign up for an Azure account

You will need to install node to run this sample. You can download and install node from [here](https://nodejs.org/).

#### Create a Text Analytics API key

You will need to create an API key for the v Cognitive Service. To do this, sign up for an Azure account at [azure.com](http://azure.com). You can sign up for a Free Account.

#### Create the getkey.js file

To protect the API key, I did not check in the web.config file. You will need to create this file in the root folder. Add the following code to to the < appSettings > section of web.config

```C#
    <add key="ApiKey" value="00d3f2d2c00f41a9849665f4cb2fb791" />
```

### Run the sample.

To run the sample, open the solution in Visual Studio 2017 and press F5.

Then, use the [Bot Framework emulator](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-debug-emulator?view=azure-bot-service-3.0) to test this bot.
