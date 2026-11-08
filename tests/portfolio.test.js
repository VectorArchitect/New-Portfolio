const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

class ClassList {
    constructor() {
        this.values = new Set();
    }
    add(value) { this.values.add(value); }
    remove(value) { this.values.delete(value); }
    contains(value) { return this.values.has(value); }
    toggle(value, force) {
        const shouldAdd = force === undefined ? !this.contains(value) : Boolean(force);
        if (shouldAdd) this.add(value);
        else this.remove(value);
        return shouldAdd;
    }
}

class Element {
    constructor(id = '', href = '', offsetTop = 0) {
        this.id = id;
        this.href = href;
        this.offsetTop = offsetTop;
        this.clientHeight = 400;
        this.classList = new ClassList();
        this.attributes = new Map();
        if (href) this.attributes.set('href', href);
        this.listeners = new Map();
        this.children = new Set();
        this.focused = false;
    }
    addEventListener(name, callback) {
        if (!this.listeners.has(name)) this.listeners.set(name, []);
        this.listeners.get(name).push(callback);
    }
    dispatch(name, event = {}) {
        for (const callback of this.listeners.get(name) || []) {
            callback({ target: this, ...event });
        }
    }
    setAttribute(name, value) { this.attributes.set(name, String(value)); }
    getAttribute(name) { return this.attributes.get(name) ?? null; }
    removeAttribute(name) { this.attributes.delete(name); }
    contains(target) { return target === this || this.children.has(target); }
    focus() { this.focused = true; }
}

function createEnvironment({ observer = true, reducedMotion = false } = {}) {
    const menu = new Element('mobile-menu');
    menu.setAttribute('aria-expanded', 'false');
    const nav = new Element('primary-navigation');
    const links = [
        new Element('', '#about'),
        new Element('', '#blog'),
        new Element('', '#projects'),
        new Element('', '#contact')
    ];
    links.forEach(link => nav.children.add(link));

    const sections = [
        new Element('hero', '', 0),
        new Element('about', '', 500),
        new Element('blog', '', 1000),
        new Element('projects', '', 1500),
        new Element('contact', '', 2000)
    ];

    const body = new Element('body');
    const documentListeners = new Map();
    const document = {
        body,
        getElementById: id => id === 'mobile-menu' ? menu : null,
        querySelector: selector => selector === '.nav-links' ? nav : null,
        querySelectorAll: selector => {
            if (selector === '.nav-links a') return links;
            if (selector === 'section') return sections;
            return [];
        },
        addEventListener: (name, callback) => documentListeners.set(name, callback),
        dispatch: (name, event = {}) => documentListeners.get(name)?.({ target: body, ...event })
    };

    const windowListeners = new Map();
    let observerInstance = null;
    const window = {
        scrollY: 0,
        lucide: undefined,
        matchMedia: () => ({ matches: reducedMotion }),
        addEventListener: (name, callback) => windowListeners.set(name, callback),
        dispatch: (name, event = {}) => windowListeners.get(name)?.(event)
    };

    if (observer) {
        window.IntersectionObserver = class {
            constructor(callback, options) {
                this.callback = callback;
                this.options = options;
                this.observed = [];
                this.unobserved = [];
                observerInstance = this;
            }
            observe(element) { this.observed.push(element); }
            unobserve(element) { this.unobserved.push(element); }
        };
    }

    vm.runInNewContext(source, { window, document }, { filename: 'script.js' });

    return { menu, nav, links, sections, body, document, window, get observer() { return observerInstance; } };
}

test('mobile navigation exposes and updates its expanded state', () => {
    const env = createEnvironment();
    env.menu.dispatch('click');

    assert.equal(env.nav.classList.contains('active'), true);
    assert.equal(env.menu.getAttribute('aria-expanded'), 'true');

    env.menu.dispatch('click');
    assert.equal(env.nav.classList.contains('active'), false);
    assert.equal(env.menu.getAttribute('aria-expanded'), 'false');
});

test('Escape closes the mobile menu and restores focus', () => {
    const env = createEnvironment();
    env.menu.dispatch('click');
    env.window.dispatch('keydown', { key: 'Escape' });

    assert.equal(env.nav.classList.contains('active'), false);
    assert.equal(env.menu.getAttribute('aria-expanded'), 'false');
    assert.equal(env.menu.focused, true);
});

test('clicking a navigation link closes the mobile menu', () => {
    const env = createEnvironment();
    env.menu.dispatch('click');
    env.links[0].dispatch('click');

    assert.equal(env.nav.classList.contains('active'), false);
    assert.equal(env.menu.getAttribute('aria-expanded'), 'false');
});

test('clicking outside an open mobile menu closes it', () => {
    const env = createEnvironment();
    env.menu.dispatch('click');
    env.document.dispatch('click', { target: new Element('outside') });

    assert.equal(env.nav.classList.contains('active'), false);
});

test('scroll highlighting matches the exact section anchor', () => {
    const env = createEnvironment();
    env.window.scrollY = 600;
    env.window.dispatch('scroll');

    assert.equal(env.links[0].classList.contains('active'), true);
    assert.equal(env.links[0].getAttribute('aria-current'), 'location');
    assert.equal(env.links[1].classList.contains('active'), false);
    assert.equal(env.links[1].getAttribute('aria-current'), null);
});

test('sections are revealed once by IntersectionObserver', () => {
    const env = createEnvironment();
    assert.equal(env.body.classList.contains('js'), true);
    assert.equal(env.observer.observed.length, env.sections.length);

    env.observer.callback([{ isIntersecting: true, target: env.sections[1] }]);

    assert.equal(env.sections[1].classList.contains('visible'), true);
    assert.deepEqual(env.observer.unobserved, [env.sections[1]]);
});

test('sections remain visible when IntersectionObserver is unavailable', () => {
    const env = createEnvironment({ observer: false });

    assert.equal(env.body.classList.contains('js'), false);
    assert.ok(env.sections.every(section => section.classList.contains('visible')));
});

test('reduced-motion preference disables scroll-reveal hiding', () => {
    const env = createEnvironment({ reducedMotion: true });

    assert.equal(env.body.classList.contains('js'), false);
    assert.ok(env.sections.every(section => section.classList.contains('visible')));
});
