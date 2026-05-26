/* ============================================================
   PROTOCOLO HAPER — FIDELIZE
   script.js
   ============================================================ */

'use strict';

window.addEventListener('load', function () {
  window.scrollTo(0, 0);
});


/* ------------------------------------------------------------
   EVENTO FACEBOOK PIXEL — InitiateCheckout
   ------------------------------------------------------------ */
(function () {
  var checkoutLinks = document.querySelectorAll('a[href="https://checkoutseguro.ru/checkout/cmpkk9y8i0vpl01mnwd6a2abx?offer=W16O0XN"]');
  checkoutLinks.forEach(function (el) {
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
