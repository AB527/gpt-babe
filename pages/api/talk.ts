import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from "openai"
import * as fs from 'fs';
import path from 'path'

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

  const updateData = async (logNew:any, cb:any) => {
    // var date = new Date();
    // logNew.timestamp = date.toLocaleString('en-GB', { timeZone: 'UTC' })
    // const jsonDirectory = path.join(process.cwd(), 'json');
    // const logData = JSON.parse(fs.readFileSync(jsonDirectory + '/queryLog.json').toString());
    // logData.push(logNew)
    // const res = fs.writeFileSync(jsonDirectory + '/queryLog.json', JSON.stringify(logData)); 
    cb(logNew);  
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
