using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmotionsDemo
{
    public static class Utilities
    {
        public static string GetKey()
        {
            // Replace with your key and uncomment!
            //localSettings.Values["EmotionApiKey"] = "<Emotion API key>";
            string emotionApiKey = "8b31fae51d9940c686bae7f00b4f4265"; // localSettings.Values["EmotionApiKey"].ToString();
            return emotionApiKey;
        }
    }
}
