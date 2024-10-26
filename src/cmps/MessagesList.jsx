import { MessagePreview } from './MessagePreview.jsx'

export function MessagesList({ messages, setMessages }) {
  return (
    <div className='messages-list-container'>
      {messages.map((message) => {
        return <MessagePreview message={message} setMessages={setMessages} />
      })}
    </div>
  )
}
