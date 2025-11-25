const storageKey = 'med-tracker';
const medForm = document.getElementById('medForm');
const medList = document.getElementById('medList');
const reminderList = document.getElementById('reminderList');
const statActive = document.getElementById('statActive');
const statDue = document.getElementById('statDue');
const statWeek = document.getElementById('statWeek');

function loadData() {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : { meds: [] };
}

function saveData(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function uuid() {
  return crypto.randomUUID();
}

function weeksBetween(startDate, endDate = new Date()) {
  const ms = 1000 * 60 * 60 * 24 * 7;
  return Math.max(0, Math.floor((endDate - startDate) / ms));
}

function renderStats(data) {
  const today = new Date();
  const active = data.meds.length;
  const due = data.meds.filter((med) => reminderStatus(med).status === 'due').length;
  const maxWeek = Math.max(0, ...data.meds.map((m) => weeksBetween(new Date(m.startDate), today) + 1));
  statActive.textContent = `${active} ${active === 1 ? 'plan activo' : 'planes activos'}`;
  statDue.textContent = `${due} ${due === 1 ? 'recordatorio pendiente' : 'recordatorios pendientes'}`;
  statWeek.textContent = `Semana ${maxWeek} en curso`;
}

function reminderStatus(med) {
  const today = new Date();
  const snoozedUntil = med.snoozedUntil ? new Date(med.snoozedUntil) : null;
  if (snoozedUntil && today < snoozedUntil) {
    return { status: 'snoozed', message: `En pausa hasta ${snoozedUntil.toLocaleDateString()}` };
  }

  const currentWeek = weeksBetween(new Date(med.startDate), today) + 1;
  const lastLog = [...(med.logs || [])].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const lastWeek = lastLog ? lastLog.weekNumber : 0;
  const missingWeeks = currentWeek - lastWeek;
  if (missingWeeks >= med.reminderEvery) {
    const message = lastWeek === 0 ? 'Aún no hay registros' : `Última entrada semana ${lastWeek}`;
    return { status: 'due', message, missingWeeks };
  }
  return { status: 'ok', message: `Al día (semana ${lastWeek})` };
}

function renderReminders(data) {
  reminderList.innerHTML = '';
  if (!data.meds.length) {
    reminderList.innerHTML = '<p class="muted">Aún no tienes tratamientos configurados.</p>';
    return;
  }
  data.meds.forEach((med) => {
    const status = reminderStatus(med);
    const card = document.createElement('div');
    card.className = 'reminder-card';
    const badgeClass = status.status === 'due' ? 'due' : status.status === 'snoozed' ? 'snoozed' : 'ok';
    card.innerHTML = `
      <div class="reminder-card__row">
        <div>
          <p class="pill-card__title">${med.name}</p>
          <p class="muted">${med.dose}</p>
        </div>
        <span class="badge ${badgeClass}">${status.status === 'due' ? 'Pendiente' : status.status === 'snoozed' ? 'Pausado' : 'Al día'}</span>
      </div>
      <p class="muted">${status.message}</p>
      <div class="inline-input">
        <label class="muted" style="font-weight:700;">Intervalo</label>
        <input type="number" min="1" max="6" value="${med.reminderEvery}" data-interval="${med.id}" />
        <button class="ghost" data-snooze="${med.id}">Aplazar 1 semana</button>
      </div>
      <div class="card-actions">
        <button class="primary" data-log="${med.id}">Registrar semana</button>
        <button class="ghost" data-remove="${med.id}">Eliminar</button>
      </div>
    `;
    reminderList.appendChild(card);
  });
}

function renderTimeline(med) {
  const container = document.createElement('div');
  container.className = 'timeline';
  const total = Math.max(med.durationWeeks, med.logs.length + 2);
  const today = new Date();
  const currentWeek = weeksBetween(new Date(med.startDate), today) + 1;
  for (let week = 1; week <= total; week++) {
    const log = med.logs.find((l) => l.weekNumber === week);
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.textContent = week;
    if (log) {
      dot.classList.add('done');
      dot.title = `Semana ${week}: estado ${log.mood}/5`;
    } else if (week <= currentWeek) {
      dot.classList.add('pending');
      dot.title = `Semana ${week}: sin registro`;
    } else {
      dot.classList.add('future');
      dot.title = `Semana ${week}: programada`;
    }
    container.appendChild(dot);
  }
  return container;
}

function renderMeds(data) {
  medList.innerHTML = '';
  if (!data.meds.length) {
    medList.innerHTML = '<p class="muted">Añade tu primer tratamiento para comenzar.</p>';
    return;
  }
  data.meds.forEach((med) => {
    const card = document.createElement('div');
    card.className = 'med-card';
    const status = reminderStatus(med);
    const badgeClass = status.status === 'due' ? 'due' : status.status === 'snoozed' ? 'snoozed' : 'ok';
    card.innerHTML = `
      <div class="med-card__header">
        <div>
          <h3 style="margin:0;">${med.name}</h3>
          <p class="muted" style="margin:4px 0;">${med.dose}</p>
          <p class="muted" style="margin:0;">Inicio: ${new Date(med.startDate).toLocaleDateString()}</p>
        </div>
        <span class="badge ${badgeClass}">${status.status === 'due' ? 'Pendiente' : status.status === 'snoozed' ? 'Pausado' : 'Al día'}</span>
      </div>
      <p class="muted" style="margin:0;">${status.message}</p>
    `;
    const timeline = renderTimeline(med);
    card.appendChild(timeline);

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const logBtn = document.createElement('button');
    logBtn.className = 'primary';
    logBtn.textContent = 'Añadir registro semanal';
    logBtn.addEventListener('click', () => openProgressForm(med.id, data));
    const removeBtn = document.createElement('button');
    removeBtn.className = 'ghost';
    removeBtn.textContent = 'Eliminar plan';
    removeBtn.addEventListener('click', () => removeMed(med.id));
    actions.append(logBtn, removeBtn);
    card.appendChild(actions);

    if (med.notes) {
      const notes = document.createElement('p');
      notes.className = 'muted';
      notes.textContent = `Notas: ${med.notes}`;
      card.appendChild(notes);
    }

    const history = document.createElement('div');
    history.innerHTML = '<p class="pill-card__title" style="margin:8px 0;">Historial</p>';
    if (med.logs.length === 0) {
      history.innerHTML += '<p class="muted">Sin registros aún.</p>';
    } else {
      const list = document.createElement('ul');
      list.style.paddingLeft = '18px';
      med.logs
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach((log) => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>Semana ${log.weekNumber}</strong>: ánimo ${log.mood}/5 · ${log.adherence ? 'Adherencia completa' : 'Saltos'}${log.effects ? ' · Efectos: ' + log.effects : ''}${log.notes ? ' · ' + log.notes : ''}`;
          li.className = 'muted';
          list.appendChild(li);
        });
      history.appendChild(list);
    }
    card.appendChild(history);

    medList.appendChild(card);
  });
}

function openProgressForm(medId, data) {
  const med = data.meds.find((m) => m.id === medId);
  if (!med) return;
  const template = document.getElementById('progressFormTemplate');
  const form = template.content.firstElementChild.cloneNode(true);
  const dialog = document.createElement('div');
  dialog.style.position = 'fixed';
  dialog.style.inset = '0';
  dialog.style.background = 'rgba(0,0,0,0.65)';
  dialog.style.display = 'grid';
  dialog.style.placeItems = 'center';
  dialog.style.padding = '16px';
  dialog.appendChild(form);
  document.body.appendChild(dialog);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const mood = Number(form.querySelector('[name="mood"]').value);
    const effects = form.querySelector('[name="effects"]').value.trim();
    const notes = form.querySelector('[name="notes"]').value.trim();
    const adherence = form.querySelector('[name="adherence"]').checked;
    const snooze = Number(form.querySelector('[name="snooze"]').value || 0);
    const today = new Date();
    const weekNumber = weeksBetween(new Date(med.startDate), today) + 1;
    med.logs.push({
      id: uuid(),
      weekNumber,
      mood,
      effects,
      notes,
      adherence,
      date: today.toISOString(),
    });
    if (snooze > 0) {
      const snoozeDate = new Date();
      snoozeDate.setDate(snoozeDate.getDate() + snooze * 7);
      med.snoozedUntil = snoozeDate.toISOString();
    } else {
      med.snoozedUntil = null;
    }
    saveAndRender(data);
    dialog.remove();
  });

  form.querySelector('[data-close]').addEventListener('click', () => dialog.remove());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.remove();
  });
}

function removeMed(id) {
  const data = loadData();
  data.meds = data.meds.filter((m) => m.id !== id);
  saveAndRender(data);
}

function updateInterval(id, value) {
  const data = loadData();
  const med = data.meds.find((m) => m.id === id);
  if (!med) return;
  med.reminderEvery = Math.max(1, Math.min(6, Number(value)));
  saveAndRender(data);
}

function snoozeReminder(id, weeks = 1) {
  const data = loadData();
  const med = data.meds.find((m) => m.id === id);
  if (!med) return;
  const date = new Date();
  date.setDate(date.getDate() + weeks * 7);
  med.snoozedUntil = date.toISOString();
  saveAndRender(data);
}

function saveAndRender(data) {
  saveData(data);
  renderStats(data);
  renderReminders(data);
  renderMeds(data);
}

medForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(medForm);
  const med = {
    id: uuid(),
    name: formData.get('name').trim(),
    dose: formData.get('dose').trim(),
    startDate: formData.get('start'),
    durationWeeks: Number(formData.get('duration')),
    reminderEvery: Number(formData.get('interval')),
    notes: formData.get('notes').trim(),
    logs: [],
    snoozedUntil: null,
  };
  const data = loadData();
  data.meds.push(med);
  saveAndRender(data);
  medForm.reset();
});

reminderList.addEventListener('click', (e) => {
  const logId = e.target.getAttribute('data-log');
  const removeId = e.target.getAttribute('data-remove');
  const snoozeId = e.target.getAttribute('data-snooze');
  if (logId) {
    const data = loadData();
    openProgressForm(logId, data);
  }
  if (removeId) removeMed(removeId);
  if (snoozeId) snoozeReminder(snoozeId, 1);
});

reminderList.addEventListener('change', (e) => {
  const intervalId = e.target.getAttribute('data-interval');
  if (intervalId) updateInterval(intervalId, e.target.value);
});

const scrollToFormBtn = document.getElementById('scrollToForm');
const scrollToRemindersBtn = document.getElementById('scrollToReminders');
scrollToFormBtn.addEventListener('click', () => {
  document.getElementById('add').scrollIntoView({ behavior: 'smooth' });
});
scrollToRemindersBtn.addEventListener('click', () => {
  document.getElementById('reminders').scrollIntoView({ behavior: 'smooth' });
});

(function init() {
  const data = loadData();
  saveAndRender(data);
})();
