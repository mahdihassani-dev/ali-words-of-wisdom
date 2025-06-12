import React, { useState } from 'react';
import { ScrollText, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getRandomHadith, type Hadith } from '@/data/hadiths';

const EidGhadirPage = () => {
  const [currentHadith, setCurrentHadith] = useState<Hadith | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHadith, setShowHadith] = useState(false);

  const fetchHadith = async (): Promise<Hadith> => {
    console.log('Fetching hadith from local collection...');
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    const hadith = getRandomHadith();
    console.log('Selected hadith:', hadith);
    return hadith;
  };

  const handleScrollClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setShowHadith(false);
    
    try {
      const hadith = await fetchHadith();
      setCurrentHadith(hadith);
      setShowHadith(true);
      toast.success('حدیث جدیدی دریافت شد');
    } catch (error) {
      console.error('Error fetching hadith:', error);
      toast.error('دریافت حدیث با مشکل مواجه شد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen manuscript-bg overflow-hidden">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-islamic-gold-700 mb-4 persian-text">
            عید غدیر خم مبارک
          </h1>
          <h2 className="text-2xl md:text-3xl text-manuscript-800 persian-text font-medium">
            حدیثی از بزرگان اسلام
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center space-y-8">
          
          {/* Ancient Scroll/Letter */}
          <div className="relative">
            <button
              onClick={handleScrollClick}
              disabled={isLoading}
              className={`
                ancient-scroll
                p-8 md:p-12 rounded-xl
                transition-all duration-300 ease-in-out
                hover:animate-glow
                focus:outline-none focus:ring-4 focus:ring-islamic-gold-300
                disabled:opacity-50 disabled:cursor-not-allowed
                ${!isLoading ? 'animate-float' : ''}
              `}
            >
              <div className="flex flex-col items-center space-y-4">
                {isLoading ? (
                  <Loader2 className="w-16 h-16 text-islamic-gold-600 animate-spin" />
                ) : (
                  <ScrollText className="w-16 h-16 text-islamic-gold-600" />
                )}
                
                <div className="text-center persian-text">
                  <p className="text-xl md:text-2xl font-semibold text-manuscript-800 mb-2">
                    {isLoading ? 'در حال دریافت حدیث...' : 'برای دریافت حدیث کلیک کنید'}
                  </p>
                  <p className="text-sm md:text-base text-manuscript-600">
                    {isLoading ? 'لطفاً صبر کنید' : 'نامه‌ای از گنجینه حکمت'}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Hadith Display */}
          {showHadith && currentHadith && (
            <div className="w-full max-w-3xl animate-fade-in">
              <div className="islamic-border bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-2xl">
                
                {/* Hadith Text */}
                <div className="mb-6">
                  <blockquote className="text-lg md:text-xl leading-relaxed text-foreground persian-text text-center font-medium">
                    "{currentHadith.text}"
                  </blockquote>
                </div>

                {/* Attribution */}
                <div className="border-t border-islamic-gold-200 pt-4 space-y-2 text-center">
                  <p className="text-base md:text-lg font-semibold text-islamic-gold-700 persian-text">
                    {currentHadith.person}
                  </p>
                  {currentHadith.source && (
                    <p className="text-sm md:text-base text-muted-foreground persian-text">
                      منبع: {currentHadith.source}
                    </p>
                  )}
                </div>

                {/* New Hadith Button */}
                <div className="mt-6 text-center">
                  <button
                    onClick={handleScrollClick}
                    disabled={isLoading}
                    className="inline-flex items-center space-x-2 space-x-reverse px-6 py-3 bg-islamic-gold-500 hover:bg-islamic-gold-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-persian"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span>حدیث جدید</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm md:text-base text-manuscript-600 persian-text opacity-80">
            "من مدینة العلم و علی بابها"
          </p>
          <p className="text-xs md:text-sm text-manuscript-500 persian-text mt-2">
            به مناسبت عید غدیر خم - ولایت حضرت علی علیه‌السلام
          </p>
        </div>
      </div>
    </div>
  );
};

export default EidGhadirPage;
