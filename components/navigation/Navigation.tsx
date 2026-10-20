"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

const routes = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Exercise 1",
    href: "/exercise1",
  },
  {
    label: "Exercise 2",
    href: "/exercise2",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <nav aria-label="Navegación principal">
        <ul className={styles.navigation}>
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                className={styles.navigationLink}
                href={route.href}
                aria-current={pathname === route.href ? "page" : undefined}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
