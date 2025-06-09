import React, { useState } from 'react';

const Step2_Structure = ({ newPart, setNewPart, course, setCourse, deletePart, expandedIndex, toggleExpand }) => {
  const [activeTab, setActiveTab] = useState('file');
  const [newFile, setNewFile] = useState(null);
  const [newQuiz, setNewQuiz] = useState('');
  const [newVideo, setNewVideo] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handlePartChange = e => {
    const { name, value, files } = e.target;
    if (name === 'files') {
      setNewPart(prev => ({ ...prev, files: Array.from(files) }));
    } else {
      setNewPart(prev => ({ ...prev, [name]: value }));
    }
  };

  const addFile = () => {
    if (newFile) {
      setNewPart(prev => ({ ...prev, files: [...(prev.files || []), newFile] }));
      setNewFile(null);
    }
  };

  const addQuiz = () => {
    if (newQuiz.trim()) {
      setNewPart(prev => ({ ...prev, quizzes: [...(prev.quizzes || []), newQuiz] }));
      setNewQuiz('');
    }
  };

  const addVideo = () => {
    if (newVideo.trim()) {
      setNewPart(prev => ({ ...prev, videos: [...(prev.videos || []), newVideo] }));
      setNewVideo('');
    }
  };

  const removeItem = (type, index) => {
    setNewPart(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const resetPartForm = () => {
    setNewPart({ week: '', title: '', files: [], quizzes: [], videos: [] });
    setEditIndex(null);
  };

  const generateContents = () => {
    const contents = [];

    newPart.files?.forEach((file, i) => {
      contents.push({
        contentType: 'FILE',
        title: file.name || `File ${i + 1}`,
        contentId: null
      });
    });

    newPart.videos?.forEach((video, i) => {
      contents.push({
        contentType: 'VIDEO',
        title: `Video ${i + 1}`,
        contentId: null
      });
    });

    newPart.quizzes?.forEach((quiz, i) => {
      contents.push({
        contentType: 'QUIZ',
        title: quiz,
        contentId: null
      });
    });

    return contents;
  };

  const savePart = () => {
    const partToSave = {
      title: newPart.title,
      weekNumber: parseInt(newPart.week) || null,
      sequence: editIndex !== null ? editIndex + 1 : course.parts.length + 1,
      contents: generateContents()
    };

    if (editIndex !== null) {
      const updatedParts = [...course.parts];
      updatedParts[editIndex] = partToSave;
      setCourse(prev => ({ ...prev, parts: updatedParts }));
    } else {
      setCourse(prev => ({ ...prev, parts: [...prev.parts, partToSave] }));
    }

    resetPartForm();
  };

  const editPart = (index) => {
    const part = course.parts[index];
    setNewPart({
      week: part.weekNumber?.toString() || '',
      title: part.title,
      files: part.files || [],
      quizzes: part.quizzes || [],
      videos: part.videos || []
    });
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="form-step structure-step">
      <h3 className="structure-heading">🏗️ {editIndex !== null ? 'Edit Part' : 'Add Course Structure'}</h3>

      <div className="new-part-form">
        <div className="inline-group labeled-line">
          <input type="number" name="week" placeholder="Week" value={newPart.week} onChange={handlePartChange} />
          <input type="text" name="title" placeholder="Part Title" value={newPart.title} onChange={handlePartChange} />
        </div>

        <div className="resource-tabs">
          <button type="button" className={activeTab === 'file' ? 'active' : ''} onClick={() => setActiveTab('file')}>📁 File</button>
          <button type="button" className={activeTab === 'quiz' ? 'active' : ''} onClick={() => setActiveTab('quiz')}>📝 Quiz</button>
          <button type="button" className={activeTab === 'video' ? 'active' : ''} onClick={() => setActiveTab('video')}>🎥 Video</button>
        </div>

        <div className="tab-content">
          {activeTab === 'file' && (
            <>
              <div className="inline-group">
                <input type="file" onChange={(e) => setNewFile(e.target.files[0])} />
                <button type="button" onClick={addFile}>➕ Add File</button>
              </div>
              <ul className="preview-list">
                {newPart.files?.map((f, idx) => (
                  <li key={idx}>{f.name || f} <button onClick={() => removeItem('files', idx)}>❌</button></li>
                ))}
              </ul>
            </>
          )}

          {activeTab === 'quiz' && (
            <>
              <div className="inline-group quiz-inline">
                <input type="text" value={newQuiz} onChange={e => setNewQuiz(e.target.value)} placeholder="Quiz Title" />
                <button type="button" onClick={addQuiz}>➕ Add Quiz</button>
              </div>
              <ul className="preview-list">
                {newPart.quizzes?.map((q, idx) => (
                  <li key={idx}>{q} <button onClick={() => removeItem('quizzes', idx)}>❌</button></li>
                ))}
              </ul>
            </>
          )}

          {activeTab === 'video' && (
            <>
              <div className="inline-group">
                <input type="text" value={newVideo} onChange={e => setNewVideo(e.target.value)} placeholder="Video Link" />
                <button type="button" onClick={addVideo}>➕ Add Video</button>
              </div>
              <ul className="preview-list">
                {newPart.videos?.map((v, idx) => (
                  <li key={idx}><a href={v} target="_blank" rel="noreferrer">{v}</a> <button onClick={() => removeItem('videos', idx)}>❌</button></li>
                ))}
              </ul>
            </>
          )}
        </div>

        <button type="button" className="add-part-btn" onClick={savePart}>{editIndex !== null ? '💾 Save Part' : '✅ Add Part'}</button>
      </div>

      <div className="course-outline">
        {course.parts.map((part, index) => (
          <details key={index} className="part-block">
            <summary>{index + 1}. Week {part.weekNumber} – {part.title}</summary>
            <div className="part-content">
              <strong>Files:</strong>
              <ul>{part.files?.map((f, i) => <li key={i}>{f.name || f}</li>)}</ul>
              <strong>Quizzes:</strong>
              <ul>{part.quizzes?.map((q, i) => <li key={i}>{q}</li>)}</ul>
              <strong>Videos:</strong>
              <ul>{part.videos?.map((v, i) => <li key={i}><a href={v} target="_blank" rel="noreferrer">{v}</a></li>)}</ul>
              <button onClick={() => editPart(index)}>✏️ Edit</button>
              <button onClick={() => deletePart(index)}>🗑️ Delete</button>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default Step2_Structure;
