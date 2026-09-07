/* ============================================
   기획자 포트폴리오 - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Pause off-screen autoplay videos (e.g. Thinking page camping clips) to avoid
    // needless, always-on motion and resource use
    const autoplayVideos = document.querySelectorAll('video[autoplay]');
    if (autoplayVideos.length) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play().catch(() => {});
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.25 });

        autoplayVideos.forEach(video => videoObserver.observe(video));
    }

    // Navigation scroll effect
    const nav = document.getElementById('nav');
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.pattern-card, .featured-card, .career-card, .project-card');
    animateElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Accordion functionality
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');

            // Close all accordions
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            // Open clicked accordion if it wasn't active
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabGroup = button.closest('.tab-group');
            const tabId = button.dataset.tab;

            // Update buttons
            tabGroup.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');

            // Update content
            tabGroup.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            tabGroup.querySelector(`[data-content="${tabId}"]`).classList.add('active');
        });
    });

    // Structure Builder - click-to-cascade reveal (Problem -> Data -> AI/Build -> KPI -> Structure)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.querySelectorAll('.structure-builder').forEach(builder => {
        const trigger = builder.querySelector('.structure-builder-trigger');
        const nodes = builder.querySelectorAll('.structure-node');
        const labelDefault = trigger ? trigger.dataset.labelDefault || trigger.textContent.trim() : '';
        const labelActive = trigger ? trigger.dataset.labelActive || labelDefault : '';
        let revealTimers = [];
        let isRevealed = false;

        if (!trigger || !nodes.length) return;

        const clearTimers = () => {
            revealTimers.forEach(t => clearTimeout(t));
            revealTimers = [];
        };

        const reveal = () => {
            clearTimers();
            nodes.forEach((node, i) => {
                const delay = prefersReducedMotion ? 0 : i * 180;
                revealTimers.push(setTimeout(() => node.classList.add('is-revealed'), delay));
            });
            isRevealed = true;
            trigger.classList.add('is-active');
            trigger.setAttribute('aria-expanded', 'true');
            trigger.querySelector('.structure-builder-trigger-label').textContent = labelActive;
        };

        const collapse = () => {
            clearTimers();
            nodes.forEach(node => node.classList.remove('is-revealed'));
            isRevealed = false;
            trigger.classList.remove('is-active');
            trigger.setAttribute('aria-expanded', 'false');
            trigger.querySelector('.structure-builder-trigger-label').textContent = labelDefault;
        };

        trigger.addEventListener('click', () => {
            isRevealed ? collapse() : reveal();
        });
    });

    // How I Work - toggle evidence links per step
    document.querySelectorAll('.pattern-evidence-toggle').forEach(toggle => {
        const evidence = toggle.nextElementSibling;
        if (!evidence || !evidence.classList.contains('pattern-evidence')) return;

        toggle.addEventListener('click', () => {
            const isOpen = evidence.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.firstChild.textContent = isOpen ? '접기 ' : '실제 사례 보기 ';
        });
    });

    // Generic: click a tag to highlight related card(s) elsewhere on the page
    const initTagHighlight = (tagSelector) => {
        const tags = document.querySelectorAll(tagSelector);
        if (!tags.length) return;

        const activate = (tag) => {
            const alreadySelected = tag.classList.contains('is-selected');

            tags.forEach(t => t.classList.remove('is-selected'));
            tags.forEach(t => {
                t.dataset.related.split(' ').forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.remove('is-highlighted');
                });
            });

            if (alreadySelected) return;

            const relatedIds = tag.dataset.related.split(' ');

            tag.classList.add('is-selected');
            let firstEl = null;

            relatedIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.classList.add('is-highlighted');
                    if (!firstEl) firstEl = el;
                }
            });

            if (firstEl) {
                firstEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
            }
        };

        tags.forEach(tag => {
            tag.addEventListener('click', () => activate(tag));
            tag.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activate(tag);
                }
            });
        });
    };

    // Capability Map (Home) - click a capability tag to highlight related Selected Work
    initTagHighlight('.capability-list li[data-related]');

    // Career Overview - click a domain/skill tag to highlight related case studies
    initTagHighlight('.overview-tags .tag[data-related]');

    // Career - toggle full narrative (Context/Role/Key Decision detail + output image) on standard cases
    document.querySelectorAll('.career-detail-toggle').forEach(toggle => {
        const detail = toggle.nextElementSibling;
        const labelDefault = toggle.dataset.labelDefault;
        const labelActive = toggle.dataset.labelActive;
        if (!detail || !detail.classList.contains('career-detail')) return;

        toggle.addEventListener('click', () => {
            const isOpen = detail.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.querySelector('.career-detail-toggle-label').textContent = isOpen ? labelActive : labelDefault;
        });
    });

    // Build Lab category filter (keeps Project TOC and group headers in sync)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');
    const tocItems = document.querySelectorAll('.toc-item[data-category]');
    const buildGroups = document.querySelectorAll('.build-group');

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;
                const matches = (el) => filter === 'all' || el.dataset.category.split(' ').includes(filter);

                projectCards.forEach(card => { card.hidden = !matches(card); });
                tocItems.forEach(item => { item.hidden = !matches(item); });

                buildGroups.forEach(group => {
                    const hasVisibleCard = group.querySelector('.project-card:not([hidden])');
                    const header = group.querySelector('.build-group-header');
                    if (header) header.hidden = !hasVisibleCard;
                });

                document.querySelectorAll('.toc-group').forEach(group => {
                    const hasVisibleItem = group.querySelector('.toc-item:not([hidden])');
                    group.hidden = !hasVisibleItem;
                });
            });
        });
    }

    // Project TOC sticky shadow effect
    const projectToc = document.querySelector('.project-toc');
    if (projectToc) {
        const tocOriginalTop = projectToc.offsetTop;
        const navHeight = nav.offsetHeight;

        const handleTocSticky = () => {
            if (window.scrollY > tocOriginalTop - navHeight) {
                projectToc.classList.add('is-sticky');
            } else {
                projectToc.classList.remove('is-sticky');
            }
        };

        window.addEventListener('scroll', handleTocSticky, { passive: true });
    }

    // Smooth scroll for anchor links (accounting for sticky TOC)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const toc = document.querySelector('.project-toc');
                const tocHeight = toc ? toc.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - tocHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');

    const updateActiveNav = () => {
        const scrollY = window.scrollY;
        const navHeight = nav.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .pattern-card,
    .featured-card,
    .career-card,
    .project-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .pattern-card.animate-in,
    .featured-card.animate-in,
    .career-card.animate-in,
    .project-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
