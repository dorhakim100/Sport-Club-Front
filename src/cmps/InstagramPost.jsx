import { InstagramEmbed } from 'react-social-media-embed'

export function InstagramPost({ postUrl }) {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center' }}
      className='embed-container hidden'
    >
      <InstagramEmbed url={postUrl} width={328} />
    </div>
  )
}
