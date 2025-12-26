import { Link } from 'react-router-dom';
import { Book, Sparkles, Play, Layers, Share2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent mb-8 shadow-2xl animate-float">
            <Book className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Heading */}
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-6 animate-fade-in">
            <span className="text-foreground">Create </span>
            <span className="text-gradient">Stunning</span>
            <br />
            <span className="text-foreground">Flipbooks</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Transform your images into beautiful, animated flipbooks with realistic page-turning effects. 
            No design skills required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button asChild variant="gradient" size="xl" className="group">
              <Link to="/builder">
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/builder">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Powerful features to bring your flipbooks to life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-elevated rounded-2xl p-8 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Layers className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                Drag & Drop Pages
              </h3>
              <p className="text-muted-foreground">
                Easily upload and reorder your images with intuitive drag-and-drop functionality.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-elevated rounded-2xl p-8 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Play className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                Smooth Animations
              </h3>
              <p className="text-muted-foreground">
                Realistic page-flip effects with adjustable playback speed for the perfect experience.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-elevated rounded-2xl p-8 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Share2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                Share Anywhere
              </h3>
              <p className="text-muted-foreground">
                Generate shareable links to showcase your flipbooks with friends and colleagues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="card-elevated rounded-3xl p-12 md:p-16 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
                Ready to Create Your Flipbook?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of creators who bring their stories to life with animated flipbooks.
              </p>
              <Button asChild variant="gradient" size="xl">
                <Link to="/builder">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Vibhor Pundhir. Create beautiful animated flipbooks.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
