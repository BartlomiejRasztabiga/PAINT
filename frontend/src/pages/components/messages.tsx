import React, { useEffect, useRef, useState } from 'react'
import { Message } from '../../models/messages'
import { convoParticipantsNames, convoParticipantsNicknames } from '../../queries/conversations'
import { useGetMessages, useSendMessage } from '../../queries/messages'
import { useGetUsers } from '../../queries/users'
import { useDashboardStore } from '../../stores/dashboard'

import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ActivityIndicator from './activity-indicator'
import { UserStatus } from '../../models/user'


export default function MessagesView() {
  const currentUser = useDashboardStore(state => state.currentUser)
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [enteredMessage, setEnteredMessage] = useState("")
  const { selectedConversation, setSelectedConversation, reset: dashboardStoreReset } = useDashboardStore()
  const users = useGetUsers();

  const messages = useGetMessages(selectedConversation?.id);
  const sendMessage = useSendMessage();

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let trimmedMessage = enteredMessage.trim();
    if (!trimmedMessage) return;

    sendMessage.mutate({ conversationId: selectedConversation!.id, content: enteredMessage });
    setEnteredMessage("");
  }

  useEffect(() => {
    // scroll to bottom every time messages change
    if (messages.isSuccess) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.data]);

  if (messages.isLoading || users.isLoading) {
    return <div>Loading...</div>
  }

  if (messages.isError || users.isError) {
    const error = messages.error || users.error;
    return <div>Error: {error}</div>
  }

  return (<>
    <div id="dashboard-content" className="flex flex-col flex-1 min-w-[320px] bg-base-100 h-screen max-h-screen rounded-r-2xl">
      {selectedConversation ? (<>
      <div id="dashboard-content__header" className="flex flex-row items-center justify-between p-4 bg-base-200">
        <div id="header-user" className="flex flex-row items-center justify-center">
          <ActivityIndicator userStatus={
            users.data?.find((user) => user.id === selectedConversation.userIds.find((id) => id !== currentUser!.id))?.status || UserStatus.Offline
          } />
          <span className="text-2xl font-bold ml-2">
          {selectedConversation.name ? selectedConversation.name : convoParticipantsNames(selectedConversation.userIds, users.data!, currentUser)}
          </span>
          <span className='text-base-content/50 text-sm font-normal ml-4'>
            {convoParticipantsNicknames(selectedConversation.userIds, users.data!, currentUser)}
          </span>
        </div>
        <div className='flex flex-row items-center gap-2'>
          <button className="btn btn-square btn-sm" onClick={() => setSelectedConversation(null)}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div id="dashboard-content__messages" className="flex flex-col flex-1 py-4 px-2 min-content overflow-auto">
        <div className="flex-1"></div>
        {messages.data!.map((message: Message) => {
          return (
            <div key={message.id} className={`chat ${message.authorId === currentUser?.id ? "chat-end" : "chat-start"}`}>
              <div className={`chat-bubble ${message.authorId === currentUser?.id ? "chat-bubble-primary" : ""}`}>{message.content}</div>
            </div>
          )
        })}
        <div ref={messagesEndRef}></div>
      </div>
      <form onSubmit={handleSendMessage} id="dashboard-send__message" className="flex flex-row flex-2 items-center p-2 bg-base-300">
        <div className="input-group">
          <input type="text" placeholder="Type your message" className="input input-bordered w-full" value={enteredMessage} onChange={event => setEnteredMessage(event.target.value)} />
          <button className="btn btn-secondary gap-2">
            Send
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
      </>) : (
      <div className="flex flex-col flex-1 items-center justify-center">
        <p className="text-2xl font-bold">Select a conversation to start chatting</p>
      </div>
      )}
    </div>
  </>)
}
