import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.nav}>
      <Link href="/">
        <span className={styles.logo}>thisisstar</span>
      </Link>
      <nav className={styles.navLinks}>
        <Link href="/">Posts</Link>
      </nav>
    </header>
  );
}
