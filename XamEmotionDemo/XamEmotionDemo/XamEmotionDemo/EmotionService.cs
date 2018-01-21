using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using XamEmotionDemo.Models;

namespace XamEmotionDemo
{
    public static class EmotionService
    {
        public static async Task<Face[]> GetEmotions(string imageUrl)
        {

            string emotionApiKey = GetKey();
            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", emotionApiKey);
            string uri = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize ";
            HttpResponseMessage response;
            var json = "{'url': '" + imageUrl + "'}";
            byte[] byteData = Encoding.UTF8.GetBytes(json);
            using (var content = new ByteArrayContent(byteData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                response = await client.PostAsync(uri, content);
            }

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();
                var results = JsonConvert.DeserializeObject(data);
                var rawResults = results.ToString();

                Face[] faces = JsonConvert.DeserializeObject<Face[]>(data);
                return faces;


            }
            else
            {
                return new Face[0];
            }

        }

        public static string GetKey()
        {
            // Replace with your key!
            string emotionApiKey = "348e91d8e1224dfcb92f88fb7835d67f";
            return emotionApiKey;
        }
    }
}
