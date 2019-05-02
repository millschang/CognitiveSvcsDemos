using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace SentimentBotDemo.Dialogs
{
    [Serializable]
    public class RootDialog : IDialog<object>
    {
        public Task StartAsync(IDialogContext context)
        {
            context.Wait(MessageReceivedAsync);

            return Task.CompletedTask;
        }

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;
            var response = "";
            string messageText = activity.Text;
            double sentimentScore = await Sentiment.Analyze(messageText);

            if (sentimentScore > 0.5)
            {
                response = "That's the spirit!";
            }
            else
            {
                response = "Why so serious?";
            }
            response += string.Format("; (Score = {0:0.00})", sentimentScore);
            await context.PostAsync(response);

            context.Wait(MessageReceivedAsync);
        }
    }
}