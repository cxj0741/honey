import { isMobile } from '@/app/detectDevice'
import WebBecomePremium from '@/components/web-pages/BecomePremium'
import H5BecomePremium from '@/components/h5-pages/BecomePremium'

export default function BecomePremium() {
  return isMobile() ? <H5BecomePremium /> : <WebBecomePremium />
}
