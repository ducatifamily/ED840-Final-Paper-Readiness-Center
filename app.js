const STORAGE_KEY = 'ed840FinalReadiness.v1';

const defaultState = {
  notes: { purpose: '', methodology: '', findings: '', conclusions: '' },
  checks: {},
  keywords: Array(7).fill(''),
  ackChoice: '',
  tocMethod: ''
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      ...defaultState,
      ...saved,
      notes: { ...defaultState.notes, ...(saved.notes || {}) },
      checks: { ...(saved.checks || {}) },
      keywords: Array.from({ length: 7 }, (_, i) => (saved.keywords || [])[i] || '')
    };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateDashboard();
}

const abstractPlanning = [
  { key: 'purpose', label: 'Chapter 1', title: 'Purpose', prompt: 'In short notes, identify why the completed study was conducted and what it was designed to address.' },
  { key: 'methodology', label: 'Chapter 3', title: 'Methodology', prompt: 'Note the methodology/design, participants or data sources, and primary data-collection approach actually used.' },
  { key: 'findings', label: 'Chapter 4', title: 'Key Findings', prompt: 'Note the most important findings reported from the completed analysis.' },
  { key: 'conclusions', label: 'Chapter 5', title: 'Final Conclusions', prompt: 'Note the conclusions that are directly supported by the study findings.' }
];

const abstractGroups = [
  {
    title: 'Content Alignment',
    items: [
      ['abstract-purpose', 'The abstract clearly represents the study purpose.'],
      ['abstract-methodology', 'The methodology/design and completed procedures are represented accurately.'],
      ['abstract-findings', 'The key findings are represented without adding unsupported claims.'],
      ['abstract-conclusions', 'The final conclusions follow from the reported findings.'],
      ['abstract-same-study', 'The abstract summarizes the study that was actually completed—not an earlier proposed version.']
    ]
  },
  {
    title: 'Presentation & Template Check',
    items: [
      ['abstract-one-paragraph', 'The abstract is presented as one concise paragraph.'],
      ['abstract-word-rule', 'I confirmed the current governing word-count requirement for my ED840 submission.'],
      ['abstract-no-cites', 'The abstract contains no footnotes, references, or unexplained abbreviations.'],
      ['abstract-format', 'I checked the current template for alignment, spacing, title, author, and date presentation.'],
      ['abstract-final-proof', 'I proofread the abstract after completing Chapters 4 and 5.']
    ]
  }
];

const keywordItems = [
  ['keyword-core', 'The terms represent the central topics or concepts of the project.'],
  ['keyword-search', 'A researcher or practitioner could realistically use these terms to search for a study like mine.'],
  ['keyword-specific', 'The terms are specific enough to distinguish the project from a very broad topic.'],
  ['keyword-context', 'Population, setting, or context is represented when it is central to the study.'],
  ['keyword-format', 'I checked current APA/course guidance for how the keywords should be presented.']
];

const ackItems = [
  ['ack-format', 'I checked the current template for the exact section title and formatting.'],
  ['ack-support', 'The section recognizes appropriate support, guidance, or assistance.'],
  ['ack-names', 'Names and professional titles are accurate where used.'],
  ['ack-confidentiality', 'The section does not disclose confidential research or participant information.'],
  ['ack-proof', 'I proofread the section for tone, clarity, and professionalism.']
];

const tocGroups = {
  auto: [
    {
      title: 'Automatic Word TOC',
      items: [
        ['toc-auto-styles', 'Chapter and subsection headings use actual Microsoft Word heading styles.'],
        ['toc-auto-levels', 'Heading levels are applied consistently so the correct entries appear in the TOC.'],
        ['toc-auto-insert', 'I created/updated the TOC from Word’s References tab.'],
        ['toc-auto-update', 'After final revisions, I used “Update entire table,” not only “Update page numbers.”'],
        ['toc-auto-pages', 'I verified that displayed page numbers match the final document.'],
        ['toc-auto-long', 'I checked long TOC entries against the current template.']
      ]
    }
  ],
  manual: [
    {
      title: 'Manual TOC',
      items: [
        ['toc-manual-sequence', 'The TOC reflects the current chapter and major-section sequence.'],
        ['toc-manual-leaders', 'Tab leaders are used consistently according to the template.'],
        ['toc-manual-pages', 'I manually verified every page number after the document became stable.'],
        ['toc-manual-front', 'Front matter entries are included when applicable.'],
        ['toc-manual-long', 'Long TOC entries follow the current template presentation.'],
        ['toc-manual-final', 'I performed a final page-by-page verification after the last revision.']
      ]
    }
  ]
};

const formattingGroups = [
  {
    title: 'Front Matter',
    items: [
      ['fmt-title-match', 'The project title matches exactly everywhere the template requires it to match.'],
      ['fmt-name', 'My official name is used consistently where required.'],
      ['fmt-degree', 'Degree and college information match the current template.'],
      ['fmt-abstract-keywords', 'Abstract and keywords appear in the required location and format.'],
      ['fmt-optional-front', 'Acknowledgement/dedication sections are included only if I intend to use them.'],
      ['fmt-lists', 'List of Tables and/or List of Figures is included if applicable.']
    ]
  },
  {
    title: 'Pagination & Layout',
    items: [
      ['fmt-roman', 'Front matter uses lowercase Roman numerals where required.'],
      ['fmt-arabic', 'Chapter One begins the Arabic page-number sequence correctly.'],
      ['fmt-font', 'One professional font is used consistently, including tables/figures where applicable.'],
      ['fmt-black', 'The paper uses black font as required by the template.'],
      ['fmt-margins', 'Margins meet the template requirement and content does not intrude into them.'],
      ['fmt-new-page', 'Each new chapter begins at the top of a new page.'],
      ['fmt-blank', 'There are no unintended blank pages.'],
      ['fmt-header', 'There are no running headers.'],
      ['fmt-heading', 'Equivalent heading levels are formatted consistently.']
    ]
  },
  {
    title: 'References & Appendices',
    items: [
      ['fmt-apa7', 'References follow APA 7 and the current program/template expectations.'],
      ['fmt-ref-page', 'The References section begins at the top of its own page.'],
      ['fmt-ref-consistency', 'In-text citations and reference entries have been checked for consistency.'],
      ['fmt-hyperlinks', 'Active hyperlinks are handled according to the current template requirement.'],
      ['fmt-appendix-half', 'If appendices are included, the required appendix half-title page is present.'],
      ['fmt-appendix-labels', 'Appendices are labeled and separated appropriately.'],
      ['fmt-supporting', 'Required instruments or supporting materials are included in the appropriate appendix when applicable.']
    ]
  }
];

function checked(id) {
  return Boolean(state.checks[id]);
}

function renderCheckGroups(targetId, groups, dark = false) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = groups.map((group, groupIndex) => {
    const completed = group.items.filter(([id]) => checked(id)).length;
    return `
      <section class="check-group${dark ? ' dark' : ''}" data-check-group="${targetId}-${groupIndex}">
        <h3>${group.title}</h3>
        ${group.items.map(([id, text]) => `
          <label class="check-item">
            <input type="checkbox" data-check-id="${id}" ${checked(id) ? 'checked' : ''} />
            <span>${text}</span>
          </label>`).join('')}
        <div class="check-progress">${completed} of ${group.items.length} complete</div>
      </section>`;
  }).join('');

  target.querySelectorAll('[data-check-id]').forEach(input => {
    input.addEventListener('change', event => {
      state.checks[event.target.dataset.checkId] = event.target.checked;
      saveState();
      refreshAllCheckProgress();
    });
  });
}

function refreshAllCheckProgress() {
  renderCheckGroups('abstract-checks', abstractGroups, true);
  renderKeywordChecks();
  renderAckChecks();
  renderTocChecks();
  renderCheckGroups('formatting-checks', formattingGroups, true);
}

function renderAbstractPlanning() {
  const target = document.getElementById('abstract-planning');
  target.innerHTML = abstractPlanning.map(item => `
    <article class="planning-card">
      <span>${item.label}</span>
      <h3>${item.title}</h3>
      <p>${item.prompt}</p>
      <label class="sr-only" for="plan-${item.key}">${item.title} planning notes</label>
      <textarea id="plan-${item.key}" data-plan="${item.key}" maxlength="800" placeholder="Short planning notes only—do not draft the final paragraph here.">${escapeHtml(state.notes[item.key])}</textarea>
    </article>`).join('');

  target.querySelectorAll('[data-plan]').forEach(textarea => {
    textarea.addEventListener('input', event => {
      state.notes[event.target.dataset.plan] = event.target.value;
      saveState();
    });
  });
}

function countWords(text) {
  const cleaned = text.trim();
  return cleaned ? cleaned.split(/\s+/).length : 0;
}

function updateWordCounter() {
  const text = document.getElementById('abstract-text').value;
  const count = countWords(text);
  const number = document.getElementById('word-count');
  const status = document.getElementById('word-status');
  number.textContent = count;
  status.className = 'counter-status';
  if (count === 0) {
    status.textContent = 'Paste your abstract to begin.';
  } else if (count < 150) {
    status.textContent = 'Below the 150-word minimum stated in the included paper template. Confirm the current requirement before submitting.';
    status.classList.add('warn');
  } else if (count <= 250) {
    status.textContent = 'Within the 150–250 range stated in the included paper template and below the 300-word maximum stated in the current assignment directions.';
    status.classList.add('good');
  } else if (count <= 300) {
    status.textContent = 'Within the assignment’s 300-word maximum, but above the 250-word maximum stated in the included paper template. Confirm which requirement governs.';
    status.classList.add('warn');
  } else {
    status.textContent = 'Over 300 words. This exceeds both the current assignment maximum and the included template maximum.';
    status.classList.add('bad');
  }
}

function renderKeywordInputs() {
  const target = document.getElementById('keyword-inputs');
  target.innerHTML = state.keywords.map((value, index) => `
    <div class="keyword-field">
      <label for="keyword-${index}">Keyword ${index + 1}</label>
      <input id="keyword-${index}" data-keyword="${index}" maxlength="80" value="${escapeAttr(value)}" placeholder="Enter a search term" />
    </div>`).join('');

  target.querySelectorAll('[data-keyword]').forEach(input => {
    input.addEventListener('input', event => {
      state.keywords[Number(event.target.dataset.keyword)] = event.target.value;
      saveState();
      updateKeywordCount();
    });
  });
  updateKeywordCount();
}

function nonEmptyKeywords() {
  return state.keywords.map(k => k.trim()).filter(Boolean);
}

function updateKeywordCount() {
  const count = nonEmptyKeywords().length;
  const label = document.getElementById('keyword-count-label');
  const bar = document.getElementById('keyword-bar');
  if (label) label.textContent = `${count} of 5–7 entered`;
  if (bar) bar.style.width = `${Math.min(100, (count / 5) * 100)}%`;
  updateDashboard();
}

function renderKeywordChecks() {
  const target = document.getElementById('keyword-checks');
  if (!target) return;
  target.innerHTML = keywordItems.map(([id, text]) => `
    <label class="check-item">
      <input type="checkbox" data-check-id="${id}" ${checked(id) ? 'checked' : ''} />
      <span>${text}</span>
    </label>`).join('');
  target.querySelectorAll('[data-check-id]').forEach(input => {
    input.addEventListener('change', event => {
      state.checks[event.target.dataset.checkId] = event.target.checked;
      saveState();
      renderKeywordChecks();
    });
  });
}

function setupAcknowledgement() {
  document.querySelectorAll('input[name="ack-choice"]').forEach(radio => {
    radio.checked = radio.value === state.ackChoice;
    radio.addEventListener('change', event => {
      state.ackChoice = event.target.value;
      saveState();
      updateAckResult();
      renderAckChecks();
    });
  });
  updateAckResult();
  renderAckChecks();
}

function updateAckResult() {
  const result = document.getElementById('ack-result');
  if (!result) return;
  const messages = {
    yes: '<strong>Next step:</strong> Complete the self-check below and follow the current template for the exact section title, alignment, and spacing.',
    no: '<strong>Optional section:</strong> No acknowledgement section is required simply because the template provides one. Verify that removing or leaving it blank does not disrupt section breaks or pagination.',
    undecided: '<strong>Decision point:</strong> Review whether you have individuals or organizations you wish to formally recognize, then decide before finalizing front matter.'
  };
  result.innerHTML = messages[state.ackChoice] || 'Choose an option to see your next step.';
}

function renderAckChecks() {
  const target = document.getElementById('ack-checks');
  if (!target) return;
  if (state.ackChoice === 'no') {
    target.innerHTML = `<section class="check-group"><h3>No acknowledgement included</h3><p class="lead">This optional component is marked complete for this self-check. Continue to the Table of Contents section.</p></section>`;
    return;
  }
  const groups = [{ title: 'Acknowledgement Self-Check', items: ackItems }];
  renderCheckGroups('ack-checks', groups, false);
}

function setupTocSelector() {
  document.querySelectorAll('[data-toc]').forEach(button => {
    button.classList.toggle('active', button.dataset.toc === state.tocMethod);
    button.addEventListener('click', () => {
      state.tocMethod = button.dataset.toc;
      saveState();
      document.querySelectorAll('[data-toc]').forEach(b => b.classList.toggle('active', b.dataset.toc === state.tocMethod));
      updateTocGuidance();
      renderTocChecks();
    });
  });
  updateTocGuidance();
  renderTocChecks();
}

function updateTocGuidance() {
  const target = document.getElementById('toc-guidance');
  if (!target) return;
  if (state.tocMethod === 'auto') {
    target.innerHTML = `<h3>Automatic Word TOC</h3><ol><li>Apply actual Word heading styles to chapter and subsection headings.</li><li>Use <strong>References → Table of Contents</strong> to insert or update the table.</li><li>After final edits, choose <strong>Update entire table</strong> and verify the page numbers.</li></ol>`;
  } else if (state.tocMethod === 'manual') {
    target.innerHTML = `<h3>Manual TOC</h3><ol><li>Follow the current template’s tab-leader format.</li><li>Enter the required headings and front-matter items.</li><li>After the paper is stable, manually verify every page number one final time.</li></ol>`;
  } else {
    target.textContent = 'Choose your TOC method above.';
  }
}

function renderTocChecks() {
  const target = document.getElementById('toc-checks');
  if (!target) return;
  if (!state.tocMethod) {
    target.innerHTML = `<section class="check-group"><h3>Select a TOC method</h3><p class="lead">Your self-check items will appear after you choose Automatic Word TOC or Manual TOC.</p></section>`;
    return;
  }
  renderCheckGroups('toc-checks', tocGroups[state.tocMethod], false);
}

function flattenItems(groups) {
  return groups.flatMap(group => group.items.map(([id]) => id));
}

function percentComplete(ids, extras = []) {
  const values = [...ids.map(id => checked(id)), ...extras];
  if (!values.length) return 0;
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

function categoryScores() {
  const abstractIds = flattenItems(abstractGroups);
  const planningDone = abstractPlanning.map(item => Boolean(state.notes[item.key].trim()));
  const abstractScore = percentComplete(abstractIds, planningDone);

  const keywordIds = keywordItems.map(([id]) => id);
  const keywordCountValid = nonEmptyKeywords().length >= 5 && nonEmptyKeywords().length <= 7;
  const keywordScore = percentComplete(keywordIds, [keywordCountValid]);

  let ackScore = 0;
  if (state.ackChoice === 'no') ackScore = 100;
  else if (state.ackChoice === 'yes') ackScore = percentComplete(ackItems.map(([id]) => id), [true]);
  else if (state.ackChoice === 'undecided') ackScore = 0;

  let tocScore = 0;
  if (state.tocMethod) {
    tocScore = percentComplete(flattenItems(tocGroups[state.tocMethod]), [true]);
  }

  const formattingScore = percentComplete(flattenItems(formattingGroups));

  return [
    { key: 'abstract', label: 'ABSTRACT', title: 'Abstract', score: abstractScore, description: 'Planning + content + presentation checks' },
    { key: 'keywords', label: 'KEYWORDS', title: 'Keywords', score: keywordScore, description: '5–7 terms + search-quality checks' },
    { key: 'ack', label: 'OPTIONAL', title: 'Acknowledgement(s)', score: ackScore, description: 'Decision + formatting checks' },
    { key: 'toc', label: 'NAVIGATION', title: 'Table of Contents', score: tocScore, description: 'Method selection + TOC checks' },
    { key: 'formatting', label: 'MECHANICS', title: 'Paper Mechanics', score: formattingScore, description: 'Front matter + pagination + references' }
  ];
}

function updateDashboard() {
  const categories = categoryScores();
  const overall = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);
  const overallText = document.getElementById('overall-percent');
  const overallBar = document.getElementById('overall-bar');
  const dashboardPercent = document.getElementById('dashboard-percent');
  if (overallText) overallText.textContent = `${overall}%`;
  if (overallBar) overallBar.style.width = `${overall}%`;
  if (dashboardPercent) dashboardPercent.textContent = `${overall}%`;

  const grid = document.getElementById('dashboard-grid');
  if (grid) {
    grid.innerHTML = categories.map(cat => `
      <article class="dashboard-card">
        <span>${cat.label}</span>
        <strong>${cat.score}%</strong>
        <p>${cat.description}</p>
        <div class="progress-track"><span style="width:${cat.score}%"></span></div>
      </article>`).join('');
  }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

function escapeAttr(value = '') {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

function setupButtons() {
  const abstractText = document.getElementById('abstract-text');
  abstractText.addEventListener('input', updateWordCounter);
  document.getElementById('clear-abstract').addEventListener('click', () => {
    abstractText.value = '';
    updateWordCounter();
  });

  ['print-summary', 'print-summary-top', 'footer-print'].forEach(id => {
    const button = document.getElementById(id);
    if (button) button.addEventListener('click', () => window.print());
  });

  document.getElementById('reset-progress').addEventListener('click', () => {
    const confirmed = window.confirm('Reset all saved checklist selections, keywords, planning notes, and TOC/acknowledgement choices stored by this site in this browser?');
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    state = structuredClone(defaultState);
    initializeDynamicContent();
  });
}

function initializeDynamicContent() {
  renderAbstractPlanning();
  renderCheckGroups('abstract-checks', abstractGroups, true);
  renderKeywordInputs();
  renderKeywordChecks();
  setupAcknowledgement();
  setupTocSelector();
  renderCheckGroups('formatting-checks', formattingGroups, true);
  updateDashboard();
}

setupMobileMenu();
initializeDynamicContent();
setupButtons();
updateWordCounter();
