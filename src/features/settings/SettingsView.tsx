import type { TeachingSettings } from "../../types/schedule";

export function SettingsView({ settings }: { settings: TeachingSettings }) {
  return (
    <section className="view-stack">
      <div className="view-header">
        <div>
          <p className="eyebrow">Defaults</p>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="settings-grid">
        <article className="metric-tile">
          <span className="inline-icon">D</span>
          <span>Default duration</span>
          <strong>{settings.defaultLessonDurationMinutes} minutes</strong>
        </article>
        <article className="metric-tile">
          <span className="inline-icon">H</span>
          <span>Working hours</span>
          <strong>
            {settings.workingDayStartsAt} - {settings.workingDayEndsAt}
          </strong>
        </article>
        <article className="metric-tile">
          <span className="inline-icon">TZ</span>
          <span>Timezone</span>
          <strong>{settings.timezone}</strong>
        </article>
      </div>
    </section>
  );
}
