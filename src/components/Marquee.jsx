import { memo } from 'react'

const TAGS = [
  'PHP', 'Laravel', 'React', 'Next.js', 'Flutter', 'Dart', 'WordPress',
  'WooCommerce', 'Node.js', 'Express', 'MySQL', 'MongoDB', 'Firebase',
  'Tailwind CSS', 'Angular', 'Bootstrap', 'Python', 'OpenAI API',
  'ElevenLabs', 'Stripe', 'REST API', 'ASP.NET', 'Google Maps API',
]

function Marquee({ reverse = false }) {
  const items = [...TAGS, ...TAGS]
  return (
    <div className="marquee-wrap">
      <div className={`marquee-track${reverse ? ' marquee-rev' : ''}`}>
        {items.map((t, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot">✦</span>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default memo(Marquee)
