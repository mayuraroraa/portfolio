export const contactService = {
  submitInquiry: async (formData) => {
    // 1. Format WhatsApp message and URL
    const whatsappMessage = 
      `*New Project Inquiry from Portfolio*\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📧 *Email:* ${formData.email}\n` +
      `🛠 *Project Type:* ${formData.projectType}\n` +
      `💰 *Budget Range:* ${formData.budget}\n\n` +
      `📝 *Message:*\n${formData.message}`;

    const whatsappUrl = `https://wa.me/918360825752?text=${encodeURIComponent(whatsappMessage)}`;

    try {
      // 2. Send submission to [EMAIL_ADDRESS] via FormSubmit.co
      const response = await fetch("https://formsubmit.co/ajax/mayuraroraa@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Name: formData.name,
          Email: formData.email,
          "Project Type": formData.projectType,
          "Budget Range": formData.budget,
          Message: formData.message,
          _subject: `New Project Inquiry from ${formData.name} - Portfolio`,
          _template: "table"
        })
      });

      const result = await response.json();
      return {
        success: true,
        whatsappUrl,
        result
      };
    } catch (error) {
      console.error("Email submission error:", error);
      // Even if email network fails, still allow WhatsApp messaging
      return {
        success: true,
        whatsappUrl
      };
    }
  }
};
