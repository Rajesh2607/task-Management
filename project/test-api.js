const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test basic server connection
    const testResponse = await fetch('http://localhost:5001/test');
    console.log('Test endpoint status:', testResponse.status);
    const testData = await testResponse.text();
    console.log('Test response:', testData);
    
    // Test tasks endpoint
    const tasksResponse = await fetch('http://localhost:5001/api/tasks');
    console.log('Tasks endpoint status:', tasksResponse.status);
    const tasksData = await tasksResponse.text();
    console.log('Tasks response:', tasksData);
    
  } catch (error) {
    console.error('API test failed:', error);
  }
};

testApiConnection();
