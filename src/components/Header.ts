export function Header(): string {
	return `
    <div class="header-banner">
      <!-- Animated background decorations -->
      <div class="header-bg-decoration">
        <div class="header-blob header-blob-1"></div>
        <div class="header-blob header-blob-2"></div>
        <div class="header-blob header-blob-3"></div>
        <div class="header-grid-pattern"></div>
      </div>
      
      <!-- Accent bar at top -->
      <div class="header-accent-bar"></div>
      
      <div class="header-content-row">
        <div class="header-logo-wrapper">
          <div class="header-logo-glow"></div>
          <img src="./complete.png" 
               alt="DICT Region 2 - Cagayan Valley" 
               class="header-complete-logo"
               loading="lazy">
        </div>
        
        <div class="header-divider"></div>
        
        <div class="header-title-block">
          <div class="header-badge">
            <span class="header-badge-icon">🏛️</span>
            <span>Government Digital Services</span>
          </div>
          <h1 class="header-title">
            <span class="header-title-text">Digital Transformation Center</span>
            <span class="header-title-shine"></span>
          </h1>
          <p class="header-subtitle">
            <span class="header-subtitle-icon">📋</span>
            Attendance & Registration System
          </p>
        </div>
      </div>
      
      <!-- Bottom accent -->
      <div class="header-bottom-accent"></div>
    </div>
  `;
}
