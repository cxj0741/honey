import { isMobile } from './detectDevice'
import WebHome from '@/components/web-pages/Home'
import H5Home from '@/components/h5-pages/Home'


export default async function Home() {
  return isMobile() ? <H5Home /> : <WebHome />
}
