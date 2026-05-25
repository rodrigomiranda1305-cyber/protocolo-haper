/* ============================================================
   PROTOCOLO HAPER — FIDELIZE
   script.js  |  Quiz + Accordion
   ============================================================ */

'use strict';

window.addEventListener('load', function () {
  window.scrollTo(0, 0);
});

/* ------------------------------------------------------------
   SEQUÊNCIA COMPLETA DO QUIZ
   Cada item é ou uma pergunta { type:'q', n, text } ou uma
   tela de tensão { type:'t', text }. Ordem é a única fonte
   de verdade — sem lookups, sem cálculos de índice.
   ------------------------------------------------------------ */
var SEQUENCE = [
  {
    type: 'q', n: 1,
    text: 'Ele leva o celular para o banheiro com mais frequência do que levava antes?'
  },
  {
    type: 'q', n: 2,
    text: 'Ele virou o celular com a tela para baixo na sua frente nos últimos dias?'
  },
  {
    type: 'q', n: 3,
    text: 'Ele começou a usar o celular em modo silencioso ou sem vibração quando está com você?'
  },
  {
    type: 't',
    text: 'Por enquanto, são padrões comuns. As próximas perguntas vão fundo.'
  },
  {
    type: 'q', n: 4,
    text: 'Você notou alguma mudança no cheiro dele — perfume novo, sabonete diferente, ou cheiro que você não reconhece?'
  },
  {
    type: 'q', n: 5,
    text: 'Ele começou a se vestir melhor para sair de casa, mesmo para tarefas comuns como ir ao supermercado ou à academia?'
  },
  {
    type: 'q', n: 6,
    text: 'Ele te elogia em momentos aleatórios, sem você ter feito nada de diferente?'
  },
  {
    type: 'q', n: 7,
    text: 'Quando você pergunta algo simples sobre o dia dele, ele dá mais detalhes do que o necessário, como se justificasse algo que você não perguntou?'
  },
  {
    type: 't',
    text: 'Pausa. O padrão que está se formando aqui não é coincidência. Continue.'
  },
  {
    type: 'q', n: 8,
    text: 'O padrão de sono dele mudou nas últimas semanas — dormindo mais cedo, mais tarde, ou em horários irregulares?'
  },
  {
    type: 'q', n: 9,
    text: 'Ele toma banho em horários incomuns, como ao chegar em casa de tarefas curtas ou antes de sair para coisas simples?'
  },
  {
    type: 'q', n: 10,
    text: 'Houve mudança na vida sexual de vocês — mais intensa do nada, ou ao contrário, mais distante?'
  },
  {
    type: 't',
    text: 'Você está no limite do alerta laranja. Faltam apenas 2 perguntas.'
  },
  {
    type: 'q', n: 11,
    text: 'Ele começou a usar gírias, expressões ou palavras novas que não fazem parte do vocabulário dele?'
  },
  {
    type: 'q', n: 12,
    text: 'Você sente, sem conseguir explicar exatamente o porquê, que algo nele está diferente — mesmo que tudo pareça normal por fora?'
  }
  /* Após o último item (índice 14), avançar dispara o loading. */
];

/* Respostas armazenadas localmente — nunca enviadas, resultado é fixo. */
var userAnswers = [];

/* Posição atual na SEQUENCE (−1 = quiz ainda não começou). */
var currentStep = -1;


/* ------------------------------------------------------------
   REFERÊNCIAS DO DOM
   ------------------------------------------------------------ */
var elIntro    = document.getElementById('quiz-intro');
var elProgress = document.getElementById('progress-wrapper');
var elLabel    = document.getElementById('progress-label');
var elFill     = document.getElementById('progress-fill');
var elQuestion = document.getElementById('question-display');
var elQText    = document.getElementById('question-text');
var elTension  = document.getElementById('tension-display');
var elTText    = document.getElementById('tension-text');
var elLoading  = document.getElementById('loading-display');
var btnStart   = document.getElementById('btn-start-quiz');
var btnSim     = document.getElementById('btn-sim');
var btnNao     = document.getElementById('btn-nao');
var btnCont    = document.getElementById('btn-continue');


/* ------------------------------------------------------------
   UTILITÁRIOS
   ------------------------------------------------------------ */

/* Esconde os três painéis intercambiáveis do quiz. */
function hideAll() {
  elQuestion.style.display = 'none';
  elTension.style.display  = 'none';
  elLoading.style.display  = 'none';
}

/*
   Exibe um elemento com animação de entrada.
   Usa classe CSS para a animação — mais confiável que inline style
   porque evita conflitos com a cascade e não depende de reflow manual.
*/
function showPanel(el, displayValue) {
  el.style.display = displayValue;
  el.classList.remove('quiz-anim');
  /* Força reflow para o browser tratar a remoção da classe como
     um frame separado, permitindo que a animação reinicie. */
  el.getBoundingClientRect();
  el.classList.add('quiz-anim');
}


/* ------------------------------------------------------------
   RENDERIZA O PASSO ATUAL
   ------------------------------------------------------------ */
function renderStep(step) {
  if (step >= SEQUENCE.length) {
    startLoading();
    return;
  }

  var item = SEQUENCE[step];
  hideAll();

  if (item.type === 'q') {
    /* Atualiza barra de progresso */
    var pct = Math.round((item.n / 12) * 100);
    elFill.style.width = pct + '%';
    elLabel.textContent = 'Pergunta ' + item.n + ' de 12';

    /* Exibe a pergunta */
    elQText.textContent = item.text;
    showPanel(elQuestion, 'block');

  } else {
    /* Exibe frase de tensão */
    elTText.textContent = item.text;
    showPanel(elTension, 'flex');
  }
}


/* ------------------------------------------------------------
   AVANÇA PARA O PRÓXIMO PASSO
   Chamado por: SIM, NÃO ou CONTINUAR.
   ------------------------------------------------------------ */
function advance() {
  currentStep += 1;
  renderStep(currentStep);
}


/* ------------------------------------------------------------
   PAINEL BORRADO → aparece após Q12.
   Resultado sempre fixo: 22 / Alerta Laranja.
   ------------------------------------------------------------ */
function startLoading() {
  if (typeof fbq === 'function') { fbq('trackCustom', 'CompleteQuiz'); }
  hideAll();
  elFill.style.width = '100%';
  elProgress.style.display = 'none';
  showPanel(elLoading, 'flex');
}


/* ------------------------------------------------------------
   EVENT LISTENERS DO QUIZ
   ------------------------------------------------------------ */

/* Botão "INICIAR DIAGNÓSTICO" */
btnStart.addEventListener('click', function () {
  elIntro.style.display = 'none';
  elProgress.style.display = 'block';
  currentStep = 0;
  renderStep(0);
});

/* Respostas SIM / NÃO — armazenam a resposta e avançam */
btnSim.addEventListener('click', function () {
  if (currentStep >= 0 && currentStep < SEQUENCE.length) {
    var item = SEQUENCE[currentStep];
    if (item.type === 'q') {
      userAnswers.push({ pergunta: item.n, resposta: 'SIM' });
    }
  }
  advance();
});

btnNao.addEventListener('click', function () {
  if (currentStep >= 0 && currentStep < SEQUENCE.length) {
    var item = SEQUENCE[currentStep];
    if (item.type === 'q') {
      userAnswers.push({ pergunta: item.n, resposta: 'NÃO' });
    }
  }
  advance();
});

/* Botão CONTINUAR (após frases de tensão) */
btnCont.addEventListener('click', function () {
  advance();
});


/* ------------------------------------------------------------
   BOTÃO "VER MEU DIAGNÓSTICO COMPLETO"
   Esconde o quiz, revela #page-tail e rola para o resultado.
   ------------------------------------------------------------ */
/* Injeta o player VTurb apenas no momento da revelação, evitando
   carregamento e reprodução antecipada. */
function revealVSL() {
  var container = document.getElementById('vsl-container');
  if (!container || container.dataset.loaded) { return; }
  container.dataset.loaded = 'true';
  container.innerHTML = '<vturb-smartplayer id="vid-6a122082eedd86301a423ca3" style="display:block;margin:0 auto;width:100%;max-width:720px;"></vturb-smartplayer>';
  var s = document.createElement('script');
  s.src = 'https://scripts.converteai.net/8f8a1087-a192-4f93-9fe2-baacd1e8f7f1/players/6a122082eedd86301a423ca3/v4/player.js';
  s.async = true;
  document.head.appendChild(s);
}

document.getElementById('btn-reveal').addEventListener('click', function () {
  if (typeof fbq === 'function') { fbq('trackCustom', 'ViewDiagnostic'); }
  /* Esconde a seção do quiz inteira */
  document.getElementById('quiz').style.display = 'none';

  /* Revela o restante da página */
  var tail = document.getElementById('page-tail');
  tail.style.display = 'block';

  /* Injeta a VSL agora que o conteúdo está visível */
  revealVSL();

  /* Pequeno delay para o browser recalcular o layout antes do scroll */
  setTimeout(function () {
    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
  }, 50);
});


/* ------------------------------------------------------------
   EVENTOS FACEBOOK PIXEL
   ------------------------------------------------------------ */

/* StartQuiz — clique no CTA do hero que leva ao quiz */
(function () {
  var heroCtaLinks = document.querySelectorAll('a[href="#quiz"]');
  heroCtaLinks.forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof fbq === 'function') { fbq('trackCustom', 'StartQuiz'); }
    });
  });
}());

/* InitiateCheckout — clique em qualquer botão de compra Yampi */
(function () {
  var yampiLinks = document.querySelectorAll('a[href="https://checkoutseguro.ru/checkout/cmpkk9y8i0vpl01mnwd6a2abx?offer=W16O0XN"]');
  yampiLinks.forEach(function (el) {
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

      /* Fecha todos */
      triggers.forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
        var b = document.getElementById(t.getAttribute('aria-controls'));
        if (b) b.hidden = true;
      });

      /* Abre o clicado (se estava fechado) */
      if (!expanded && body) {
        this.setAttribute('aria-expanded', 'true');
        body.hidden = false;
      }
    });
  });
}());
