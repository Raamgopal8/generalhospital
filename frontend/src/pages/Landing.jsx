import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll('.animate-fade-in');
    animatedElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handlePortalAccess = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'admin') {
          navigate('/admin');
          return;
        } else {
          navigate('/dashboard');
          return;
        }
      } catch (err) {
        console.error('Error parsing user from localStorage:', err);
      }
    }
    navigate('/auth');
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen">
      {/* Top Navigation Bar */}
      <header
        className={`sticky top-0 z-50 bg-clinical-white transition-all duration-300 ${
          isScrolled ? 'shadow-md py-3' : 'shadow-sm py-4'
        }`}
      >
        <nav className="flex justify-between items-center w-full px-container-margin max-w-7xl mx-auto">
          <div className="flex items-center gap-12">
            <span
              className="font-display-lg text-headline-md font-bold text-deep-teal cursor-pointer"
              onClick={() => navigate('/')}
            >
              Clear Dental <span className="text-primary">Care</span>
            </span>
            <div className="hidden md:flex gap-8 items-center">
              <a
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                href="#treatments"
                onClick={(e) => scrollToSection(e, 'treatments')}
              >
                Treatments
              </a>
              <a
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                href="#dentists"
                onClick={(e) => scrollToSection(e, 'dentists')}
              >
                Find a Dentist
              </a>
              <a
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                href="#choose-us"
                onClick={(e) => scrollToSection(e, 'choose-us')}
              >
                Why Trust Us
              </a>
              <a
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                href="#network"
                onClick={(e) => scrollToSection(e, 'network')}
              >
                Technology & Locations
              </a>
              <a
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
                href="/auth"
                onClick={handlePortalAccess}
              >
                Patient Portal
              </a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[12px] font-bold text-status-orange uppercase tracking-wider">
                Call Us: 063836 48103
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <button
                className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
                onClick={handlePortalAccess}
                title="Portal Account"
              >
                account_circle
              </button>
              <button
                className="md:hidden material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? 'close' : 'menu'}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-clinical-white border-t border-outline-variant px-6 py-4 flex flex-col gap-4 shadow-lg absolute w-full left-0 animate-fade-in transition-all duration-300">
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary py-2 transition-colors"
              href="#treatments"
              onClick={(e) => scrollToSection(e, 'treatments')}
            >
              Treatments
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary py-2 transition-colors"
              href="#dentists"
              onClick={(e) => scrollToSection(e, 'dentists')}
            >
              Find a Dentist
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary py-2 transition-colors"
              href="#choose-us"
              onClick={(e) => scrollToSection(e, 'choose-us')}
            >
              Why Trust Us
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary py-2 transition-colors"
              href="#network"
              onClick={(e) => scrollToSection(e, 'network')}
            >
              Technology & Locations
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary py-2 transition-colors"
              href="/auth"
              onClick={handlePortalAccess}
            >
              Patient Portal
            </a>
            <div className="border-t border-outline-variant pt-2 mt-1">
              <span className="text-[12px] font-bold text-status-orange uppercase tracking-wider block">
                Call Us: 063836 48103
              </span>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative flex items-center overflow-hidden h-screen bg-surface">
          <div className="absolute inset-0 z-0">
            <img
              alt="Modern Dental Surgery Suite"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ-kJdIcfRTKmwnJaRNzgscKS9GMJbARWxF0OEdiiFwxMKPw5TtnJ3XCFN4E9SpEdnYjybHTYDAzGZCZCZ-inMRmAgxAOEuLxueQ2-n8s6Dhl_SY9lfwciH4byyjBbyS1__1f30wq9Pnnobvq7xcHEk_Ndg44AWU6YLDGpJwePtYBgldlyVtgZsC45LbVshcMtZJsvuN0qPZvheyVNqz7xE4pags5uDDOOI7xaGFKPv1fhq-z17zc0K3wwHKBY39woB5yiHpqJpDI"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-clinical-white via-clinical-white/85 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-container-margin w-full">
            <div className="max-w-2xl">
              <h1 className="font-display-lg text-display-lg text-deep-teal mb-6">
                Precision <span className="text-primary">Dentistry</span> for a Perfect Smile.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 leading-relaxed">
                Clear Dental Care combines world-class oral surgery with cutting-edge digital imaging to provide personalized dental care for life.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handlePortalAccess}
                  className="bg-cta-gold text-deep-teal font-label-md text-label-md px-8 py-4 rounded-lg shadow-md hover:scale-105 transition-transform font-bold"
                >
                  Book Appointment
                </button>
                <button
                  onClick={(e) => scrollToSection(e, 'treatments')}
                  className="bg-clinical-white border-2 border-primary text-primary font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-primary-fixed transition-colors font-bold shadow-sm"
                >
                  View Treatments
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Access Bento Grid */}
        <section className="max-w-7xl mx-auto px-container-margin relative z-20 -mt-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            <div className="md:col-span-2 bg-clinical-white p-8 rounded-xl soft-shadow border border-outline-variant flex flex-col justify-between transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
              <div>
                <h3 className="font-headline-md text-headline-md text-deep-teal mb-2">Smile Portal</h3>
                <p className="text-on-surface-variant mb-6">
                  Manage your appointments, view 3D scans, and coordinate your treatment plan securely.
                </p>
              </div>
              <a
                onClick={handlePortalAccess}
                className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all cursor-pointer"
                href="/auth"
              >
                Login to Portal <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
            <div className="bg-primary text-clinical-white p-8 rounded-xl soft-shadow flex flex-col justify-between group cursor-pointer transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
              <span className="material-symbols-outlined text-4xl mb-4">emergency</span>
              <h3 className="font-headline-md text-headline-md mb-2">Emergency Dental</h3>
              <p className="text-primary-fixed-dim text-sm">Immediate care for acute pain, trauma, and dental emergencies.</p>
            </div>
            <div className="bg-cta-gold p-8 rounded-xl soft-shadow flex flex-col justify-between group cursor-pointer transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
              <span className="material-symbols-outlined text-4xl text-deep-teal mb-4">videocam</span>
              <h3 className="font-headline-md text-headline-md text-deep-teal mb-2">Virtual Consultation</h3>
              <p className="text-deep-teal/70 text-sm">Consult with our specialists for cosmetic and orthodontic assessments.</p>
            </div>
          </div>
        </section>

        {/* Specialized Centers */}
        <section id="treatments" className="py-section-gap max-w-7xl mx-auto px-container-margin pt-24">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-headline-lg text-deep-teal mb-4">Centers of Dental Excellence</h2>
            <div className="w-20 h-1 bg-cta-gold mx-auto rounded-full"></div>
            <p className="mt-6 text-on-surface-variant max-w-2xl mx-auto">
              Specialized clinics led by board-certified dental surgeons using the industry's most advanced diagnostic technology.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Advanced Orthodontics */}
            <div className="group bg-clinical-white p-2 rounded-2xl soft-shadow border border-outline-variant hover:border-primary transition-all overflow-hidden duration-700 animate-fade-in opacity-0 translate-y-10">
              <div className="h-48 rounded-xl overflow-hidden mb-6">
                <img
                  alt="Advanced Orthodontics"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIoyih-vUzWdSrjVASQIwnOo1jMZlF0rji_7-d3_x_E6uq-GkcETL3eXyYVriHq4NHjRx59P-7WAVpuyYUTBreOJZWMzIWGrt0J-FjxBnTX5Mtfuk3xqGFHMYWXhneFLgGJn8rJANGvwFFDFpxx8uceRZZcFNVw6lMGS0GM42a_JH4OS65XdIWIsTSx9ndo-bnqPsjXNdbkgJK2i7hLvGelBnPm30rYSAnylPuEO5SxcGgPxJdGJBbMDZjBm-m52EC7-6znfr4seU"
                />
              </div>
              <div className="px-4 pb-6">
                <h4 className="font-headline-md text-headline-md text-deep-teal mb-2">Advanced Orthodontics</h4>
                <p className="text-on-surface-variant text-sm mb-4">Precision alignment using digital scanning and invisible aligner technology.</p>
                <button className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn More <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
            {/* Implant Dentistry */}
            <div className="group bg-clinical-white p-2 rounded-2xl soft-shadow border border-outline-variant hover:border-primary transition-all overflow-hidden duration-700 animate-fade-in opacity-0 translate-y-10">
              <div className="h-48 rounded-xl overflow-hidden mb-6">
                <img
                  alt="Implant Dentistry"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxu7CjwPHdRKlGLb3tO_7SdOQFUxTMwQ0ooyTqKuvpZW7nCGMO5nS8vmwk8EjW2mLSAr45eojdihgsTSW-h8CG_f3kPx9x1Skoec4Fh_GbN3Epry6LI5obVSmSiUezlrZxlr52tNM_bF75JkCwV1gjqIBjz2nh7PShuffWrCrdUEr0tar8m_WSETjfHGYniV12R8MLslJPtpGyl1vR0wzUToDXujSK8X8L-H6g0qJGUTg1eTfOwq5_0b07CUQPGbIlEzK5pTyKqSc"
                />
              </div>
              <div className="px-4 pb-6">
                <h4 className="font-headline-md text-headline-md text-deep-teal mb-2">Implant Dentistry</h4>
                <p className="text-on-surface-variant text-sm mb-4">State-of-the-art permanent tooth replacement with robotic-assisted precision.</p>
                <button className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn More <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
            {/* Cosmetic Smile Design */}
            <div className="group bg-clinical-white p-2 rounded-2xl soft-shadow border border-outline-variant hover:border-primary transition-all overflow-hidden duration-700 animate-fade-in opacity-0 translate-y-10">
              <div className="h-48 rounded-xl overflow-hidden mb-6">
                <img
                  alt="Cosmetic Smile Design"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWwAWQXr6e7yhrtznbf0orXCZ3A4kcdo8HtDzcwVtPCw9TmXp9dYE64f3PnUNDlQmd3Vykef91uhVYy_8J-wk6HM_B2HXJAl3MxzUFjHdYUUNfNbpn1ddMKHSQ-fDhYptoVNakyzoDEwf_ow_wieu1Kci3WXoTIze_II3krKVmlDzgoDyx6BJBRh9CXBIEsceJGvMjeYXFcJkAJN8fOtly_pzbrqiR7Wb0081OiEJr_5CUqxuYjkKNfSgDwMldHgeeJf4zY7hnewI"
                />
              </div>
              <div className="px-4 pb-6">
                <h4 className="font-headline-md text-headline-md text-deep-teal mb-2">Cosmetic Smile Design</h4>
                <p className="text-on-surface-variant text-sm mb-4">Complete aesthetic transformations powered by 3D diagnostic visualization.</p>
                <button className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  Learn More <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="choose-us" className="bg-deep-teal py-section-gap overflow-hidden relative">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-container-margin grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  alt="Professional Dental Team"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6cArUIq7r6PufCV1CrFKduCQ4_PAImJmDoG21h4j1NruvErJPzRoED3pyuR_oIiOXs7fTHnjR_L4Rlvusz90XBT39c9z-dRmTClGj2_RoRU5NYSiCTr7afOc5l0k9BqhwC9MvXr103FBb9h2qgS0WeZHUYW5MdUY51kzXM71PxY72z46WtXOc7Y14xfUKNqQfG-QAf5InQPLQcXpHRWMw-TKOoAQIwvyrQJvMZBq4jrdVhnnJDXGHL87eLW27nufGHbbB-_uwQ4g"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-cta-gold p-8 rounded-2xl soft-shadow hidden md:block">
                <p className="text-4xl font-bold text-deep-teal mb-1">15k+</p>
                <p className="text-deep-teal font-label-md">Perfect Smiles</p>
              </div>
            </div>
            <div>
              <h2 className="font-display-lg text-headline-lg text-clinical-white mb-8">Why Trust Our Institute?</h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-primary-container p-3 rounded-lg flex-shrink-0">
                    <span className="material-symbols-outlined text-clinical-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                      award_star
                    </span>
                  </div>
                  <div>
                    <h4 className="text-cta-gold font-bold mb-1">Global Dental Standards</h4>
                    <p className="text-clinical-white/80">
                      Maintaining the highest international accreditations for oral surgery and clinical sterilization.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-primary-container p-3 rounded-lg flex-shrink-0">
                    <span className="material-symbols-outlined text-clinical-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                      biotech
                    </span>
                  </div>
                  <div>
                    <h4 className="text-cta-gold font-bold mb-1">Digital Workflow</h4>
                    <p className="text-clinical-white/80">
                      Using intraoral scanners and 3D printing to ensure 100% precision in crowns and implants.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-primary-container p-3 rounded-lg flex-shrink-0">
                    <span className="material-symbols-outlined text-clinical-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </div>
                  <div>
                    <h4 className="text-cta-gold font-bold mb-1">Patient-First Comfort</h4>
                    <p className="text-clinical-white/80">
                      Specialized sedation dentistry and a calming environment to ensure a pain-free experience.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-section-gap max-w-7xl mx-auto px-container-margin pt-24">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-headline-lg text-deep-teal">Voices of Our Patients</h2>
            <p className="text-on-surface-variant mt-4">Restoring confidence, one smile at a time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-clinical-white p-8 rounded-xl soft-shadow border border-outline-variant relative transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
              <span className="material-symbols-outlined text-primary/20 text-6xl absolute top-4 right-8">format_quote</span>
              <p className="text-on-surface-variant italic mb-8 relative z-10">
                "The precision of my dental implants was incredible. I was back to normal in days, and the aesthetic result is indistinguishable from my natural teeth."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">JD</div>
                <div>
                  <p className="font-bold text-deep-teal">Jonathan Davis</p>
                  <p className="text-xs text-on-surface-variant">Implant Patient</p>
                </div>
              </div>
            </div>
            <div className="bg-clinical-white p-8 rounded-xl soft-shadow border border-outline-variant relative transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
              <span className="material-symbols-outlined text-primary/20 text-6xl absolute top-4 right-8">format_quote</span>
              <p className="text-on-surface-variant italic mb-8 relative z-10">
                "My orthodontist at Clear Dental Care used digital tracking for my aligners. I could see my progress every week on the portal. Truly modern care."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold">
                  SR
                </div>
                <div>
                  <p className="font-bold text-deep-teal">Sarah Richardson</p>
                  <p className="text-xs text-on-surface-variant">Orthodontic Patient</p>
                </div>
              </div>
            </div>
            <div className="bg-clinical-white p-8 rounded-xl soft-shadow border border-outline-variant relative transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
              <span className="material-symbols-outlined text-primary/20 text-6xl absolute top-4 right-8">format_quote</span>
              <p className="text-on-surface-variant italic mb-8 relative z-10">
                "I've always had dental anxiety, but the team here made me feel completely at ease. The cosmetic work they did has changed my life."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
                  MK
                </div>
                <div>
                  <p className="font-bold text-deep-teal">Michael K.</p>
                  <p className="text-xs text-on-surface-variant">Cosmetic Patient</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Founders Section */}
        <section id="dentists" className="py-section-gap max-w-7xl mx-auto px-container-margin pt-24">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-headline-lg text-deep-teal mb-4">Our Clinical Leadership</h2>
            <div className="w-20 h-1 bg-cta-gold mx-auto rounded-full"></div>
            <p className="mt-6 text-on-surface-variant max-w-2xl mx-auto">
              The visionaries behind our commitment to revolutionary oral healthcare and surgical precision.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Dr. Michael Chen */}
            <div className="bg-clinical-white rounded-2xl soft-shadow border border-outline-variant overflow-hidden flex flex-col md:flex-row transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
              <div className="md:w-2/5 h-64 md:h-auto">
                <img
                  alt="Dr. Michael Chen"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHv54Yo4991V6p1MrVVpfzWBak8Vc8zpRK7eqiShPF-NuK9AkQk6lrp7BEVLaOyVC_D7M902GDLK_wLX_vV_8Fj1bA9BW6cTInupkir5CFwA-ugM8s6LMDRv2M-CWdidFMdEGYFHE5raW9r_NT2hJVbG2wOnZqHP6hJnSJRLqxaqkAj89SBMVGDWIVc8UxehCKHrozYzkM1nQLMoe_cOGb1TZ0IlOzEwAqGn1rgbgyNBbNIdJoKEPxE7RwO-BaiMzdNKMVHXLtqYY"
                />
              </div>
              <div className="md:w-3/5 p-8 flex flex-col justify-center">
                <h4 className="font-headline-md text-xl text-deep-teal mb-1">Dr. Michael Chen</h4>
                <p className="text-primary font-bold text-sm mb-4">Chief Prosthodontist</p>
                <p className="text-on-surface-variant text-sm leading-relaxed italic">
                  "Restorative dentistry is a marriage of engineering and art. Our goal is to rebuild function while creating an aesthetic result that feels completely natural."
                </p>
              </div>
            </div>
            {/* Dr. Sarah Jenkins */}
            <div className="bg-clinical-white rounded-2xl soft-shadow border border-outline-variant overflow-hidden flex flex-col md:flex-row transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
              <div className="md:w-2/5 h-64 md:h-auto">
                <img
                  alt="Dr. Sarah Jenkins"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPWW3IRUMFk7_njWK9pCbSiJntm5fx1FlUuKEYkaPPjVpZ5Lt4gQRSdhe12pnsLsifTaVFeAkwIENMMQr5_Q-zD8xEQO-uMoIJL7PhsNZGAbVRXFbDB-TaLI7JB0F-OBx1NBMN2vu3w9Ke1gfHL6aUn6Xqmu4qoliDuEwiN1oKu1-hE8_BuqSYyYuAw-KpW7u-Rpueihh5sFVp-eJtBryK2INh1ZLLO_Twntm2VRSR-WWzmp4K3hKYmBlhvBCci_vr8hGJuy9a2A0"
                />
              </div>
              <div className="md:w-3/5 p-8 flex flex-col justify-center">
                <h4 className="font-headline-md text-xl text-deep-teal mb-1">Dr. Sarah Jenkins</h4>
                <p className="text-primary font-bold text-sm mb-4">Chief Orthodontic Surgeon</p>
                <p className="text-on-surface-variant text-sm leading-relaxed italic">
                  "Orthodontics is about more than straight teeth; it's about structural health. By leveraging digital 3D scanning, we provide precision that was impossible a decade ago."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Healthcare Network Section */}
        <section id="network" className="py-section-gap max-w-7xl mx-auto px-container-margin pt-24">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-headline-lg text-deep-teal mb-4">Our Regional Dental Network</h2>
            <div className="w-20 h-1 bg-cta-gold mx-auto rounded-full"></div>
            <p className="mt-6 text-on-surface-variant max-w-2xl mx-auto">
              Access specialized dental care at any of our high-tech metro locations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Location 1 */}
            <div className="bg-clinical-white p-8 rounded-xl soft-shadow border border-outline-variant hover:border-primary transition-all duration-700 animate-fade-in opacity-0 translate-y-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <span className="material-symbols-outlined">location_on</span>
                  <h4 className="font-bold text-deep-teal">Perambalur Hub</h4>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                  No 2, near Thanthai Hans Rover Centenary Arch,
                  <br />
                  opposite to tambu vegetable shop,
                  <br />
                  Sungu Pettai, Perambalur, Tamil Nadu 621212
                </p>
              </div>
              <a className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all cursor-pointer" href="#" onClick={(e) => e.preventDefault()}>
                Get Directions <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </div>
            {/* Location 2 */}
            <div className="bg-clinical-white p-8 rounded-xl soft-shadow border border-outline-variant hover:border-primary transition-all duration-700 animate-fade-in opacity-0 translate-y-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <span className="material-symbols-outlined">medical_services</span>
                  <h4 className="font-bold text-deep-teal">Trichy Branch</h4>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                  12 Clinical Road,
                  <br />
                  Trichy, Tamil Nadu 620002
                </p>
              </div>
              <a className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all cursor-pointer" href="#" onClick={(e) => e.preventDefault()}>
                Get Directions <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </div>
            {/* Location 3 */}
            <div className="bg-clinical-white p-8 rounded-xl soft-shadow border border-outline-variant hover:border-primary transition-all duration-700 animate-fade-in opacity-0 translate-y-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <span className="material-symbols-outlined">health_and_safety</span>
                  <h4 className="font-bold text-deep-teal">Ariyalur Branch</h4>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                  45 Bypass Road,
                  <br />
                  Ariyalur, Tamil Nadu 621704
                </p>
              </div>
              <a className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all cursor-pointer" href="#" onClick={(e) => e.preventDefault()}>
                Get Directions <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (FAQ) Section */}
        <section className="py-section-gap bg-surface-container-low">
          <div className="max-w-4xl mx-auto px-container-margin">
            <div className="text-center mb-16">
              <h2 className="font-display-lg text-headline-lg text-deep-teal mb-4">Common Dental Questions</h2>
              <div className="w-20 h-1 bg-cta-gold mx-auto rounded-full"></div>
            </div>
            <div className="space-y-4">
              <details className="group bg-clinical-white rounded-xl soft-shadow border border-outline-variant transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <span className="font-bold text-deep-teal">Is dental implant surgery painful?</span>
                  <span className="material-symbols-outlined text-cta-gold transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
                  Most patients report that the procedure involves minimal discomfort. We use local anesthesia and offer sedation options for your comfort. Post-operative soreness is typically managed with standard over-the-counter medication.
                </div>
              </details>
              <details className="group bg-clinical-white rounded-xl soft-shadow border border-outline-variant transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <span className="font-bold text-deep-teal">How long do braces or clear aligners take?</span>
                  <span className="material-symbols-outlined text-cta-gold transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
                  Treatment duration varies based on the complexity of the alignment. On average, our digital aligner plans range from 6 to 18 months. We provide a precise timeline during your initial 3D scan consultation.
                </div>
              </details>
              <details className="group bg-clinical-white rounded-xl soft-shadow border border-outline-variant transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <span className="font-bold text-deep-teal">What is professional teeth whitening vs. store-bought?</span>
                  <span className="material-symbols-outlined text-cta-gold transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
                  Our professional whitening uses medical-grade gels and specialized light technology that can brighten teeth by several shades in a single hour, while store-bought options take weeks and often cause increased sensitivity.
                </div>
              </details>
              <details className="group bg-clinical-white rounded-xl soft-shadow border border-outline-variant transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <span className="font-bold text-deep-teal">What insurance providers do you accept for dental?</span>
                  <span className="material-symbols-outlined text-cta-gold transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
                  Clear Dental Care accepts major dental PPO plans including Delta Dental, MetLife, Aetna Dental, and Cigna. We also offer internal financing plans for cosmetic procedures not covered by insurance.
                </div>
              </details>
              <details className="group bg-clinical-white rounded-xl soft-shadow border border-outline-variant transition-all duration-700 animate-fade-in opacity-0 translate-y-10">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                  <span className="font-bold text-deep-teal">How often should I have a digital check-up?</span>
                  <span className="material-symbols-outlined text-cta-gold transition-transform group-open:rotate-180">expand_more</span>
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
                  We recommend a professional cleaning and digital diagnostic scan every six months to detect early signs of decay or periodontal issues before they require major intervention.
                </div>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Area */}
      <section className="py-section-gap bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-container-margin relative z-10">
          <div className="bg-clinical-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row items-center duration-700 animate-fade-in opacity-0 translate-y-10">
            <div className="p-8 md:p-12 flex-1">
              <h3 className="font-display-lg text-headline-md text-deep-teal mb-2">Join Our Wellness Newsletter</h3>
              <p className="text-on-surface-variant text-sm mb-8">
                Subscribe for regular dental health tips, orthodontic updates, and exclusive session invites.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="flex-1 bg-subtle-gray border border-outline-variant rounded-lg px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary text-sm focus:outline-none"
                  placeholder="Your Email Address..."
                  type="email"
                />
                <button className="bg-primary text-clinical-white font-bold px-8 py-4 rounded-lg hover:bg-primary-container transition-all text-sm whitespace-nowrap">
                  Subscribe »
                </button>
              </div>
            </div>
            <div className="hidden lg:block w-1/3 relative self-stretch">
              <img
                alt="Professional Dentist"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHv54Yo4991V6p1MrVVpfzWBak8Vc8zpRK7eqiShPF-NuK9AkQk6lrp7BEVLaOyVC_D7M902GDLK_wLX_vV_8Fj1bA9BW6cTInupkir5CFwA-ugM8s6LMDRv2M-CWdidFMdEGYFHE5raW9r_NT2hJVbG2wOnZqHP6hJnSJRLqxaqkAj89SBMVGDWIVc8UxehCKHrozYzkM1nQLMoe_cOGb1TZ0IlOzEwAqGn1rgbgyNBbNIdJoKEPxE7RwO-BaiMzdNKMVHXLtqYY"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply text-deep-teal"></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-deep-teal text-clinical-white">
        <div className="max-w-7xl mx-auto px-container-margin pb-16 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Column 1: Quick Links */}
            <div className="flex flex-col gap-6">
              <h4 className="font-label-md text-cta-gold uppercase tracking-widest text-xs border-b border-clinical-white/10 pb-4">
                Information
              </h4>
              <nav className="flex flex-col gap-3">
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'dentists')}>
                  About the Institute
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'dentists')}>
                  Our Dentists
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => e.preventDefault()}>
                  Patient Safety
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => e.preventDefault()}>
                  Clinical Gallery
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => e.preventDefault()}>
                  Technology Hub
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => e.preventDefault()}>
                  Insurance & Billing
                </a>
              </nav>
            </div>
            {/* Column 2: Services */}
            <div className="flex flex-col gap-6">
              <h4 className="font-label-md text-cta-gold uppercase tracking-widest text-xs border-b border-clinical-white/10 pb-4">
                Our Services
              </h4>
              <nav className="flex flex-col gap-3">
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  General Cleaning
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  Root Canal Therapy
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  Periodontics
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  Oral Surgery
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  3D Imaging
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  Sedation Dentistry
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  Emergency Care
                </a>
              </nav>
            </div>
            {/* Column 3: Specialties */}
            <div className="flex flex-col gap-6">
              <h4 className="font-label-md text-cta-gold uppercase tracking-widest text-xs border-b border-clinical-white/10 pb-4">
                Specialties
              </h4>
              <nav className="flex flex-col gap-3">
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  Advanced Orthodontics
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  Implant Institute
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  Cosmetic Smile Design
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  Prosthodontics
                </a>
                <a className="text-clinical-white/70 hover:text-cta-gold transition-colors text-sm" href="#" onClick={(e) => scrollToSection(e, 'treatments')}>
                  Pediatric Dentistry
                </a>
              </nav>
            </div>
            {/* Column 4: Contact */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <h4 className="font-label-md text-cta-gold uppercase tracking-widest text-xs border-b border-clinical-white/10 pb-4">
                Reach Us
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <h5 className="text-cta-gold font-bold text-xs uppercase mb-2">Clinic Hours</h5>
                    <div className="flex justify-between text-sm text-clinical-white/80 mb-1">
                      <span>Opening Hours:</span>
                      <span className="font-bold">09:00 AM - 09:00 PM</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase text-clinical-white/50 font-bold mb-1">Email</p>
                      <a className="text-sm font-bold hover:text-cta-gold transition-colors" href="mailto:dental@cleardentalcare.com">
                        dental@cleardentalcare.com
                      </a>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-clinical-white/50 font-bold mb-1">Contact Phone</p>
                      <p className="text-status-orange font-bold text-lg">063836 48103</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="relative w-full h-40 bg-[#001e2b] rounded-xl overflow-hidden border border-clinical-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-status-orange text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      location_on
                    </span>
                    <span className="text-[10px] font-bold tracking-widest uppercase mt-1 text-clinical-white/50 absolute bottom-4">
                      View Locations
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <a
                      aria-label="Facebook"
                      className="w-10 h-10 rounded-full bg-clinical-white/5 flex items-center justify-center hover:bg-cta-gold hover:text-deep-teal transition-all text-cta-gold"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        facebook
                      </span>
                    </a>
                    <a
                      aria-label="X"
                      className="w-10 h-10 rounded-full bg-clinical-white/5 flex items-center justify-center hover:bg-cta-gold hover:text-deep-teal transition-all text-cta-gold"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className="material-symbols-outlined text-lg">close</span>
                    </a>
                    <a
                      aria-label="LinkedIn"
                      className="w-10 h-10 rounded-full bg-clinical-white/5 flex items-center justify-center hover:bg-cta-gold hover:text-deep-teal transition-all text-cta-gold"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        work
                      </span>
                    </a>
                    <a
                      aria-label="Instagram"
                      className="w-10 h-10 rounded-full bg-clinical-white/5 flex items-center justify-center hover:bg-cta-gold hover:text-deep-teal transition-all text-cta-gold"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <span className="material-symbols-outlined text-lg">photo_camera</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-clinical-white/10 py-8 text-center">
          <div className="max-w-7xl mx-auto px-container-margin flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-clinical-white/40 text-xs">© 2024 Clear Dental Care. A specialized care facility.</p>
            <div className="flex gap-6">
              <a className="text-clinical-white/40 hover:text-clinical-white text-xs" href="#" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
              <a className="text-clinical-white/40 hover:text-clinical-white text-xs" href="#" onClick={(e) => e.preventDefault()}>
                Patient Rights
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
