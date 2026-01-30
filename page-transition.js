<script>
document.addEventListener("DOMContentLoaded", () => {

  const overlay = document.createElement("div");
  overlay.id = "page-transition";
  document.body.appendChild(overlay);

  document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("http")) return;

    link.addEventListener("click", e => {
      e.preventDefault();
      overlay.classList.add("active");
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    });
  });

});
</script>

<style>
#page-transition{
  position:fixed;
  inset:0;
  background:#000;
  opacity:0;
  pointer-events:none;
  transition:opacity .5s ease;
  z-index:9999;
}
#page-transition.active{
  opacity:1;
}
</style>
