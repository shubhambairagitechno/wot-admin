import React from 'react';
import GlobalLoader from './GlobalLoader';

export default function CourseDetailModal({ show, courseData, isLoading, onClose }) {
  if (!show) return null;

  const getContentTypeIcon = (contentType) => {
    const iconMap = {
      video: 'fa-video',
      text: 'fa-file-text',
      doc: 'fa-file-pdf',
      audio: 'fa-music',
    };
    return iconMap[contentType?.toLowerCase()] || 'fa-file';
  };

  const getContentTypeLabel = (contentType) => {
    const labelMap = {
      video: 'Video',
      text: 'Text',
      doc: 'Document',
      audio: 'Audio',
    };
    return labelMap[contentType?.toLowerCase()] || contentType;
  };

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header border-bottom">
            <h5 className="modal-title">Course Details</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>

          <div className="modal-body">
            {isLoading ? (
              <div className="text-center py-5">
                <GlobalLoader visible={true} size="small" />
              </div>
            ) : courseData ? (
              <>
                {/* Course Header */}
                <div className="mb-4">
                  <img 
                    src={courseData.image_url} 
                    alt={courseData.title}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}
                  />
                  
                  <h4 className="mb-2">{courseData.title}</h4>
                  
                  <div className="d-flex gap-2 mb-3">
                    <span className="badge bg-success">{courseData.status}</span>
                    <span className="badge bg-primary">{courseData.level}</span>
                    <span className="badge bg-info">{courseData.duration}</span>
                  </div>
                </div>

                {/* Course Info Section */}
                <div className="mb-4">
                  <h6 className="text-primary mb-2">Course Description</h6>
                  <p className="text-muted">{courseData.description}</p>
                </div>

                <div className="mb-4">
                  <h6 className="text-primary mb-2">Learning Objectives</h6>
                  <p className="text-muted">{courseData.objectives}</p>
                </div>

                {/* Lessons Section */}
                {courseData.lessons && courseData.lessons.length > 0 && (
                  <div className="mb-4">
                    <h6 className="text-primary mb-3">Course Lessons ({courseData.lesson_count})</h6>
                    <div className="list-group">
                      {courseData.lessons.map((lesson, index) => (
                        <div key={lesson.id} className="list-group-item">
                          <div className="d-flex align-items-start">
                            <div className="me-3 pt-1">
                              <span className="badge bg-light text-dark">
                                {lesson.order || index + 1}
                              </span>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-1">
                                <h6 className="mb-0">{lesson.title}</h6>
                                <span className="ms-2 badge bg-secondary">
                                  <i className={`fa ${getContentTypeIcon(lesson.content_type)} me-1`}></i>
                                  {getContentTypeLabel(lesson.content_type)}
                                </span>
                              </div>
                              <p className="text-muted small mb-1">{lesson.description}</p>
                              <small className="text-muted">
                                <i className="fa fa-clock me-1"></i>Duration: {lesson.duration}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">Unable to load course details</p>
              </div>
            )}
          </div>

          <div className="modal-footer border-top">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isLoading}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
