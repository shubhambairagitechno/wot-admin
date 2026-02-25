const API_BASE_URL = 'https://api.wayoftrading.com/aitredding';

// Add new glossary term
export const addGlossary = async (glossaryData, token) => {
  try {
    const url = `${API_BASE_URL}/admin/create-TradingGlossary`;
    
    const payload = {
      term: glossaryData.term,
      short_form: glossaryData.short_form,
      category: glossaryData.category,
      description: glossaryData.description,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.status === 1) {
      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to create glossary term',
      };
    }
  } catch (error) {
    console.error('Add Glossary API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while adding glossary term',
    };
  }
};

// Get all glossary terms
export const getAllGlossaries = async (token) => {
  try {
    const url = `${API_BASE_URL}/admin/get-TradingGlossaries`;
    console.log("[v0] API Call - URL:", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });

    console.log("[v0] Response Status:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[v0] HTTP Error Response:", errorData);
      return {
        success: false,
        message: `HTTP Error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    console.log("[v0] Parsed Response Data:", data);

    if (data.status === 1) {
      return {
        success: true,
        data: data.data || [],
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch glossaries',
      };
    }
  } catch (error) {
    console.error('[v0] Get Glossaries API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching glossaries',
    };
  }
};

// Get single glossary term
export const getGlossaryById = async (glossaryId, token) => {
  try {
    const url = `${API_BASE_URL}/admin/get-TradingGlossary/${glossaryId}`;
    
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

// Update glossary term
export const updateGlossary = async (glossaryId, glossaryData, token) => {
  try {
    const url = `${API_BASE_URL}/admin/update-TradingGlossary/${glossaryId}`;
    
    const payload = {
      term: glossaryData.term,
      short_form: glossaryData.short_form,
      category: glossaryData.category,
      description: glossaryData.description,
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.status === 1) {
      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to update glossary term',
      };
    }
  } catch (error) {
    console.error('Update Glossary API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while updating glossary term',
    };
  }
};

// Delete glossary term
export const deleteGlossary = async (glossaryId, token) => {
  try {
    const url = `${API_BASE_URL}/admin/delete-TradingGlossary/${glossaryId}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
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
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to delete glossary term',
      };
    }
  } catch (error) {
    console.error('Delete Glossary API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while deleting glossary term',
    };
  }
};
