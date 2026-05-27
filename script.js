/* ============================================================
   PROTOCOLO HAPER — FIDELIZE
   script.js
   ============================================================ */

'use strict';

window.addEventListener('load', function () {
  window.scrollTo(0, 0);
});

/* ============================================================
   QUIZ — 5 PERGUNTAS
   ============================================================ */
var PERGUNTAS = [
  'Ele te elogia com frequência logo pela manhã, antes mesmo de qualquer interação relevante entre vocês?',
  'Ele tem uma atividade fixa semanal fora de casa — como futebol, academia em horário irregular, ou encontros com amigos — que se tornou inegociável nos últimos meses?',
  'Ele começou a demonstrar interesse novo por roupas, perfumes, cortes de cabelo ou cuidados pessoais que antes não tinha?',
  'Ele evita usar o celular na sua frente, ou virou o celular com a tela para baixo em situações que antes deixava normal?',
  'Ele te dá pequenos presentes ou demonstrações de carinho sem motivo aparente, em momentos em que vocês não estavam comemorando nada?'
];

var currentQuestion = 0;

var elQuizSection     = document.getElementById('quiz-section');
var elProgressLabel   = document.getElementById('quiz-progress-label');
var elProgressFill    = document.getElementById('quiz-progress-fill');
var elQuestionDisplay = document.getElementById('quiz-question-display');
var elQuestionText    = document.getElementById('quiz-question-text');
var elBtnSim          = document.getElementById('btn-sim');
var elBtnNao          = document.getElementById('btn-nao');
var elLoadingSection  = document.getElementById('loading-section');
var elPageTail        = document.getElementById('page-tail');

function showQuestion(index) {
  elProgressLabel.textContent = 'Pergunta ' + (index + 1) + ' de 5';
  elProgressFill.style.width = Math.round((index / 5) * 100) + '%';

  elQuestionDisplay.classList.remove('quiz-fade-in');
  void elQuestionDisplay.getBoundingClientRect();
  elQuestionDisplay.classList.add('quiz-fade-in');

  elQuestionText.textContent = PERGUNTAS[index];
}

function handleAnswer() {
  currentQuestion += 1;

  if (currentQuestion >= PERGUNTAS.length) {
    if (typeof fbq === 'function') { fbq('trackCustom', 'CompleteQuiz'); }
    elQuizSection.style.display = 'none';
    startLoading();
  } else {
    showQuestion(currentQuestion);
  }
}

elBtnSim.addEventListener('click', handleAnswer);
elBtnNao.addEventListener('click', handleAnswer);


/* ============================================================
   LOADING — 5 SEGUNDOS
   ============================================================ */
var LOADING_TEXTS = [
  'Cruzando padrões comportamentais...',
  'Identificando ativações límbicas...',
  'Calculando pontuação Haper...',
  'Cruzando com banco de dados do experimento...',
  'Gerando seu diagnóstico...'
];

function startLoading() {
  elLoadingSection.style.display = 'flex';
  elLoadingSection.scrollIntoView({ behavior: 'smooth' });

  var barFill   = document.getElementById('loading-bar-fill');
  var textEl    = document.getElementById('loading-text');
  var startTime = Date.now();
  var duration  = 5000;
  var textIndex = 0;

  textEl.textContent = LOADING_TEXTS[0];

  var textInterval = setInterval(function () {
    textIndex += 1;
    if (textIndex < LOADING_TEXTS.length) {
      textEl.textContent = LOADING_TEXTS[textIndex];
    }
  }, 1000);

  function tick() {
    var elapsed = Date.now() - startTime;
    var pct = Math.min((elapsed / duration) * 100, 100);
    barFill.style.width = pct + '%';

    if (pct < 100) {
      requestAnimationFrame(tick);
    } else {
      clearInterval(textInterval);
      if (typeof fbq === 'function') { fbq('trackCustom', 'ViewResult'); }
      elLoadingSection.style.display = 'none';
      elPageTail.style.display = 'block';
      injectVSL();
      setTimeout(function () {
        document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }

  requestAnimationFrame(tick);
}


/* ============================================================
   VSL — INJEÇÃO TARDIA (evita autoplay antes do resultado)
   ============================================================ */
function injectVSL() {
  var container = document.getElementById('vsl-container');
  if (!container || container.dataset.loaded) { return; }
  container.dataset.loaded = 'true';
  container.innerHTML = '<vturb-smartplayer id="vid-6a122082eedd86301a423ca3" style="display:block;margin:0 auto;width:100%;max-width:720px;"></vturb-smartplayer>';
  var s = document.createElement('script');
  s.src = 'https://scripts.converteai.net/8f8a1087-a192-4f93-9fe2-baacd1e8f7f1/players/6a122082eedd86301a423ca3/v4/player.js';
  s.async = true;
  document.head.appendChild(s);
}


/* ============================================================
   BOTÃO INICIAR QUIZ
   ============================================================ */
document.getElementById('btn-iniciar-quiz').addEventListener('click', function () {
  if (typeof fbq === 'function') { fbq('trackCustom', 'StartQuiz'); }
  currentQuestion = 0;
  showQuestion(0);
  elQuizSection.style.display = 'block';
  setTimeout(function () {
    elQuizSection.scrollIntoView({ behavior: 'smooth' });
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
