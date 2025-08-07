import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'

const steps = [
  { label: 'Mandatory Fields', path: '/add-data' },
  { label: 'Recommended Fields', path: '/add-data/recommended-fields' },
  { label: 'Other Fields', path: '/add-data/other-fields' },
]

export default function HorizontalStepperNav() {
  const location = useLocation()

  return (
    <div className="w-full flex flex-col items-center py-6">
      {/* Step circles with connecting line */}
      <div className="relative flex justify-between items-center w-full max-w-md">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500 z-0" />

        {steps.map((step, index) => {
          const isActive = location.pathname.startsWith(step.path)

          return (
            <Link
              to={step.path}
              key={step.path}
              className="relative z-10 flex flex-col items-center w-1/3"
            >
              {/* Step circle */}
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center',
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
