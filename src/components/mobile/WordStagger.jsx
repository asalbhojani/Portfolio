import { motion } from 'framer-motion'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const word = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

// Word-level stagger heading for mobile — letters are too heavy on mobile
// per the spec, so headings split on spaces instead.
export default function WordStagger({ text, className, as = 'h2' }) {
  const Tag = motion[as] ?? motion.h2
  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      {text.split(' ').map((w, i) => (
        <motion.span key={i} variants={word} style={{ display: 'inline-block', marginRight: '0.28em' }}>
          {w}
        </motion.span>
      ))}
    </Tag>
  )
}
