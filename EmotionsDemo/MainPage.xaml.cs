using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using EmotionsDemo.Models;

namespace EmotionsDemo
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();

            // Angry girl
            ImageUrlCombobox.Items.Add("http://4.bp.blogspot.com/-b2L0jhNLbec/T5VouZK2g-I/AAAAAAAAEzY/253HyiLjxOQ/s1600/angry+face+girl+(2).jpg");
            // Sad Lebron
            ImageUrlCombobox.Items.Add("https://windycitizensports.files.wordpress.com/2012/04/lebron-crying.jpg?w=595");
            // Happy group
            ImageUrlCombobox.Items.Add("http://hotelkappara.com/wp-content/uploads/2011/08/Happy-group-of-people.jpg");
            // Mixed group
            ImageUrlCombobox.Items.Add("https://thedrawshop.com/wp-content/uploads/2013/08/Emotions_faces_web.gif");
            //ImageUrlCombobox.Items.Add("http://www.thoughtpursuits.com/wp-content/uploads/2014/03/happy-sad-face-720x340.jpg");

            // Kylo Ren
            ImageUrlCombobox.Items.Add("http://assets2.ignimgs.com/2016/01/08/1280-kylo-ren-adam-driverjpg-0d7084_1280w.jpg");

            // Mona Lisa
            ImageUrlCombobox.Items.Add("http://www.sott.net/image/s13/272205/full/Mona_Lisa.jpg");
        
            ImageUrlCombobox.SelectedIndex = 0;

        }

        private void GetEmotionsButton_Click(object sender, RoutedEventArgs e)
        {
            string url = "";
            url = @"http://www.asianweek.com/wp-content/uploads/2008/04/dreamstimeweb_angry374345_11.jpg";
            url = ImageUrlTextbox.Text;
            //url = ImageUrlCombobox.SelectedValue.ToString();
            GetEmotions(url);
        }

        private async void GetEmotions(string imageUrl)
        {
            string emotionApiKey = Utilities.GetKey();
            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", emotionApiKey);
            string uri = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize";
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
                RawResultsTextblock.Text = results.ToString();

                Face[] faces = JsonConvert.DeserializeObject<Face[]>(data);
                var sb1 = new StringBuilder();
                var sb2 = new StringBuilder();
                var faceNumber = 0;
                foreach (Face face in faces)
                {
                    faceNumber++;
                    var scores = face.Scores;

                    var anger = scores.Anger;
                    var contempt = scores.Contempt;
                    var disgust = scores.Disgust;
                    var fear = scores.Fear;
                    var happiness = scores.Happiness;
                    var neutral = scores.Neutral;
                    var surprise = scores.Surprise;
                    var sadness = scores.Sadness;

                    sb1.Append(string.Format("Face {0}\n", faceNumber));
                    sb1.Append("Scores:\n");
                    sb1.Append(string.Format("Anger: {0:0.00}\n", anger));
                    sb1.Append(string.Format("Contempt: {0:0.00}\n", contempt));
                    sb1.Append(string.Format("Disgust: {0:0.00}\n", disgust));
                    sb1.Append(string.Format("Fear: {0:0.00}\n", fear));
                    sb1.Append(string.Format("Happiness: {0:0.00}\n", happiness));
                    sb1.Append(string.Format("Neutral: {0:0.00}\n", neutral));
                    sb1.Append(string.Format("Surprise: {0:0.00}\n", surprise));
                    sb1.Append(string.Format("Sadness: {0:0.00}\n", sadness));
                    sb1.Append("\n");

                    
                    var emotionScoresList = new List<EmotionScore>();
                    emotionScoresList.Add(new EmotionScore("anger", anger));
                    emotionScoresList.Add(new EmotionScore("contempt", contempt));
                    emotionScoresList.Add(new EmotionScore("disgust", disgust));
                    emotionScoresList.Add(new EmotionScore("fear", fear));
                    emotionScoresList.Add(new EmotionScore("happiness", happiness));
                    emotionScoresList.Add(new EmotionScore("neutral", neutral));
                    emotionScoresList.Add(new EmotionScore("surprise", surprise));
                    emotionScoresList.Add(new EmotionScore("sadness", sadness));

                    var maxEmotionScore = emotionScoresList.Max(e => e.EmotionValue);
                    var likelyEmotion = emotionScoresList.First(e => e.EmotionValue == maxEmotionScore);


                    string likelyEmotionText = string.Format("Face {0} is {1:N2}% likely to experiencing: {2}\n\n",
                        faceNumber, likelyEmotion.EmotionValue * 100, likelyEmotion.EmotionName.ToUpper());
                    sb2.Append(likelyEmotionText);

                }
                var resultsDump = sb1.ToString();
                ResultsTextblock.Text = resultsDump;

                LikelyEmotionsTextblock.Text = sb2.ToString();

            }
            else
            {
                var error = response.StatusCode;
                var errorMsg = response.ReasonPhrase;
                ResultsTextblock.Text = "Error: " + error.ToString() + ": " + errorMsg;
                RawResultsTextblock.Text = response.ToString();
            }

        }

        private void ClearReponsesButton_Click(object sender, RoutedEventArgs e)
        {
            RawResultsTextblock.Text = "";
            ResultsTextblock.Text = "";
            LikelyEmotionsTextblock.Text = "";
        }
    }
}


public class EmotionScore
{
    public EmotionScore(string emotionName, float emotionValue)
    {
        EmotionName = emotionName;
        EmotionValue = emotionValue;
    }
    public string EmotionName { get; set; }
    public float EmotionValue { get; set; }

}
