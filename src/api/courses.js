import { apiConfig } from './config';

const API_BASE_URL = 'https://api.wayoftrading.com/aitredding';

// Add new course
export const addCourse = async (courseData, token) => {
  try {
    const url = `${API_BASE_URL}/courses/admin/course`;
    
    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('slug', courseData.slug);
    formData.append('description', courseData.description);
    formData.append('short_description', courseData.short_description || '');
    formData.append('objectives', courseData.objectives);
    formData.append('duration_in_minutes', courseData.duration_in_minutes);
    formData.append('level', courseData.level);
    formData.append('language', courseData.language || 'English');
    formData.append('price', courseData.price || 0);
    formData.append('is_free', courseData.is_free || false);
    formData.append('is_featured', courseData.is_featured || false);
    formData.append('status', courseData.status || 'draft');
    formData.append('certificate_available', courseData.certificate_available || false);
    
    // Append files if provided
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
    const url = `${API_BASE_URL}/courses/admin/courses`;
    
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
        message: data.message || 'Failed to fetch courses',
      };
    }
  } catch (error) {
    console.error('Get Courses API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching courses',
    };
  }
};

// Get single course
export const getCourseById = async (courseId, token) => {
  try {
    const url = `${API_BASE_URL}/courses/admin/course/${courseId}`;
    
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
    formData.append('title', courseData.title);
    formData.append('slug', courseData.slug);
    formData.append('description', courseData.description);
    formData.append('short_description', courseData.short_description || '');
    formData.append('objectives', courseData.objectives);
    formData.append('duration_in_minutes', courseData.duration_in_minutes);
    formData.append('level', courseData.level);
    formData.append('language', courseData.language || 'English');
    formData.append('price', courseData.price || 0);
    formData.append('is_free', String(courseData.is_free === true || courseData.is_free === 'true'));
    formData.append('is_featured', String(courseData.is_featured === true || courseData.is_featured === 'true'));
    formData.append('status', courseData.status || 'draft');
    formData.append('certificate_available', String(courseData.certificate_available === true || courseData.certificate_available === 'true'));
    
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

// Get categories by course ID
export const getCategoriesByCourse = async (courseId, token) => {
  try {
    const url = `${API_BASE_URL}/courses/admin/course/category/${courseId}`;
    
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
        data: data.categories || [],
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch categories',
      };
    }
  } catch (error) {
    console.error('Get Categories API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching categories',
    };
  }
};

// Create category for a course
export const createCategory = async (courseId, categoryData, token) => {
  try {
    const url = `${API_BASE_URL}/courses/admin/course/${courseId}/category`;
    
    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description || '');
    formData.append('order_number', categoryData.order_number || 0);
    formData.append('status', categoryData.status || 'active');
    
    // Append image if provided
    if (categoryData.image instanceof File) {
      formData.append('image', categoryData.image);
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
        message: data.message || 'Failed to create category',
      };
    }
  } catch (error) {
    console.error('Create Category API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while creating category',
    };
  }
};

// Create chapter for a category
export const createChapter = async (categoryId, chapterData, token) => {
  try {
    const url = `${API_BASE_URL}/courses/admin/category/${categoryId}/chapter`;
    
    // Create URLSearchParams for application/x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('title', chapterData.title);
    params.append('description', chapterData.description || '');
    params.append('chapter_number', chapterData.chapter_number || 0);
    params.append('duration', chapterData.duration || 0);
    params.append('total_duration', chapterData.total_duration || 0);
    params.append('is_locked', chapterData.is_locked || false);
    params.append('order_number', chapterData.order_number || 0);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
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
        message: data.message || 'Failed to create chapter',
      };
    }
  } catch (error) {
    console.error('Create Chapter API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while creating chapter',
    };
  }
};

// Get chapters by category ID
export const getChaptersByCategory = async (categoryId, token) => {
  try {
    const url = `${API_BASE_URL}/courses/admin/category/${categoryId}/chapters`;
    
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
        data: data.chapters || [],
        message: 'Chapters fetched successfully',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch chapters',
      };
    }
  } catch (error) {
    console.error('Get Chapters API Error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while fetching chapters',
    };
  }
};
