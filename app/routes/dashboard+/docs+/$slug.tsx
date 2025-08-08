// TODO: all docs are compiled at runtime. There is a better way -> do it on build time. 
// Check example repo: https://github.com/nikolailehbrink/portfolio/tree/main

// TODO: Links internal and external and other visual improvements needed

import { useParams } from 'react-router'
import { MDXProvider } from '@mdx-js/react'
import { Suspense, lazy } from 'react'

// Vite will glob all .mdx files in content folder
const mdxModules = import.meta.glob('./content/*.mdx')

// Extract slug → component map
const mdxMap: Record<string, () => Promise<{ default: React.ComponentType }>> = {}

for (const path in mdxModules) {
	const match = path.match(/content\/(.*)\.mdx$/)
	if (match) {
		const slug = match[1]
		mdxMap[slug] = mdxModules[path] as any
	}
}

export default function DocsSlugRoute() {
	const { slug } = useParams() as { slug: string }

	const LazyContent = mdxMap[slug] ? lazy(mdxMap[slug]) : null

	if (!LazyContent) {
		return <div className="p-4 text-red-600">404 – Page not found</div>
	}

	return (
		<div className="prose-sm prose-a:underline max-w-2xl p-6 mx-auto">
			<MDXProvider>
				<Suspense fallback={<p>Loading content…</p>}>
					<LazyContent />
				</Suspense>
			</MDXProvider>
		</div>
	)
}
