import { apiConfig } from './config';

const API_BASE_URL = 'https://api.wayoftrading.com/aitredding';

// Add new course
export const addCourse = async (courseData, token) => {
  try {
    const url = `${API_BASE_URL}/courses/add`;
    
    // Create FormData for multipart/form-data
    const formData = new FormData();
    
    // Append required string fields
    if (courseData.title) {
      formData.append('title', courseData.title);
    }
    if (courseData.slug) {
      formData.append('slug', courseData.slug);
    }
    if (courseData.description) {
      formData.append('description', courseData.description);
    }
    if (courseData.short_description) {
      formData.append('short_description', courseData.short_description);
    }
    if (courseData.objectives) {
      formData.append('objectives', courseData.objectives);
    }
    if (courseData.level) {
      formData.append('level', courseData.level);
    }
    if (courseData.language) {
      formData.append('language', courseData.language);
    }
    if (courseData.status) {
      formData.append('status', courseData.status);
    }
    
    // Append numeric fields (only if they have values)
    if (courseData.duration_in_minutes !== undefined && courseData.duration_in_minutes !== null && courseData.duration_in_minutes !== '') {
      formData.append('duration_in_minutes', courseData.duration_in_minutes);
    }
    if (courseData.price !== undefined && courseData.price !== null && courseData.price !== '') {
      formData.append('price', courseData.price);
    }
    
    // Append boolean fields only when explicitly set
    if (courseData.is_free !== undefined && courseData.is_free !== null) {
      formData.append('is_free', courseData.is_free ? 1 : 0);
    }
    if (courseData.certificate_available !== undefined && courseData.certificate_available !== null) {
      formData.append('certificate_available', courseData.certificate_available ? 1 : 0);
    }
    if (courseData.is_featured !== undefined && courseData.is_featured !== null) {
      formData.append('is_featured', courseData.is_featured ? 1 : 0);
    }
    
    // Append image if provided
    if (courseData.image instanceof File) {
      formData.append('image', courseData.image);
    }
    
    // Append thumbnail if provided
    if (courseData.thumbnail instanceof File) {
      formData.append('thumbnail', courseData.thumbnail);
    }
    
    // Append intro video if provided
    if (courseData.intro_video instanceof File) {
      formData.append('intro_video', courseData.intro_video);
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
        message: data.message || 'Failed to create course',
      };
    }
  } catch (error) {
    console.error('Add Course API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while adding course',
    };
  }
};

// Get all courses
export const getAllCourses = async (token) => {
  try {
    const url = `${API_BASE_URL}/courses`;
    
    console.log("[v0] Fetching courses from:", url);
    console.log("[v0] Token available:", !!token);
    
    if (!token) {
      return {
        success: false,
        message: 'Authentication token is missing',
      };
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });

    console.log("[v0] Response status:", response.status);
    
    if (!response.ok) {
      console.error("[v0] HTTP Error:", response.status, response.statusText);
      return {
        success: false,
        message: `HTTP Error: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    console.log("[v0] Response data:", data);

    if (data.status === 1) {
      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch courses',
      };
    }
  } catch (error) {
    console.error('[v0] Get Courses API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching courses',
    };
  }
};

// Get single course
export const getCourseById = async (courseId, token) => {
  try {
    const url = `${API_BASE_URL}/courses/${courseId}`;
    
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
        message: data.message || 'Failed to fetch course',
      };
    }
  } catch (error) {
    console.error('Get Course API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching course',
    };
  }
};

// Update course
export const updateCourse = async (courseId, courseData, token) => {
  try {
    const url = `${API_BASE_URL}/courses/admin/course/${courseId}`;
    
    const formData = new FormData();
    
    // Append required string fields
    if (courseData.title) {
      formData.append('title', courseData.title);
    }
    if (courseData.slug) {
      formData.append('slug', courseData.slug);
    }
    if (courseData.description) {
      formData.append('description', courseData.description);
    }
    if (courseData.short_description) {
      formData.append('short_description', courseData.short_description);
    }
    if (courseData.objectives) {
      formData.append('objectives', courseData.objectives);
    }
    if (courseData.level) {
      formData.append('level', courseData.level);
    }
    if (courseData.language) {
      formData.append('language', courseData.language);
    }
    if (courseData.status) {
      formData.append('status', courseData.status);
    }
    
    // Append numeric fields (only if they have values)
    if (courseData.duration_in_minutes !== undefined && courseData.duration_in_minutes !== null && courseData.duration_in_minutes !== '') {
      formData.append('duration_in_minutes', courseData.duration_in_minutes);
    }
    if (courseData.price !== undefined && courseData.price !== null && courseData.price !== '') {
      formData.append('price', courseData.price);
    }
    
    // Append boolean fields only when explicitly set
    if (courseData.is_free !== undefined && courseData.is_free !== null) {
      formData.append('is_free', courseData.is_free ? 1 : 0);
    }
    if (courseData.certificate_available !== undefined && courseData.certificate_available !== null) {
      formData.append('certificate_available', courseData.certificate_available ? 1 : 0);
    }
    if (courseData.is_featured !== undefined && courseData.is_featured !== null) {
      formData.append('is_featured', courseData.is_featured ? 1 : 0);
    }
    
    // Append file fields only when actual files are provided
    if (courseData.image instanceof File) {
      formData.append('image', courseData.image);
    }
    if (courseData.thumbnail instanceof File) {
      formData.append('thumbnail', courseData.thumbnail);
    }
    if (courseData.intro_video instanceof File) {
      formData.append('intro_video', courseData.intro_video);
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
        message: data.message || 'Failed to update course',
      };
    }
  } catch (error) {
    console.error('Update Course API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while updating course',
    };
  }
};

// Delete course
export const deleteCourse = async (courseId, token) => {
  try {
    const url = `${API_BASE_URL}/courses/${courseId}/delete`;
    
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
        message: data.message || 'Failed to delete course',
      };
    }
  } catch (error) {
    console.error('Delete Course API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while deleting course',
    };
  }
};
