import { isMobile } from '@/app/detectDevice'
import WebChat from '@/components/web-pages/Chat'
import H5Chat from '@/components/h5-pages/Chat'

export default function Chat() {
  return isMobile() ? <H5Chat /> : <WebChat />
}
