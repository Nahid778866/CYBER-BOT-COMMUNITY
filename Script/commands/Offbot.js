// ইউজারের বট চালু/বন্ধ স্ট্যাটাস সংরক্ষণের জন্য
const userStatus = {};  // userId অনুযায়ী: { "123456": "off" }

function sendMessage(senderId, text) {
  const request = require('request');
  request({
    url: 'https://graph.facebook.com/v17.0/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: senderId },
      message: { text }
    }
  });
}

app.post('/webhook', (req, res) => {
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      let event = entry.messaging[0];
      let senderId = event.sender.id;
      let msg = event.message?.text?.toLowerCase();

      if (!msg) return;

      if (msg === "off") {
        userStatus[senderId] = "off";
        sendMessage(senderId, "✅ Bot বন্ধ করা হয়েছে। আপনি 'on' লিখলে আবার চালু হবে।");
      } 
      else if (msg === "on") {
        userStatus[senderId] = "on";
        sendMessage(senderId, "🔛 Bot আবার চালু হয়েছে! কিছু জিজ্ঞাসা করুন।");
      } 
      else {
        if (userStatus[senderId] === "off") {
          // যদি off থাকে, কিছু না করে return
          return;
        }

        // Bot Active → উত্তর দেওয়া শুরু
        sendMessage(senderId, `আপনি বললেন: "${msg}"`);
        // চাইলে এখানে GPT response দিতে পারেন
      }
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});
