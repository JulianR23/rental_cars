'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { PUBLIC_MENU, ADMIN_MENU } from '@/app/lib/menuItems';
import { memoryDb } from '@/app/lib/memoryDb';
import styles from './Navbar.module.css';

export function Navbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const currentUserId = localStorage.getItem('currentUserId');
    if (!currentUserId) {
      setIsAdmin(false);
      return;
    }

    const user = memoryDb.users.find((u) => u.id === currentUserId);
    setIsAdmin(user?.isAdmin ?? false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        RentCar
      </Link>

      <ul className={styles.menu}>
        {PUBLIC_MENU.map(({ label, href }) => {

          if (label === 'Administrativo' && !isAdmin) return null;

          if (label === 'Administrativo') {
            return (
              <li
                key={href}
                ref={dropdownRef}
                className={`${styles.dropdown} ${openDropdown ? styles.open : ''}`}
              >
                <button
                  className={styles.dropdownToggle}
                  onClick={() => setOpenDropdown(!openDropdown)}
                >
                  {label} ▾
                </button>
                {openDropdown && (
                  <ul className={styles.dropdownMenu}>
                    {ADMIN_MENU.map(({ label, href }) => (
                      <li key={href}>
                        <Link href={href}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          }
          return (
            <li key={href} className={pathname === href ? styles.active : ''}>
              <Link href={href}>{label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
