import { Button } from '@/components/ui/button'
import type { Route } from './+types/index'
import { Link } from 'react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  FileText,
  Globe,
  Shield,
  Users,
  Zap,
} from 'lucide-react'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'DataCite Metadata Generator' },
    {
      name: 'description',
      content: 'Welcome DataCite Metadata Generator',
    },
  ]
}

export default function IndexPage() {
  const features = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: 'Schema Compliant',
      description: 'Generate DataCite Metadata Schema v4.3 compliant XML files',
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Best Practices Built-in',
      description: 'Follow LMU and LSC institutional guidelines automatically',
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Easy to Use',
      description: 'Intuitive form-based interface with validation and guidance',
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: 'Multi-language Support',
      description: 'Support for multiple languages with proper xml:lang attributes',
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Research Ready',
      description: 'Designed for researchers, IT staff, and library professionals',
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'Validation Included',
      description: 'Built-in validation ensures your metadata meets standards',
    },
  ]

  return (
    <div className="min-h-screen px-2 ">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur ">
        <div className="container flex h-16 items-center justify-between mx-auto">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-2 text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <div className="font-bold text-foreground">
              DataCite Metadata Generator
            </div>
          </div>
          <Badge variant="secondary">v4.3</Badge>
        </div>
      </header>

      <main className="container py-16 mx-auto">
        <section className="mb-16 text-center">
          <Badge className="mb-4">DataCite Schema v4.3</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Generate Compliant Metadata
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg mb-8">
            Create DataCite XML metadata that follows institutional best practices for
            research data management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/dashboard">Start Creating Metadata</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard/docs/best-practice-guide">View Best Practices Guide</Link>
            </Button>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Why Use Our Generator?
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-secondary p-2 text-secondary-foreground">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16 grid gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">
              What is DataCite Metadata?
            </h2>
            <p className="text-muted-foreground">
              DataCite metadata provides a standardized way to describe research datasets,
              making them discoverable, citable, and reusable.
            </p>
            <p className="text-muted-foreground">
              The metadata includes essential information like titles, creators, publishers,
              subjects, and rights - all formatted according to international standards.
            </p>
            <div className="flex gap-4">
              <div className="rounded-md bg-muted p-4 text-center">
                <div className="text-2xl font-bold text-primary">19</div>
                <div className="text-sm text-muted-foreground">Metadata Fields</div>
              </div>
              <div className="rounded-md bg-muted p-4 text-center">
                <div className="text-2xl font-bold text-primary">v4.3</div>
                <div className="text-sm text-muted-foreground">Schema Version</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Key Benefits</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {[
                'Make your research data discoverable',
                'Enable proper citation of datasets',
                'Ensure compliance with funding requirements',
                'Support reproducible research practices',
                'Meet institutional data management policies',
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="text-center rounded-lg bg-muted p-12">
          <h2 className="text-2xl font-semibold mb-2">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">
            Generate compliant DataCite XML metadata in minutes with our guided interface.
          </p>
          <Button asChild size="lg">
            <Link to="/add-data">Get Started Now</Link>
          </Button>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2025 DataCite Metadata Generator. Built with best practices.
        </div>
      </footer>
    </div>
  )
}
