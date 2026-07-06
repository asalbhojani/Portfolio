import { useIsMobile } from '../hooks/useIsMobile'
import HeroDesktop from './HeroDesktop'
import HeroMobile from './HeroMobile'

export default function Hero({ loaderDone }) {
  const isMobile = useIsMobile()
  return isMobile ? <HeroMobile loaderDone={loaderDone} /> : <HeroDesktop loaderDone={loaderDone} />
}
