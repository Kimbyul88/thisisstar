"use client";

import Link from "next/link";
import styled from "@emotion/styled";

const Nav = styled.header`
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 1.25rem;
  font-size: 0.95rem;

  a:hover {
    text-decoration: underline;
  }
`;

export default function Header() {
  return (
    <Nav>
      <Link href="/">
        <Logo>thisisstar</Logo>
      </Link>
      <NavLinks>
        <Link href="/">Posts</Link>
      </NavLinks>
    </Nav>
  );
}
