/**
 * v-coming-soon
 *
 * Menandai kontrol yang fiturnya belum dibuat: tampil redup, kursor not-allowed,
 * tooltip penjelas, dan klik diblokir di fase capture sehingga handler apa pun
 * yang menempel di elemen tidak ikut jalan.
 *
 * Sengaja TIDAK memakai atribut `disabled` supaya tooltip tetap muncul saat
 * di-hover (elemen ber-`disabled` tidak memancarkan event mouse di Chrome).
 *
 * Pakai:
 *   <button v-coming-soon>Import CSV</button>
 *   <button v-coming-soon="'Export laporan'">Export Report</button>
 */
const blockEvent = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

export const comingSoon = {
  mounted(el, binding) {
    const label = binding.value || "Fitur ini";

    el.setAttribute("title", `${label} belum tersedia — Coming soon`);
    el.setAttribute("aria-disabled", "true");
    el.dataset.comingSoon = "true";

    el.style.opacity = "0.5";
    el.style.cursor = "not-allowed";

    // Capture phase: jalan sebelum handler milik elemen itu sendiri.
    el.addEventListener("click", blockEvent, true);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") blockEvent(e);
    }, true);
  },

  unmounted(el) {
    el.removeEventListener("click", blockEvent, true);
  },
};

export default comingSoon;
