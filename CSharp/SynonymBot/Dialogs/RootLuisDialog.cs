using System;
using System.Threading.Tasks;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System.Collections.Generic;
using SynonymBot.Services;
using Microsoft.Bot.Builder.Luis;
using Microsoft.Bot.Builder.Luis.Models;

namespace SynonymBot.Dialogs
{
    /// <summary>
    /// This dialog tages the first message from the user and sends the text to LUIS. LUIS tries to detect the intent here. 
    /// The attribute LuisModel takes the ID of the services, the key and information about API level, region, etc.
    /// Please keep in mind that there a different LUIS regions and that you have a production and staging deployment of your LUIS service
    /// </summary>
    [LuisModel("", "", LuisApiVersion.V2, "westeurope.api.cognitive.microsoft.com")]
    [Serializable]
    public class RootLuisDialog : LuisDialog<object>
    {
        // If no intent is determined we forward the user input to our small talk dialog
        [LuisIntent("")]
        [LuisIntent("None")]
        public async Task None(IDialogContext context, IAwaitable<IMessageActivity> activity, LuisResult result)
        {
            var message = await activity;
            await context.PostAsync("Sorry, but I don't really understand what you want me to do.");
        }

        // If we detect a greeting we call the greeting dialog
        [LuisIntent("Thesaurus")]
        public async Task Greeting(IDialogContext context, IAwaitable<IMessageActivity> activity, LuisResult result)
        {
            var message = await activity;
            EntityRecommendation term;
            if (result.TryFindEntity("term", out term))
            {
                message.Text = term.Entity;
                await context.Forward(new ThesaurusDialog(), AfterChildDialogFinished, message);
            }
            else
            {
                await context.PostAsync("Sorry, but that did not work.");
                context.Done(String.Empty);
            }
        }        

        // We use this method to end the dialog after a child dialog finishes
        private Task AfterChildDialogFinished(IDialogContext context, IAwaitable<object> result)
        {
            context.Done(String.Empty);
            return Task.CompletedTask;
        }
    }
}