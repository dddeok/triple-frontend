import React from 'react'

import Container from '../elements/container'
import Text from '../elements/text'
import Image from '../elements/image'

export function Author({ name, bio, image }) {
  return (
    <Container centered textAlign="center">
      {image && <Image size="medium" circular src={image.sizes.large.url} />}
      <Text bold size="large" color="gray" alpha={1} margin={{ top: 15 }}>
        {name}
      </Text>
      <Text center size="small" color="gray" alpha={0.5} margin={{ top: 5 }}>
        {bio}
      </Text>
    </Container>
  )
}
