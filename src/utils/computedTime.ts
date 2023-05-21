import type { MessageItemType } from '@/services/types'
import dayjs from 'dayjs'

// 10 * 60 * 1000;
const intervalTime = 600000
// 计算 50 条，到达 50 重置
let computedCount = 0

const timeToStr = (time: number) => {
  const sendTime = dayjs(time)
  const isToday = dayjs(sendTime).diff(dayjs(dayjs().format('YYYY-MM-DD')), 'day') < 1
  console.log(dayjs(sendTime).diff(dayjs(dayjs().format('YYYY-MM-DD')), 'day'))
  return isToday ? sendTime.format('HH:mm:ss') : sendTime.format('YYYY-MM-DD HH:mm:ss')
}

// 超过20分钟，或者超过50条评论，展示时间
const checkTimeInterval = (cur: MessageItemType, pre: MessageItemType) => {
  pre && console.log(cur.message.id, cur.message.sendTime - pre.message.sendTime)
  if ((pre && cur.message.sendTime - pre.message.sendTime > intervalTime) || computedCount >= 50) {
    computedCount = 0
    return { ...cur, timeBlock: timeToStr(cur.message.sendTime) }
  } else {
    computedCount += 1
    return cur
  }
}

export const computedTimeBlock = (list: MessageItemType[], needFirst = true) => {
  if (!list || list.length === 0) return []
  const temp = needFirst ? [list[0]] : []
  // 跳过第一个
  for (let index = 1, len = list.length; index < len; index++) {
    const item = list[index]
    // 上个聊天记录
    const preItem = list[index - 1]
    // 超过20分钟，或者超过50条评论，展示时间
    temp.push(checkTimeInterval(item, preItem))
  }
  return temp
}
