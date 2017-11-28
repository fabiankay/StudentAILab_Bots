using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;

namespace SynonymBot.Dialogs
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

            await context.PostAsync("Hi, great to meet you. I can help you to find Synonyms for German words.");

            context.Wait(IntentMessageReceivedAsync);            
        }

        private async Task IntentMessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;
            await context.Forward(new RootLuisDialog(), LuisDialogCompleted, activity);
        }

        private async Task LuisDialogCompleted(IDialogContext context, IAwaitable<object> result)
        {
            await context.PostAsync("What do you need to find next?");
            context.Wait(IntentMessageReceivedAsync);
        }
    }
}