import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/userState';

const Chatting = ({ roomId, nickname, image }) => {
  const { user } = useRecoilValue(userState);
  const inputRef = useRef(null);
  const chatRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [chat, setChat] = useState(null);
  const [chatLoad, setChatLoad] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!socket) {
      setSocket(io(`wss://api.subin.kr/room/${roomId}`));
    } else {
      socket.on(`${roomId}`, (data) => {
        setChat(data);
      });

      if (!chatLoad) {
        const getChats = async () => {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_API_SERVER}/room/${roomId}`,
              { withCredentials: true },
            );
            const result = response.data;
            // 지난대화 내용이 보여져야햠!
            if (result.length > 0) {
              result.forEach((chat) => {
                const chatDiv = document.createElement('div');
                chatDiv.innerText = `${chat.content}`;
                chatDiv.className =
                  user.id === chat.user.id ? 'text-right p-1' : 'text-left p-1';
                chatRef.current.appendChild(chatDiv);
              });
              setChatLoad(true);
            } else {
              chatRef.current.style.overflowY = 'hidden';
            }
          } catch (error) {
            console.log(`error :`, error);
          }
        };
        getChats();
      }
    }
  }, [socket, chatLoad]);

  useEffect(() => {
    if (chat) {
      // 현재 대화내용
      const chatDiv = document.createElement('div');
      chatDiv.innerText = `${chat.content}`;
      chatDiv.className =
        user.id === chat.user.id ? 'text-right p-1' : 'text-left p-1';
      chatRef.current.appendChild(chatDiv);
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = () => {
    socket.emit('send-message', {
      user: {
        id: user.id,
      },
      content: inputValue,
    });
    setChat({
      user: {
        id: user.id,
      },
      content: inputValue,
    });
    setInputValue('');
  };

  return (
    <div>
      <div>
        <div>
          <div>
            <img src={image} alt='' />
          </div>
          <div>{nickname}</div>
        </div>
        <div>
          <div
            ref={chatRef}
            className={cn(
              'text-lg p-3 w-full h-[550px] overflow-y-scroll scrollbar-hide',
              'note:h-[335px]',
            )}
          ></div>
          <input
            placeholder='chat...'
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            className='w-full text-black h-[35px] rounded-md px-2 outline-none border-none'
          />
        </div>
      </div>
    </div>
  );
};

export default Chatting;
