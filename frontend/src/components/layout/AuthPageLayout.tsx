import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface AuthPageLayoutProps {
  title: string;
  subtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  features: string[];
  featureStyle?: 'pills' | 'list';
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthPageLayout({
  title,
  subtitle,
  heroTitle,
  heroSubtitle,
  features,
  featureStyle = 'pills',
  headerExtra,
  children,
  footer,
}: AuthPageLayoutProps) {
  return (
    <div className="flex min-h-screen auth-bg">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-teal-600 via-emerald-500 to-cyan-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white px-12">
          <div className="text-8xl mb-6 animate-float">✦</div>
          <h1 className="text-4xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-lg text-amber-100 mb-8 leading-relaxed">{heroSubtitle}</p>
          {featureStyle === 'pills' ? (
            <div className="flex justify-center gap-4">
              {features.map(f => (
                <div key={f} className="px-3 py-1.5 rounded-full bg-white/10 text-sm backdrop-blur-sm border border-white/20">
                  {f}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 text-left max-w-sm mx-auto">
              {features.map(f => (
                <div key={f} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="lg:hidden text-5xl mb-3 animate-float">✦</div>
            <h2 className="text-2xl font-bold gradient-text">{title}</h2>
            <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
            {headerExtra}
          </CardHeader>
          {children}
          {footer && <CardFooter className="flex flex-col gap-3 px-8 pb-8">{footer}</CardFooter>}
        </Card>
      </div>
    </div>
  );
}
