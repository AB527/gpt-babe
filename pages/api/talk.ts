// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai"

type Data = {
  text: any
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const configuration = new Configuration({
    apiKey: String(process.env.OPENAI_API_KEY)
  });

  const openai = new OpenAIApi(configuration);

  openai.createCompletion({
    model: String(process.env.OPENAI_MODEL),
    prompt: req.body.text,
    temperature: 0
  }).then(response=>{
    res.status(200).json({ text: response.data.choices[0].text})
  }).catch(error=>{
    console.log(error)
    // res.status(200).json({ text: "Sorry Babe, I am not able to understand anything. Can we talk later ?"})
    res.status(200).json({ text: req.body.text})
  });
}
