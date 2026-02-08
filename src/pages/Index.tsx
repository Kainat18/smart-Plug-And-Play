import { useState } from "react";
import DemoControlBar, { type DemoMode } from "@/components/DemoControlBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import SiteFooter from "@/components/SiteFooter";


const Index = () => {
  const [demoMode, setDemoMode] = useState<DemoMode>("default");

  return (
    <div className="min-h-screen bg-background">

{/* Demo Controls (fixed) */}
  <DemoControlBar activeMode={demoMode} onModeChange={setDemoMode} />

  {/* Navbar (fixed or sticky) */}
  <Navbar />

  

    {/* Pitch / Explanation Section
    <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          InstantPersonalize
        </h1>

        <p className="text-xl md:text-2xl mb-4 opacity-90">
          AI-Powered Website Personalization for SMBs
        </p>

        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          One script tag. Real-time intent detection. Personalized hero sections in &lt;300ms.
          Built for 30 million Shopify stores that can't afford $50K enterprise tools.
        </p>

        <div className="mt-6 flex gap-4 justify-center text-sm flex-wrap">
          <span className="bg-white/20 px-4 py-2 rounded-full">⚡ Sub-300ms</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">🧠 Bayesian + Thompson</span>
          <span className="bg-white/20 px-4 py-2 rounded-full">📊 Explainable AI</span>
        </div>
      </div>
    </section> */}

    {/* Hero */}
    <HeroSection mode={demoMode} />

    <ProductGrid />


  <SiteFooter />

      {/* Decision Panel */}
      <div
        id="decision-panel"
        className="fixed bottom-6 right-6 w-96 z-50
    bg-white/95 backdrop-blur-xl
    border border-gray-200
    shadow-2xl rounded-xl
    p-5
    text-gray-900"
  
      >
        <div className="font-bold text-gray-800 mb-4">
          🤖 Live Decision Process
        </div>

        <div className="space-y-4">
          <div id="step-context" className="flex items-center bg-gray-200 p-2 rounded">
            <span className="mr-2">1. Query</span>
            <span className="flex-1"></span>
            <span id="step-context-time" className="ml-4 text-sm"></span>
          </div>

          <div id="step-semantic" className="flex items-center bg-gray-200 p-2 rounded">
            <span className="mr-2">2. Intent</span>
            <span className="flex-1"></span>
            <span id="step-semantic-time" className="ml-4 text-sm"></span>
          </div>

          <div id="intent-bars" className="ml-8"></div>

          <div id="step-bayesian" className="flex items-center bg-gray-200 p-2 rounded">
            <span className="mr-2">3. Bayesian</span>
            <span className="flex-1"></span>
            <span id="step-bayesian-time" className="ml-4 text-sm"></span>
          </div>

          <div id="step-thompson" className="flex items-center bg-gray-200 p-2 rounded">
            <span className="mr-2">4. Template</span>
            <span className="flex-1"></span>
            <span id="step-thompson-time" className="ml-4 text-sm"></span>
          </div>

          <div id="step-dom" className="flex items-center bg-gray-200 p-2 rounded">
            <span className="mr-2">5. Applied</span>
            <span className="flex-1"></span>
            <span id="step-dom-time" className="ml-4 text-sm"></span>
          </div>
        </div>

        <button
          id="view-json-btn"
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700"
        >
          View Full Decision JSON
        </button>
      </div>

      {/* JSON Modal */}
      <div
        id="json-modal"
        className="hidden fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg w-3/4 max-w-3xl">
          <div className="bg-gray-700 text-white flex justify-between p-4 rounded-t-lg">
            <span className="font-semibold">Decision JSON</span>
            <button id="json-close-btn" className="hover:text-gray-300">✕</button>
          </div>
          <pre
            id="json-content"
            className="p-4 text-xs bg-gray-900 text-green-400 max-h-[70vh] overflow-auto"
          />
        </div>
      </div>

    </div>
  );
};

export default Index;