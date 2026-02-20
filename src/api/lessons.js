const API_BASE_URL = 'https://api.wayoftrading.com/aitredding';

// Get all lessons for a course
export const getLessonsByCourse = async (courseId, token) => {
  try {
    const url = `${API_BASE_URL}/courses/${courseId}/lessons`;
    
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
        message: data.message || 'Failed to fetch lessons',
      };
    }
  } catch (error) {
    console.error('Get Lessons API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching lessons',
    };
  }
};

// Get single lesson
export const getLessonById = async (lessonId, token) => {
  try {
    const url = `${API_BASE_URL}/courses/lessons/${lessonId}`;
    
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
        message: data.message || 'Failed to fetch lesson',
      };
    }
  } catch (error) {
    console.error('Get Lesson API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching lesson',
    };
  }
};

// Update lesson
export const updateLesson = async (courseId, lessonId, lessonData, token) => {
  try {
    const url = `${API_BASE_URL}/courses/lessons/${lessonId}/update`;
    
    const formData = new FormData();
    formData.append('title', lessonData.title);
    formData.append('description', lessonData.description);
    formData.append('content', lessonData.content);
    formData.append('content_type', lessonData.content_type);
    formData.append('duration', lessonData.duration || '');
    formData.append('order', lessonData.order);
    
    if (lessonData.media instanceof File) {
      formData.append('media', lessonData.media);
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
      body: formData,
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
        message: data.message || 'Failed to update lesson',
      };
    }
  } catch (error) {
    console.error('Update Lesson API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while updating lesson',
    };
  }
};

// Delete lesson
export const deleteLesson = async (lessonId, token) => {
  try {
    const url = `${API_BASE_URL}/courses/lessons/${lessonId}/delete`;
    
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
        message: data.message || 'Failed to delete lesson',
      };
    }
  } catch (error) {
    console.error('Delete Lesson API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while deleting lesson',
    };
  }
};
