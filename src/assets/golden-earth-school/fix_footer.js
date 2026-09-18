const fs = require('fs');
const path = require('path');

const footerHtml = `  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer__brand">
          <img src="https://goldenearthconventschoolmlp.com/uploads/2026/03/sqoKt-golden-earth-convent-school.png" alt="GECS">
          <div class="footer__brand-name">Golden Earth Convent School</div>
          <p class="footer__brand-desc">Nurturing Minds. Building Futures.</p>
          <div class="footer__social">
            <a href="https://www.facebook.com/gecs.mlp" target="_blank" class="footer__social-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://www.instagram.com/gecs_pandori/" target="_blank" class="footer__social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://youtube.com/@goldenearthconventschoolmu7405" target="_blank" class="footer__social-link" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
          </div>
        </div>
        
        <div>
          <h4 class="footer__heading">Quick Links</h4>
          <a href="about.html" class="footer__link">About</a>
          <a href="academics.html" class="footer__link">Academics</a>
          <a href="gallery.html" class="footer__link">Gallery</a>
        </div>
        
        <div>
          <h4 class="footer__heading">Admissions</h4>
          <a href="admissions.html" class="footer__link">How to Apply</a>
          <a href="apply.html" class="footer__link" style="color:var(--gold);">Registration →</a>
        </div>
        
        <div>
          <h4 class="footer__heading">Contact Us</h4>
          
          <div class="footer__contact-item">
            <span class="footer__contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <div class="footer__contact-text">
              <a href="https://maps.google.com" target="_blank">VPO Pandori, Mullanpur,<br>Ludhiana, Punjab 141102</a>
            </div>
          </div>
          
          <div class="footer__contact-item">
            <span class="footer__contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <div class="footer__contact-text">
              <a href="tel:+918728800725">+91-8728800725</a>
            </div>
          </div>
          
          <div class="footer__contact-item">
            <span class="footer__contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </span>
            <div class="footer__contact-text">
              <a href="https://wa.me/918872700725" target="_blank">+91-8872700725</a>
            </div>
          </div>

          <div class="footer__contact-item">
            <span class="footer__contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </span>
            <div class="footer__contact-text">
              <a href="mailto:gecsmlp@gmail.com">gecsmlp@gmail.com</a>
            </div>
          </div>
          
        </div>
      </div>
      <div class="footer__closing">
        <div class="footer__closing-text">Grow. Learn. Lead.</div>
      </div>
    </div>
    <div class="footer__copyright">
      Copyright &copy; 2017&ndash;2026 Golden Earth Convent School, Mullanpur.
    </div>
  </footer>`;

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const replacements = {
    "â€”": "—",
    "â€™": "'",
    "â€œ": '"',
    "â€ ": '"',
    "Â©": "&copy;",
    "â†’": "→",
    "ðŸ“ ": "",
    "ðŸ“ž": "",
    "âœ‰ï¸": "",
    "â€": '"'
};

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    Object.keys(replacements).forEach(old => {
        content = content.split(old).join(replacements[old]);
    });
    
    // Replace footer
    content = content.replace(/<footer class="footer">[\s\S]*?<\/footer>/, footerHtml);
    
    fs.writeFileSync(path.join(dir, file), content, 'utf8');
});

console.log("Updated all files with Node.js!");
