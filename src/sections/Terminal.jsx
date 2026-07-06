import { useIsMobile } from '../hooks/useIsMobile'
import TerminalDesktop from './TerminalDesktop'
import TerminalMobile from './TerminalMobile'

export default function Terminal() {
  const isMobile = useIsMobile()
  return isMobile ? <TerminalMobile /> : <TerminalDesktop />
}
