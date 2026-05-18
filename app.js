const state = { experiences: [], educations: [] };

// Tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
  });
});

// Live bindings
function bind(id, fn) { const el = document.getElementById(id); if (el) el.addEventListener('input', fn); }
bind('name',    () => document.getElementById('r-name').textContent  = val('name') || 'Your Name');
bind('title',   () => document.getElementById('r-title').textContent = val('title') || 'Job Title');
bind('summary', () => document.getElementById('r-summary').textContent = val('summary'));
['email','phone','location','linkedin','portfolio'].forEach(id => bind(id, updateContact));
['tech-skills','soft-skills','certs'].forEach(id => bind(id, updateSkills));

function updateContact() {
  document.getElementById('r-contact').innerHTML =
    ['email','phone','location','linkedin','portfolio']
      .map(id => val(id)).filter(Boolean)
      .map(v => `<span>${v}</span>`).join('');
}

function updateSkills() {
  const container = document.getElementById('r-skills-list');
  container.innerHTML = '';
  [['Technical', 'tech-skills'], ['Soft Skills', 'soft-skills'], ['Certifications & Tools', 'certs']].forEach(([label, id]) => {
    const v = val(id); if (!v) return;
    const tags = v.split(',').map(s => s.trim()).filter(Boolean);
    container.innerHTML += `<div class="r-skills-group"><span class="r-skills-label">${label}:</span>
      <div class="r-skills-tags">${tags.map(t => `<span class="r-skill-tag">${t}</span>`).join('')}</div></div>`;
  });
}

// Experience
document.getElementById('add-exp').addEventListener('click', () => {
  state.experiences.push({ id: Date.now(), role: '', company: '', start: '', end: '', bullets: '' });
  renderExpForm(); renderExpPreview();
});

function renderExpForm() {
  const list = document.getElementById('exp-list');
  list.innerHTML = '';
  state.experiences.forEach((exp, i) => {
    const block = document.createElement('div');
    block.className = 'entry-block';
    block.innerHTML = `
      <div class="entry-header">
        <span class="entry-title">${exp.role || exp.company || `Experience ${i+1}`}</span>
        <button class="remove-btn" data-id="${exp.id}">✕</button>
      </div>
      <div class="entry-fields">
        <div class="field"><label>Job Title</label><input type="text" placeholder="Frontend Developer" value="${exp.role}" data-field="role" data-id="${exp.id}" /></div>
        <div class="field"><label>Company</label><input type="text" placeholder="TCS" value="${exp.company}" data-field="company" data-id="${exp.id}" /></div>
        <div class="field"><label>Start</label><input type="text" placeholder="Jan 2022" value="${exp.start}" data-field="start" data-id="${exp.id}" /></div>
        <div class="field"><label>End</label><input type="text" placeholder="Present" value="${exp.end}" data-field="end" data-id="${exp.id}" /></div>
        <div class="field full"><label>Bullet Points (one per line)</label>
          <textarea rows="4" placeholder="• Led migration to microservices..." data-field="bullets" data-id="${exp.id}">${exp.bullets}</textarea></div>
      </div>`;
    list.appendChild(block);
  });
  list.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', e => {
      const exp = state.experiences.find(x => x.id === +e.target.dataset.id);
      if (exp) { exp[e.target.dataset.field] = e.target.value; renderExpForm(); renderExpPreview(); }
    });
  });
  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      state.experiences = state.experiences.filter(x => x.id !== +e.target.dataset.id);
      renderExpForm(); renderExpPreview();
    });
  });
}

function renderExpPreview() {
  const container = document.getElementById('r-exp-list');
  container.innerHTML = '';
  state.experiences.forEach(exp => {
    if (!exp.role && !exp.company) return;
    const bullets = exp.bullets.split('\n').filter(b => b.trim());
    container.innerHTML += `
      <div class="r-entry">
        <div class="r-entry-top">
          <span class="r-entry-title">${exp.role}</span>
          <span class="r-entry-date">${[exp.start, exp.end].filter(Boolean).join(' – ')}</span>
        </div>
        <div class="r-entry-sub">${exp.company}</div>
        ${bullets.length ? `<ul class="r-entry-bullets">${bullets.map(b => `<li>${b.replace(/^•\s*/,'')}</li>`).join('')}</ul>` : ''}
      </div>`;
  });
}

// Education
document.getElementById('add-edu').addEventListener('click', () => {
  state.educations.push({ id: Date.now(), degree: '', school: '', year: '', gpa: '' });
  renderEduForm(); renderEduPreview();
});

function renderEduForm() {
  const list = document.getElementById('edu-list');
  list.innerHTML = '';
  state.educations.forEach((edu, i) => {
    const block = document.createElement('div');
    block.className = 'entry-block';
    block.innerHTML = `
      <div class="entry-header">
        <span class="entry-title">${edu.degree || edu.school || `Education ${i+1}`}</span>
        <button class="remove-btn" data-id="${edu.id}">✕</button>
      </div>
      <div class="entry-fields">
        <div class="field full"><label>Degree</label><input type="text" placeholder="B.Tech in Computer Science" value="${edu.degree}" data-field="degree" data-id="${edu.id}" /></div>
        <div class="field"><label>School</label><input type="text" placeholder="JNTU Hyderabad" value="${edu.school}" data-field="school" data-id="${edu.id}" /></div>
        <div class="field"><label>Year</label><input type="text" placeholder="2020" value="${edu.year}" data-field="year" data-id="${edu.id}" /></div>
        <div class="field"><label>GPA</label><input type="text" placeholder="8.5 / 10" value="${edu.gpa}" data-field="gpa" data-id="${edu.id}" /></div>
      </div>`;
    list.appendChild(block);
  });
  list.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', e => {
      const edu = state.educations.find(x => x.id === +e.target.dataset.id);
      if (edu) { edu[e.target.dataset.field] = e.target.value; renderEduForm(); renderEduPreview(); }
    });
  });
  list.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      state.educations = state.educations.filter(x => x.id !== +e.target.dataset.id);
      renderEduForm(); renderEduPreview();
    });
  });
}

function renderEduPreview() {
  const container = document.getElementById('r-edu-list');
  container.innerHTML = '';
  state.educations.forEach(edu => {
    if (!edu.degree && !edu.school) return;
    container.innerHTML += `
      <div class="r-entry">
        <div class="r-entry-top">
          <span class="r-entry-title">${edu.degree}</span>
          <span class="r-entry-date">${edu.year}</span>
        </div>
        <div class="r-entry-sub">${edu.school}${edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
      </div>`;
  });
}

// Print
document.getElementById('print-btn').addEventListener('click', () => window.print());

// ATS Score
document.getElementById('ats-score-btn').addEventListener('click', () => {
  const score = calcATSScore();
  document.getElementById('score-num').textContent = score.total;
  document.getElementById('ats-feedback').innerHTML = score.items
    .map(item => `<li>${item.pass ? '✅' : '❌'} ${item.msg}</li>`).join('');
  document.getElementById('ats-modal').classList.remove('hidden');
});
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('ats-modal').classList.add('hidden');
});

function calcATSScore() {
  const items = []; let total = 0;
  function check(cond, pts, pass_msg, fail_msg) {
    if (cond) { total += pts; items.push({ pass: true, msg: pass_msg }); }
    else items.push({ pass: false, msg: fail_msg });
  }
  check(val('name').length > 2,        10, 'Full name present',              'Add your full name');
  check(val('email').includes('@'),    10, 'Email address present',          'Add a valid email');
  check(val('title').length > 3,       10, 'Job title present',              'Add a clear job title');
  check(val('summary').length > 50,    15, 'Professional summary present',   'Write at least 2–3 sentences in summary');
  check(val('summary').split(' ').length >= 30, 5, 'Summary has enough keywords', 'Expand your summary with more keywords');
  check(state.experiences.length >= 1, 15, 'Work experience added',          'Add at least 1 work experience');
  check(state.experiences.some(e => e.bullets.length > 20), 10, 'Experience has bullet points', 'Add accomplishment bullets to experience');
  check(state.educations.length >= 1,   5, 'Education added',                'Add your education');
  check(val('tech-skills').split(',').filter(Boolean).length >= 4, 10, '4+ technical skills listed', 'Add at least 4 technical skills');
  check(val('phone').length > 6,        5, 'Phone number present',           'Add a phone number');
  check(val('linkedin').length > 5,     5, 'LinkedIn URL present',           'Add your LinkedIn profile URL');
  return { total, items };
}

function val(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }
