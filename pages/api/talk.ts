import db from '../../utils/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai"

type Data = {
    text: any
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

  const configuration = new Configuration({
    apiKey: String(process.env.OPENAI_API_KEY)
  });

  const openai = new OpenAIApi(configuration);

  const updateData = async (logNew:any, callback:any) => {
    var date = new Date();
    logNew.timestamp = date.toLocaleString('en-GB', { timeZone: 'UTC' })
    await db.collection('chat_history').add(logNew)
    callback(logNew);  
  } 

  openai.createCompletion({
    model: String(process.env.OPENAI_MODEL),
    prompt: req.body.text,
    temperature: 0
  }).then(response=>{
    updateData({
      query: req.body.text,
      response: response.data.choices[0].text 
    }, (data:any)=>{
      res.status(200).json({ text: data.response})
    })
  }).catch(error=>{
    console.log(error)
    updateData({
      query: req.body.text,
      response: "Sorry Babe, I am not able to understand anything. Can we talk later ?", 
      msg: error.message
    }, (data:any)=>{
      res.status(200).json({ text: data.response})
    })
  });
}