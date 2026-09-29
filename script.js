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
    var mqDark = window.matchMedia('(prefers-color-scheme: dark)');
    var current = function () {
        return root.getAttribute('data-theme') || (mqDark.matches ? 'dark' : 'light');
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
    if (mqDark.addEventListener) mqDark.addEventListener('change', sync);
    sync();
})();
