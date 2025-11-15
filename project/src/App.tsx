import React, { useState, useEffect } from 'react';
import { Home, Eye, Zap, Users, Play, Check, Mail, Phone, MapPin, Menu, X as XIcon, ChevronRight, Building, Sparkles, ArrowUp, Cuboid as Cube, Download, Palette, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import UserInputForm from './components/UserInputForm';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[id]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'form') {
    return <UserInputForm />;
  }

  return (
    <div className="min-h-screen bg-white font-['Poppins'] overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <Building className="h-8 w-8 lg:h-10 lg:w-10 text-sky-500 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-sky-500 transition-colors">
                Rendero
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
              {['home', 'features', 'how-it-works', 'pricing', 'about', 'contact'].map((section) => (
                <button 
                  key={section}
                  onClick={() => scrollToSection(section)} 
                  className="relative text-gray-700 hover:text-sky-500 transition-all duration-300 font-medium capitalize group"
                >
                  {section.replace('-', ' ')}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
              <button className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 lg:px-8 py-2 lg:py-3 rounded-full hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold">
                <span onClick={() => setCurrentPage('form')}>Get Started</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative w-6 h-6">
                <Menu className={`h-6 w-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
                <XIcon className={`h-6 w-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} />
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 py-4 space-y-4">
              {['home', 'features', 'how-it-works', 'pricing', 'about', 'contact'].map((section, index) => (
                <button 
                  key={section}
                  onClick={() => scrollToSection(section)} 
                  className={`block w-full text-left text-gray-700 hover:text-sky-500 transition-all duration-300 font-medium capitalize px-4 py-2 hover:bg-sky-50 rounded-lg transform ${
                    isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {section.replace('-', ' ')}
                </button>
              ))}
              <div className="px-4 pt-2">
                <button 
                  onClick={() => setCurrentPage('form')}
                  className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-full hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 lg:pt-20 min-h-screen flex items-center bg-gradient-to-br from-sky-50 via-white to-sky-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-sky-100 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-sky-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-sky-300 rounded-full opacity-20 animate-ping" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className={`transition-all duration-1000 ease-out ${
              isVisible.home ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="space-y-6 lg:space-y-8">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  <span className="block">Rendero</span>
                  <span className="block bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl text-sky-600 font-semibold">
                  "Visualize your future home today"
                </p>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Your home design assistant powered by AI. Transform your dream home vision into reality with our 2D & 3D visualization and planning platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 pt-4">
                  <button 
                    onClick={() => setCurrentPage('form')}
                    className="group bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 lg:px-10 py-4 lg:py-5 rounded-full text-lg lg:text-xl font-semibold hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    Get Started
                    <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => scrollToSection('demo')} 
                    className="group border-2 border-sky-500 text-sky-500 px-8 lg:px-10 py-4 lg:py-5 rounded-full text-lg lg:text-xl font-semibold hover:bg-sky-50 hover:border-sky-600 hover:text-sky-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Play className="h-5 w-5 lg:h-6 lg:w-6 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ease-out ${
              isVisible.home ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
            }`}>
              <div className="relative">
                <div className="bg-gradient-to-br from-sky-100 to-sky-200 rounded-3xl lg:rounded-[3rem] p-6 lg:p-12 transform rotate-3 shadow-2xl hover:rotate-6 transition-transform duration-500">
                  <div className="bg-white rounded-2xl lg:rounded-[2.5rem] p-6 lg:p-12 transform -rotate-3 hover:-rotate-6 transition-transform duration-500 shadow-lg">
                    <Cube className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 text-sky-500 mx-auto animate-pulse hover:animate-spin transition-all duration-1000" />
                    <p className="text-center text-gray-600 mt-4 lg:mt-6 font-semibold text-sm lg:text-base">
                      3D House Visualization
                    </p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-3 lg:p-4 animate-bounce shadow-lg">
                  <Sparkles className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full p-2 lg:p-3 animate-pulse shadow-lg">
                  <Zap className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 lg:mb-20 transition-all duration-1000 ${
            isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
              Powerful Features
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to design, visualize, and plan your perfect home
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Zap,
                title: "AI-Powered Blueprint Generator",
                description: "Generate professional blueprints instantly using advanced AI algorithms tailored to your requirements.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: Eye,
                title: "3D Interior & Exterior Visualization",
                description: "See your home come to life with photorealistic 3D renderings of both interior and exterior spaces.",
                color: "from-purple-400 to-pink-500"
              },
              {
                icon: Home,
                title: "Furniture & Appliance Placement",
                description: "Virtually place and arrange furniture and appliances to optimize your space layout.",
                color: "from-green-400 to-emerald-500"
              },
              {
                icon: Palette,
                title: "Customization Tools",
                description: "Choose from various themes, styles, and color schemes to match your personal taste.",
                color: "from-blue-400 to-indigo-500"
              },
              {
                icon: Download,
                title: "Downloadable Design Files",
                description: "Get high-quality, construction-ready files that you can share with contractors and builders.",
                color: "from-red-400 to-rose-500"
              },
              {
                icon: Users,
                title: "Expert Architect Consultation",
                description: "Connect with professional architects for personalized guidance and expert advice.",
                color: "from-teal-400 to-cyan-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group bg-white p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-gray-100 hover:border-sky-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${
                  isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`bg-gradient-to-r ${feature.color} rounded-xl lg:rounded-2xl p-4 lg:p-5 w-fit group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mt-6 lg:mt-8 group-hover:text-sky-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mt-3 lg:mt-4 leading-relaxed text-sm lg:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 lg:mb-20 transition-all duration-1000 ${
            isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
              How It Works
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Simple steps to transform your vision into reality
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: "01",
                title: "Sign in / Create account",
                description: "Get started with a simple Sign-in",
                icon: Users
              },
              {
                step: "02",
                title: "Enter plot size and room details",
                description: "Provide your space dimensions and requirements",
                icon: Home
              },
              {
                step: "03",
                title: "Choose design preferences",
                description: "Select your style, theme, and aesthetic preferences",
                icon: Palette
              },
              {
                step: "04",
                title: "AI generates blueprint & 3D model",
                description: "Our AI creates your personalized design instantly",
                icon: Home
              },
              {
                step: "05",
                title: "Customize layout and furniture",
                description: "Fine-tune every detail to match your vision",
                icon: Home
              },
              {
                step: "06",
                title: "Download final plan or consult architect",
                description: "Get your files or connect with our expert architects",
                icon: Download
              }
            ].map((step, index) => (
              <div 
                key={index}
                className={`relative group transition-all duration-700 ${
                  isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-white p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-sky-200">
                  <div className="flex items-center gap-4 lg:gap-6 mb-6">
                    <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xl lg:text-2xl font-bold rounded-full w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {step.step}
                    </div>
                    <div className="bg-sky-100 rounded-xl lg:rounded-2xl p-3 lg:p-4 group-hover:bg-sky-200 transition-colors">
                      <step.icon className="h-6 w-6 lg:h-8 lg:w-8 text-sky-500" />
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 group-hover:text-sky-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                    {step.description}
                  </p>
                </div>
                {index < 5 && (
                  <div className="hidden xl:block absolute top-8 lg:top-12 left-full w-8 lg:w-12 h-0.5 bg-gradient-to-r from-sky-200 to-sky-300 transform translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${
            isVisible.demo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-8 lg:mb-12">
              See It In Action
            </h2>
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-3xl lg:rounded-[3rem] aspect-video flex items-center justify-center group hover:from-gray-200 hover:via-gray-300 hover:to-gray-400 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-3xl transform hover:scale-105">
                <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-full p-6 lg:p-8 group-hover:from-sky-600 group-hover:to-sky-700 transition-all duration-300 group-hover:scale-125 transform shadow-2xl">
                  <Play className="h-12 w-12 lg:h-16 lg:w-16 text-white ml-1" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-3xl lg:rounded-[3rem] pointer-events-none"></div>
            </div>
            <button className="mt-8 lg:mt-12 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 lg:px-12 py-4 lg:py-6 rounded-full text-lg lg:text-xl font-semibold hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <span onClick={() => setCurrentPage('form')}>Try Live Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 lg:mb-20 transition-all duration-1000 ${
            isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Pick the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Basic",
                price: "₹2000",
                description: "Perfect for getting started",
                features: [
                  "100 Credit Points",
                  "AI-generated blueprint",
                  "Basic 2D floor plan Sketch",
                  "Room layout suggestions",
                  "PDF download"
                ],
                popular: false,
                color: "from-blue-500 to-blue-600"
              },
              {
                name: "Standard",
                price: "₹5,000",
                description: "Most popular choice",
                features: [
                  "500 credit points",
                  "Indian styles",
                  "2D visualization",
                  "Interior design suggestions",
                  "Multiple design variations",
                  "Priority support"
                ],
                popular: true,
                color: "from-sky-500 to-sky-600"
              },
              {
                name: "Premium",
                price: "₹10,000",
                description: "Complete design solution",
                features: [
                  "1000 credit points",
                  "Access Indian/Continental Styles",
                  "Expert architect consultation",
                  "3D home tour Visualization",
                  "Material recommendations",
                  "Custom modifications",
                  "Builder's support"
                ],
                popular: false,
                color: "from-purple-500 to-purple-600"
              }
            ].map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 transition-all duration-700 hover:shadow-2xl group ${
                  plan.popular 
                    ? 'ring-4 ring-sky-500/20 shadow-2xl scale-105 lg:scale-110' 
                    : 'hover:scale-105 shadow-lg'
                } ${isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 250}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 lg:-top-6 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 lg:px-8 py-2 lg:py-3 rounded-full text-sm lg:text-base font-bold shadow-lg animate-pulse">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8 lg:mb-10">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6 lg:mb-8 text-sm lg:text-base">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl lg:text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 text-lg">/Plan Package</span>
                  </div>
                </div>

                <ul className="space-y-4 lg:space-y-5 mb-8 lg:mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${featureIndex * 50}ms` }}>
                      <div className="bg-green-100 rounded-full p-1 mr-3 lg:mr-4">
                        <Check className="h-4 w-4 lg:h-5 lg:w-5 text-green-500" />
                      </div>
                      <span className="text-gray-700 text-sm lg:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 lg:py-5 rounded-full font-bold text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 ${
                  plan.popular 
                    ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-xl` 
                    : `border-2 border-sky-500 text-sky-500 hover:bg-sky-50 hover:border-sky-600`
                }`}
                onClick={() => setCurrentPage('form')}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className={`transition-all duration-1000 ${
              isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 lg:mb-10">
                About Rendero
              </h2>
              <div className="space-y-6 lg:space-y-8 text-base lg:text-lg text-gray-700 leading-relaxed">
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Rendero was founded on a simple idea: everyone should be able to see and experience their dream home before it’s built. We recognize that for middle-class families, constructing a home is often the largest investment of a lifetime.
                </p>
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Our team—comprising AI specialists, professional architects, and creative designers—has developed a platform that democratizes home design. By combining advanced artificial intelligence with human expertise, we make professional-grade home planning easy, affordable, and accessible to everyone.
                </p>
                <p className="transform hover:translate-x-2 transition-transform duration-300">
                  Since our inception, we’ve helped thousands of families visualize, plan, and perfect their homes, saving time, reducing costs, and eliminating stress throughout the construction process.
                </p>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible.about ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <div className="bg-gradient-to-br from-sky-50 via-white to-sky-100 p-6 lg:p-10 rounded-3xl lg:rounded-[2.5rem] shadow-xl">
                <div className="grid grid-cols-2 gap-4 lg:gap-8">
                  {[
                    { icon: Zap, title: "AI Developers", desc: "Next-generation technology", color: "from-yellow-400 to-orange-500" },
                    { icon: Building, title: "Architects", desc: "Professional expertise", color: "from-blue-400 to-indigo-500" },
                    { icon: Home, title: "Designers", desc: "Creative vision", color: "from-purple-400 to-pink-500" },
                    { icon: Users, title: "Support Team", desc: "Always here to help", color: "from-green-400 to-emerald-500" }
                  ].map((item, index) => (
                    <div key={index} className="text-center group hover:scale-110 transition-all duration-300">
                      <div className={`bg-gradient-to-r ${item.color} rounded-2xl lg:rounded-3xl p-4 lg:p-6 mb-3 lg:mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <item.icon className="h-8 w-8 lg:h-12 lg:w-12 text-white mx-auto" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm lg:text-base">{item.title}</h3>
                      <p className="text-gray-600 text-xs lg:text-sm mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 lg:mb-20 transition-all duration-1000 ${
            isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
              Get In Touch
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ready to start your dream home journey? We're here to help!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className={`transition-all duration-1000 ${
              isVisible.contact ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-xl">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-10">Send us a message</h3>
                <form className="space-y-6 lg:space-y-8">
                  <div className="group">
                    <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2 lg:mb-3">Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2 lg:mb-3">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm lg:text-base font-semibold text-gray-700 mb-2 lg:mb-3">Message</label>
                    <textarea 
                      rows={6}
                      className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 resize-none text-base lg:text-lg group-hover:border-gray-300"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>
                  <button className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold text-lg lg:text-xl hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-300 ${
              isVisible.contact ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <div className="space-y-6 lg:space-y-8">
                <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8">Contact Information</h3>
                  <div className="space-y-6 lg:space-y-8">
                    {[
                      { icon: Mail, title: "Email", info: "info@Rendero.ai", color: "from-red-400 to-rose-500" },
                      { icon: Phone, title: "Phone", info: "+91 8248722009", color: "from-green-400 to-emerald-500" },
                      { icon: MapPin, title: "Address", info: "India", color: "from-blue-400 to-indigo-500" }
                    ].map((contact, index) => (
                      <div key={index} className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                        <div className={`bg-gradient-to-r ${contact.color} rounded-xl lg:rounded-2xl p-3 lg:p-4 mr-4 lg:mr-6 shadow-lg group-hover:scale-110 transition-transform`}>
                          <contact.icon className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base lg:text-lg">{contact.title}</p>
                          <p className="text-gray-600 text-sm lg:text-base">{contact.info}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 lg:mb-8">Follow Us</h3>
                  <div className="flex space-x-4 lg:space-x-6">
                    {[
                      { icon: Twitter, label: "Twitter", color: "hover:bg-blue-100 hover:text-blue-500" },
                      { icon: Facebook, label: "Facebook", color: "hover:bg-blue-100 hover:text-blue-600" },
                      { icon: Instagram, label: "Instagram", color: "hover:bg-pink-100 hover:text-pink-500" },
                      { icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-100 hover:text-blue-700" },
                      { icon: Mail, label: "Email", color: "hover:bg-red-100 hover:text-red-500" }
                    ].map((social, index) => (
                      <button 
                        key={index}
                        className={`bg-gray-100 p-3 lg:p-4 rounded-xl lg:rounded-2xl ${social.color} transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                      >
                        {React.createElement(social.icon, { className: "h-6 w-6 lg:h-8 lg:w-8" })}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6 lg:mb-8 group">
                <Building className="h-8 w-8 lg:h-10 lg:w-10 text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="text-xl lg:text-2xl font-bold">Rendero</span>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm lg:text-base">
                Transforming dreams into architectural reality with the power of AI and expert craftsmanship.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg lg:text-xl font-bold mb-6 lg:mb-8">Quick Links</h3>
              <ul className="space-y-3 lg:space-y-4">
                {['home', 'features', 'pricing', 'contact'].map((link) => (
                  <li key={link}>
                    <button 
                      onClick={() => scrollToSection(link)} 
                      className="text-gray-300 hover:text-sky-400 transition-all duration-300 capitalize hover:translate-x-1 transform text-sm lg:text-base"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg lg:text-xl font-bold mb-6 lg:mb-8">Services</h3>
              <ul className="space-y-3 lg:space-y-4 text-gray-300 text-sm lg:text-base">
                <li className="hover:text-sky-400 transition-colors cursor-pointer">AI Blueprint Generation</li>
                <li className="hover:text-sky-400 transition-colors cursor-pointer">3D Visualization</li>
                <li className="hover:text-sky-400 transition-colors cursor-pointer">Interior Design</li>
                <li className="hover:text-sky-400 transition-colors cursor-pointer">Architect Consultation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg lg:text-xl font-bold mb-6 lg:mb-8">Support</h3>
              <ul className="space-y-3 lg:space-y-4 text-gray-300 text-sm lg:text-base">
                <li className="hover:text-sky-400 transition-colors cursor-pointer">Documentation</li>
                <li className="hover:text-sky-400 transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-sky-400 transition-colors cursor-pointer">Community</li>
                <li className="hover:text-sky-400 transition-colors cursor-pointer">Contact Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 lg:mt-16 pt-8 lg:pt-12 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm lg:text-base">
              © 2025 Rendero AI. All rights reserved.
            </p>
            <div className="flex space-x-6 lg:space-x-8 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors text-sm lg:text-base">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition-colors text-sm lg:text-base">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 lg:bottom-8 lg:right-8 bg-gradient-to-r from-sky-500 to-sky-600 text-white p-3 lg:p-4 rounded-full shadow-2xl hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-110 z-50 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUp className="h-6 w-6 lg:h-8 lg:w-8" />
      </button>
    </div>
  );
}

export default App;