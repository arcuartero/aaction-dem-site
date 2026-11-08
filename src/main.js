(function () {
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  var track = document.querySelector('.rtrack');
  if (track) {
    document.querySelectorAll('.rnav').forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = b.classList.contains('rnav--next') ? 1 : -1;
        track.scrollBy({ left: dir * track.clientWidth / 1.5, behavior: 'smooth' });
      });
    });
  }
})();

// Filtres de la FAQ
const ff = document.querySelector('.ffilter');
if (ff) {
  ff.hidden = false;
  const items = document.querySelectorAll('.faq--filter details');
  ff.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    ff.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    items.forEach((d) => { d.hidden = b.dataset.cat !== 'all' && d.dataset.cat !== b.dataset.cat; });
  });
}
// Raccourcis de thèmes dans le hero de la FAQ
document.querySelectorAll('[data-faqcat]').forEach((a) => a.addEventListener('click', () => {
  document.querySelector(`.ffilter [data-cat="${a.dataset.faqcat}"]`)?.click();
}));


// Sélecteur de date aux couleurs du site (remplace le calendrier natif ; sans JS, le champ date natif reste utilisable)
(() => {
  const en = document.documentElement.lang.startsWith('en');
  const T = en
    ? { months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'], ph: 'dd/mm/yyyy', prev: 'Previous month', next: 'Next month', clear: 'Clear', today: 'Today', label: 'Choose a date' }
    : { months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'], days: ['L', 'M', 'M', 'J', 'V', 'S', 'D'], ph: 'jj/mm/aaaa', prev: 'Mois précédent', next: 'Mois suivant', clear: 'Effacer', today: 'Aujourd’hui', label: 'Choisir une date' };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fr = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  document.querySelectorAll('input[data-datepicker]').forEach((input) => {
    const hidden = document.createElement('input');
    hidden.type = 'hidden'; hidden.name = input.name; input.removeAttribute('name');
    input.type = 'text'; input.readOnly = true; input.placeholder = T.ph; input.classList.add('dp-input');
    input.setAttribute('aria-haspopup', 'dialog'); input.setAttribute('autocomplete', 'off');
    input.after(hidden);
    const wrap = document.createElement('div'); wrap.className = 'dp-wrap';
    input.parentNode.insertBefore(wrap, input); wrap.append(input, hidden);
    const pop = document.createElement('div');
    pop.className = 'dp'; pop.hidden = true; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', T.label);
    wrap.append(pop);
    let view = new Date(today.getFullYear(), today.getMonth(), 1), sel = null;
    const render = () => {
      const y = view.getFullYear(), m = view.getMonth();
      const first = (new Date(y, m, 1).getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate();
      const canPrev = new Date(y, m, 1) > new Date(today.getFullYear(), today.getMonth(), 1);
      let cells = '';
      for (let i = 0; i < first; i++) cells += '<span></span>';
      for (let d = 1; d <= n; d++) {
        const dt = new Date(y, m, d), past = dt < today;
        const cls = [dt.getTime() === today.getTime() ? 'is-today' : '', sel && dt.getTime() === sel.getTime() ? 'is-sel' : ''].join(' ').trim();
        cells += `<button type="button" data-d="${d}"${past ? ' disabled' : ''}${cls ? ` class="${cls}"` : ''} aria-label="${d} ${T.months[m]} ${y}">${d}</button>`;
      }
      pop.innerHTML = `<div class="dp__head"><button type="button" class="dp__nav" data-nav="-1" aria-label="${T.prev}"${canPrev ? '' : ' disabled'}>‹</button><strong>${T.months[m]} ${y}</strong><button type="button" class="dp__nav" data-nav="1" aria-label="${T.next}">›</button></div>
<div class="dp__days">${T.days.map((x) => `<span>${x}</span>`).join('')}</div><div class="dp__grid">${cells}</div>
<div class="dp__foot"><button type="button" data-act="clear">${T.clear}</button><button type="button" data-act="today">${T.today}</button></div>`;
    };
    const open = () => { render(); pop.hidden = false; input.setAttribute('aria-expanded', 'true'); (pop.querySelector('.is-sel') || pop.querySelector('.is-today') || pop.querySelector('.dp__grid button:not([disabled])'))?.focus(); };
    const close = (focus) => { pop.hidden = true; input.setAttribute('aria-expanded', 'false'); if (focus) input.focus(); };
    const pick = (d) => { sel = d; input.value = d ? fr(d) : ''; hidden.value = d ? iso(d) : ''; close(true); };
    input.addEventListener('click', () => (pop.hidden ? open() : close()));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); open(); } if (e.key === 'Backspace' || e.key === 'Delete') pick(null); });
    pop.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b || b.disabled) return;
      if (b.dataset.nav) { view = new Date(view.getFullYear(), view.getMonth() + Number(b.dataset.nav), 1); render(); pop.querySelector(`[data-nav="${b.dataset.nav}"]`)?.focus(); }
      else if (b.dataset.d) pick(new Date(view.getFullYear(), view.getMonth(), Number(b.dataset.d)));
      else if (b.dataset.act === 'clear') pick(null);
      else if (b.dataset.act === 'today') pick(new Date(today));
    });
    pop.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') return close(true);
      const b = e.target.closest('.dp__grid button'); if (!b) return;
      const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]; if (!step) return;
      e.preventDefault();
      const target = new Date(view.getFullYear(), view.getMonth(), Number(b.dataset.d) + step);
      if (target < today) return;
      if (target.getMonth() !== view.getMonth()) { view = new Date(target.getFullYear(), target.getMonth(), 1); render(); }
      pop.querySelector(`[data-d="${target.getDate()}"]`)?.focus();
    });
    document.addEventListener('click', (e) => { if (!pop.hidden && !wrap.contains(e.target)) close(); });
  });
})();

// Bouton téléphone (en-tête + barre mobile) : si les bureaux sont fermés, pop-up qui redirige vers le formulaire de devis.
// Horaires de l'agence de Knutange (heure de Paris) + jours fériés d'Alsace-Moselle (dont Vendredi saint et 26 décembre).
(() => {
  const links = document.querySelectorAll('a[data-hours-check]');
  if (!links.length) return;
  const SLOTS = [[8 * 60 + 45, 12 * 60], [14 * 60, 17 * 60 + 30]];
  const en = document.documentElement.lang.startsWith('en');
  const parisNow = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { d: new Date(Date.UTC(+p.year, +p.month - 1, +p.day)), min: +p.hour * 60 + +p.minute };
  };
  const easter = (y) => { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1; return new Date(Date.UTC(y, mo - 1, da)); };
  const key = (d) => d.toISOString().slice(0, 10);
  const holidays = (y) => { const e = easter(y).getTime(), day = 864e5; return new Set([`${y}-01-01`, `${y}-05-01`, `${y}-05-08`, `${y}-07-14`, `${y}-08-15`, `${y}-11-01`, `${y}-11-11`, `${y}-12-25`, `${y}-12-26`, ...[-2, 1, 39, 50].map((n) => key(new Date(e + n * day)))]); };
  const workday = (d) => d.getUTCDay() >= 1 && d.getUTCDay() <= 5 && !holidays(d.getUTCFullYear()).has(key(d));
  const status = () => {
    const { d, min } = parisNow();
    if (workday(d) && SLOTS.some(([o, c]) => min >= o && min < c)) return { open: true };
    for (let i = 0; i < 15; i++) {
      const day = new Date(d.getTime() + i * 864e5);
      if (!workday(day)) continue;
      const slot = SLOTS.find(([o]) => i > 0 || o > min);
      if (slot) return { open: false, day, at: slot[0], today: i === 0, tomorrow: i === 1 };
    }
    return { open: false };
  };
  const hhmm = (m) => `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`;
  const T = en
    ? { title: 'Our offices are closed', hours: 'We can be reached Monday to Friday, 8:45am–12pm and 2pm–5:30pm.', reopen: 'We reopen', today: 'today', tomorrow: 'tomorrow', at: 'at', cta: 'Request a free quote', call: 'Call anyway', close: 'Close', locale: 'en-GB', form: '#devis', or: 'or', cbTitle: 'Get a call back', cbLabel: 'Your phone number', cbPh: 'e.g. +352 621 123 456', cbBtn: 'Call me back', cbNote: 'We will call you back as soon as we reopen. Your number is only used for this call.', cbOk: 'Thank you! We will call you back as soon as we reopen.', cbErr: 'Sending failed. Please try again or use the quote form.', cbBad: 'Please enter a valid phone number.' }
    : { title: 'Nos bureaux sont fermés', hours: 'Nous sommes joignables du lundi au vendredi, de 8h45 à 12h et de 14h à 17h30.', reopen: 'Réouverture', today: 'aujourd’hui', tomorrow: 'demain', at: 'à', cta: 'Demander un devis gratuit', call: 'Appeler quand même', close: 'Fermer', locale: 'fr-FR', form: '/contact/#devis', or: 'ou', cbTitle: 'Être rappelé', cbLabel: 'Votre numéro de téléphone', cbPh: 'Ex. 06 12 34 56 78', cbBtn: 'Me rappeler', cbNote: 'Nous vous rappelons dès la réouverture. Votre numéro sert uniquement à ce rappel.', cbOk: 'Merci ! Nous vous rappelons dès la réouverture.', cbErr: 'L’envoi a échoué. Réessayez ou utilisez le formulaire de devis.', cbBad: 'Merci d’indiquer un numéro de téléphone valide.' };
  let dlg;
  const show = (st, tel) => {
    const when = st.day ? (st.today ? T.today : st.tomorrow ? T.tomorrow : new Intl.DateTimeFormat(T.locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(st.day)) : '';
    const formHref = en ? (document.getElementById('devis') ? '#devis' : '/contact/#devis') : T.form;
    if (!dlg) { dlg = document.createElement('dialog'); dlg.className = 'closed-dlg'; dlg.setAttribute('aria-labelledby', 'closed-dlg-title'); document.body.append(dlg); dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); }); }
    dlg.innerHTML = `<button type="button" class="closed-dlg__x" aria-label="${T.close}">×</button>
<div class="closed-dlg__icon" aria-hidden="true"><svg viewBox="0 0 48 48" width="56" height="56" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="19"/><path d="M24 13v11l7 5"/></svg></div>
<h2 id="closed-dlg-title">${T.title}</h2>
<p>${T.hours}${when ? ` <strong>${T.reopen} ${when} ${T.at} ${hhmm(st.at)}.</strong>` : ''}</p>
<a class="btn btn--red closed-dlg__cta" href="${formHref}">${T.cta} →</a>
<p class="closed-dlg__or"><span>${T.or}</span></p>
<form class="closed-dlg__cb" novalidate>
  <p class="closed-dlg__cbt">${T.cbTitle}</p>
  <label class="sr-only" for="cb-tel">${T.cbLabel}</label>
  <div class="closed-dlg__cbrow"><input id="cb-tel" name="telephone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="${T.cbPh}"><button type="submit" class="btn btn--outline-red">${T.cbBtn}</button></div>
  <p class="closed-dlg__cbn" role="status">${T.cbNote}</p>
</form>
<a class="closed-dlg__call" href="${tel}">${T.call}</a>`;
    const cb = dlg.querySelector('.closed-dlg__cb');
    cb.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = cb.querySelector('input'), note = cb.querySelector('.closed-dlg__cbn'), btn = cb.querySelector('button');
      const digits = input.value.replace(/\D/g, '');
      if (digits.length < 9 || digits.length > 15) { note.textContent = T.cbBad; note.className = 'closed-dlg__cbn is-err'; input.focus(); return; }
      const src = document.querySelector('form[name="rappel"]');
      const data = new URLSearchParams({ 'form-name': 'rappel', _subject: 'Demande de rappel – site Aaction Dem', telephone: input.value.trim(), page: location.pathname, reouverture: when ? `${when} ${hhmm(st.at)}` : '', 'bot-field': '' });
      const action = src && /^https?:/.test(src.getAttribute('action')) ? src.getAttribute('action') : '/';
      btn.disabled = true;
      try {
        const r = await fetch(action, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' }, body: data.toString() });
        if (!r.ok) throw new Error(r.status);
        cb.innerHTML = `<p class="closed-dlg__ok" role="status"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>${T.cbOk}</p>`;
      } catch { note.textContent = T.cbErr; note.className = 'closed-dlg__cbn is-err'; btn.disabled = false; }
    });
    dlg.querySelector('.closed-dlg__x').addEventListener('click', () => dlg.close());
    dlg.querySelector('.closed-dlg__cta').addEventListener('click', () => dlg.close());
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  };
  links.forEach((a) => a.addEventListener('click', (e) => {
    const st = status();
    if (st.open) return;
    e.preventDefault();
    show(st, a.getAttribute('href'));
  }));
})();

// Formulaires de devis : si l'action est un service externe (Formspree…), envoi en arrière-plan puis page « merci » du site.
document.querySelectorAll('form.form[data-next]').forEach((f) => {
  if (!/^https?:/.test(f.getAttribute('action') || '')) return;   // Netlify Forms : envoi classique
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!f.reportValidity()) return;
    const btn = f.querySelector('button[type="submit"]');
    let msg = f.querySelector('.form__err');
    if (!msg) { msg = document.createElement('p'); msg.className = 'form__err'; msg.setAttribute('role', 'alert'); btn.after(msg); }
    msg.textContent = ''; btn.disabled = true;
    try {
      const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(r.status);
      location.href = f.dataset.next;
    } catch {
      btn.disabled = false;
      msg.textContent = document.documentElement.lang.startsWith('en')
        ? 'Sending failed. Please try again or call us on +33 3 82 85 49 43.'
        : 'L’envoi a échoué. Réessayez ou appelez-nous au 03 82 85 49 43.';
    }
  });
});
