import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from './Landing';
import { MainHeader } from '../components/layout/MainHeader';

// Mock dependencies
vi.mock('../lib/i18n', () => ({
  useLanguage: () => ({ language: 'en', setLanguage: vi.fn() }),
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    isAuthenticated: false,
    logout: vi.fn(),
  }),
}));

vi.mock('../app/providers/ThemeProvider', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}));

vi.mock('../features/wanted/hooks/useImpactStats', () => ({
  useImpactStats: () => ({ data: null }),
}));

vi.mock('../features/wanted/services/wantedApi', () => ({
  wantedApi: {
    getPendingClaims: vi.fn().mockResolvedValue([]),
  },
}));

/**
 * Bug Condition Exploration Test
 * 
 * Property 1: Bug Condition - Hero Full-Screen and Navbar Overlay
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * This test encodes the expected behavior:
 * - Hero section starts at 0px from viewport top
 * - Navbar uses absolute positioning
 * - Spacer div does not exist
 * - Navbar buttons have transparent backgrounds on landing page
 * - Hero section is full viewport height
 * 
 * Expected counterexamples on UNFIXED code:
 * - Hero section top offset is 64px (mobile) or 80px (desktop) instead of 0px
 * - Navbar className contains "fixed" instead of "absolute"
 * - Spacer div exists at end of MainHeader
 * - Navbar buttons have default styling instead of transparent backgrounds
 * - Hero section uses min-h-[80vh] instead of min-h-screen
 */
describe('Bug Condition Exploration: Hero Full-Screen and Navbar Overlay', () => {
  const renderLandingPageWithNavbar = () => {
    const result = render(
      <BrowserRouter>
        <MainHeader />
        <LandingPage />
      </BrowserRouter>
    );
    return result;
  };

  beforeEach(() => {
    // Reset window scroll position
    window.scrollTo(0, 0);
  });

  it('should have hero section starting at 0px from viewport top (currently fails - starts at 64px/80px)', () => {
    const { container } = renderLandingPageWithNavbar();
    
    // Find the hero section (first section in Landing page)
    const heroSection = container.querySelector('section');
    expect(heroSection).toBeTruthy();
    
    // Get computed styles
    const heroStyles = window.getComputedStyle(heroSection);
    
    // Hero should start at top of viewport (0px)
    // On unfixed code, this will fail because spacer div pushes it down
    const heroRect = heroSection.getBoundingClientRect();
    expect(heroRect.top).toBe(0);
  });

  it('should have navbar using absolute positioning (currently fails - uses fixed)', () => {
    const { container } = renderLandingPageWithNavbar();
    
    // Find the navbar header element
    const header = container.querySelector('header');
    expect(header).toBeTruthy();
    
    // Check that navbar className contains 'absolute' and not 'fixed'
    const headerClasses = header.className;
    expect(headerClasses).toContain('absolute');
    expect(headerClasses).not.toContain('fixed');
  });

  it('should not have spacer div (currently fails - spacer div exists)', () => {
    const { container } = renderLandingPageWithNavbar();
    
    // Look for a spacer div that is a direct child of the header (not the nav container)
    // The spacer div should be an empty div with only h-16 md:h-20 classes after the nav
    const header = container.querySelector('header');
    const headerChildren = Array.from(header.children);
    
    // Check if there's a spacer div after the nav element
    // A spacer div would be a div with minimal classes (just height classes)
    const spacerDiv = headerChildren.find(child => {
      if (child.tagName !== 'DIV') return false;
      const classes = child.className;
      // Spacer div has only height classes and no other content
      return (classes.includes('h-16') || classes.includes('md:h-20')) && 
             child.children.length === 0 &&
             !classes.includes('flex') &&
             !classes.includes('items-center');
    });
    
    // On unfixed code, this will fail because spacer div exists
    expect(spacerDiv).toBeUndefined();
  });

  it('should have navbar buttons with transparent backgrounds on landing page (currently fails - solid backgrounds)', () => {
    const { container } = renderLandingPageWithNavbar();
    
    // Find navbar navigation links
    const navLinks = container.querySelectorAll('nav a');
    expect(navLinks.length).toBeGreaterThan(0);
    
    // Check that at least one primary nav link has transparent background classes
    // On landing page when not scrolled, buttons should have transparent backgrounds and white text
    const primaryNavLink = Array.from(navLinks).find(link => 
      link.textContent.includes('Cases') || link.textContent.includes('Report')
    );
    
    expect(primaryNavLink).toBeTruthy();
    const linkClasses = primaryNavLink.className;
    
    // Check for transparent background and white text classes
    // On unfixed code, this will fail because buttons have default dark text
    expect(linkClasses).toContain('bg-transparent');
    expect(linkClasses).toContain('text-white');
  });

  it('should have hero section with full viewport height (currently fails - 80vh)', () => {
    const { container } = renderLandingPageWithNavbar();
    
    // Find the hero section
    const heroSection = container.querySelector('section');
    expect(heroSection).toBeTruthy();
    
    // Check that hero section has min-h-screen class (full viewport height)
    const heroClasses = heroSection.className;
    
    // On unfixed code, this will fail because hero uses min-h-[80vh]
    expect(heroClasses).toContain('min-h-screen');
    expect(heroClasses).not.toContain('min-h-[80vh]');
  });
});
