import React from 'react';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ShareIcon } from './icons/ShareIcon';
import { CodeBracketIcon } from './icons/CodeBracketIcon';
import { PlayIcon } from './icons/PlayIcon';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { GiftIcon } from './icons/GiftIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ImageIcon } from './icons/ImageIcon';
import FeatureCard from './FeatureCard';

interface LandingPageProps {
  onStartCreating: () => void;
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartCreating, onLoginClick }) => {
  const useCases = [
    {
      icon: <ShareIcon className="w-10 h-10 mb-6" />,
      title: 'Social Media Graphics',
      description: 'Design eye-catching text for your posts. Upload custom fonts, and export pixel-perfect images for Instagram, Twitter, and more.',
      delay: '1300ms',
    },
    {
      icon: <CodeBracketIcon className="w-10 h-10 mb-6" />,
      title: 'Website Heroes',
      description: 'Build stunning headlines for your website. Use our powerful real-time editor to style typography without writing a single line of CSS.',
      delay: '1400ms',
    },
    {
      icon: <PlayIcon className="w-10 h-10 mb-6" />,
      title: 'Video Thumbnails',
      description: 'Craft compelling text for your thumbnails. Easily visualize your fonts and export high-quality images to boost click-through rates.',
      delay: '1500ms',
    },
  ];

  const features = [
    {
      icon: <UploadIcon className="w-10 h-10 mb-6" />,
      title: 'Upload Any Font',
      description: 'Bring your creative vision to life. Easily upload your own font files in .ttf or .otf format and start designing instantly.',
      delay: '600ms',
    },
    {
      icon: <DownloadIcon className="w-10 h-10 mb-6" />,
      title: 'Flexible Export Options',
      description: 'Download your final design in high-resolution PNG, JPEG, or scalable SVG formats, ready for any web or print project.',
      delay: '700ms',
    },
    {
      icon: <GiftIcon className="w-10 h-10 mb-6" />,
      title: 'Completely Free',
      description: 'Unleash your creativity without limits. This tool is completely free to use, with no hidden fees or subscriptions.',
      delay: '800ms',
    },
    {
      icon: <ShieldCheckIcon className="w-10 h-10 mb-6" />,
      title: 'Private & Secure',
      description: 'Your privacy matters. Font files are processed locally in your browser and are never uploaded to a server. Your work stays yours.',
      delay: '900ms',
    },
    {
      icon: <ImageIcon className="w-10 h-10 mb-6" />,
      title: 'Custom Backgrounds',
      description: 'Personalize your designs by uploading your own background images. Create the perfect canvas for your typography.',
      delay: '1000ms',
    },
  ];

  return (
    <div className="max-w-6xl w-full flex flex-col items-center gap-12 lg:gap-16">
      <div className="w-full text-center py-8 sm:py-12 px-4">
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-hero uppercase tracking-wider text-text-main animate-enter opacity-0 leading-tight lg:whitespace-nowrap"
          style={{
            animationDelay: '0ms',
            textShadow: '3px 3px 0px #F59E0B, 6px 6px 0px #EF4444'
          }}
        >
          Bring Your Fonts to Life
        </h1>
        <div className="flex flex-col items-center justify-center mt-10">
          <button
            onClick={onLoginClick}
            className="group inline-flex items-center justify-center px-8 py-4 font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary bg-brand-primary text-brand-text border-2 border-brand-primary hover:bg-transparent hover:text-brand-primary focus:ring-brand-primary text-xl animate-enter opacity-0 transform hover:scale-105 hover:shadow-lg"
            style={{ animationDelay: '200ms' }}
          >
            <span>Start Creating</span>
            <ArrowRightIcon className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
          </button>
          <p 
            className="mt-4 text-text-muted text-sm animate-enter opacity-0"
            style={{ animationDelay: '300ms' }}
          >
            Create an account or sign in to access the font styling editor
          </p>
        </div>
      </div>
      
      <div className="w-full text-center">
        <h2
          className="text-4xl font-bold text-text-main mb-8 animate-enter opacity-0"
          style={{ animationDelay: '400ms' }}
        >
          Powerful Features
        </h2>
        <div className="flex flex-wrap lg:flex-nowrap justify-center items-stretch gap-6 p-4">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>

      <div className="w-full text-center">
        <h2
          className="text-4xl font-bold text-text-main mb-8 animate-enter opacity-0"
          style={{ animationDelay: '1100ms' }}
        >
          Creative Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
             <FeatureCard
              key={useCase.title}
              icon={useCase.icon}
              title={useCase.title}
              description={useCase.description}
              delay={useCase.delay}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default LandingPage;