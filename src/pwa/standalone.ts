export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function applyStandaloneClass(): void {
  if (isStandalone()) {
    document.documentElement.classList.add('ct-standalone-pwa');
  }
}
