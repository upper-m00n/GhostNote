
import { NextRequest, NextResponse } from 'next/server';

const HF_API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';

export async function POST(req: NextRequest) {
  const prompt =
    "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          return_full_text: false,
        },
      }),
    });

    const data = await response.json();

    const output = data?.[0]?.generated_text || 'No output generated';

    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
  }
}
