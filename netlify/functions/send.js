exports.handler = async function (event) {

  // ✅ CORS HEADERS (CRITICAL)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // ✅ Handle preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    const data = JSON.parse(event.body);

    const {
      agent_code,
      agent_name,
      customer_name,
      dob,
      occupation,
      plan,
      form_type,
      smoking,
      gender,
      phone,
      remarks
    } = data;

    // ✅ Load agents.json
    const res = await fetch("https://mgasofficial.com/agents.json");
    const agents = await res.json();

    // ✅ FIXED arrow function
    const agent = agents.find(a => a.code === agent_code);

    if (!agent) {
      return {
        statusCode: 404,
        headers,
        body: "Agent not found"
      };
    }

    const formLabel = form_type === "Quick"
      ? "Quick Quotation"
      : "Custom Quotation";

    // ✅ CLEAN Telegram message
    const text = `
📢 *NEW LEAD ALERT*

Hi ${agent.name}, 👋

You have received a new enquiry from your *${formLabel} Form*.

━━━━━━━━━━━━━━━
👤 *Customer Name:* ${customer_name}
🎂 *Date of Birth:* ${dob}
💼 *Occupation:* ${occupation}

📋 *Plan Interested:* ${plan}
🚬 *Smoking Status:* ${smoking}
⚧ *Gender:* ${gender}
📞 *Phone Number:* ${phone}
━━━━━━━━━━━━━━━

📝 *Remarks:*
${remarks || "-"}

⚡ Please follow up with the customer as soon as possible.
`;

    // ✅ Send to Telegram
    await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: agent.chat_id,
        text: text,
        parse_mode: "Markdown"
      })
    });

    return {
      statusCode: 200,
      headers,
      body: "Sent"
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: err.message
    };
  }
};