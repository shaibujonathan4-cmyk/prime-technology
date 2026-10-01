document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set Dynamic Copyright Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile Navigation Drawer Toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Active Navigation Route Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
});

/* Modal Quote Handler */
function openQuoteModal(equipmentName = 'General Inquiry') {
  const modal = document.getElementById('quoteModal');
  const input = document.getElementById('modalEquipment');
  if (modal && input) {
    input.value = equipmentName;
    modal.classList.remove('hidden');
  }
}

function closeQuoteModal() {
  const modal = document.getElementById('quoteModal');
  if (modal) modal.classList.add('hidden');
}

function handleQuoteSubmit(e) {
  e.preventDefault();
  const equipment = document.getElementById('modalEquipment').value;
  alert(`Thank you! Your quote request for "${equipment}" has been received. Our engineering team will contact you shortly.`);
  closeQuoteModal();
}

/* Instant WhatsApp Quotation Router */
function triggerWhatsApp(equipmentName = 'General Hardware') {
  const phone = "2347019180094"; // Corporate Line[span_1](start_span)[span_1](end_span)
  const message = `Hello Prime Industrial Technology Limited,\n\nI am making an inquiry regarding:\n- Item: ${equipmentName}\n\nPlease share price, leasing options, and specification documents.`;
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
}
