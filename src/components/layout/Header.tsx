import './Header.css';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { HEADER_MENUS, type HeaderMenuId } from '@/data/headerMenu';
import { getCurrentHeaderMenu, NAV_ITEMS } from '@/data/nav';
import { IMAGES } from '@/data/config';
import { useTopScrollReveal } from '@/hooks/useTopScrollReveal';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { HeaderMegaMenu } from './HeaderMegaMenu';
import { MobileMenu } from './MobileMenu';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { t } = useTranslation();
  const { key, pathname } = useLocation();
  const currentMenu = getCurrentHeaderMenu(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<HeaderMenuId | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusFirstItem = useRef(false);
  const showSbc = useTopScrollReveal(key);

  function cancelClose() {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function closeMegaMenu() {
    cancelClose();
    focusFirstItem.current = false;
    setActiveMenu(null);
  }

  function closeAllMenus() {
    closeMegaMenu();
    setMobileMenuOpen(false);
  }

  useOnClickOutside(headerRef, closeAllMenus, activeMenu !== null || mobileMenuOpen);

  useEffect(() => () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (activeMenu && focusFirstItem.current) {
      headerRef.current
        ?.querySelector<HTMLElement>(`#header-mega-menu-${activeMenu} :is(a, button)`)
        ?.focus();
      focusFirstItem.current = false;
    }
  }, [activeMenu]);

  useEffect(() => {
    const breakpoint = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      setActiveMenu(null);
      setMobileMenuOpen(false);
    };
    breakpoint.addEventListener('change', onChange);
    return () => breakpoint.removeEventListener('change', onChange);
  }, []);

  // Anchor targets and the mobile menu clear the full visible header.
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const rootStyle = document.documentElement.style;
    const update = () => {
      rootStyle.setProperty('--site-header-offset', `${header.offsetHeight}px`);
    };

    update();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    observer?.observe(header);
    return () => {
      observer?.disconnect();
      rootStyle.removeProperty('--site-header-offset');
    };
  }, [key]);

  return (
    <header
      ref={headerRef}
      className="site-header"
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !mobileMenuOpen) return;
        event.preventDefault();
        event.stopPropagation();
        mobileTriggerRef.current?.focus();
        closeAllMenus();
      }}
    >
      <div key={key} className="site-header__sbc" aria-hidden={!showSbc}>
        <div className="site-header__sbc-inner">
          <span className="site-header__sbc-label">{t('header.organizedBy')}</span>
          <a
            href="https://www.sbc.org.br/"
            className="site-header__sbc-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('header.sbcAria')}
            tabIndex={showSbc ? undefined : -1}
          >
            <img src={IMAGES.sbc_logo} alt="" width={597} height={288} />
          </a>
        </div>
      </div>

      <div className="site-header__inner">
        <Link
          to="/"
          className="site-header__logo-link"
          aria-label={t('header.homeAria')}
          onClick={closeAllMenus}
        >
          {/* Brand manual: the full logo needs at least 220px, which only wide
              screens have room for. Smaller screens use the typographic-only
              signature, as the manual prescribes below that size. */}
          <picture>
            <source media="(min-width: 1280px)" srcSet={IMAGES.logo_horizontal} width={5196} height={1802} />
            <img
              className="site-header__logo"
              src={IMAGES.logo_wordmark}
              alt=""
              width={2059}
              height={310}
            />
          </picture>
        </Link>

        <nav className="site-header__nav" aria-label={t('header.navAria')}>
          {NAV_ITEMS.map((item) => {
            const open = activeMenu === item.id;

            return (
              <div
                key={item.id}
                className={`site-header__mega-root site-header__mega-root--${item.id}`}
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'mouse') return;
                  cancelClose();
                  setActiveMenu(item.id);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType !== 'mouse') return;
                  const panel = event.currentTarget.querySelector('.header-mega-menu');
                  cancelClose();
                  closeTimer.current = setTimeout(() => {
                    closeTimer.current = null;
                    if (!panel?.contains(document.activeElement)) {
                      setActiveMenu((current) => current === item.id ? null : current);
                    }
                  }, 150);
                }}
                onBlurCapture={(event) => {
                  if (open && !event.currentTarget.contains(event.relatedTarget)) {
                    closeMegaMenu();
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Escape' || !open) return;
                  event.preventDefault();
                  event.stopPropagation();
                  event.currentTarget.querySelector('button')?.focus();
                  closeMegaMenu();
                }}
              >
                <button
                  id={`header-trigger-${item.id}`}
                  type="button"
                  className={`site-header__nav-item${open ? ' is-active' : ''}${currentMenu === item.id ? ' is-current' : ''}`}
                  aria-current={currentMenu === item.id ? 'location' : undefined}
                  aria-expanded={open}
                  aria-controls={open ? `header-mega-menu-${item.id}` : undefined}
                  onClick={(event) => {
                    cancelClose();
                    const mouse = 'pointerType' in event.nativeEvent && event.nativeEvent.pointerType === 'mouse';
                    setActiveMenu((current) => current === item.id && !mouse ? null : item.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      cancelClose();
                      if (open) {
                        event.currentTarget.parentElement
                          ?.querySelector<HTMLElement>('.header-mega-menu :is(a, button)')
                          ?.focus();
                      } else {
                        focusFirstItem.current = true;
                        setActiveMenu(item.id);
                      }
                    }
                  }}
                >
                  <span>{t(item.key)}</span>
                  <img src={IMAGES.chevron_down} width={16} height={16} alt="" aria-hidden="true" />
                </button>

                {open && (
                  <HeaderMegaMenu
                    id={item.id}
                    menu={HEADER_MENUS[item.id]}
                    onNavigate={closeMegaMenu}
                  />
                )}
              </div>
            );
          })}
        </nav>
        <div className="language-switcher">
          <LanguageSwitcher />
        </div>

        <Link to="/inscricoes" className="site-header__register" onClick={closeAllMenus}>
          {t('header.register')}
        </Link>

        <button
          ref={mobileTriggerRef}
          id="menu-toggle"
          type="button"
          className={`site-header__mobile-toggle${mobileMenuOpen ? ' is-open' : ''}`}
          aria-label={t(mobileMenuOpen ? 'header.closeMenu' : 'header.openMenu')}
          aria-expanded={mobileMenuOpen}
          aria-controls={mobileMenuOpen ? 'mobile-menu' : undefined}
          onClick={() => {
            closeMegaMenu();
            setMobileMenuOpen((open) => !open);
          }}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
    </header>
  );
}
