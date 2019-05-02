﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Web.Http;
using EmotionsInMotion.Models;
using Newtonsoft.Json;

namespace EmotionsInMotion.Controllers
{
    public class EmotionController : ApiController
    {
        // POST: api/Emotion
        public List<Emotion> Post([FromBody]string imageUrl)
        {
            return GetEmotionData(imageUrl);
        }

        private List<Emotion> GetEmotionData(string imageUrl)
        {

            var webSvcUrl = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize";
            //var webSvcUrl = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize";
            // TODO: Replace the EmotionApiSubscriptionKey value in Web.config with your key
            string emotionsKey = ConfigurationManager.AppSettings["EmotionApiSubscriptionKey"];
            if (emotionsKey == null)
            {
                throw new ConfigurationErrorsException("Web Service is missing Subscription Key");
            }
            WebRequest Request = WebRequest.Create(webSvcUrl);
            Request.Method = "POST";
            Request.ContentType = "application / json";
            Request.Headers.Add("Ocp-Apim-Subscription-Key", emotionsKey);
            using (var streamWriter = new StreamWriter(Request.GetRequestStream()))
            {
                string json = "{"
                + "\"url\": \"" + imageUrl + "\""
                + "}";

                streamWriter.Write(json);
                streamWriter.Flush();
                streamWriter.Close();

                var httpResponse = (HttpWebResponse)Request.GetResponse();

                string result = "";
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    result = streamReader.ReadToEnd();
                }
                httpResponse.Close();

                List<Emotion> emotions = JsonConvert.DeserializeObject<List<Emotion>>(result);
                return emotions;
            }
        }

        // PUT: api/Emotion/5
        public void Put(int id, [FromBody]string value)
        {
            throw new Exception("PUT not supported");
        }

        // DELETE: api/Emotion/5
        public void Delete(int id)
        {
            throw new Exception("DELETE not supported");
        }

        // GET: api/Emotion
        public IEnumerable<string> Get()
        {
            throw new Exception("GET not supported");
        }

        // GET: api/Emotion/5
        public string Get(int id)
        {
            throw new Exception("GET not supported");
        }

    }
}
