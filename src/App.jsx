import { useEffect, useState } from "react";

const STORAGE_KEY = "claudeRtlEnabled";

function readSetting() {
  if (!chrome?.storage?.sync) {
    return Promise.resolve(false);
  }

  return chrome.storage.sync
    .get({ [STORAGE_KEY]: false })
    .then((result) => Boolean(result[STORAGE_KEY]))
    .catch(() => false);
}

function saveSetting(value) {
  if (!chrome?.storage?.sync) {
    return Promise.resolve();
  }

  return chrome.storage.sync.set({ [STORAGE_KEY]: value });
}

export default function App() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    readSetting().then((value) => {
      setEnabled(value);
      setReady(true);
    });
  }, []);

  const onToggle = async () => {
    const next = !enabled;
    setEnabled(next);
    await saveSetting(next);
  };

  return (
    <main className="popup-shell">
      <section className="card">
        <header className="card-top">
          <p className="eyebrow">Claude Arabic RTL</p>

          <button
            className={`switch ${enabled ? "switch-on" : ""}`}
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            disabled={!ready}
            aria-label="تفعيل أو إيقاف RTL"
            title="Toggle RTL for Claude responses"
          >
            <span className="switch-thumb" />
          </button>
        </header>

        <div className="title-wrap">
          <h1 className="title-one-line">تعديل اتجاه RTL لردود Claude</h1>
          <p className="subline">يعمل فقط على claude.ai</p>
        </div>

        <div className="chip-row">
          <span className="chip">Arabic Detect</span>
          <span className="chip">Response Only</span>
        </div>

        <p className="description">
          هذا الخيار يطبق RTL على الردود العربية فقط، بدون تغيير اتجاه واجهة Claude نفسها.
        </p>

        <footer className="status-line">
          <span className={`dot ${enabled ? "dot-on" : "dot-off"}`} />
          <span>{enabled ? "الحالة: مفعل" : "الحالة: متوقف"}</span>
        </footer>
      </section>
    </main>
  );
}
