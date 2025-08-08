import { Link, useLocation, useParams } from 'react-router'
import { cn } from '@/lib/utils'

export default function HorizontalStepperNav() {
	const location = useLocation()
	const { id } = useParams<{ id: string }>()

	if (!id) return null

	const steps = [
		{ label: 'Mandatory Fields', path: `/dashboard/add-data/${id}/mandatory-fields` },
		{ label: 'Recommended Fields', path: `/dashboard/add-data/${id}/recommended-fields` },
		{ label: 'Other Fields', path: `/dashboard/add-data/${id}/other-fields` },
	]

	return (
		<div className="w-full flex flex-col items-center py-6">
			<div className="relative flex justify-between items-center w-full max-w-md">
				{/* Connecting line */}
				<div
					className="absolute top-1/4 transform -translate-y-1/2 bg-border z-0"
					style={{
						left: 'calc(16.666% + 12px)',
						right: 'calc(16.666% + 12px)',
						height: '2px',
					}}
				/>

				{steps.map((step) => {
					const isActive = location.pathname === step.path

					return (
						<Link
							to={step.path}
							key={step.path}
							className="relative z-10 flex flex-col items-center w-1/3"
						>
							<div
								className={cn(
									'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
									isActive
										? 'bg-primary border-4 border-ring'
										: 'bg-background border-muted-foreground'
								)}
							/>
							<div
								className={cn(
									'text-xs mt-2 text-center',
									isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
								)}
							>
								{step.label}
							</div>
						</Link>
					)
				})}
			</div>
		</div>
	)
}
