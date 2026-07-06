import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue } from 'framer-motion'
import WordStagger from '../components/mobile/WordStagger'
import RevealMobile from '../components/mobile/RevealMobile'
import { PROJECTS } from '../data/projects'
import { subscribeOrientation } from '../utils/deviceOrientation'

function ProjectCardMobile({ project, onOpen }) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  // Subtle gyroscope tilt — stays at 0 (static) if permission was never
  // granted / the API is unsupported, since the store just never publishes.
  useEffect(() => {
    return subscribeOrientation(({ x, y }) => {
      rotateY.set(Math.max(-6, Math.min(6, x * 6)))
      rotateX.set(Math.max(-6, Math.min(6, -y * 6)))
    })
  }, [rotateX, rotateY])

  return (
    <motion.div
      layoutId={`project-${project.id}`}
      className="project-card-mobile"
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onClick={onOpen}
    >
      <span className="project-card-num">{project.id}</span>
      <span className="s-label">{project.cat}</span>
      <h3 className="project-card-title">{project.title}</h3>
      <div className="project-card-tags">
        {project.tags.slice(0, 3).map(t => <span key={t} className="proj-tag">{t}</span>)}
      </div>
      <p className="project-card-desc-preview">{project.desc}</p>
    </motion.div>
  )
}

export default function ProjectsMobile() {
  const [selected, setSelected] = useState(null)
  const project = PROJECTS.find(p => p.id === selected)

  return (
    <section id="projects" className="projects-mobile section">
      <div className="s-inner">
        <span className="s-label">Portfolio</span>
        <WordStagger as="h2" className="s-title" text="Things I've Built" />
      </div>

      <div className="projects-mobile-stack">
        {PROJECTS.map(p => (
          <RevealMobile key={p.id}>
            <ProjectCardMobile project={p} onOpen={() => setSelected(p.id)} />
          </RevealMobile>
        ))}
      </div>

      <AnimatePresence>
        {project && (
          <motion.div
            className="project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              layoutId={`project-${project.id}`}
              className="project-modal"
              onClick={e => e.stopPropagation()}
            >
              <span className="project-card-num large">{project.id}</span>
              <span className="s-label">{project.cat}</span>
              <h3 className="project-card-title large">{project.title}</h3>
              <div className="project-card-tags">
                {project.tags.map(t => <span key={t} className="proj-tag">{t}</span>)}
              </div>
              <p className="project-modal-desc">{project.desc}</p>
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-o" style={{ width: '100%', justifyContent: 'center' }}>
                  View Project →
                </a>
              )}
              <button className="project-modal-close" onClick={() => setSelected(null)}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
