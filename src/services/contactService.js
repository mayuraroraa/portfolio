export const contactService = {
  submitInquiry: async (formData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate a success response
        if (formData.name && formData.email && formData.message) {
          resolve({ success: true, message: "Inquiry sent successfully!" });
        } else {
          reject(new Error("Missing required fields."));
        }
      }, 1500); // Simulate network delay
    });
  }
};
