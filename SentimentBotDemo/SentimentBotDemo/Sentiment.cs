using Microsoft.IdentityModel.Protocols;
using Newtonsoft.Json;
using SentimentBotDemo.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace SentimentBotDemo
{
    public static class Sentiment
    {
        public static async Task<double> Analyze(string text)
        {
            var client = new HttpClient();

            string apiKey = ConfigurationManager.AppSettings["ApiKey"];
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", apiKey);

            var uri = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment";

            HttpResponseMessage response;

            // Request body
            var document = "{'language': 'en', 'id': 1, 'text': '" + text + "'}";
            var jsonBody = "{documents: [" + document + "]}";
            byte[] byteData = Encoding.UTF8.GetBytes(jsonBody);

            using (var content = new ByteArrayContent(byteData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                response = await client.PostAsync(uri, content);

                double score = 0;
                if (response.IsSuccessStatusCode)
                {
                    var data = await response.Content.ReadAsStringAsync();

                    var results = JsonConvert.DeserializeObject<TextAnalysisResults>(data);

                    if (results.Documents.Count() > 0)
                    {
                        score = results.Documents[0].Score;
                    }
                }
                else
                {
                    var error = response.StatusCode;
                    var errorMsg = response.ReasonPhrase;
                }

                return score;

            }

        }

    }
}