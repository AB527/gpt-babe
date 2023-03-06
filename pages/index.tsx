import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useEffect, useState, useCallback } from "react"
import { Configuration, OpenAIApi } from "openai";

let helperTextt:any;

const Home: NextPage = () => {

  const [chatInput, setChatInput] = useState('');
  const [chatDisabled, setDisabled] = useState(false);
  const [chatData, setChatData] = useState([]);

  const getResponse = async (input:String, callback:any) => {
    fetch("/api/talk", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({text: input})
    }).then(res=>{
      res.json().then(res=>{
        console.log(res)
        callback(res)
      })
    })
  }

  const scrollDown = () => {
    setTimeout(()=>{
      const chatArea = document.getElementById('chat_area')!;
      chatArea.scrollTop = chatArea.scrollHeight;
    }, 300)
  }

  const createChat = (data:any, index:number) => {
    return (
      <div key={index} className='w-full grid justify-items-stretch mb-5'>
        <div className={`shadow-xl p-4 rounded-2xl chatItem ${data.sender==0 ? "bg-black text-white rounded-tr-none mr-2 justify-self-end text-right" : "border rounded-tl-none ml-2 justify-self-start text-left"}`}>
          {data.text}
	      </div>
      </div>
    );
  }

  const onChatQuery = () => {

    var chatTemp = chatData;

    if(chatInput.trim().length == 0)
      return; 

    const newChat = createChat({
      text: chatInput,
      sender: 0
    }, chatTemp.length)
    chatTemp.push(newChat as never);
    window.scrollTo(0, 0);

    setChatData(chatTemp);
    setDisabled(true);
    setChatInput("");
    scrollDown();

    getResponse(chatInput, (data:any)=>{
      var chatTemp = chatData;
      const newChat = createChat({
        text: data.text,
        sender: 1
      }, chatTemp.length)
      chatTemp.push(newChat as never);
      setChatData(chatTemp);
      setDisabled(false);
      scrollDown();
    });

  }  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>GPT Babe </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="flex items-center justify-between flex-wrap bg-white py-2">
        <div className="flex items-center flex-shrink-0">
          <span className="font-bold text-6xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-sky-400">GPT Babe</span>
        </div>
      </header>

      <main className="flex w-full h-full flex-1 flex-col items-center justify-center text-center main">

        <ul className="w-11/12 chatArea mt-1 overflow-auto overflow-y" id="chat_area">
          {chatData}
        </ul>

        <div className="w-full mx-1 px-7">
          <p className={`text-left mb-2 pl-2 text-gray-700 ${!chatDisabled ? "invisible" : "visible"}`}>Babe is typing...</p>
          <div className="flex flex-row items-end justify-start">
            <input className="w-full h-12 flex items-center justify-center placeholder:text-sm overflow-hidden rounded-full shadow-xl border px-4 border-transparent focus:border-transparent focus:ring-0" placeholder="Ask me babe..." id="chat_input"
            onChange={e=> setChatInput(e.target.value)}
            value={chatInput}
            disabled={chatDisabled}></input>
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className='min-md:h-10 w-10 flex flex-none justify-center items-center font-medium ml-2 self-center' 
            onClick={onChatQuery}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"></path>
            </svg>
          </div>
        </div>
      </main>

      <footer className="flex h-12 w-full items-center justify-center border-t">
        Created by<p className='font-bold'>&nbsp;ATHARVA BEDEKAR</p>
      </footer>
    </div>
  )
}

export default Home
