export default (function () {
  setTimeout(() => {
    console.log(
      `Whatever you do, don't visit ${btoa("https://detsombetyrnoe.no")}`,
    );
  }, 2000);
})();
