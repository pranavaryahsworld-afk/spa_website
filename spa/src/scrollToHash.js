export const scrollToHash = () => {
  const hash = window.location.hash;
  if (!hash) return;

  const element = document.querySelector(hash);
  if (!element) return;

  const NAVBAR_HEIGHT = 80; // adjust if your navbar height differs

  setTimeout(() => {
    const elementTop =
      element.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: elementTop - NAVBAR_HEIGHT,
      behavior: "smooth",
    });
  }, 150);
};
