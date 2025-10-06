import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import EventBanner from './EventBanner';
import { useActiveEvent } from '@/hooks/useEvents';
import { useEffect } from 'react';

// Add activeEvent to window for global access
declare global {
  interface Window {
    activeEvent?: any;
  }
}

const Layout = () => {
  const { data: activeEvent, isLoading: isEventLoading } = useActiveEvent();
  
  // Make activeEvent available globally for cart calculations
  useEffect(() => {
    if (activeEvent) {
      window.activeEvent = activeEvent;
    }
    return () => {
      window.activeEvent = undefined;
    };
  }, [activeEvent]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {!isEventLoading && activeEvent && <EventBanner event={activeEvent} />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Layout;
