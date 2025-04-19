import { MessagePreview } from './MessagePreview.jsx'

export function MessagesList({
  messages,
  setMessages,
  idsToRemove,
  setIdsToRemove,
}) {
  return (
    <div className='list-container messages'>
      {messages.map((message) => {
        return (
          <MessagePreview
            message={message}
            setMessages={setMessages}
            idsToRemove={idsToRemove}
            setIdsToRemove={setIdsToRemove}
            key={message._id}
          />
        )
      })}
    </div>
  )
}
