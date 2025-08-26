// Simple test for direct API call
export const testDirectAPICall = async () => {
  const url = 'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=dA1kldVp1XUANQmYmkSuucGbpWg6LR3S';
  
  console.log('Testing direct API call...');
  console.log('URL:', url);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Data keys:', Object.keys(data));
      console.log('Events found:', data._embedded?.events?.length || 0);
      return { success: true, data };
    } else {
      console.log('Response error:', response.statusText);
      return { success: false, error: response.statusText };
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
