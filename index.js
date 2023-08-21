// discord.js import
import { Client, IntentsBitField } from "discord.js";
// node-fetch for making HTTP requests
import fetch from "node-fetch";

import dotenv from "dotenv";

dotenv.config();

// initialize client
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
// my model URL
const API_URL =
  "https://api-inference.huggingface.co/models/AleksiDu/HarryPotterBot";

// log out some info
client.on("ready", (c) => {
  console.log(`Logged in as ${c.user.tag}!`);
});

// when the bot receives a message
// need async message because we are making HTTP requests

client.on("messageCreate", async (message) => {
  // ignore messages from the bot itself
  if (message.author.bot) {
    return;
  }

  // form the payload
  const payload = {
    inputs: {
      text: message.content,
    },
  };
  // form the request headers with Hugging Face API key and Content-Type
  const headers = {
    Authorization: "Bearer " + process.env.AUTH_TOKEN_HUGGER,
    "Content-Type": "application/json",
  };
  // set status to typing
  message.channel.sendTyping();
  // query the server
  const response = await fetch(API_URL, {
    method: "post",
    body: JSON.stringify(payload),
    headers: headers,
  });

  console.log(response.status);
  // check for errors
  // if (response.status >= 400) {
  //   throw new Error(await response.json());
  // }

  // get the response data
  const data = await response.json();

  // initialize botResponse variable
  let botResponse = "";

  // if the response has generated_text property, set botResponse to it
  if (data.hasOwnProperty("generated_text")) {
    botResponse = data.generated_text;
  } else if (data.hasOwnProperty("error")) {
    // error condition
    botResponse = data.error;
  }

  // send message to channel as a reply
  message.reply(botResponse);
});

client.login(process.env.AUTH_TOKEN_DISCORD);
