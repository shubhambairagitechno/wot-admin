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

// Get all lessons for a chapter (admin endpoint)
export const getLessonsByChapter = async (chapterId, token) => {
  try {
    const url = `${API_BASE_URL}/courses/admin/chapter/${chapterId}/lessons`;
    
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
        chapterId: data.chapter_id,
        lessons: data.lessons || [],
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch chapter lessons',
      };
    }
  } catch (error) {
    console.error('Get Chapter Lessons API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching chapter lessons',
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
    const url = `${API_BASE_URL}/courses/admin/lesson/${lessonId}`;
    
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

// Add new lesson (legacy endpoint)
export const addLesson = async (courseId, lessonData, token) => {
  try {
    const url = `${API_BASE_URL}/courses/${courseId}/lessons/add`;
    
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
      method: 'POST',
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
        message: data.message || 'Failed to add lesson',
      };
    }
  } catch (error) {
    console.error('Add Lesson API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while adding lesson',
    };
  }
};

// Create lesson with full payload (new admin endpoint)
export const createLesson = async (chapterId, lessonData, token) => {
  try {
    const url = `${API_BASE_URL}/courses/admin/chapter/${chapterId}/lesson`;
    
    const formData = new FormData();
    
    // Required fields
    formData.append('title', lessonData.title);
    formData.append('description', lessonData.description);
    
    // Optional text content
    if (lessonData.content) {
      formData.append('content', lessonData.content);
    }
    
    // Lesson configuration fields
    formData.append('lesson_number', lessonData.lesson_number || 0);
    formData.append('duration', lessonData.duration || '');
    
    // Extended fields from payload
    formData.append('xp_points', lessonData.xp_points || 0);
    formData.append('reward_points', lessonData.reward_points || 0);
    formData.append('is_preview', lessonData.is_preview || false);
    formData.append('is_locked', lessonData.is_locked || false);
    formData.append('quiz_available', lessonData.quiz_available || false);
    formData.append('status', lessonData.status || 'active');
    formData.append('order_number', lessonData.order_number || 0);
    
    // File uploads
    if (lessonData.thumbnail instanceof File) {
      formData.append('thumbnail', lessonData.thumbnail);
    }
    if (lessonData.media instanceof File) {
      formData.append('media', lessonData.media);
    }

    const response = await fetch(url, {
      method: 'POST',
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
        message: data.message || 'Failed to create lesson',
      };
    }
  } catch (error) {
    console.error('Create Lesson API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while creating lesson',
    };
  }
};
