import React from 'react';

interface FeatureCardProps {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  const cardStyles = "absolute w-full h-full backface-hidden rounded-full bg-brand-primary/75 backdrop-blur-lg border-4 border-brand-text/80 shadow-clay-colored flex flex-col items-center justify-center p-8 text-center";

  const coloredIcon = React.cloneElement(icon, { className: `${icon.props.className || ''} text-brand-text` });

  return (
    <div
      className="group perspective animate-enter opacity-0"
      style={{ animationDelay: delay }}
    >
      <div className="relative w-64 h-64 mx-auto preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
        {/* Card Front */}
        <div className={cardStyles}>
          {coloredIcon}
          <p className="text-2xl font-bold text-brand-text">{title}</p>
        </div>

        {/* Card Back */}
        <div className={`${cardStyles} rotate-y-180`}>
          <p className="text-brand-text leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;