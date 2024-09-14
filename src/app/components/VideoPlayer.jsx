import ReactPlayer from 'react-player/lazy'


const ZendeskMediaPlayer = ( params ) => {
    return (
        <ReactPlayer url={ params.url } 
          controls={true}
          width='100%'
          height='100%'
          style={{ position: 'absolute', top: 0, left: 0 }}
          />
    )
}
  

export default ZendeskMediaPlayer;