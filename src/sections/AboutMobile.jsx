import avatar from '../assets/images/avatar.png'
import RevealMobile from '../components/mobile/RevealMobile'
import WordStagger from '../components/mobile/WordStagger'
import CountUp from '../components/mobile/CountUp'
import { STATS } from './AboutDesktop'

const TOOLKIT = ['PHP', 'Laravel', 'React', 'Next.js', 'Flutter', 'WordPress', 'MongoDB', 'MySQL', 'OpenAI API']

export default function AboutMobile() {
  return (
    <section id="about" className="about-mobile section">
      <div className="s-inner">
        <span className="s-label">About</span>
        <WordStagger as="h2" className="s-title" text="Asal Fatima" />

        {/* Profile card — glassmorphism, comes first per spec */}
        <RevealMobile className="about-mobile-card">
          <div className="about-mobile-card-head">
            <img
              src={avatar} alt="Asal Fatima" loading="lazy" width={56} height={56}
              className="about-mobile-avatar"
            />
            <div>
              <div className="about-mobile-name">Asal Fatima</div>
              <div className="about-mobile-role">Full Stack Developer</div>
            </div>
          </div>
          <p className="about-mobile-card-sub">
            Open to full-time positions and freelance projects worldwide.
            Laravel · WordPress · Flutter · MERN · AI integrations.
          </p>
          <div className="about-mobile-card-actions">
            <a href="mailto:asalfatima2005@gmail.com" className="btn-g" style={{ fontSize: '.62rem', padding: '10px 18px' }}>
              Send Email
            </a>
            <a href="https://wa.me/923359976976" target="_blank" rel="noopener noreferrer" className="btn-o" style={{ fontSize: '.62rem', padding: '10px 18px' }}>
              WhatsApp
            </a>
          </div>
        </RevealMobile>

        {/* Stats row — count-up on scroll into view */}
        <RevealMobile className="about-mobile-stats" delay={0.1}>
          {STATS.map(s => (
            <div key={s.label} className="about-mobile-stat">
              <div className="about-mobile-stat-num"><CountUp value={s.num} /></div>
              <div className="about-mobile-stat-label">{s.label}</div>
            </div>
          ))}
        </RevealMobile>

        {/* Bio */}
        <RevealMobile className="about-mobile-bio" delay={0.15}>
          <p>
            Self-driven Software Engineer with a diploma from <strong>Aptech Computer Education</strong> and
            professional experience as a PHP/Laravel &amp; WordPress developer at <strong>QF Network</strong> and{' '}
            <strong>Stallyons Technologies</strong>.
          </p>
          <p>
            Comfortable working across the full stack — pixel-perfect frontends, robust Laravel APIs, complex
            WordPress customisations, and Flutter mobile apps shipped to both stores.
          </p>
          <p>
            Currently pursuing a BSc IT at <strong>Virtual University of Pakistan</strong> and completing a Cloud
            Applied Generative AI program at the <strong>Governor Sindh Initiative</strong>.
          </p>
        </RevealMobile>

        {/* Toolkit */}
        <RevealMobile delay={0.2}>
          <div className="about-mobile-toolkit-label">Toolkit</div>
          <div className="about-mobile-toolkit">
            {TOOLKIT.map(t => <span key={t} className="about-skill-tag">{t}</span>)}
          </div>
        </RevealMobile>
      </div>
    </section>
  )
}
