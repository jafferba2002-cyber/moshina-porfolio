document.addEventListener('DOMContentLoaded', () => {
    const revealItems = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.86;

        revealItems.forEach((item) => {
            const itemTop = item.getBoundingClientRect().top;

            if (itemTop < triggerBottom) {
                item.classList.add('visible');
            }
        });
    };

    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll, { passive: true });
});

(function () {
    var root = document.documentElement;
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var current = function () {
        return root.getAttribute('data-theme') || 'dark';
    };
    var sync = function () {
        var dark = current() === 'dark';
        btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        btn.querySelector('.icon-sun').toggleAttribute('hidden', !dark);
        btn.querySelector('.icon-moon').toggleAttribute('hidden', dark);
    };
    btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('mp-theme', next); } catch (e) {}
        sync();
    });
    sync();
})();

(function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = document.getElementById('form-status');
    var btn = form.querySelector('.submit-btn');
    var ALLOWED = ['gmail.com', 'outlook.com', 'proton.me', 'protonmail.com', 'zoho.com', 'zohomail.com', 'icloud.com', 'jaffersadiq.com', 'webzio.xyz'];

    var setStatus = function (msg, cls) {
        status.textContent = msg;
        status.className = 'form-status ' + (cls || '');
    };

    var checks = {
        name: function (v) {
            return v.trim().length < 2 ? 'Please enter your name.' : '';
        },
        phone: function (v) {
            return /^\d{10,13}$/.test(v.replace(/[\s\-+()]/g, '')) ? '' : 'Please enter a valid contact number (10-13 digits).';
        },
        email: function (v) {
            var m = /^[^\s@]+@([^\s@]+\.[^\s@]+)$/.exec(v.trim().toLowerCase());
            if (!m) return 'Please enter a valid email address.';
            if (ALLOWED.indexOf(m[1]) === -1) return 'Please use a Gmail, Outlook, Proton Mail, Zoho Mail or iCloud Mail address (or @jaffersadiq.com / @webzio.xyz).';
            return '';
        },
        message: function (v) {
            return v.trim().length < 5 ? 'Please write a message.' : '';
        }
    };

    var showError = function (key, msg) {
        var el = form.elements[key];
        var slot = document.getElementById('err-' + key);
        slot.textContent = msg;
        slot.classList.toggle('show', !!msg);
        if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    };

    var validateField = function (key) {
        var msg = checks[key](form.elements[key].value);
        showError(key, msg);
        return !msg;
    };

    Object.keys(checks).forEach(function (key) {
        var el = form.elements[key];
        el.addEventListener('blur', function () { validateField(key); });
        el.addEventListener('input', function () {
            if (el.getAttribute('aria-invalid')) validateField(key);
        });
    });

    var validate = function () {
        var firstBad = null;
        Object.keys(checks).forEach(function (key) {
            if (!validateField(key) && !firstBad) firstBad = form.elements[key];
        });
        if (firstBad) firstBad.focus();
        return !firstBad;
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validate()) return;
        btn.disabled = true;
        setStatus('Sending...', '');
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        }).then(function (res) {
            if (!res.ok) throw new Error('bad status');
            form.reset();
            setStatus('Thank you! Your message has been sent.', 'ok');
        }).catch(function () {
            setStatus('Could not send your message. Please try again or use WhatsApp / email above.', 'err');
        }).then(function () {
            btn.disabled = false;
        });
    });
})();

(function () {
    var nav = document.querySelector('.site-nav');
    var btn = document.getElementById('menu-btn');
    if (!nav || !btn) return;
    var open = function (state) {
        nav.classList.toggle('menu-open', state);
        btn.setAttribute('aria-expanded', String(state));
        btn.setAttribute('aria-label', state ? 'Close menu' : 'Open menu');
        btn.querySelector('.i-open').toggleAttribute('hidden', state);
        btn.querySelector('.i-close').toggleAttribute('hidden', !state);
    };
    btn.addEventListener('click', function () { open(!nav.classList.contains('menu-open')); });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
        a.addEventListener('click', function () { open(false); });
    });
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target)) open(false);
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') open(false);
    });
    window.matchMedia('(min-width: 769px)').addEventListener('change', function () { open(false); });
})();
