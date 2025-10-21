export function loadTimerAnimation() {
  const Timer = bodymovin.loadAnimation({
    container: document.getElementById("Timer"),
    path: "./timer.json",
    renderer: "svg",
    loop: false,
    autoplay: false,
  });

  Timer.goToAndStop(0, false);
  Timer.addEventListener("data_failed", (e) => {
    console.error("❌data_failed timer.json", e);
  });
  return Timer;
}