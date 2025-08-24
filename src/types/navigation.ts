export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  EventDetails: {
    event: {
      id: string;
      name: string;
      date: string;
      venue: string;
      city: string;
      category: string;
      url?: string;
      images?: Array<{ url: string; width: number; height: number }>;
      priceRanges?: Array<{ min: number; max: number; currency: string }>;
    };
  };
  Profile: undefined;
};
