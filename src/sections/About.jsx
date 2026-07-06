import { useIsMobile } from '../hooks/useIsMobile'
import AboutDesktop from './AboutDesktop'
import AboutMobile from './AboutMobile'

export default function About() {
  const isMobile = useIsMobile()
  return isMobile ? <AboutMobile /> : <AboutDesktop />
}
