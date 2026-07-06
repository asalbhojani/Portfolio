import { useIsMobile } from '../hooks/useIsMobile'
import SkillsDesktop from './SkillsDesktop'
import SkillsMobile from './SkillsMobile'

export default function Skills() {
  const isMobile = useIsMobile()
  return isMobile ? <SkillsMobile /> : <SkillsDesktop />
}
