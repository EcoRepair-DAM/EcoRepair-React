export default function AuthVisual() {
  return (
    <div className="auth-visual" aria-hidden="true">
      <div className="visual-grid" />
      <div className="device-orbit orbit-one">
        <span />
      </div>
      <div className="device-orbit orbit-two">
        <span />
      </div>
      <div className="repair-device">
        <div className="device-screen">
          <span className="pulse-line" />
          <span className="pulse-line short" />
          <span className="pulse-line" />
        </div>
        <div className="device-base" />
      </div>
      <div className="floating-chip chip-one">Reuse</div>
      <div className="floating-chip chip-two">Repair</div>
      <div className="floating-chip chip-three">Track</div>
    </div>
  );
}