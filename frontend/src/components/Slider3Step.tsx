const STEPS = ['light', 'balanced', 'intense'] as const

export type IntensityStep = (typeof STEPS)[number]

const STEP_LABELS: Record<IntensityStep, string> = {
  light: 'Light',
  balanced: 'Balanced',
  intense: 'Intense',
}

interface Slider3StepProps {
  value: IntensityStep
  onChange: (value: IntensityStep) => void
  label?: string
}

export default function Slider3Step({ value, onChange, label }: Slider3StepProps) {
  const index = STEPS.indexOf(value)

  return (
    <div className="slider-3step">
      {label && <span className="slider-3step-label">{label}</span>}
      <input
        type="range"
        min={0}
        max={2}
        step={1}
        value={index}
        onChange={(e) => onChange(STEPS[Number(e.target.value)])}
        aria-valuetext={STEP_LABELS[value]}
      />
      <div className="slider-3step-ticks">
        {STEPS.map((step) => (
          <span key={step} className={step === value ? 'active' : ''}>
            {STEP_LABELS[step]}
          </span>
        ))}
      </div>
    </div>
  )
}
