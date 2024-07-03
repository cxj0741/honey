import { isMobile } from '@/app/detectDevice'
import WebPersonalCenter from '@/components/web-pages/PersonalCenter'
import H5PersonalCenter from '@/components/h5-pages/PersonalCenter'

export default function PersonalCenter() {
  return isMobile() ? <H5PersonalCenter /> : <WebPersonalCenter />
}
