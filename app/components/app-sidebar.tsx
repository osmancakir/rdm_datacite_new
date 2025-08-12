import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Home, ScrollText, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const staticItems = [
	{ title: 'Home', url: '/dashboard', icon: Home },
]

const docItems = [
	{
		title: 'Best Practice Guide',
		url: '/dashboard/docs/best-practice-guide',
		slug: 'best-practice-guide',
	},
	{
		title: 'XML Schema Definition',
		url: '/dashboard/docs/xml-schema-definition',
		slug: 'xml-schema-definition',
	},
]

const baseItem =
	'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors'
const idleItem =
	'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
const activeItem =
	'bg-sidebar-primary text-sidebar-primary-foreground'

export function AppSidebar() {
	const [isDocsOpen, setIsDocsOpen] = useState(false)

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel asChild>
						<NavLink to="/" className="hover:bg-gray-200 my-2 bg-card border">
							DataCite Metadata Generator 4.3
						</NavLink>
					</SidebarGroupLabel>

					<SidebarGroupContent>
						<SidebarMenu>
							{/* Static items (use asChild + same classes) */}
							{staticItems.map(item => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className={cn(baseItem)}
									>
										<NavLink
											to={item.url}
											end
											className={({ isActive }) =>
												cn(isActive ? activeItem : idleItem)
											}
										>
											<item.icon className="h-4 w-4 shrink-0" />
											<span className="truncate">{item.title}</span>
										</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}

							{/* Docs collapsible (same base classes on trigger button) */}
							<Collapsible open={isDocsOpen} onOpenChange={setIsDocsOpen}>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton
											className={cn(baseItem, idleItem)}
										>
											<ScrollText className="h-4 w-4 shrink-0" />
											<span className="truncate">Documentation</span>
											<ChevronRight
												className={cn(
													'h-4 w-4 ml-auto transition-transform',
													isDocsOpen && 'rotate-90',
												)}
											/>
										</SidebarMenuButton>
									</CollapsibleTrigger>

									<CollapsibleContent>
										{/* Optional: control indent to match your design */}
										<SidebarMenuSub className="pl-6">
											{docItems.map(doc => (
												<SidebarMenuSubItem key={doc.slug}>
													<SidebarMenuSubButton
														asChild
														className={cn(baseItem)}
													>
														<NavLink
															to={doc.url}
															className={({ isActive }) =>
																cn(isActive ? activeItem : idleItem)
															}
														>
															<span className="truncate">{doc.title}</span>
														</NavLink>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
