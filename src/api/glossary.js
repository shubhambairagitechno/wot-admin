const API_BASE_URL = 'https://api.wayoftrading.com/aitredding';

// Get all glossary terms
export const getGlossary = async (token, page = 1, limit = 10) => {
  try {
    const url = `${API_BASE_URL}/admin/TradingGlossary?page=${page}&limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });

    const data = await response.json();

    if (data.status === 1) {
      return {
        success: true,
        data: data.data,
        total: data.total,
        page: data.page,
        limit: data.limit,
        count: data.count,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch glossary',
      };
    }
  } catch (error) {
    console.error('Get Glossary API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching glossary',
    };
  }
};
