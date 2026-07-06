import { useIsMobile } from '../hooks/useIsMobile'
import ProjectsDesktop from './ProjectsDesktop'
import ProjectsMobile from './ProjectsMobile'

export default function Projects() {
  const isMobile = useIsMobile()
  return isMobile ? <ProjectsMobile /> : <ProjectsDesktop />
}
