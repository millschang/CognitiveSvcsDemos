using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using AnalyzeImageDemo.models;

namespace AnalyzeImageDemo
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();

            ImageUrlComboBox.Items.Add("http://2.bp.blogspot.com/-PoUR2nj2Ifs/UHbPZGo1W8I/AAAAAAAAEfs/pO9QWEoFbsk/s1600/cute-baby-kittens.jpeg");
            ImageUrlComboBox.Items.Add("http://www.liveintentionally.org/wp-content/uploads/2011/07/freedom-bald-eagle-flying.jpg");
            ImageUrlComboBox.Items.Add("http://imguol.com/2013/03/14/christopher-power-1363276244301_400x500.jpg");
            ImageUrlComboBox.Items.Add("http://cdn.idigitaltimes.com/sites/idigitaltimes.com/files/2015/10/27/luke-skywalker-star-wars-force-awakens.jpg");
            
            ImageUrlComboBox.SelectedIndex = 0;
        }

        private async void AnalyzeButton_Click(object sender, RoutedEventArgs e)
        {

            CaptionTextBox.Text = "Analyzing...";

            string computerVisionKey = Utilities.GetKey();
            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", computerVisionKey);
            string requestParameters = "visualFeatures=Categories,Description,Adult,Color,Faces,ImageType,Tags&language=en";
            string uri = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + requestParameters;
            //string uri = "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + requestParameters;
            
            var imageUrl = ImageUrlComboBox.SelectedValue.ToString();

            HttpResponseMessage response;
            var json = "{'url': '" + imageUrl +"'}";
            byte[] byteData = Encoding.UTF8.GetBytes(json);

            using (var content = new ByteArrayContent(byteData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                response = await client.PostAsync(uri, content);
            }

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync();

                var results = JsonConvert.DeserializeObject<ImageAnalysisResults>(data);

                var caption = results.Description.Captions[0].Text;
                CaptionTextBox.Text = caption;
                var tags = results.Description.Tags;
                foreach (var tag in tags)
                {
                    TagsListBox.Items.Add(tag);
                }

                var racyScore = results.Adult.RacyScore;
                ShockingImage.Visibility = Visibility.Collapsed;
                if (racyScore > 0.3)
                {
                    ShockingImage.Visibility = Visibility.Visible;
                }
            }
            else
            {
                var error = response.StatusCode;
                var errorMsg = response.ReasonPhrase;
                CaptionTextBox.Text = "Error: " + error.ToString() + ": " + errorMsg;
            }

        }

        private void ImageUrlComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            CaptionTextBox.Text = "";
            TagsListBox.Items.Clear();
            ShockingImage.Visibility = Visibility.Hidden;
        }
    }
}
