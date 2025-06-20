import React, { useEffect, useState } from 'react';
import { fetchFilteredCourses } from '../../services/api';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = () => {
    fetchFilteredCourses(searchTitle, category, sort, page)
      .then(data => {
        setCourses(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(console.error);
  };

 useEffect(() => {
  fetchFilteredCourses(searchTitle, category, sort, page)
    .then(data => {
      setCourses(data.content); 
      setTotalPages(data.totalPages);
    })
    .catch(console.error);
}, [searchTitle, category, sort, page]);


  return (
    <>
      <Navbar />
      <main className="courses-container">
        <h1 className="courses-title">Explore Our Courses</h1>

        {/* Filters */}
        <section className="filters-grid">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTitle}
            onChange={(e) => {
              setPage(0);
              setSearchTitle(e.target.value);
            }}
            className="filter-input"
          />
          <select
            className="filter-select"
            value={category}
            onChange={(e) => {
              setPage(0);
              setCategory(e.target.value);
            }}
          >
            <option value="">Category</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Business">Business</option>
          </select>
          <select
            className="filter-select"
            value={sort}
            onChange={(e) => {
              setPage(0);
              setSort(e.target.value);
            }}
          >
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Popular</option>
          </select>
        </section>

        {/* Course Grid */}
        <section className="courses-grid">
          {courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            courses.map(course => (
              <article className="course-card" key={course.id}>
                {course.imageData && (
                  <img
                    className="course-image"
                    src={`data:image/jpeg;base64,${course.imageData}`}
                    alt={course.title}
                    loading="lazy"
                    width="300"
                    height="180"
                  />
                )}
                <div className="course-info">
                  <h2>{course.title}</h2>
                  <p className="course-description">{course.description}</p>
                  <p className="course-category"><strong>Category:</strong> {course.category}</p>
                  <p className="course-rating">
                    ⭐ {course.rating?.toFixed(1) || 'N/A'} ({course.numberOfReviews || 0} reviews)
                  </p>
                  <Link to={`/courses/${course.id}`} className="view-button">View Details</Link>
                </div>
              </article>
            ))
          )}
        </section>

        {/* Pagination */}
        <section className="pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
        </section>
      </main>
    </>
  );
};

export default CoursesPage;
