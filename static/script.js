document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('analyzeForm');
  const cvText = document.getElementById('cvText');
  const jobRequirements = document.getElementById('jobRequirements');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const btnText = analyzeBtn.querySelector('.btn-text');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const errorBox = document.getElementById('errorBox');
  const errorMessage = document.getElementById('errorMessage');
  const resultsSection = document.getElementById('resultsSection');

  const cvCharCount = document.getElementById('cvCharCount');
  const reqCharCount = document.getElementById('reqCharCount');

  // Character counter updates
  const updateCounts = () => {
    cvCharCount.textContent = `${cvText.value.length} chars`;
    reqCharCount.textContent = `${jobRequirements.value.length} chars`;
  };

  cvText.addEventListener('input', updateCounts);
  jobRequirements.addEventListener('input', updateCounts);
  updateCounts();

  // Helper to show/hide error
  const showError = (msg) => {
    errorMessage.textContent = msg;
    errorBox.style.display = 'flex';
  };

  const hideError = () => {
    errorBox.style.display = 'none';
    errorMessage.textContent = '';
  };

  // Helper to render a list into a container
  const renderList = (elementId, items, emptyText) => {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    if (!items || !Array.isArray(items) || items.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'empty-item';
      emptyLi.textContent = emptyText || 'None identified';
      container.appendChild(emptyLi);
      return;
    }

    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'result-item';
      li.textContent = item;
      container.appendChild(li);
    });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const cvVal = cvText.value.trim();
    const reqVal = jobRequirements.value.trim();

    // Client-side validation matching backend requirements
    if (cvVal.length < 10) {
      showError('Please provide CV text with at least 10 characters.');
      cvText.focus();
      return;
    }

    if (reqVal.length < 10) {
      showError('Please provide job requirements with at least 10 characters.');
      jobRequirements.focus();
      return;
    }

    // Enter loading state
    analyzeBtn.disabled = true;
    analyzeBtn.classList.add('loading');
    btnText.textContent = 'Analyzing...';
    loadingIndicator.style.display = 'flex';
    resultsSection.style.display = 'none';

    try {
      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cv_text: cvVal,
          job_requirements: reqVal
        })
      });

      if (!response.ok) {
        let errDetail = 'Failed to analyze CV. Please try again.';
        try {
          const errData = await response.json();
          if (errData && errData.detail) {
            if (typeof errData.detail === 'string') {
              errDetail = errData.detail;
            } else if (Array.isArray(errData.detail)) {
              errDetail = errData.detail.map(d => d.msg || JSON.stringify(d)).join(', ');
            }
          }
        } catch (_) {
          // Keep default message if response isn't JSON
        }
        throw new Error(errDetail);
      }

      const result = await response.json();

      // Render all 5 fields
      renderList('evidenceFoundList', result.evidence_found, 'No direct evidence found for the requirements.');
      renderList('requirementsNotFoundList', result.requirements_not_found, 'All mandatory requirements were found in the CV.');
      renderList('relevantSkillsList', result.relevant_skills, 'No matching skills found in the CV.');
      renderList('relevantExperienceList', result.relevant_experience, 'No matching experience found in the CV.');
      renderList('clarificationQuestionsList', result.clarification_questions, 'No clarification questions required.');

      resultsSection.style.display = 'block';
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
      showError(err.message || 'An unexpected error occurred while communicating with the server.');
    } finally {
      // Exit loading state
      analyzeBtn.disabled = false;
      analyzeBtn.classList.remove('loading');
      btnText.textContent = 'Analyze CV';
      loadingIndicator.style.display = 'none';
    }
  });
});
