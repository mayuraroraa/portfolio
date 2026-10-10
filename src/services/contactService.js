export const contactService = {
  submitInquiry: async (formData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      return {
        success: true,
        whatsappUrl: result.whatsappUrl
      };
    } catch (error) {
      console.error('[contactService] Submission error:', error);
      throw error;
    }
  }
};
