const {
  Client,
  RemoteAuth,
  LegacySessionAuth,
  LocalAuth,
  MessageMedia
} = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Require database
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();
// // Path where the session data will be stored
// const SESSION_FILE_PATH = "./session.json";

// // Load the session data if it has been previously saved
// let sessionData;
// if (fs.existsSync(SESSION_FILE_PATH)) {
//   sessionData = require(SESSION_FILE_PATH);
// }

// Use the saved values
// const client = new Client({
//   authStrategy: new LegacySessionAuth({
//     session: sessionData,
//   }),
// });

// Save session values to the file upon successful auth

// const client = new Client({
//   authStrategy: new LocalAuth(),
// });
// Load the session data
const id = "warHistories101";
let store;
const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      store = new MongoStore({ mongoose: mongoose });

      console.log("connected to db");
      //       client.initialize();
    })
    .catch((err) => console.log(err));
};

const connectClient = async () => {
  await connectDB();
  const client = new Client({
    authStrategy: new RemoteAuth({
      clientId: id,
      store: store,
      backupSyncIntervalMs: 300000,
    }),
  });
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });
  client.on("ready", () => {
    console.log("Bot is ready");
  });
  client.on("message", async (message) => {
    const contact = await message.getContact();
    if (message.body.toLowerCase() === "ping") {
      console.log(message._data);
      message.reply(`pong  @${contact.id.user} ${contact.pushname} `);
    }
    if (message.body === "who is daniz") {
      message.reply("daniz na werey");
    }
    if (message.body === "who is daniel") {
      message.reply("daniel na criminal");
    }
    if (message.body === "who is emma") {
      message.reply("emma na mumu");
    }
    if (message.body === "who is dwales") {
      message.reply("dwales na boss");
    }
    if (message.hasMedia && message.body === "toSticker") {
      message.downloadMedia().then((media) => {
        const sticker = new MessageMedia(media.mimetype, media.data, "sticker");
        // Send the image as a sticker!
        return client.sendMessage(message.from, sticker,{sendMediaAsSticker:true,stickerAuthor:"german-bot",stickerName:"made in germany"}).catch((err) => {
          console.log(err);
        });
      });
    }
    if (message.body === "display all court sessions") {
      message.reply(
        "{19th june,2023:prosecution of mr.emmanuel on the charges of breaching a contract. 21st june,2023: prosecution of mr.daniel on the charges of breaching a contract, being absent without leave and spoliation of evidence}"
      );
    }
  });

  client.initialize();
};
connectClient();
// client.on("qr", (qr) => {
//   qrcode.generate(qr, { small: true });
// });
// client.on("ready", () => {
//   console.log("Bot is ready");
// });
// client.on("message", (message) => {
//   if (message.body.toLowerCase() === "ping") {
//     console.log(message);
//     message.reply(`pong @${message.author} @${message.from}  `);
//   }
//   if (message.body === "who is daniz") {
//     message.reply("daniz na werey");
//   }
//   if (message.body === "who is daniel") {
//     message.reply("daniel na criminal");
//   }
//   if (message.body === "who is emma") {
//     message.reply("emma na mumu");
//   }
//   if (message.body === "who is dwales") {
//     message.reply("dwales na boss");
//   }
//   if (message.body === "display all court sessions") {
//     message.reply(
//       "{19th june,2023:prosecution of mr.emmanuel on the charges of breaching a contract. 21st june,2023: prosecution of mr.daniel on the charges of breaching a contract, being absent without leave and spoliation of evidence}"
//     );
//   }
// });

// client.initialize();
// // client.on('remote_session_saved', () => {
// //     // Do Stuff...
// // }
// // )
// // client.on("authenticated", (session) => {
// //   sessionData = session;
// //   fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
// //     if (err) {
// //       console.error(err);
// //     }
// //   });
// // });
