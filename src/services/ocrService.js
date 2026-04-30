import api from "./api";

class OCRService {
  constructor() {
    this.isProcessing = false;
  }

  async extractText(imageBase64, language = "auto") {
    if (this.isProcessing) {
      throw new Error("OCR processing already in progress");
    }

    if (!imageBase64) {
      throw new Error("No image provided");
    }

    this.isProcessing = true;

    try {
      // Remove data URL prefix if present
      const cleanBase64 = imageBase64.replace(
        /^data:image\/[a-z]+;base64,/,
        "",
      );

      const response = await api.post("/ai/extract", {
        imageBase64: cleanBase64,
        extractTextOnly: true,
        language: language,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || "OCR failed");
      }

      const result = response.data.data;

      return {
        text: result.extractedText || "",
        confidence: result.ocrConfidence || 0,
        language: result.detectedLanguage || language,
        fullResult: result,
      };
    } catch (error) {
      console.error("OCR extraction failed:", error);
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Validate image format and size
   * @param {File} file - Image file
   * @returns {Promise<boolean>}
   */
  async validateImage(file) {
    return new Promise((resolve) => {
      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        resolve(false);
        return;
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        resolve(false);
        return;
      }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        // Basic validation - image loaded successfully
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  
  async processImage(file, language = "auto") {
    // Validate image
    const isValid = await this.validateImage(file);
    if (!isValid) {
      throw new Error(
        "Invalid image file. Please use JPEG, PNG, GIF, or WebP under 10MB.",
      );
    }

    // Convert to base64
    const base64 = await this.fileToBase64(file);

    // Extract text
    const ocrResult = await this.extractText(base64, language);

    return {
      ...ocrResult,
      base64: base64,
    };
  }

  /**
   * Get supported languages
   * @returns {Array<{code: string, name: string}>}
   */
  getSupportedLanguages() {
    return [
      { code: "auto", name: "Auto Detect" },
      { code: "eng", name: "English" },
      { code: "amh", name: "Amharic" },
      { code: "orm", name: "Oromo" },
      
    ];
  }
}

// Export singleton instance
const ocrService = new OCRService();
export default ocrService;
