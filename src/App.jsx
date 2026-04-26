import React, { useEffect } from 'react';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import ShowcaseScroll from './sections/ShowcaseScroll';
import Marquee from './components/ui/Marquee';
import About from './sections/About';
import Portfolio from './sections/Portfolio';
import Services from './sections/Services';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import CustomCursor from './components/ui/CustomCursor';
import AnimatedBackground from './components/ui/AnimatedBackground';


function App() {
  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-container">
      <CustomCursor />
      <Navigation />
      <main>
        {/* Hero keeps its own dark cinematic look — no animated canvas here */}
        <Hero />
        <ShowcaseScroll />

        {/* All sections below hero get the colorful animated canvas background */}
        <div className="relative" style={{ zIndex: 1 }}>
          <AnimatedBackground />
          <div className="relative" style={{ zIndex: 1 }}>
            <div className="scroll-reveal"><Marquee /></div>
            <div className="scroll-reveal"><About /></div>
            <div className="scroll-reveal"><Portfolio /></div>
            <div className="scroll-reveal"><Services /></div>
            <div className="scroll-reveal"><Contact /></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
