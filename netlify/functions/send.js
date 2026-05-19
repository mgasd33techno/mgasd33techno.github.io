exports.handler = async function (event) {

  const text = "✅ Test message 2 from Netlify bot!";

  await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: 344886216,
      text: text
    })
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};