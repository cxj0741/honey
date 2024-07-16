import { isMobile } from '@/app/detectDevice'
import WebBecomePremium from '@/components/web-pages/Premium'
import H5BecomePremium from '@/components/h5-pages/Premium'

export default function BecomePremium() {
  return isMobile() ? <H5BecomePremium /> : <WebBecomePremium />
}
