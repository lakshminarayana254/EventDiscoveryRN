import axios from 'axios';

const testTicketmasterAPI = async () => {
  console.log('Testing Ticketmaster API connection...');
  
  try {
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
      params: {
        apikey: 'dA1kldVp1XUANQmYmkSuucGbpWg6LR3S',
        countryCode: 'US',
        size: 5
      },
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ API connection successful!');
    console.log('Status:', response.status);
    console.log('Data keys:', Object.keys(response.data));
    
    if (response.data._embedded?.events) {
      console.log('Events found:', response.data._embedded.events.length);
    }
    
  } catch (error) {
    console.error('❌ API connection failed:');
    
    if (axios.isAxiosError(error)) {
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      console.log('Response status:', error.response?.status);
      console.log('Response data:', error.response?.data);
      console.log('Request config:', {
        url: error.config?.url,
        params: error.config?.params,
        headers: error.config?.headers
      });
    } else {
      console.log('Non-axios error:', error);
    }
  }
};

// Call the test function
testTicketmasterAPI();

export default testTicketmasterAPI;
