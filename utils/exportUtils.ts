// Utility functions for font and export handling

export const preloadFont = async (fontFamily: string): Promise<void> => {
  try {
    // Create a test element to force font loading
    const testElement = document.createElement('div');
    testElement.style.fontFamily = fontFamily;
    testElement.style.fontSize = '12px';
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    testElement.style.top = '-9999px';
    testElement.textContent = 'Test';
    
    document.body.appendChild(testElement);
    
    // Wait for font to load
    await document.fonts.ready;
    
    // Additional wait to ensure font is fully loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    document.body.removeChild(testElement);
  } catch (error) {
    console.warn('Font preloading failed:', error);
  }
};

export const waitForImages = async (element: HTMLElement): Promise<void> => {
  const images = element.querySelectorAll('img');
  const imagePromises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    
    return new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
      
      // Timeout after 5 seconds
      setTimeout(() => reject(new Error('Image load timeout')), 5000);
    });
  });
  
  await Promise.all(imagePromises);
};

export const prepareElementForExport = async (element: HTMLElement): Promise<void> => {
  // Wait for fonts
  await document.fonts.ready;
  
  // Wait for images
  await waitForImages(element);
  
  // Force reflow
  element.offsetHeight;
  
  // Additional small delay for any pending renders
  await new Promise(resolve => setTimeout(resolve, 50));
};