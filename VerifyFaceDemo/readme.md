# Cognitive Services Demo

## Verify Face

### Overview

This demo calls the Face API, passing in 2 images, each containing a face and returning a score from 0 to 1, indicating how likely these faces are the same person.

### Setup

The following steps are required to run this sample code:

1. Sign up for an Azure account
2. Create a Face API key
3. Create the getkey.js file

Details:

#### Sign up for an Azure account

You will need to install node to run this sample. You can download and install node from [here](https://nodejs.org/).

#### Create a Face API key

You will need to create an API key for the Cognitive Service. To do this, sign up for an Azure account at [azure.com](http://azure.com). You can sign up for a Free Account.

#### Create the getkey.js file

To protect the API key, I did not check in the getkey.js file. You will need to create this file in the root folder. Add the following code to getkey.js

```javascript
var getKey = function () {
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
}

where xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx is your API key.

### Run the sample.

To run the sample, open index.html in a web browser.
