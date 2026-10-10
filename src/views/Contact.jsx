'use client';

import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { contactService } from '@/services/contactService';
import ScrollReveal from '@/components/ScrollReveal';
import '@/styles/Contact.css';

const Contact = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Not sure yet',
    budget: 'Not sure yet',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Build the WhatsApp message URL synchronously
    const whatsappMessage = 
      `*New Project Inquiry from Portfolio*\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📧 *Email:* ${formData.email}\n` +
      `🛠 *Project Type:* ${formData.projectType}\n` +
      `💰 *Budget Range:* ${formData.budget}\n\n` +
      `📝 *Message:*\n${formData.message}`;

    const waUrl = `https://wa.me/918360825752?text=${encodeURIComponent(whatsappMessage)}`;
    setWhatsappUrl(waUrl);

    try {
      const res = await contactService.submitInquiry(formData);
      if (res.whatsappUrl) setWhatsappUrl(res.whatsappUrl);

      setStatus('success');
      setFormData({ name: '', email: '', projectType: 'Not sure yet', budget: 'Not sure yet', message: '' });
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Something went wrong. Please check your fields and try again.');
      setStatus('error');
    }
  };

  return (
    <div id="contact" className={`contact-container container ${className}`.trim()}>
      <ScrollReveal yOffset={20}>
        <div className="contact-header">
          <div className="status-indicator" style={{ marginBottom: '2rem' }}>
            <div className="status-dot"></div>
            <span>Available for New Project</span>
          </div>
          <h1 className="display-large" style={{ textTransform: 'uppercase' }}>HAVE A PROJECT IN MIND?</h1>
          <p className="contact-subtitle">
            Together, we can create something clear and impactful. Let's collaborate to bring our ideas to life in a way that resonates with everyone.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal yOffset={30} delay={0.2} className="contact-form-wrapper">
        {status === 'success' ? (
          <div className="success-message">
            <h3>Thank you!</h3>
            <p>Your message has been submitted and sent to my email.</p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="pill-btn"
                style={{
                  marginTop: '1rem',
                  marginBottom: '0.75rem',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.75rem',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}
              >
                Send via WhatsApp <ArrowUpRight size={18} />
              </a>
            )}
            <button className="pill-btn pill-btn-outline" onClick={() => setStatus('idle')}>
              Send another message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="projectType">Project Type</label>
                <select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange}>
                  <option value="Full-Stack Development">Full-Stack Development</option>
                  <option value="Website Development">Website Development</option>
                  <option value="Web Application">Web Application</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Other">Other</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budget">Budget Range</label>
                <select id="budget" name="budget" value={formData.budget} onChange={handleChange}>
                  <option value="Under ₹10,000">Under ₹10,000</option>
                  <option value="₹10,000–₹25,000">₹10,000–₹25,000</option>
                  <option value="₹25,000–₹50,000">₹25,000–₹50,000</option>
                  <option value="₹50,000+">₹50,000+</option>
                  <option value="Not sure yet">Not sure yet</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={4} placeholder="Tell me about your project..."></textarea>
            </div>
            
            {status === 'error' && (
              <div className="error-message">{errorMessage || 'Something went wrong. Please check your fields and try again.'}</div>
            )}

            <button type="submit" className="pill-btn pill-btn-dark submit-btn" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : (
                <>Contact Me <ArrowUpRight size={16} /></>
              )}
            </button>
          </form>
        )}
      </ScrollReveal>
    </div>
  );
};

export default Contact;
