import React, { useState, useRef } from 'react';
import { ScrollText, Loader2, RefreshCw, PauseCircle, PlayCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';


interface Hadith {
  person: string;
  text: string;
  source: string;
}

const EidGhadirPage = () => {
  const [currentHadith, setCurrentHadith] = useState<Hadith | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHadith, setShowHadith] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [pausedManually, setPausedManually] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hadithRef = useRef<HTMLDivElement | null>(null); // ✅ برای اسکرول ملایم


  useEffect(() => {
  const audio = audioRef.current;
  if (audio) {
    audio.volume = 0.2; // تنظیم صدا روی ۲۰٪
  }
}, []);

  const fetchHadith = async (): Promise<Hadith> => {
    const response = await fetch('https://ketabbaan.ir/api/hadith/random/');
    if (!response.ok) throw new Error("دریافت حدیث با مشکل مواجه شد");
    const data = await response.json();
    if (data?.text && data?.person) return data;
    throw new Error("داده‌ای دریافت نشد");
  };

  const handleScrollClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setShowHadith(false); // برای fade-out

    try {
      const hadith = await fetchHadith();
      setCurrentHadith(hadith);

      setTimeout(() => setShowHadith(true), 100); // کمی تأخیر برای fade-in

      toast.success('حدیث جدیدی دریافت شد');

      const audio = audioRef.current;
      if (audio && audio.paused && !pausedManually) {
        await audio.play();
        setIsAudioPlaying(true);
      }

      // ✅ اسکرول ملایم فقط به بخش حدیث، نه بالا
      setTimeout(() => {
        hadithRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    } catch (error) {
      console.error('Error fetching hadith:', error);
      toast.error('دریافت حدیث با مشکل مواجه شد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
      setIsAudioPlaying(true);
      setPausedManually(false);
    } else {
      audio.pause();
      setIsAudioPlaying(false);
      setPausedManually(true);
    }
  };

  const handleShare = async () => {
    const shareText = `به مناسبت عید غدیر 🌿
روحت را با حدیثی از مولای متقیان سیراب کن:

"${currentHadith?.text || ''}"

تو هم یک حدیث بخوان :‌
${window.location.href}`;

    const shareData = {
      title: 'حدیثی از حضرت علی علیه‌السلام',
      text: shareText,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('اشتراک‌گذاری انجام شد');
      } catch (error) {
        toast.error('خطا در اشتراک‌گذاری');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('متن در کلیپ‌بورد کپی شد');
      } catch (err) {
        toast.error('کپی متن ناموفق بود');
      }
    }
  };

  return (
    <div className="min-h-screen manuscript-bg overflow-hidden">
      {/* Audio Element */}
      <audio ref={audioRef} src="/audio/ghadir-music.mp3" preload="auto" loop />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-islamic-gold-700 mb-4 persian-text">
            عید غدیر خم مبارک
          </h1>
          <h2 className="text-2xl md:text-3xl text-manuscript-800 persian-text font-medium">
            روحت را با حدیثی از مولای متقیان سیراب کن
          </h2>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center space-y-8">
          {/* Ancient Scroll Button */}
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
            <div
              ref={hadithRef}
              className="w-full max-w-3xl transition-opacity duration-500 ease-in-out opacity-100 animate-fade-in relative"
            >
              {/* Audio Control Button */}
              <div className="absolute top-4 left-4 z-10">
                <button
                  onClick={toggleAudio}
                  className="text-islamic-gold-600 hover:text-islamic-gold-800 transition"
                  title={isAudioPlaying ? 'توقف موسیقی' : 'پخش موسیقی'}
                >
                  {isAudioPlaying ? (
                    <PauseCircle className="w-7 h-7 md:w-8 md:h-8" />
                  ) : (
                    <PlayCircle className="w-7 h-7 md:w-8 md:h-8" />
                  )}
                </button>
              </div>

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

                {/* Share Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-persian"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>در نشر حکمت شریک باش</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm md:text-base text-manuscript-600 persian-text opacity-80">
            "أنا مدینة العلم و علی بابها"
          </p>
          <p className="text-xs md:text-sm text-manuscript-500 persian-text mt-2">
            من شهر علم هستم و علی دروازه آن
          </p>
        </div>
      </div>
    </div>
  );
};

export default EidGhadirPage;
