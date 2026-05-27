/* ============================================================
   PROTOCOLO HAPER — FIDELIZE
   script.js
   ============================================================ */

'use strict';

window.addEventListener('load', function () {
  window.scrollTo(0, 0);
});


/* ============================================================
   FILTRO — 3 PERGUNTAS MÚLTIPLA ESCOLHA
   ============================================================ */
var FILTER_QUESTIONS = [
  {
    text: 'Qual o seu status de relacionamento atual?',
    key: 'status',
    options: ['Ficando', 'Namorando', 'Noivos', 'Casados']
  },
  {
    text: 'Há quanto tempo vocês estão juntos?',
    key: 'tempo',
    options: ['Menos de 1 ano', 'Até 5 anos', 'Até 10 anos', '11 anos ou mais']
  },
  {
    text: 'Se você pudesse colocar a mão no fogo agora, você acha que seu parceiro é:',
    key: 'fidelidade',
    options: [
      '100% fiel',
      'Pode cometer microtraições (pornografia, curtir fotos de outras mulheres, flertar com colegas)',
      '100% infiel'
    ]
  }
];

var FILTER_LOADING_TEXTS = [
  'Cruzando perfil comportamental...',
  'Verificando elegibilidade...',
  'Cruzando com banco de dados do experimento...',
  'Gerando seu resultado...'
];

var filterAnswers   = {};
var currentFilterQ  = 0;

var elFiltroSection   = document.getElementById('filtro-section');
var elFiltroQuiz      = document.getElementById('filtro-quiz');
var elFiltroLabel     = document.getElementById('filtro-progress-label');
var elFiltroFill      = document.getElementById('filtro-progress-fill');
var elFiltroDisplay   = document.getElementById('filtro-question-display');
var elFiltroText      = document.getElementById('filtro-question-text');
var elFiltroOptions   = document.getElementById('filtro-options');
var elFiltroLoading   = document.getElementById('filtro-loading');
var elFiltroLoadFill  = document.getElementById('filtro-loading-fill');
var elFiltroLoadText  = document.getElementById('filtro-loading-text');
var elPageTail        = document.getElementById('page-tail');
var elAprovacaoText   = document.getElementById('aprovacao-dynamic-text');

function showFilterQuestion(index) {
  var q = FILTER_QUESTIONS[index];

  elFiltroLabel.textContent = 'Pergunta ' + (index + 1) + ' de 3';
  elFiltroFill.style.width  = Math.round((index / 3) * 100) + '%';

  elFiltroDisplay.classList.remove('filtro-fade-in');
  void elFiltroDisplay.getBoundingClientRect();
  elFiltroDisplay.classList.add('filtro-fade-in');

  elFiltroText.textContent = q.text;
  elFiltroOptions.innerHTML = '';

  q.options.forEach(function (opt) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-filtro-option';
    btn.textContent = opt;
    btn.addEventListener('click', function () {
      filterAnswers[q.key] = opt;
      handleFilterAnswer();
    });
    elFiltroOptions.appendChild(btn);
  });
}

function handleFilterAnswer() {
  currentFilterQ += 1;
  if (currentFilterQ >= FILTER_QUESTIONS.length) {
    if (typeof fbq === 'function') { fbq('trackCustom', 'CompleteFilter'); }
    elFiltroQuiz.style.display = 'none';
    startFilterLoading();
  } else {
    showFilterQuestion(currentFilterQ);
  }
}

function startFilterLoading() {
  elFiltroLoading.style.display = 'flex';
  elFiltroLoading.scrollIntoView({ behavior: 'smooth' });

  var startTime  = Date.now();
  var duration   = 4000;
  var textIndex  = 0;

  elFiltroLoadText.textContent = FILTER_LOADING_TEXTS[0];

  var textInterval = setInterval(function () {
    textIndex += 1;
    if (textIndex < FILTER_LOADING_TEXTS.length) {
      elFiltroLoadText.textContent = FILTER_LOADING_TEXTS[textIndex];
    }
  }, 1000);

  function tick() {
    var elapsed = Date.now() - startTime;
    var pct = Math.min((elapsed / duration) * 100, 100);
    elFiltroLoadFill.style.width = pct + '%';

    if (pct < 100) {
      requestAnimationFrame(tick);
    } else {
      clearInterval(textInterval);
      if (typeof fbq === 'function') { fbq('trackCustom', 'ViewApproval'); }
      buildApprovalMessage();
      elFiltroSection.style.display = 'none';
      elPageTail.style.display      = 'block';
      setTimeout(function () {
        document.getElementById('aprovacao-section').scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }

  requestAnimationFrame(tick);
}

function buildApprovalMessage() {
  var statusMap = {
    'Ficando':   'ficando com alguém',
    'Namorando': 'namorando',
    'Noivos':    'noivas',
    'Casados':   'casadas'
  };
  var tempoMap = {
    'Menos de 1 ano':  'menos de 1 ano',
    'Até 5 anos':      'entre 1 e 5 anos',
    'Até 10 anos':     'entre 5 e 10 anos',
    '11 anos ou mais': 'há mais de 11 anos'
  };
  var fidelidadeMap = {
    '100% fiel': 'é 100% fiel',
    'Pode cometer microtraições (pornografia, curtir fotos de outras mulheres, flertar com colegas)': 'pode cometer microtraições',
    '100% infiel': 'é 100% infiel'
  };

  var status     = statusMap[filterAnswers.status]         || filterAnswers.status     || '—';
  var tempo      = tempoMap[filterAnswers.tempo]           || filterAnswers.tempo       || '—';
  var fidelidade = fidelidadeMap[filterAnswers.fidelidade] || filterAnswers.fidelidade || '—';

  elAprovacaoText.textContent =
    'Uau! Mulheres que estão ' + status + ', há ' + tempo +
    ', e que pensam que o parceiro ' + fidelidade +
    ' correspondem a aproximadamente 50% das nossas clientes — quase metade.' +
    ' Saber disso agora vai te dar uma clareza que você nem imagina ter.';
}

document.getElementById('btn-iniciar-verificacao').addEventListener('click', function () {
  if (typeof fbq === 'function') { fbq('trackCustom', 'StartFilter'); }
  currentFilterQ  = 0;
  filterAnswers   = {};
  showFilterQuestion(0);
  elFiltroSection.style.display = 'block';
  setTimeout(function () {
    elFiltroSection.scrollIntoView({ behavior: 'smooth' });
  }, 50);
});


/* ============================================================
   EVENTO FACEBOOK PIXEL — InitiateCheckout
   ============================================================ */
(function () {
  var links = document.querySelectorAll('a[href="https://checkoutseguro.ru/checkout/cmpkk9y8i0vpl01mnwd6a2abx?offer=W16O0XN"]');
  links.forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof fbq === 'function') { fbq('track', 'InitiateCheckout'); }
    });
  });
}());


/* ============================================================
   ACCORDION — FAQ
   ============================================================ */
(function () {
  var triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var bodyId   = this.getAttribute('aria-controls');
      var body     = document.getElementById(bodyId);

      triggers.forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
        var b = document.getElementById(t.getAttribute('aria-controls'));
        if (b) b.hidden = true;
      });

      if (!expanded && body) {
        this.setAttribute('aria-expanded', 'true');
        body.hidden = false;
      }
    });
  });
}());
