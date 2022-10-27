import React from 'react'

import { BubbleInfo } from './bubble-info'

export default {
  title: 'chat-bubble / BubbleInfo',
  component: BubbleInfo,
  argTypes: {
    date: {
      control: {
        type: 'date',
      },
    },
  },
}

export function Primary(args: Parameters<typeof BubbleInfo>[0]) {
  return <BubbleInfo {...args} />
}

Primary.storyName = '기본'
Primary.args = {
  unreadCount: 1,
  date: new Date().toString(),
}
