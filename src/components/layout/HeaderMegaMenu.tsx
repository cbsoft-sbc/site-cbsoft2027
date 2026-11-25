import './HeaderMegaMenu.css';

import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type {
    HeaderMenuDefinition,
    HeaderMenuId,
    HeaderMenuLink,
    HeaderMenuSubLink,
} from '@/data/headerMenu';

interface HeaderMegaMenuProps {
    id: HeaderMenuId;
    menu: HeaderMenuDefinition;
    onNavigate: () => void;
    mobile?: boolean;
}

function MenuLink({
    link,
    label,
    onNavigate,
}: {
    link: HeaderMenuSubLink & { external?: boolean };
    label: string;
    onNavigate: () => void;
}) {
    return link.href.startsWith('/') ? (
        <Link to={link.href} onClick={onNavigate}>{label}</Link>
    ) : (
        <a
            href={link.href}
            onClick={onNavigate}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
        >
            {label}
        </a>
    );
}

export function HeaderMegaMenu({
    id,
    menu,
    onNavigate,
    mobile = false,
}: HeaderMegaMenuProps) {
    const { t } = useTranslation();
    const prefix = mobile ? 'mobile-header' : 'header';
    const panelId = `${prefix}-mega-menu-${id}`;
    const hasSectionTitles = menu.some((section) => section.titleKey);
    const panelRef = useRef<HTMLDivElement>(null);
    const flyoutRef = useRef<HTMLDivElement>(null);
    const focusFirstChild = useRef(false);
    const [openGroup, setOpenGroup] = useState<HeaderMenuLink | null>(null);

    useLayoutEffect(() => {
        const panel = panelRef.current;
        const flyout = flyoutRef.current;
        if (!openGroup || !panel || !flyout) return;

        const placeFlyout = () => {
            const trigger = flyout.previousElementSibling;
            if (!trigger) return;

            const { left, right } = panel.getBoundingClientRect();
            const width = flyout.offsetWidth;
            const edge = 8;
            const fitsOnRight = right + width <= document.documentElement.clientWidth - edge;
            const x = fitsOnRight ? right : left - width;
            const y = Math.min(trigger.getBoundingClientRect().top, window.innerHeight - flyout.offsetHeight - edge);
            flyout.style.left = `${Math.max(edge, x)}px`;
            flyout.style.top = `${Math.max(edge, y)}px`;
        };

        if (!mobile) placeFlyout();
        if (focusFirstChild.current) {
            flyout.querySelector('a')?.focus();
            focusFirstChild.current = false;
        }
        if (mobile) return;

        const onScroll = () => {
            if (flyout.contains(document.activeElement)) {
                placeFlyout();
            } else {
                setOpenGroup(null);
            }
        };
        const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(placeFlyout);
        const header = panel.closest('header');
        if (header) observer?.observe(header);
        observer?.observe(flyout);
        panel.addEventListener('scroll', onScroll);
        window.addEventListener('resize', placeFlyout);
        return () => {
            observer?.disconnect();
            panel.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', placeFlyout);
        };
    }, [mobile, openGroup]);

    return (
        <div
            id={panelId}
            className={`header-mega-menu${mobile ? ' header-mega-menu--mobile' : ''}`}
            role="region"
            aria-labelledby={`${prefix}-trigger-${id}`}
        >
            <div
                className={`header-mega-menu__content${hasSectionTitles ? '' : ' header-mega-menu__content--untitled'}`}
                ref={panelRef}
            >
                {menu.map((section) => (
                    <section className="header-mega-menu__section" key={section.titleKey ?? section.links[0]?.titleKey}>
                        {section.titleKey && <h2>{t(section.titleKey)}</h2>}
                        <ul className="header-mega-menu__links">
                            {section.links.map((link) => {
                                const label = t(link.titleKey);
                                if (!link.children) {
                                    return (
                                        <li key={link.titleKey}>
                                            <MenuLink link={link} label={label} onNavigate={onNavigate} />
                                        </li>
                                    );
                                }

                                const open = openGroup === link;
                                const flyoutId = `${panelId}-${link.titleKey}`;
                                return (
                                    <li
                                        className="header-mega-menu__group"
                                        key={link.titleKey}
                                        onPointerEnter={(event) => {
                                            if (!mobile && event.pointerType === 'mouse') setOpenGroup(link);
                                        }}
                                        onBlur={(event) => {
                                            if (!event.currentTarget.contains(event.relatedTarget)) {
                                                setOpenGroup((current) => current === link ? null : current);
                                            }
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Escape' && open) {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                event.currentTarget.querySelector('button')?.focus();
                                                setOpenGroup(null);
                                            }
                                        }}
                                    >
                                        <button
                                            type="button"
                                            className="header-mega-menu__group-trigger"
                                            aria-expanded={open}
                                            aria-controls={open ? flyoutId : undefined}
                                            onClick={(event) => {
                                                const mouse = 'pointerType' in event.nativeEvent && event.nativeEvent.pointerType === 'mouse';
                                                setOpenGroup((current) => current === link && (mobile || !mouse) ? null : link);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key !== 'ArrowRight') return;
                                                event.preventDefault();
                                                if (open) {
                                                    flyoutRef.current?.querySelector('a')?.focus();
                                                } else {
                                                    focusFirstChild.current = true;
                                                    setOpenGroup(link);
                                                }
                                            }}
                                        >
                                            {label}
                                            <span className="header-mega-menu__chevron" aria-hidden="true">&gt;</span>
                                        </button>
                                        {open && (
                                            <div
                                                ref={flyoutRef}
                                                id={flyoutId}
                                                className={mobile ? 'header-mega-menu__sublinks' : 'header-mega-menu__flyout'}
                                                role="group"
                                                aria-label={label}
                                            >
                                                {link.children.map((child) => (
                                                    <MenuLink key={child.href} link={child} label={t(child.titleKey)} onNavigate={onNavigate} />
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))}
            </div>
        </div>
    );
}
