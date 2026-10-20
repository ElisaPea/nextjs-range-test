import Link from "next/link";
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
  return (
    <header className={styles.header}>
      <nav aria-label="Navegación principal">
        <ul className={styles.navigation}>
          {routes.map((route) => (
            <li key={route.href}>
              <Link className={styles.navigationLink} href={route.href}>
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
