export interface Event {
  id: string;
  title: {
    en: string;
    ar: string;
    sv: string;
  };
  description?: {
    en: string;
    ar: string;
    sv: string;
  };
  link?: string;
  background_color: string;
  text_color: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  discount_percentage?: number;
  created_at: string;
  updated_at: string;
}
