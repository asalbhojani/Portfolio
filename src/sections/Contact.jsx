import { useIsMobile } from '../hooks/useIsMobile'
import ContactDesktop from './ContactDesktop'
import ContactMobile from './ContactMobile'

export default function Contact() {
  const isMobile = useIsMobile()
  return isMobile ? <ContactMobile /> : <ContactDesktop />
}
