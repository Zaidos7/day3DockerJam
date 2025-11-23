function toggle() {
  const el = document.getElementById("logs");
  if (!el) return;
  if (el.hasAttribute("hidden")) el.removeAttribute("hidden");
  else {
    el.setAttribute("hidden", "");
    el.innerText = "Logs";
  }
}
function toggleN() {
  const el = document.getElementById("network");
  if (!el) return;
  if (el.hasAttribute("hidden")) el.removeAttribute("hidden");
  else {
    el.setAttribute("hidden", "");
    el.innerText = "Network";
  }
}
document.getElementById("start").onclick = async () => {
  try {
    await window.sandboxAPI.start();
  } catch (err) {
    console.error("start failed.", err);
    document.getElementById("logs").textContent =
      "start error:\n" + (err && err.message ? err.message : String(err));
  }
  await refereshLogs();
};

document.getElementById("stop").onclick = async () => {
  try {
    await window.sandboxAPI.stop();
  } catch (err) {
    console.error("stop failed.", err);
    document.getElementById("logs").textContent =
      "stop error:\n" + (err && err.message ? err.message : String(err));
  }
  await refereshLogs();
};

document.getElementById("reset").onclick = async () => {
  if (
    !confirm(
      "Reset Sandbox? This will delete volumes, and reset sandbox network."
    )
  )
    return;
  try {
    const res = await window.sandboxAPI.reset();

    if (res) document.getElementById("logs").textContent = String(res);
  } catch (err) {
    console.error("reset failed.", err);
    document.getElementById("logs").textContent =
      "reset error:\n" + (err && err.message ? err.message : String(err));
  }
  await refereshLogs();
};
async function refereshLogs() {
  try {
    const logs = await window.sandboxAPI.logs();
    let text = "";
    if (!logs) text = "Logs";
    else if (typeof logs === "string") text = logs;
    else if (logs.stdout || logs.stderr)
      text =
        (logs.stdout || "") + (logs.stderr ? "\n[stderr]\n" + logs.stderr : "");
    else text = String(logs);
    document.getElementById("logs").textContent = text;
  } catch (err) {
    console.error("Failed to fetch logs.", err);
    document.getElementById("logs").textContent =
      "Failed to fetch logs:\n" +
      (err && err.message ? err.message : String(err));
  }
}

async function refereshNetwork() {
  try {
    const network = await window.sandboxAPI.network();
    let text = "";
    if (!network) text = "Network";
    else if (typeof network === "string") text = network;
    else if (network.stdout || network.stderr)
      text =
        (network.stdout || "") +
        (network.stderr ? "\n[stderr]\n" + network.stderr : "");
    else text = String(network);
    document.getElementById("network").textContent = text;
  } catch (err) {
    console.error("Failed to fetch network.", err);
    document.getElementById("network").textContent =
      "Failed to fetch network:\n" + (err?.message || JSON.stringify(err));
  }
}

setInterval(refereshLogs, 2000);
setInterval(refereshNetwork, 2000);
