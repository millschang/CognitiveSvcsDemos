# Cognitive Services Demo

## Image Analysis

### Overview

This demo calls the Cognitive Services Analyze Image API, passing in a photo and returning information about that image. 

After running this code, a web server starts with a page at http://localhost:8124/, displaying the results.

### Setup

The following steps are required to run this sample code:

1. Sign up for an Azure account
2. Create a Computer Vision API key
3. Create the getkey.js file

Details:

#### Sign up for an Azure account

You will need to install node to run this sample. You can download and install node from [here](https://nodejs.org/).

#### Create a Computer Vision API key

You will need to create an API key for the Computer Vision Cognitive Service. To do this, sign up for an Azure account at [azure.com](http://azure.com). You can sign up for a Free Account.

#### Create the getkey.js file

To protect the API key, I did not check in the getkey.js file. You will need to create this file in the root folder. Add the following code to getkey.js

```javascript
(function() {
    var key = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    module.exports.getKey = function() {
        return key;
    }
}());
```

where xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx is your API key.

### Run the sample.

To run the sample, open a command prompt, change to the root folder, and type the following command:

```
node analyzeImage.js
```

Then, open a web browser and navigate to http://localhost:8124/.
