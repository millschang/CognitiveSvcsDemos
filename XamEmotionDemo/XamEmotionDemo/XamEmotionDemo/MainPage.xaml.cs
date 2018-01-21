using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Forms;
using XamEmotionDemo.Models;

namespace XamEmotionDemo
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
        }

        public async void GetEmotionsButton_Clicked(object sender, EventArgs ea)
        {

            var imgUrl = "http://www.thoughtpursuits.com/wp-content/uploads/2014/03/happy-sad-face-720x340.jpg";
            ImageUrlLabel.Text = imgUrl;
            ResultsLabel.Text = "analyzing...";
            Face[] faces = await EmotionService.GetEmotions(imgUrl);
            var emotionsResults = ParseFaces(faces);
            ResultsLabel.Text = emotionsResults;

        }
        protected static string ParseFaces(Face[] faces)
        {
            var sb2 = new StringBuilder();
            var faceNumber = 0;
            foreach (Face face in faces)
            {
                faceNumber++;
                var scores = face.Scores;
                var emotionScoresList = new List<EmotionScore>();
                emotionScoresList.Add(new EmotionScore("anger", scores.Anger));
                emotionScoresList.Add(new EmotionScore("contempt", scores.Contempt));
                emotionScoresList.Add(new EmotionScore("disgust", scores.Disgust));
                emotionScoresList.Add(new EmotionScore("fear", scores.Fear));
                emotionScoresList.Add(new EmotionScore("happiness", scores.Happiness));
                emotionScoresList.Add(new EmotionScore("neutral", scores.Neutral));
                emotionScoresList.Add(new EmotionScore("surprise", scores.Surprise));
                emotionScoresList.Add(new EmotionScore("sadness", scores.Sadness));

                var maxEmotionScore = emotionScoresList.Max(e => e.EmotionValue);
                var likelyEmotion = emotionScoresList.First(e => e.EmotionValue == maxEmotionScore);

                string likelyEmotionText
                    = string.Format("Face {0} is {1:N2}% likely to be experiencing: {2}\n\n",
                                faceNumber, likelyEmotion.EmotionValue * 100,
                                likelyEmotion.EmotionName.ToUpper()
                                );
                sb2.Append(likelyEmotionText);
            }

            var emotionsResults = sb2.ToString();

            return emotionsResults;

        }
    }
}
