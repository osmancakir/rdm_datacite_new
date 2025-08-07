import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'

const steps = [
  { label: 'Mandatory Fields', path: '/dashboard/add-data' },
  { label: 'Recommended Fields', path: '/dashboard/add-data/recommended-fields' },
  { label: 'Other Fields', path: '/dashboard/add-data/other-fields' },
]

export default function HorizontalStepperNav() {
  const location = useLocation()

  return (
    <div className="w-full flex flex-col items-center py-6">
      <div className="relative flex justify-between items-center w-full max-w-md">
        {/* Connecting line */}
        <div
          className="absolute top-1/4 transform -translate-y-1/2 bg-blue-500 z-0"
          style={{
            left: 'calc(16.666% + 12px)', // after first circle (w-1/3 + half circle width)
            right: 'calc(16.666% + 12px)', // before last circle
            height: '2px',
          }}
        />

        {steps.map((step, index) => {
          const isActive = location.pathname === step.path

          return (
            <Link
              to={step.path}
              key={step.path}
              className="relative z-10 flex flex-col items-center w-1/3"
            >
              {/* Step circle */}
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center transition-all',
                  isActive ? 'bg-red-500 border-4 border-blue-200' : 'bg-white'
                )}
              />
              {/* Label */}
              <div className="text-xs mt-2 text-center">{step.label}</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}