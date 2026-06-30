const APP_HEIGHT_VAR = '--ct-app-height';
const VIEWPORT_OFFSET_VAR = '--ct-viewport-offset-top';
const VIEWPORT_INSET_BOTTOM_VAR = '--ct-viewport-inset-bottom';

export const PWA_PAUSE_EVENT = 'coachtek:pwa-pause';
export const PWA_RESUME_EVENT = 'coachtek:pwa-resume';

let hiddenAt: number | null = null;

function setAppHeight() {
  const vv = window.visualViewport;
  const height = vv?.height ?? window.innerHeight;
  const offsetTop = vv?.offsetTop ?? 0;
  const insetBottom = vv ? Math.max(0, window.innerHeight - offsetTop - height) : 0;

  document.documentElement.style.setProperty(APP_HEIGHT_VAR, `${height}px`);
  document.documentElement.style.setProperty(VIEWPORT_OFFSET_VAR, `${offsetTop}px`);
  document.documentElement.style.setProperty(VIEWPORT_INSET_BOTTOM_VAR, `${insetBottom}px`);

  const keyboardOpen = vv ? height < window.innerHeight * 0.82 : false;
  document.documentElement.classList.toggle('ct-keyboard-open', keyboardOpen);
}

function forceRepaint() {
  const root = document.getElementById('root');
  const html = document.documentElement;

  html.classList.add('ct-pwa-resume');
  root?.style.setProperty('transform', 'translateZ(0)');

  requestAnimationFrame(() => {
    root?.style.removeProperty('transform');
    requestAnimationFrame(() => {
      html.classList.remove('ct-pwa-resume');
    });
  });
}

function dispatchPause() {
  document.body.style.removeProperty('overflow');
  window.dispatchEvent(new CustomEvent(PWA_PAUSE_EVENT));
}

function onResume(hiddenMs = 0) {
  setAppHeight();
  forceRepaint();
  window.setTimeout(setAppHeight, 120);
  window.dispatchEvent(new CustomEvent(PWA_RESUME_EVENT, { detail: { hiddenMs } }));
}

function onVisible() {
  if (document.visibilityState !== 'visible') return;
  const hiddenMs = hiddenAt ? Date.now() - hiddenAt : 0;
  hiddenAt = null;
  onResume(hiddenMs);
}

function onHidden() {
  hiddenAt = Date.now();
  dispatchPause();
}

export function initLifecycle() {
  setAppHeight();

  window.addEventListener('resize', setAppHeight);
  window.visualViewport?.addEventListener('resize', setAppHeight);
  window.visualViewport?.addEventListener('scroll', setAppHeight);
  window.addEventListener('orientationchange', () => {
    window.setTimeout(setAppHeight, 100);
  });
  window.addEventListener('focus', onVisible);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') onHidden();
    else onVisible();
  });

  document.addEventListener('pagehide', onHidden);

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      onResume(0);
      return;
    }
    onVisible();
  });
}
