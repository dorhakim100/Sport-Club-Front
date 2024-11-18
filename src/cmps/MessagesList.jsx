import { MessagePreview } from './MessagePreview.jsx'

export function MessagesList({
  messages,
  setMessages,
  idsToRemove,
  setIdsToRemove,
}) {
  return (
    <div className='messages-list-container'>
      {messages.map((message) => {
        return (
          <MessagePreview
            message={message}
            setMessages={setMessages}
            idsToRemove={idsToRemove}
            setIdsToRemove={setIdsToRemove}
          />
        )
      })}
    </div>
  )
}
