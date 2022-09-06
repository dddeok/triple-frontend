import styled from 'styled-components'
import { forwardRef } from 'react'
import { mergeRefs } from 'react-merge-refs'

import Sources from './sources'
import Controls from './controls'
import { useVideoState } from './context'
import { useVideoRef } from './use-video-ref'

const Pending = styled.div`
  position: absolute;
  border: none;
  background: none;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  top: 50%;
  left: 50%;
  background-image: url(https://assets.triple.guide/images/img-video-loading@3x.png);
  background-size: cover;
  animation: rotation 2s infinite linear;

  @keyframes rotation {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(359deg);
    }
  }
`

const Video = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;

  overflow: hidden;
  object-fit: cover;
`

interface Props {
  src?: string
  srcType?: string
  cloudinaryBucket?: string
  cloudinaryId?: string
  autoPlay?: boolean
  muted?: boolean
  showNativeControls?: boolean
  hideControls?: boolean
  initialControlHidden?: boolean
}

const VideoElement = forwardRef<HTMLVideoElement, Props>(
  (
    {
      src,
      srcType,
      cloudinaryBucket,
      cloudinaryId,
      autoPlay,
      muted,
      showNativeControls,
      hideControls,
      initialControlHidden,
    },
    ref,
  ) => {
    const { frame, fallbackImageUrl } = useVideoState()
    const { videoRef, pending } = useVideoRef()

    return (
      <>
        <Video
          loop
          playsInline
          preload="metadata"
          controls={!!showNativeControls}
          autoPlay={autoPlay}
          muted={muted ?? autoPlay}
          ref={mergeRefs([videoRef, ref])}
          poster={fallbackImageUrl}
        >
          <Sources
            src={src}
            srcType={srcType}
            cloudinaryBucket={cloudinaryBucket}
            cloudinaryId={cloudinaryId}
            frame={frame}
          />
        </Video>
        {pending && <Pending />}
        {videoRef && !hideControls && (
          <Controls
            videoRef={videoRef}
            initialHidden={initialControlHidden ?? autoPlay}
            initialMuted={muted ?? autoPlay}
          />
        )}
      </>
    )
  },
)

VideoElement.displayName = 'VideoElement'

export default VideoElement
