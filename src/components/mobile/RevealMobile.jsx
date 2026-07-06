import { motion } from 'framer-motion'

// Lightweight scroll-in reveal shared by every mobile section — no 3D,
// no letter-splitting, just y:30->0 / opacity:0->1 (Step 5 of the mobile spec).
export default function RevealMobile({ children, className, delay = 0, as = 'div', ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp
      className={className}
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  )
}
