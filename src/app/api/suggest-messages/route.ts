import { NextResponse } from 'next/server';

export async function POST() {
  const MODEL = "@cf/meta/llama-2-7b-chat-int8"; // Free tier model
  
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${MODEL}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.Provide only the questions, do not include the inrtoductory lines."

          }],
          max_tokens: 100
        })
      }
    );

    if (!response.ok) throw new Error(await response.text());

    const { result } = await response.json();
    const output = result.response || "Favorite book?||Best trip?||Guilty pleasure food?";

    return NextResponse.json({ output });

  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json(
      { output: "Current hobby?||Bucket list place?||Favorite snack?" },
      { status: 200 }
    );
  }
}