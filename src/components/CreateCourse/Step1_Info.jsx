import React from 'react';

const Step1_Info = ({ course, handleChange, handleImageChange, image }) => {
  return (
    <div className="form-step info-step">
      <h3 className="info-heading">📘 Course Information</h3>

      <div className="form-group-inline">
        <div>
          <label>Course Title</label>
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleChange}
            required
            data-cy="course-title"
          />
        </div>
        <div>
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={course.category}
            onChange={handleChange}
            required
            data-cy="course-category"
          />
        </div>
      </div>

      <label>Description</label>
      <textarea
        name="description"
        value={course.description}
        onChange={handleChange}
        required
        data-cy="course-description"
      />

      <div className="form-group-inline">
        <div>
          <label>Enrollment Limit</label>
          <input
            type="number"
            name="enrollmentLimit"
            value={course.enrollmentLimit}
            onChange={handleChange}
            required
            data-cy="course-enrollment-limit"
          />
        </div>

        <div>
          <label>Course Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            data-cy="course-image"
          />
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="course-image-preview"
              data-cy="image-preview"
            />
          ) : course.imageData ? (
            <img
              src={`data:image/jpeg;base64,${course.imageData}`}
              alt="Existing Preview"
              className="course-image-preview"
              data-cy="image-preview"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Step1_Info;
