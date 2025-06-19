import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import '../styles/statistics-panel.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c', '#d0ed57', '#a28fd0', '#ffd6a5', '#ffaaa5', '#8dd3c7'];

const StatisticsPanel = () => {
  const [categoryStats, setCategoryStats] = useState([]);
  const [enrollmentStats, setEnrollmentStats] = useState([]);
  const [categoryLimit, setCategoryLimit] = useState('all');

  useEffect(() => {
    apiClient.get('/api/stats/courses-per-category')
      .then(res => setCategoryStats(res.data))
      .catch(err => console.error('Category stats error:', err));

    apiClient.get('/api/stats/students-per-course')
      .then(res => setEnrollmentStats(res.data))
      .catch(err => console.error('Enrollment stats error:', err));
  }, []);

  const loadSampleData = () => {
    setCategoryStats([
      { category: 'TECHNOLOGY', courseCount: 5 },
      { category: 'BUSINESS', courseCount: 3 },
      { category: 'DESIGN', courseCount: 4 },
      { category: 'PROGRAMMING', courseCount: 6 },
      { category: 'DATA_SCIENCE', courseCount: 2 },
      { category: 'HEALTH', courseCount: 3 },
      { category: 'ART', courseCount: 2 },
      { category: 'EDUCATION', courseCount: 4 },
      { category: 'LANGUAGE', courseCount: 2 },
      { category: 'SCIENCE', courseCount: 3 },
      { category: 'MATH', courseCount: 2 },
      { category: 'FINANCE', courseCount: 2 },
      { category: 'SPORTS', courseCount: 3 },
      { category: 'PSYCHOLOGY', courseCount: 2 },
      { category: 'MARKETING', courseCount: 2 },
      { category: 'GAMING', courseCount: 4 },
    ]);

    setEnrollmentStats([
      { courseTitle: 'Java Basics', studentCount: 8 },
      { courseTitle: 'Digital Illustration', studentCount: 5 },
      { courseTitle: 'Python for Data Science', studentCount: 10 },
      { courseTitle: 'Marketing 101', studentCount: 6 },
      { courseTitle: 'Intro to Finance', studentCount: 4 },
      { courseTitle: 'History of Europe', studentCount: 3 },
      { courseTitle: 'Fitness & Wellness', studentCount: 7 },
      { courseTitle: 'Psychology of Learning', studentCount: 4 },
      { courseTitle: 'Game Design Principles', studentCount: 9 },
      { courseTitle: 'Travel Photography', studentCount: 2 },
    ]);
  };

  const filteredCategories = categoryLimit === 'all'
    ? categoryStats
    : categoryStats.slice(0, parseInt(categoryLimit));

  return (
    <div className="statistics-container">
      <h1 className="main-title">📊 Platform Insights Dashboard</h1>
      <p className="main-subtitle">Visual breakdown of course categories and student enrollments across all courses.</p>

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <button className="load-sample-btn" onClick={loadSampleData}>Load Sample Data</button>
      </div>

      <div className="charts-wrapper">
        <div className="chart-box pie-box">
  <div className="pie-left">
    <h2>Courses by Category</h2>
    <p className="chart-description">
      This pie chart shows how many courses belong to each interest category.
    </p>
    <div className="filter-row">
      <label htmlFor="categoryLimit">Filter:</label>
      <select
        id="categoryLimit"
        value={categoryLimit}
        onChange={(e) => setCategoryLimit(e.target.value)}
      >
        <option value="all">Show All</option>
        <option value="5">Top 5</option>
        <option value="10">Top 10</option>
      </select>
    </div>
  </div>

  <div className="pie-right">
    <div className="pie-chart">
      <PieChart width={360} height={300}>
        <Pie
          data={filteredCategories}
          dataKey="courseCount"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {filteredCategories.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>

    <div className="legend">
      {filteredCategories.map((entry, index) => (
        <div key={index} className="legend-item">
          <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
          {entry.category} ({entry.courseCount})
        </div>
      ))}
    </div>
  </div>
</div>

        <div className="chart-box bar-box">
          <h2>Students per Course</h2>
          <p className="chart-description">This bar chart shows how many students are enrolled in each course.</p>
          {enrollmentStats.length === 0 ? (
            <p className="statistics-empty">No enrollment statistics available yet.</p>
          ) : (
            <BarChart width={1000} height={300} data={enrollmentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="courseTitle" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="studentCount" fill="#82ca9d" />
            </BarChart>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
