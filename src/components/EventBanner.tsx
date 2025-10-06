import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Event } from '@/types/event';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EventBannerProps {
  event: Event;
}

// Helper function to format time remaining
const formatTimeRemaining = (timeRemaining: number): string => {
  if (timeRemaining <= 0) return "Ended";
  
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  }
};

export const EventBanner = ({ event }: EventBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [formattedTime, setFormattedTime] = useState<string>("");
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'ar' | 'sv';
  
  // Calculate time remaining
  useEffect(() => {
    const endDate = new Date(event.end_date).getTime();
    
    const updateTimeRemaining = () => {
      const now = new Date().getTime();
      const remaining = endDate - now;
      setTimeRemaining(remaining > 0 ? remaining : 0);
      setFormattedTime(formatTimeRemaining(remaining));
    };
    
    // Initial calculation
    updateTimeRemaining();
    
    // Update every second
    const interval = setInterval(updateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [event.end_date]);
  
  // Check if user has dismissed this event before
  useEffect(() => {
    const dismissedEvents = localStorage.getItem('dismissedEvents');
    if (dismissedEvents) {
      const parsedEvents = JSON.parse(dismissedEvents);
      if (parsedEvents.includes(event.id)) {
        setIsVisible(false);
      }
    }
  }, [event.id]);

  const handleDismiss = () => {
    setIsVisible(false);
    
    // Save dismissed event to localStorage
    const dismissedEvents = localStorage.getItem('dismissedEvents');
    if (dismissedEvents) {
      const parsedEvents = JSON.parse(dismissedEvents);
      localStorage.setItem('dismissedEvents', JSON.stringify([...parsedEvents, event.id]));
    } else {
      localStorage.setItem('dismissedEvents', JSON.stringify([event.id]));
    }
  };

  const bannerContent = (
    <div 
      className={cn(
        "w-full py-3 px-4 text-center relative",
        "flex items-center justify-center"
      )}
      style={{ 
        backgroundColor: event.background_color || '#000000',
        color: event.text_color || '#ffffff'
      }}
    >
      <div className="flex items-center gap-3">
        {event.discount_percentage && event.discount_percentage > 0 && (
          <Badge variant="outline" className="bg-white/20 border-white/10 px-2.5 py-1 text-sm">
            <Tag className="h-3.5 w-3.5 mr-1.5" />
            {event.discount_percentage}% OFF
          </Badge>
        )}
        
        <p className="text-base font-medium">
          {event.title[currentLanguage]}
          {event.description && (
            <span className="hidden sm:inline ml-2">
              — {event.description[currentLanguage]}
            </span>
          )}
        </p>
        
        {/* Countdown Timer */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 ml-4 bg-white/30 px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-white/20">
                <Clock className="h-4 w-4" />
                <span className="font-mono tracking-tight">{formattedTime}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {timeRemaining <= 0 
                  ? t('event.ended') || 'Event has ended'
                  : `${t('event.endsIn') || 'Ends in'} ${formattedTime}`
                }
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <button 
        onClick={handleDismiss}
        className="absolute right-2 p-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {event.link ? (
            <Link to={event.link}>
              {bannerContent}
            </Link>
          ) : (
            bannerContent
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventBanner;
