import React, { useState } from 'react';
import { 
  User, Phone, MapPin, Compass, Bath, Bed, Home, 
  ArrowUp, Trees, Car, Briefcase, Building, 
  ChefHat, Users, Layers, Ruler, Zap, 
  ChevronRight, ChevronLeft, Check, Star, Loader2
} from 'lucide-react';

interface FormData {
  // Personal Details
  name: string;
  phone: string;
  
  // Site Details
  siteDetails: string;
  directions: string;
  plotDepth: string;
  plotWidth: string;
  
  // House Requirements
  bathroomSpace: string;
  masterBedroomSpace: string;
  houseDesignStructure: string;
  liftProvided: boolean;
  gardenProvision: boolean;
  parkingFacility: boolean;
  officeSpace: boolean;
  bedroomBalcony: boolean;
  kitchenType: string;
  kitchenFloor: string;
  guestRoom: boolean;
  masterBedrooms: string;
  floors: string;
}

interface GeneratedFloorPlan {
  success: boolean;
  image_url?: string;
  error?: string;
}

const UserInputForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedFloorPlan | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    siteDetails: '',
    directions: '',
    plotDepth: '',
    plotWidth: '',
    bathroomSpace: '',
    masterBedroomSpace: '',
    houseDesignStructure: '',
    liftProvided: false,
    gardenProvision: false,
    parkingFacility: false,
    officeSpace: false,
    bedroomBalcony: false,
    kitchenType: '',
    kitchenFloor: '',
    guestRoom: false,
    masterBedrooms: '',
    floors: ''
  });

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    setGeneratedPlan(null);

    // Validate plot dimensions before sending request
    const plotDepth = parseInt(formData.plotDepth);
    const plotWidth = parseInt(formData.plotWidth);
    
    if (!formData.plotDepth || !formData.plotWidth || isNaN(plotDepth) || isNaN(plotWidth) || plotDepth <= 0 || plotWidth <= 0) {
      setGeneratedPlan({
        success: false,
        error: 'Please enter valid positive numbers for both plot depth and plot width.'
      });
      setIsGenerating(false);
      return;
    }

    try {
      // Prepare data for the AI floor plan generation
      const floorPlanData = {
        sqft: plotDepth * plotWidth,
        depth: plotDepth,
        width: plotWidth,
        directions: formData.directions,
        bathrooms: formData.bathroomSpace,
        masterbedroom: formData.masterBedroomSpace,
        masterbedrooms: formData.masterBedrooms,
        floors: formData.floors,
        garden: formData.gardenProvision ? 'Yes' : 'No',
        varanda: formData.bedroomBalcony ? 'Yes' : 'No',
        design: formData.houseDesignStructure,
        description: `${formData.name}'s dream home with ${formData.kitchenType} kitchen on ${formData.kitchenFloor} floor. Additional features: ${
          [
            formData.liftProvided && 'Lift/Elevator',
            formData.parkingFacility && 'Parking',
            formData.officeSpace && 'Office Space',
            formData.guestRoom && 'Guest Room'
          ].filter(Boolean).join(', ') || 'Standard features'
        }`
      };

      console.log('Generating floor plan with data:', floorPlanData);

      // Send data to Supabase Edge Function which connects to Flask backend
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';
const response = await fetch(`${backendUrl}/generate-floorplan`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(floorPlanData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setGeneratedPlan(result);

      if (result.success) {
        // Scroll to the generated plan
        setTimeout(() => {
          document.getElementById('generated-plan')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (error) {
      console.error('Error generating floor plan:', error);
      setGeneratedPlan({
        success: false,
        error: 'Failed to connect to the AI service. Please try again later.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8 lg:mb-12">
      <div className="flex items-center justify-between mb-4">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold text-sm lg:text-base transition-all duration-500 ${
              i + 1 <= currentStep 
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg scale-110' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {i + 1 <= currentStep ? <Check className="h-5 w-5 lg:h-6 lg:w-6" /> : i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-12 lg:w-20 h-1 mx-2 lg:mx-4 transition-all duration-500 ${
                i + 1 < currentStep ? 'bg-sky-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-lg lg:text-xl font-semibold text-gray-700">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-sm lg:text-base text-gray-500 mt-1">
          {currentStep === 1 && "Personal & Site Information"}
          {currentStep === 2 && "Space Requirements"}
          {currentStep === 3 && "House Features & Amenities"}
          {currentStep === 4 && "Final Details & Preferences"}
        </p>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
          Let's Get Started
        </h2>
        <p className="text-lg text-gray-600">
          Tell us about yourself and your site details
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <div className="group">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <User className="h-5 w-5 mr-2 text-sky-500" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
            placeholder="Enter your full name"
          />
        </div>

        <div className="group">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <Phone className="h-5 w-5 mr-2 text-sky-500" />
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div className="group md:col-span-2">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <MapPin className="h-5 w-5 mr-2 text-sky-500" />
            Site Details & Address
          </label>
          <textarea
            value={formData.siteDetails}
            onChange={(e) => updateFormData('siteDetails', e.target.value)}
            rows={4}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 resize-none text-base lg:text-lg group-hover:border-gray-300"
            placeholder="Enter complete site address and any specific location details..."
          />
        </div>

        <div className="group md:col-span-2">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <Compass className="h-5 w-5 mr-2 text-sky-500" />
            Site Directions & Orientation
          </label>
          <textarea
            value={formData.directions}
            onChange={(e) => updateFormData('directions', e.target.value)}
            rows={3}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 resize-none text-base lg:text-lg group-hover:border-gray-300"
            placeholder="Describe the site orientation, nearby landmarks, road access..."
          />
        </div>

        <div className="group">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <Ruler className="h-5 w-5 mr-2 text-sky-500" />
            Plot Depth (in feet)
          </label>
          <input
            type="number"
            value={formData.plotDepth}
            onChange={(e) => updateFormData('plotDepth', e.target.value)}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
            placeholder="e.g., 60"
          />
        </div>

        <div className="group">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <Ruler className="h-5 w-5 mr-2 text-sky-500" />
            Plot Width (in feet)
          </label>
          <input
            type="number"
            value={formData.plotWidth}
            onChange={(e) => updateFormData('plotWidth', e.target.value)}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
            placeholder="e.g., 40"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
          Space Requirements
        </h2>
        <p className="text-lg text-gray-600">
          Define your space preferences and room specifications
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <div className="group">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <Bath className="h-5 w-5 mr-2 text-sky-500" />
            Bathroom Space Choice
          </label>
          <select
            value={formData.bathroomSpace}
            onChange={(e) => updateFormData('bathroomSpace', e.target.value)}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
          >
            <option value="">Select bathroom </option>
            <option value="compact">Compact </option>
            <option value="standard">Standard </option>
            <option value="spacious">Spacious </option>
            <option value="luxury">Luxury </option>
          </select>
        </div>

        <div className="group">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <Bed className="h-5 w-5 mr-2 text-sky-500" />
            Master Bedroom Space Choice
          </label>
          <select
            value={formData.masterBedroomSpace}
            onChange={(e) => updateFormData('masterBedroomSpace', e.target.value)}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
          >
            <option value="">Select bedroom </option>
            <option value="cozy">Cozy </option>
            <option value="comfortable">Comfortable </option>
            <option value="spacious">Spacious </option>
            <option value="luxury">Luxury </option>
          </select>
        </div>

        <div className="group">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <Bed className="h-5 w-5 mr-2 text-sky-500" />
            Number of Master Bedrooms
          </label>
          <select
            value={formData.masterBedrooms}
            onChange={(e) => updateFormData('masterBedrooms', e.target.value)}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
          >
            <option value="">Select number</option>
            <option value="1">1 Master Bedroom</option>
            <option value="2">2 Master Bedrooms</option>
            <option value="3">3 Master Bedrooms</option>
            <option value="4">4 Master Bedrooms</option>
          </select>
        </div>

        <div className="group">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <Layers className="h-5 w-5 mr-2 text-sky-500" />
            Number of Floors Required
          </label>
          <select
            value={formData.floors}
            onChange={(e) => updateFormData('floors', e.target.value)}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
          >
            <option value="">Select floors</option>
            <option value="1">Ground Floor Only</option>
            <option value="2">Ground + 1st Floor</option>
            <option value="3">Ground + 2 Floors</option>
            <option value="4">Ground + 3 Floors</option>
          </select>
        </div>

        <div className="group md:col-span-2">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <Home className="h-5 w-5 mr-2 text-sky-500" />
            House Design Structure Preference
          </label>
          <select
            value={formData.houseDesignStructure}
            onChange={(e) => updateFormData('houseDesignStructure', e.target.value)}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
          >
            <option value="">Select design style</option>
            <option value="modern">Modern Contemporary</option>
            <option value="traditional">Traditional Indian</option>
            <option value="minimalist">Minimalist</option>
            <option value="colonial">Colonial Style</option>
            <option value="mediterranean">Mediterranean</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
          House Features & Amenities
        </h2>
        <p className="text-lg text-gray-600">
          Choose the features and amenities for your dream home
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {[
          { key: 'liftProvided', icon: ArrowUp, label: 'Lift/Elevator in House', desc: 'Add elevator for multi-floor access' },
          { key: 'gardenProvision', icon: Trees, label: 'Garden Provision', desc: 'Include garden space in design' },
          { key: 'parkingFacility', icon: Car, label: 'Parking Facility', desc: 'Dedicated parking space' },
          { key: 'officeSpace', icon: Briefcase, label: 'Small Office Space', desc: 'Home office or study room' },
          { key: 'bedroomBalcony', icon: Building, label: 'Balcony in Bedroom', desc: 'Private balcony access' },
          { key: 'guestRoom', icon: Users, label: 'Extra Guest Room', desc: 'Additional room for guests' }
        ].map((feature) => (
          <div key={feature.key} className="group">
            <div 
              onClick={() => updateFormData(feature.key as keyof FormData, !formData[feature.key as keyof FormData])}
              className={`p-6 lg:p-8 border-2 rounded-2xl lg:rounded-3xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                formData[feature.key as keyof FormData] 
                  ? 'border-sky-500 bg-sky-50 shadow-lg' 
                  : 'border-gray-200 hover:border-sky-300 hover:bg-sky-25'
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl mr-4 transition-all duration-300 ${
                  formData[feature.key as keyof FormData] 
                    ? 'bg-sky-500 text-white' 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-sky-100 group-hover:text-sky-600'
                }`}>
                  <feature.icon className="h-6 w-6 lg:h-8 lg:w-8" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg lg:text-xl transition-colors ${
                    formData[feature.key as keyof FormData] ? 'text-sky-700' : 'text-gray-900'
                  }`}>
                    {feature.label}
                  </h3>
                  <p className="text-gray-600 text-sm lg:text-base mt-1">{feature.desc}</p>
                </div>
                <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  formData[feature.key as keyof FormData] 
                    ? 'border-sky-500 bg-sky-500' 
                    : 'border-gray-300'
                }`}>
                  {formData[feature.key as keyof FormData] && (
                    <Check className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="text-center mb-8 lg:mb-12">
        <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
          Final Details & Preferences
        </h2>
        <p className="text-lg text-gray-600">
          Complete your kitchen preferences and finalize your requirements
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <div className="group">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <ChefHat className="h-5 w-5 mr-2 text-sky-500" />
            Type of Kitchen Required
          </label>
          <select
            value={formData.kitchenType}
            onChange={(e) => updateFormData('kitchenType', e.target.value)}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
          >
            <option value="">Select kitchen type</option>
            <option value="open">Open Kitchen</option>
            <option value="closed">Closed Kitchen</option>
            <option value="semi-open">Semi-Open Kitchen</option>
            <option value="island">Island Kitchen</option>
            <option value="galley">Galley Kitchen</option>
            <option value="l-shaped">L-Shaped Kitchen</option>
            <option value="u-shaped">U-Shaped Kitchen</option>
          </select>
        </div>

        <div className="group">
          <label className="flex items-center text-sm lg:text-base font-semibold text-gray-700 mb-3">
            <Layers className="h-5 w-5 mr-2 text-sky-500" />
            Kitchen Floor Location
          </label>
          <select
            value={formData.kitchenFloor}
            onChange={(e) => updateFormData('kitchenFloor', e.target.value)}
            className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 text-base lg:text-lg group-hover:border-gray-300"
          >
            <option value="">Select floor</option>
            <option value="ground">Ground Floor</option>
            <option value="first">First Floor</option>
            <option value="second">Second Floor</option>
            <option value="top">Top Floor</option>
          </select>
        </div>
      </div>

      {/* Generated Floor Plan Display */}
      {(isGenerating || generatedPlan) && (
        <div id="generated-plan" className="mt-12 lg:mt-16">
          <div className="bg-white rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 shadow-xl border border-gray-200">
            {isGenerating && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-full p-6 lg:p-8 w-fit mx-auto mb-6 shadow-lg animate-pulse">
                  <Loader2 className="h-12 w-12 lg:h-16 lg:w-16 text-white animate-spin" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  AI is Generating Your Floor Plan...
                </h3>
                <p className="text-gray-600 text-lg">
                  Please wait while our advanced AI creates your personalized floor plan. This usually takes 30-60 seconds.
                </p>
                <div className="mt-6">
                  <div className="bg-gray-200 rounded-full h-2 w-64 mx-auto">
                    <div className="bg-gradient-to-r from-sky-500 to-sky-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {generatedPlan && !isGenerating && (
              <div className="text-center">
                {generatedPlan.success && generatedPlan.image_url ? (
                  <div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full p-4 lg:p-6 w-fit mx-auto mb-6 shadow-lg">
                      <Check className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                      Your AI-Generated Floor Plan is Ready!
                    </h3>
                    <div className="bg-gray-50 rounded-2xl lg:rounded-3xl p-4 lg:p-6 mb-6">
                      <img 
                        src={generatedPlan.image_url} 
                        alt="Generated Floor Plan" 
                        className="max-w-full h-auto rounded-xl lg:rounded-2xl shadow-lg border border-gray-200 mx-auto"
                        style={{ maxHeight: '600px' }}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105">
                        Download High-Res Plan
                      </button>
                      <button className="border-2 border-sky-500 text-sky-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-sky-50 transition-all duration-300 transform hover:scale-105">
                        Consult Architect
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-full p-4 lg:p-6 w-fit mx-auto mb-6 shadow-lg">
                      <Zap className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      Generation Failed
                    </h3>
                    <p className="text-red-600 text-lg mb-6">
                      {generatedPlan.error || 'Something went wrong while generating your floor plan.'}
                    </p>
                    <button 
                      onClick={handleSubmit}
                      className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-6 lg:p-10 rounded-3xl lg:rounded-[2.5rem] border border-sky-200">
        <div className="text-center">
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-full p-4 lg:p-6 w-fit mx-auto mb-6 shadow-lg">
            <Zap className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
          </div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
            AI Floor Planning Ready!
          </h3>
          <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
            Our advanced AI will analyze all your requirements and generate a personalized floor plan in just 30 seconds. 
            You'll receive a detailed blueprint with 3D visualization based on your specifications.
          </p>
          <div className="flex items-center justify-center mt-6 space-x-2">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="text-gray-600 ml-2">Trusted by 10,000+ families</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 py-8 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl lg:rounded-[3rem] shadow-2xl p-6 lg:p-12">
          {renderProgressBar()}
          
          <div className="transition-all duration-500 ease-in-out">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          <div className="flex justify-between items-center mt-12 lg:mt-16 pt-8 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 lg:px-8 py-3 lg:py-4 rounded-full font-semibold text-base lg:text-lg transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:scale-105'
              }`}
            >
              <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6 mr-2" />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-full font-semibold text-base lg:text-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Next Step
                <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                className={`flex items-center text-white px-8 lg:px-12 py-4 lg:py-5 rounded-full font-bold text-lg lg:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                  isGenerating 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-6 w-6 lg:h-7 lg:w-7 mr-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6 lg:h-7 lg:w-7 mr-3" />
                    Generate AI Floor Plan
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInputForm;