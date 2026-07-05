// Shimmering placeholder shown while a lazy section chunk loads, sized to
// roughly match the section it's standing in for so there's no layout jump.
export default function SectionSkeleton({ variant = 'default', minHeight }) {
  if (variant === 'projects') {
    return (
      <div className="section-skeleton" style={{ minHeight: minHeight ?? '100vh' }} aria-hidden="true">
        <div className="s-inner" style={{ width: '100%' }}>
          <div className="skel-block" style={{ width: 120, height: 12, marginBottom: 20 }} />
          <div className="skel-block" style={{ width: '40%', height: 48, marginBottom: 48 }} />
          <div style={{ display: 'flex', gap: 24 }}>
            <div className="skel-block" style={{ flex: 1, height: 320 }} />
            <div className="skel-block" style={{ flex: 1, height: 320 }} />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'terminal') {
    return (
      <div className="section-skeleton" style={{ minHeight: minHeight ?? 520 }} aria-hidden="true">
        <div className="s-inner" style={{ width: '100%' }}>
          <div className="skel-block" style={{ width: 100, height: 12, marginBottom: 20 }} />
          <div className="skel-block" style={{ width: '35%', height: 40, marginBottom: 40 }} />
          <div className="skel-block" style={{ width: '100%', height: 340, borderRadius: 4 }} />
        </div>
      </div>
    )
  }

  if (variant === 'about') {
    return (
      <div className="section-skeleton" style={{ minHeight: minHeight ?? '100vh' }} aria-hidden="true">
        <div className="s-inner" style={{ width: '100%', display: 'flex', gap: 48 }}>
          <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="skel-block" style={{ width: '70%', height: 56 }} />
            <div className="skel-block" style={{ width: '50%', height: 18 }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="skel-block" style={{ width: '100%', height: 20 }} />
            <div className="skel-block" style={{ width: '90%', height: 20 }} />
            <div className="skel-block" style={{ width: '95%', height: 20 }} />
            <div className="skel-block" style={{ width: '100%', height: 160, marginTop: 16 }} />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'skills') {
    return (
      <div className="section-skeleton" style={{ minHeight: minHeight ?? 700 }} aria-hidden="true">
        <div className="s-inner" style={{ width: '100%' }}>
          <div className="skel-block" style={{ width: 100, height: 12, marginBottom: 20 }} />
          <div className="skel-block" style={{ width: '35%', height: 40, marginBottom: 48 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skel-block" style={{ height: 220 }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // default / contact
  return (
    <div className="section-skeleton" style={{ minHeight: minHeight ?? '80vh' }} aria-hidden="true">
      <div className="s-inner" style={{ width: '100%' }}>
        <div className="skel-block" style={{ width: 100, height: 12, marginBottom: 20 }} />
        <div className="skel-block" style={{ width: '55%', height: 64, marginBottom: 48 }} />
        <div style={{ display: 'flex', gap: 48 }}>
          <div className="skel-block" style={{ flex: 1, height: 320 }} />
          <div className="skel-block" style={{ flex: 1, height: 320 }} />
        </div>
      </div>
    </div>
  )
}
