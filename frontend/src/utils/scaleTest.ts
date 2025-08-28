// Utility to test and validate scaling between HTML preview and PNG export

export const validateScaling = () => {
  console.log('=== PNG Download Scaling Validation ===');
  
  // HTML preview dimensions
  const previewWidth = 270;
  const previewHeight = 480;
  
  // PNG export dimensions
  const exportWidth = 1080;
  const exportHeight = 1920;
  
  // Calculate scale factor
  const scaleX = exportWidth / previewWidth;
  const scaleY = exportHeight / previewHeight;
  
  console.log(`Preview dimensions: ${previewWidth}x${previewHeight}px`);
  console.log(`Export dimensions: ${exportWidth}x${exportHeight}px`);
  console.log(`Scale factor X: ${scaleX}x`);
  console.log(`Scale factor Y: ${scaleY}x`);
  
  // Validate aspect ratio
  const previewRatio = previewWidth / previewHeight;
  const exportRatio = exportWidth / exportHeight;
  const ratioMatch = Math.abs(previewRatio - exportRatio) < 0.001;
  
  console.log(`Preview aspect ratio: ${previewRatio.toFixed(3)}`);
  console.log(`Export aspect ratio: ${exportRatio.toFixed(3)}`);
  console.log(`Aspect ratios match: ${ratioMatch ? '✅' : '❌'}`);
  
  // Font size scaling examples
  const fontSizes = {
    'Title (text-2xl)': 24,
    'Content (text-lg)': 18,
    'Bullet points (text-sm)': 14,
    'Slide number (text-xs)': 12
  };
  
  console.log('\n=== Font Size Scaling ===');
  Object.entries(fontSizes).forEach(([name, size]) => {
    const scaledSize = size * scaleX;
    console.log(`${name}: ${size}px → ${scaledSize}px`);
  });
  
  // Padding scaling
  const previewPadding = 32;
  const scaledPadding = previewPadding * scaleX;
  console.log(`\nPadding: ${previewPadding}px → ${scaledPadding}px`);
  
  return {
    scaleX,
    scaleY,
    ratioMatch,
    isValid: ratioMatch && scaleX === scaleY
  };
};

export const logElementDimensions = (element: HTMLElement, label: string) => {
  const rect = element.getBoundingClientRect();
  const computed = window.getComputedStyle(element);
  
  console.log(`\n=== ${label} Dimensions ===`);
  console.log(`Bounding box: ${rect.width.toFixed(1)}x${rect.height.toFixed(1)}px`);
  console.log(`CSS width: ${computed.width}`);
  console.log(`CSS height: ${computed.height}`);
  console.log(`Font size: ${computed.fontSize}`);
  console.log(`Padding: ${computed.padding}`);
};
