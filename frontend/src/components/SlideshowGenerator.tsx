'use client';

import { useState, useRef } from 'react';
import { Download, Copy, CheckCircle, Wand2, Loader2, Bug, Image as ImageIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import html2canvas from 'html2canvas';

interface Slide {
  slideNumber: number;
  title: string;
  content: string;
  bulletPoints: string[];
}

interface GeneratedSlideshow {
  title: string;
  description: string;
  slides: Slide[];
  tiktokDescription: string;
  generatedAt: string;
  prompt: string;
  backgroundImages?: BackgroundImage[];
  backgroundSearchTerms?: string;
  suggestedBackground?: BackgroundImage;
}

interface BackgroundImage {
  id: number;
  src: {
    small: string;
    medium: string;
    large: string;
    portrait: string;
  };
  photographer: string;
  photographer_url: string;
  alt: string;
  avg_color: string;
  searchTerm?: string;
}

interface GradientOption {
  id: string;
  name: string;
  gradient: string;
  colors: string[];
}

interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Prompt suggestions for users
const PROMPT_SUGGESTIONS = [
  "Top 5 productivity tips for remote workers",
  "Essential life skills everyone should learn",
  "Simple morning routines for success",
  "Budget-friendly home workout exercises",
  "Quick healthy meal prep ideas",
  "Social media growth strategies",
  "Study techniques that actually work",
  "Self-care practices for busy people",
  "Creative ways to save money",
  "Time management hacks for students"
];

// Gradient options for backgrounds
const GRADIENT_OPTIONS: GradientOption[] = [
  {
    id: 'sunset',
    name: 'Sunset',
    gradient: 'linear-gradient(135deg, #ff6b6b, #feca57, #ff9ff3)',
    colors: ['#ff6b6b', '#feca57', '#ff9ff3']
  },
  {
    id: 'ocean',
    name: 'Ocean',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
    colors: ['#667eea', '#764ba2']
  },
  {
    id: 'forest',
    name: 'Forest',
    gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',
    colors: ['#11998e', '#38ef7d']
  },
  {
    id: 'fire',
    name: 'Fire',
    gradient: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
    colors: ['#ff416c', '#ff4b2b']
  },
  {
    id: 'midnight',
    name: 'Midnight',
    gradient: 'linear-gradient(135deg, #0c0c0c, #434343)',
    colors: ['#0c0c0c', '#434343']
  },
  {
    id: 'lavender',
    name: 'Lavender',
    gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    colors: ['#a8edea', '#fed6e3']
  },
  {
    id: 'golden',
    name: 'Golden',
    gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
    colors: ['#f093fb', '#f5576c']
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    colors: ['#4facfe', '#00f2fe']
  },
  {
    id: 'desert',
    name: 'Desert',
    gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
    colors: ['#fa709a', '#fee140']
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    gradient: 'linear-gradient(135deg, #a8caba, #5d4e75)',
    colors: ['#a8caba', '#5d4e75']
  }
];

// Font options for text styling
const FONT_OPTIONS: FontOption[] = [
  {
    id: 'system',
    name: 'System',
    family: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    category: 'sans-serif'
  },
  {
    id: 'inter',
    name: 'Inter',
    family: 'var(--font-inter), system-ui, sans-serif',
    category: 'sans-serif'
  },
  {
    id: 'roboto',
    name: 'Roboto',
    family: 'var(--font-roboto), system-ui, sans-serif',
    category: 'sans-serif'
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    family: 'var(--font-open-sans), system-ui, sans-serif',
    category: 'sans-serif'
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    family: 'var(--font-playfair), serif',
    category: 'serif'
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    family: 'var(--font-merriweather), serif',
    category: 'serif'
  },
  {
    id: 'poppins',
    name: 'Poppins',
    family: 'var(--font-poppins), system-ui, sans-serif',
    category: 'sans-serif'
  },
  {
    id: 'montserrat',
    name: 'Montserrat',
    family: 'var(--font-montserrat), system-ui, sans-serif',
    category: 'sans-serif'
  }
];

// Color options for text
const TEXT_COLOR_OPTIONS = [
  { id: 'white', name: 'White', color: '#ffffff', hex: '#ffffff' },
  { id: 'black', name: 'Black', color: '#000000', hex: '#000000' },
  { id: 'red', name: 'Red', color: '#ef4444', hex: '#ef4444' },
  { id: 'blue', name: 'Blue', color: '#3b82f6', hex: '#3b82f6' },
  { id: 'green', name: 'Green', color: '#10b981', hex: '#10b981' },
  { id: 'yellow', name: 'Yellow', color: '#f59e0b', hex: '#f59e0b' },
  { id: 'purple', name: 'Purple', color: '#8b5cf6', hex: '#8b5cf6' },
  { id: 'orange', name: 'Orange', color: '#f97316', hex: '#f97316' },
  { id: 'pink', name: 'Pink', color: '#ec4899', hex: '#ec4899' },
  { id: 'teal', name: 'Teal', color: '#14b8a6', hex: '#14b8a6' }
];

export default function SlideshowGenerator() {
  const [prompt, setPrompt] = useState<string>('');
  const [slideCount, setSlideCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlideshow, setGeneratedSlideshow] = useState<GeneratedSlideshow | null>(null);
  const [copied, setCopied] = useState<string>('');
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Background image states
  const [backgroundImages, setBackgroundImages] = useState<BackgroundImage[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundImage | null>(null);
  const [selectedGradient, setSelectedGradient] = useState<GradientOption | null>(null);
  const [imageSearchQuery, setImageSearchQuery] = useState<string>('');
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [backgroundScale, setBackgroundScale] = useState<'cover' | 'contain' | '100%'>('cover');
  
  // Typography states
  const [selectedFont, setSelectedFont] = useState<FontOption>(FONT_OPTIONS[0]);
  const [selectedTextColor, setSelectedTextColor] = useState(TEXT_COLOR_OPTIONS[0]);
  const [selectedAccentColor, setSelectedAccentColor] = useState(TEXT_COLOR_OPTIONS[2]); // Red for bullets
  
  // Watermark states
  const [showWatermark, setShowWatermark] = useState<boolean>(false);
  const [watermarkText, setWatermarkText] = useState<string>('@yourusername');
  const [watermarkPosition, setWatermarkPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('bottom-right');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.7);
  const [watermarkSize, setWatermarkSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [watermarkColor, setWatermarkColor] = useState<'white' | 'black' | 'red'>('white');
  const [watermarkRotation, setWatermarkRotation] = useState<number>(0);

  const generateSlideshow = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-slideshow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          slideCount
        }),
      });

      const responseData = await response.json();
      
      if (responseData.success) {
        setGeneratedSlideshow(responseData.data);
        
        // Auto-select suggested background if available
        if (responseData.data.suggestedBackground) {
          setSelectedBackground(responseData.data.suggestedBackground);
          setSelectedGradient(null); // Clear any selected gradient
        }
        
        // Update background images if provided
        if (responseData.data.backgroundImages) {
          console.log('Auto-generated background images:', responseData.data.backgroundImages.length);
          console.log('Background search terms:', responseData.data.backgroundSearchTerms);
          setBackgroundImages(responseData.data.backgroundImages);
        } else {
          console.log('No background images provided by AI');
        }

        // Reset watermark settings for new slideshow
        resetWatermarkSettings();
      } else {
        console.error('Failed to generate slideshow:', responseData.error);
        alert('Failed to generate slideshow: ' + responseData.error);
      }
    } catch (error) {
      console.error('Error generating slideshow:', error);
      alert('Error generating slideshow. Please check if the backend is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatSlidesForCopy = () => {
    if (!generatedSlideshow) return '';
    
    let formatted = `TIKTOK SLIDESHOW: ${generatedSlideshow.title.toUpperCase()}\n`;
    formatted += `\nDESCRIPTION: ${generatedSlideshow.description}\n`;
    formatted += `\nSLIDES:\n`;
    
    generatedSlideshow.slides.forEach((slide, index) => {
      formatted += `\nSLIDE ${index + 1}:\n`;
      formatted += `Title: ${slide.title}\n`;
      formatted += `Content: ${slide.content}\n`;
      if (slide.bulletPoints && slide.bulletPoints.length > 0) {
        formatted += `Bullet Points:\n`;
        slide.bulletPoints.forEach(point => formatted += `• ${point}\n`);
      }
    });
    
    return formatted;
  };

  const downloadSlideAsPNG = async (slideIndex: number) => {
    const slideElement = slideRefs.current[slideIndex];
    if (!slideElement) return;

    try {
      // Create a properly scaled clone for PNG export that matches the canvas version
      const clonedElement = document.createElement('div');
      const slide = generatedSlideshow?.slides[slideIndex];
      if (!slide) return;
      
             // Set exact TikTok dimensions and styling
       clonedElement.style.position = 'absolute';
       clonedElement.style.left = '-9999px';
       clonedElement.style.top = '-9999px';
       clonedElement.style.width = '1080px';
       clonedElement.style.height = '1920px';
       clonedElement.style.backgroundColor = (selectedBackground || selectedGradient) ? 'transparent' : '#000000';
       clonedElement.style.color = '#ffffff';
       clonedElement.style.display = 'flex';
       clonedElement.style.flexDirection = 'column';
       clonedElement.style.justifyContent = 'center';
       clonedElement.style.alignItems = 'center';
       clonedElement.style.textAlign = 'center';
       clonedElement.style.padding = '80px';
       clonedElement.style.boxSizing = 'border-box';
       clonedElement.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
       clonedElement.style.overflow = 'hidden';
       
       // Add background image if selected
       if (selectedBackground) {
         const backgroundImg = document.createElement('img');
         backgroundImg.src = selectedBackground.src.portrait;
         backgroundImg.style.position = 'absolute';
         backgroundImg.style.top = '0';
         backgroundImg.style.left = '0';
         backgroundImg.style.width = '100%';
         backgroundImg.style.height = '100%';
         backgroundImg.style.objectFit = backgroundScale === 'cover' ? 'cover' : backgroundScale === 'contain' ? 'contain' : 'fill';
         backgroundImg.style.zIndex = '-2';
         clonedElement.appendChild(backgroundImg);
         
         // Add overlay
         const overlay = document.createElement('div');
         overlay.style.position = 'absolute';
         overlay.style.top = '0';
         overlay.style.left = '0';
         overlay.style.width = '100%';
         overlay.style.height = '100%';
         overlay.style.backgroundColor = '#000000';
         overlay.style.opacity = '0.6';
         overlay.style.zIndex = '-1';
         clonedElement.appendChild(overlay);
       }
       
       // Add gradient background if selected
       if (selectedGradient) {
         clonedElement.style.background = selectedGradient.gradient;
       }
      
      // Create content container
      const contentContainer = document.createElement('div');
      contentContainer.style.display = 'flex';
      contentContainer.style.flexDirection = 'column';
      contentContainer.style.alignItems = 'center';
      contentContainer.style.gap = '60px';
      contentContainer.style.width = '100%';
      contentContainer.style.maxWidth = '920px'; // Leave padding space
      
             // Title
       const titleElement = document.createElement('h1');
       titleElement.textContent = slide.title;
       titleElement.style.fontSize = '80px';
       titleElement.style.fontWeight = 'bold';
       titleElement.style.fontFamily = selectedFont.family;
       titleElement.style.color = selectedTextColor.color;
       titleElement.style.lineHeight = '1.2';
       titleElement.style.margin = '0';
       titleElement.style.textAlign = 'center';
       titleElement.style.wordWrap = 'break-word';
       contentContainer.appendChild(titleElement);
       
       // Content
       const contentElement = document.createElement('p');
       contentElement.textContent = slide.content;
       contentElement.style.fontSize = '56px';
       contentElement.style.fontFamily = selectedFont.family;
       contentElement.style.color = selectedTextColor.color;
       contentElement.style.opacity = '0.9';
       contentElement.style.lineHeight = '1.4';
       contentElement.style.margin = '0';
       contentElement.style.textAlign = 'center';
       contentElement.style.wordWrap = 'break-word';
       contentContainer.appendChild(contentElement);
      
             // Bullet points
       if (slide.bulletPoints && slide.bulletPoints.length > 0) {
         const listContainer = document.createElement('div');
         listContainer.style.textAlign = 'left';
         listContainer.style.width = '100%';
         listContainer.style.fontSize = '48px';
         
         slide.bulletPoints.forEach(point => {
           const bulletItem = document.createElement('div');
           bulletItem.style.display = 'flex';
           bulletItem.style.alignItems = 'flex-start';
           bulletItem.style.marginBottom = '20px';
           bulletItem.style.gap = '20px';
           
           const bullet = document.createElement('span');
           bullet.textContent = '•';
           bullet.style.color = selectedAccentColor.color;
           bullet.style.fontSize = '48px';
           bullet.style.lineHeight = '1';
           bullet.style.marginTop = '0';
           
           const text = document.createElement('span');
           text.textContent = point;
           text.style.fontFamily = selectedFont.family;
           text.style.color = selectedTextColor.color;
           text.style.fontSize = '48px';
           text.style.lineHeight = '1.3';
           text.style.wordWrap = 'break-word';
           text.style.flex = '1';
           
           bulletItem.appendChild(bullet);
           bulletItem.appendChild(text);
           listContainer.appendChild(bulletItem);
         });
         
         contentContainer.appendChild(listContainer);
       }
      
      clonedElement.appendChild(contentContainer);
      
             // Slide number
       const slideNumber = document.createElement('div');
       slideNumber.textContent = `${slideIndex + 1}/${generatedSlideshow?.slides.length}`;
       slideNumber.style.position = 'absolute';
       slideNumber.style.bottom = '40px';
       slideNumber.style.right = '40px';
       slideNumber.style.fontSize = '36px';
       slideNumber.style.fontFamily = selectedFont.family;
       slideNumber.style.color = selectedTextColor.color;
       slideNumber.style.opacity = '0.6';
       clonedElement.appendChild(slideNumber);
      
      document.body.appendChild(clonedElement);

      // Use html2canvas with optimal settings
      const canvas = await html2canvas(clonedElement, {
        width: 1080,
        height: 1920,
        scale: 1,
        backgroundColor: '#000000',
        useCORS: true,
        allowTaint: false,
        logging: false,
        removeContainer: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        ignoreElements: (element) => {
          return element.tagName === 'STYLE' || element.tagName === 'SCRIPT';
        }
      });

      // Remove the cloned element
      document.body.removeChild(clonedElement);

      const link = document.createElement('a');
      link.download = `slide-${slideIndex + 1}-${generatedSlideshow?.title.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error downloading slide:', error);
      // Fallback to canvas method
      alert('HTML method failed. Trying canvas method...');
      await downloadSlideAsCanvas(slideIndex);
    }
  };

  const downloadAllSlides = async () => {
    if (!generatedSlideshow) return;

    for (let i = 0; i < generatedSlideshow.slides.length; i++) {
      await downloadSlideAsPNG(i);
      // Add small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const downloadAllSlidesCanvas = async () => {
    if (!generatedSlideshow) return;

    for (let i = 0; i < generatedSlideshow.slides.length; i++) {
      await downloadSlideAsCanvas(i);
      // Add small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };
 
  // Alternative download method using canvas directly
  const downloadSlideAsCanvas = async (slideIndex: number) => {
    const slide = generatedSlideshow?.slides[slideIndex];
    if (!slide) return;

    try {
      // Create a canvas element with exact TikTok dimensions
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');

      // Fill background or draw background image
      if (selectedBackground) {
        // Load and draw background image
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          img.onload = () => {
            // Draw background image based on scaling preference
            if (backgroundScale === 'cover') {
              // Cover: scale to fill entire canvas, may crop
              const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;
              const x = (canvas.width - scaledWidth) / 2;
              const y = (canvas.height - scaledHeight) / 2;
              ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            } else if (backgroundScale === 'contain') {
              // Contain: scale to fit within canvas, may leave empty space
              const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
              const scaledWidth = img.width * scale;
              const scaledHeight = img.height * scale;
              const x = (canvas.width - scaledWidth) / 2;
              const y = (canvas.height - scaledHeight) / 2;
              ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            } else {
              // 100%: stretch to fill exactly
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
            
            // Add dark overlay for text readability
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            resolve(true);
          };
          img.onerror = () => {
            // Fallback to black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            resolve(true);
          };
          img.src = selectedBackground.src.portrait;
        });
      } else if (selectedGradient) {
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        selectedGradient.colors.forEach((color, index) => {
          gradient.addColorStop(index / (selectedGradient.colors.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Set up proper centering and spacing
      const padding = 80; // Side padding
      const contentWidth = canvas.width - (padding * 2);
      const centerX = canvas.width / 2;
      
      // Start content in the vertical center area
      let currentY = canvas.height * 0.3; // Start at 30% from top

             // Title - Large, bold, centered
       ctx.fillStyle = selectedTextColor.color;
       ctx.textAlign = 'center';
       ctx.textBaseline = 'top';
       ctx.font = `bold 80px ${selectedFont.family}`;
      
      const titleLines = wrapText(ctx, slide.title, contentWidth);
      titleLines.forEach((line, index) => {
        ctx.fillText(line, centerX, currentY + (index * 100));
      });
      currentY += titleLines.length * 100 + 80; // Add spacing after title

             // Content - Medium size, centered
       ctx.globalAlpha = 0.9;
       ctx.font = `56px ${selectedFont.family}`;
      
      const contentLines = wrapText(ctx, slide.content, contentWidth);
      contentLines.forEach((line, index) => {
        ctx.fillText(line, centerX, currentY + (index * 70));
      });
      currentY += contentLines.length * 70 + 60; // Add spacing after content
      ctx.globalAlpha = 1;

             // Bullet points - Properly spaced and sized
       if (slide.bulletPoints && slide.bulletPoints.length > 0) {
         ctx.font = `48px ${selectedFont.family}`;
         ctx.textAlign = 'left';
         
         slide.bulletPoints.forEach((point, index) => {
           const bulletY = currentY + (index * 80);
           
           // Accent color bullet - positioned properly
           ctx.fillStyle = selectedAccentColor.color;
           ctx.fillText('•', padding + 20, bulletY);
           
           // Selected text color - wrap long bullet points properly
           ctx.fillStyle = selectedTextColor.color;
          const bulletTextX = padding + 80; // Space for bullet
          const bulletContentWidth = contentWidth - 80;
          
          const bulletLines = wrapText(ctx, point, bulletContentWidth);
          bulletLines.forEach((line, lineIndex) => {
            ctx.fillText(line, bulletTextX, bulletY + (lineIndex * 60));
          });
          
          // Adjust currentY for wrapped lines
          if (bulletLines.length > 1) {
            currentY += (bulletLines.length - 1) * 60;
          }
        });
      }

             // Slide number - bottom right corner
       ctx.font = `36px ${selectedFont.family}`;
       ctx.textAlign = 'right';
       ctx.fillStyle = selectedTextColor.color;
       ctx.globalAlpha = 0.6;
      ctx.fillText(
        `${slideIndex + 1}/${generatedSlideshow?.slides.length}`, 
        canvas.width - 40, 
        canvas.height - 40
      );
      ctx.globalAlpha = 1;

      // Download
      const link = document.createElement('a');
      link.download = `slide-${slideIndex + 1}-${generatedSlideshow?.title.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error downloading slide with canvas:', error);
      alert('Error downloading slide with canvas method. Please try again.');
    }
  };

  // Helper function to wrap text
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  const useSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const searchBackgroundImages = async () => {
    if (!imageSearchQuery.trim()) {
      setImageSearchQuery('abstract background');
    }
    
    setIsLoadingImages(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/search-images?query=${encodeURIComponent(imageSearchQuery || 'abstract background')}&orientation=portrait`);
      const data = await response.json();
      
      if (data.success) {
        setBackgroundImages(data.data.images);
        console.log('Manual search found', data.data.images.length, 'images');
      } else {
        console.error('Failed to search images:', data.error);
        alert('Failed to search for background images: ' + data.error);
      }
    } catch (error) {
      console.error('Error searching images:', error);
      alert('Error searching for background images. Please check if the backend is running.');
    } finally {
      setIsLoadingImages(false);
    }
  };

  const selectBackgroundImage = (image: BackgroundImage) => {
    setSelectedBackground(image);
    setSelectedGradient(null); // Clear gradient when image is selected
  };

  const selectGradient = (gradient: GradientOption) => {
    setSelectedGradient(gradient);
    setSelectedBackground(null); // Clear image when gradient is selected
  };

  const clearBackgroundImage = () => {
    setSelectedBackground(null);
    setSelectedGradient(null);
  };

  const resetWatermarkSettings = () => {
    setShowWatermark(false);
    setWatermarkText('@yourusername');
    setWatermarkPosition('bottom-right');
    setWatermarkOpacity(0.7);
    setWatermarkSize('medium');
    setWatermarkColor('white');
    setWatermarkRotation(0);
  };

  const testPexelsAPI = async () => {
    console.log('=== Testing Pexels API ===');
    try {
      const response = await fetch(`${API_BASE_URL}/api/search-images?query=abstract&orientation=portrait`);
      const data = await response.json();
      console.log('Pexels API test result:', data);
      if (data.success) {
        console.log('Sample image URLs:', data.data.images.slice(0, 3).map(img => img.src.medium));
        alert(`Pexels API working! Found ${data.data.images.length} images. Check console for URLs.`);
        
        // Test loading the first image
        if (data.data.images.length > 0) {
          const testImg = new window.Image();
          testImg.onload = () => {
            console.log('✅ Test image loaded successfully');
            console.log('Image dimensions:', testImg.naturalWidth, 'x', testImg.naturalHeight);
            console.log('Image src:', testImg.src);
          };
          testImg.onerror = () => console.error('❌ Test image failed to load');
          testImg.src = data.data.images[0].src.medium;
        }
      } else {
        alert(`Pexels API error: ${data.error}`);
      }
    } catch (error) {
      console.error('Pexels API test failed:', error);
      alert('Pexels API test failed - check console');
    }
  };

  const debugScaling = () => {
    console.log('=== Debug: PNG Scaling Information ===');
    
    // HTML preview dimensions
    const previewWidth = 270;
    const previewHeight = 480;
    
    // PNG export dimensions  
    const exportWidth = 1080;
    const exportHeight = 1920;
    
    const scale = exportWidth / previewWidth;
    
    console.log(`Preview: ${previewWidth}x${previewHeight}px`);
    console.log(`Export: ${exportWidth}x${exportHeight}px`);
    console.log(`Scale factor: ${scale}x`);
    
    // Check if any slide elements exist
    if (slideRefs.current.length > 0 && slideRefs.current[0]) {
      const slideElement = slideRefs.current[0];
      const rect = slideElement.getBoundingClientRect();
      const computed = window.getComputedStyle(slideElement);
      
      console.log('\n=== First Slide Element ===');
      console.log(`Actual size: ${rect.width.toFixed(1)}x${rect.height.toFixed(1)}px`);
      console.log(`CSS width: ${computed.width}`);
      console.log(`CSS height: ${computed.height}`);
      console.log(`Background: ${computed.backgroundColor}`);
      console.log(`Color: ${computed.color}`);
      
      // Check text elements
      const title = slideElement.querySelector('h3');
      const content = slideElement.querySelector('p');
      
      if (title) {
        const titleStyle = window.getComputedStyle(title);
        console.log(`Title font-size: ${titleStyle.fontSize} (should scale to ${parseFloat(titleStyle.fontSize) * scale}px)`);
      }
      
      if (content) {
        const contentStyle = window.getComputedStyle(content);
        console.log(`Content font-size: ${contentStyle.fontSize} (should scale to ${parseFloat(contentStyle.fontSize) * scale}px)`);
      }
    }
    
    alert('Check browser console for detailed scaling information');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        {/* Clean, professional header */}
        <div className="text-center space-y-6 py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-6 shadow-sm">
            <Wand2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
            TikTok Slideshow Generator
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
            Create engaging TikTok slideshow content with AI-powered prompts and professional design tools
          </p>
        </div>

        {/* Input Section */}
        <Card className="shadow-sm border border-slate-200 bg-white">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Wand2 className="h-5 w-5 text-slate-700" />
              Generate Your Slideshow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                What would you like to create a slideshow about?
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your topic or idea here... (e.g., 'Top 5 productivity tips for remote workers')"
                className="min-h-[100px] border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Prompt Suggestions */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Quick Suggestions:</label>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 transition-colors border-slate-200"
                    onClick={() => setPrompt(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Slide Count */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Number of Slides</label>
              <Input
                type="number"
                value={slideCount}
                onChange={(e) => setSlideCount(Math.max(3, Math.min(10, parseInt(e.target.value) || 5)))}
                min="3"
                max="10"
                className="w-24 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateSlideshow}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Slideshow Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

                {/* Background & Gradient Selection - Left Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Background & Gradient Options */}
          <div className="lg:col-span-1 space-y-6">
            {/* Background Options Card */}
            <Card className="shadow-sm border border-slate-200 bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <ImageIcon className="h-5 w-5 text-slate-700" />
                  Background Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                
                {/* Selected Background or Gradient */}
                {(selectedBackground || selectedGradient) && (
                  <div className="p-4 border rounded-lg bg-slate-50/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-800">
                        {selectedBackground ? 'Selected Background:' : 'Selected Gradient:'}
                      </span>
                      <Button size="sm" variant="outline" onClick={clearBackgroundImage} className="border-slate-200 hover:bg-slate-100">
                        Clear
                      </Button>
                    </div>
                    {/* <div className="flex items-center gap-3">
                      {selectedBackground ? (
                        <>
                          <div 
                            className="w-16 aspect-[9/16] rounded overflow-hidden shadow-sm"
                            style={{ minHeight: '112px' }}
                          >
                            <img 
                              src={selectedBackground.src.medium} 
                              alt={selectedBackground.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-600">
                              Photo by {selectedBackground.photographer}
                            </p>
                            <p className="text-xs text-slate-500">
                              {selectedBackground.alt}
                            </p>
                          </div>
                        </>
                      ) : selectedGradient && (
                        <>
                          <div 
                            className="w-16 aspect-[9/16] rounded overflow-hidden shadow-sm"
                            style={{ 
                              minHeight: '112px',
                              background: selectedGradient.gradient 
                            }}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-slate-600">
                              {selectedGradient.name} Gradient
                            </p>
                            <p className="text-xs text-slate-500">
                              Custom gradient background
                            </p>
                          </div>
                        </>
                      )}
                    </div> */}
                  </div>
                )}

                {/* AI-Generated Search Terms */}
                {/* {generatedSlideshow && generatedSlideshow.backgroundSearchTerms && (
                  <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      🤖 AI-Generated Background Themes:
                    </p>
                    <p className="text-sm text-blue-700">
                      {generatedSlideshow.backgroundSearchTerms}
                    </p>
                  </div>
                )} */}

                {/* Background Images Grid */}
                {backgroundImages.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-slate-800">
                      {generatedSlideshow?.suggestedBackground ? 
                        'AI-Suggested Backgrounds:' : 
                        'Choose a Background:'
                      }
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {backgroundImages.map((image) => (
                        <div
                          key={image.id}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 shadow-sm ${
                            selectedBackground?.id === image.id 
                              ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          onClick={() => selectBackgroundImage(image)}
                        >
                          <div 
                            className="w-full aspect-[9/16] flex items-center justify-center overflow-hidden"
                            style={{ minHeight: '96px' }}
                          >
                            <img
                              src={image.src.medium}
                              alt={image.alt}
                              className="w-full h-full object-cover"
                              onLoad={(e) => {
                                console.log('✅ Image loaded successfully:', image.src.medium);
                              }}
                              onError={(e) => {
                                console.error('❌ Image failed to load:', image.src.medium);
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="text-xs text-red-500 p-2">Failed to load</div>`;
                                }
                              }}
                            />
                          </div>
                          {selectedBackground?.id === image.id && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center pointer-events-none">
                              <CheckCircle className="h-4 w-4 text-blue-600 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Photos provided by Pexels
                    </p>
                  </div>
                )}

                {/* Background Scaling Options */}
                {selectedBackground && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-800">Background Scaling:</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div
                        className={`p-2 border rounded cursor-pointer transition-all hover:scale-105 ${
                          backgroundScale === 'cover'
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-1' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        onClick={() => setBackgroundScale('cover')}
                      >
                        <div className="text-sm font-medium text-center">Cover</div>
                        <div className="text-xs text-slate-500 text-center">Fill entire slide</div>
                      </div>
                      <div
                        className={`p-2 border rounded cursor-pointer transition-all hover:scale-105 ${
                          backgroundScale === 'contain'
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-1' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        onClick={() => setBackgroundScale('contain')}
                      >
                        <div className="text-sm font-medium text-center">Contain</div>
                        <div className="text-xs text-slate-500 text-center">Show full image</div>
                      </div>
                      <div
                        className={`p-2 border rounded cursor-pointer transition-all hover:scale-105 ${
                          backgroundScale === '100%'
                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-1' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        onClick={() => setBackgroundScale('100%')}
                      >
                        <div className="text-sm font-medium text-center">Stretch</div>
                        <div className="text-xs text-slate-500 text-center">Fit to dimensions</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gradient Options */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-800">Or Choose a Gradient:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {GRADIENT_OPTIONS.map((gradient) => (
                      <div
                        key={gradient.id}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 shadow-sm ${
                          selectedGradient?.id === gradient.id 
                            ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => selectGradient(gradient)}
                      >
                        <div 
                          className="w-full aspect-[9/16] flex items-center justify-center overflow-hidden"
                          style={{ 
                            minHeight: '96px',
                            background: gradient.gradient
                          }}
                        />
                        {selectedGradient?.id === gradient.id && (
                          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center pointer-events-none">
                            <CheckCircle className="h-4 w-4 text-blue-600 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Beautiful gradient backgrounds for your slides
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Typography Options Card */}
            <Card className="shadow-sm border border-slate-200 bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <span className="text-lg">Aa</span>
                  Typography Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {/* Font Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Font Family:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map((font) => (
                      <div
                        key={font.id}
                        className={`p-2 border rounded cursor-pointer transition-all hover:scale-105 ${
                          selectedFont.id === font.id
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500 ring-offset-1' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedFont(font)}
                      >
                        <div 
                          className="text-sm font-medium"
                          style={{ fontFamily: font.family }}
                        >
                          {font.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {font.category}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Text Color Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Text Color:</label>
                  <div className="grid grid-cols-5 gap-2">
                    {TEXT_COLOR_OPTIONS.map((colorOption) => (
                      <div
                        key={colorOption.id}
                        className={`w-8 h-8 rounded cursor-pointer border-2 transition-all hover:scale-110 shadow-sm ${
                          selectedTextColor.id === colorOption.id
                            ? 'border-purple-500 ring-2 ring-purple-500 ring-offset-1' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        style={{ backgroundColor: colorOption.color }}
                        onClick={() => setSelectedTextColor(colorOption)}
                        title={colorOption.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Accent Color Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Accent Color (for bullets):</label>
                  <div className="grid grid-cols-5 gap-2">
                    {TEXT_COLOR_OPTIONS.map((colorOption) => (
                      <div
                        key={colorOption.id}
                        className={`w-8 h-8 rounded cursor-pointer border-2 transition-all hover:scale-110 shadow-sm ${
                          selectedAccentColor.id === colorOption.id
                            ? 'border-purple-500 ring-2 ring-purple-500 ring-offset-1' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        style={{ backgroundColor: colorOption.color }}
                        onClick={() => setSelectedAccentColor(colorOption)}
                        title={colorOption.name}
                      />
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Watermark Options Card */}
            <Card className="shadow-sm border border-slate-200 bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <span className="text-lg">💧</span>
                  Watermark Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {/* Watermark Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Enable Watermark:</label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showWatermark}
                      onChange={(e) => setShowWatermark(e.target.checked)}
                      className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500 focus:ring-2"
                    />
                  </div>
                </div>

                {/* Watermark Text Input */}
                {showWatermark && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Watermark Text:</label>
                    <Input
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Enter watermark text (e.g., @username)"
                      className="border-slate-200 focus:border-slate-500 focus:ring-slate-500"
                    />
                  </div>
                )}

                {/* Watermark Position */}
                {showWatermark && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Position:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((position) => (
                        <div
                          key={position}
                          className={`p-2 border rounded cursor-pointer transition-all hover:scale-105 ${
                            watermarkPosition === position
                              ? 'border-slate-500 bg-slate-50 ring-2 ring-slate-500 ring-offset-1' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                          onClick={() => setWatermarkPosition(position)}
                        >
                          <div className="text-sm font-medium text-center capitalize">
                            {position.replace('-', ' ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Watermark Size */}
                {showWatermark && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Size:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <div
                          key={size}
                          className={`p-2 border rounded cursor-pointer transition-all hover:scale-105 ${
                            watermarkSize === size
                              ? 'border-slate-500 bg-slate-50 ring-2 ring-slate-500 ring-offset-1' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                          onClick={() => setWatermarkSize(size)}
                        >
                          <div className="text-sm font-medium text-center capitalize">
                            {size}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Watermark Color */}
                {showWatermark && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Color:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['white', 'black', 'red'] as const).map((color) => (
                        <div
                          key={color}
                          className={`p-2 border rounded cursor-pointer transition-all hover:scale-105 ${
                            watermarkColor === color
                              ? 'border-slate-500 bg-slate-50 ring-2 ring-slate-500 ring-offset-1' 
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                          onClick={() => setWatermarkColor(color)}
                        >
                          <div 
                            className="text-sm font-medium text-center capitalize"
                            style={{ 
                              color: color === 'white' ? '#6b7280' : color === 'black' ? '#000000' : '#ef4444'
                            }}
                          >
                            {color}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Watermark Rotation */}
                {showWatermark && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Rotation: {watermarkRotation}°
                    </label>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      step="5"
                      value={watermarkRotation}
                      onChange={(e) => setWatermarkRotation(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: 'linear-gradient(to right, #e2e8f0 0%, #e2e8f0 100%)',
                        outline: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                    />
                  </div>
                )}

                {/* Watermark Opacity */}
                {showWatermark && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Opacity: {Math.round(watermarkOpacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: 'linear-gradient(to right, #e2e8f0 0%, #e2e8f0 100%)',
                        outline: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                    />
                  </div>
                )}

                {/* Watermark Preview */}
                {showWatermark && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Preview:</label>
                    <div className="relative w-full h-24 bg-slate-100 rounded border border-slate-200 overflow-hidden">
                      <div
                        className="absolute font-medium"
                        style={{
                          opacity: watermarkOpacity,
                          fontSize: watermarkSize === 'small' ? '10px' : watermarkSize === 'medium' ? '12px' : '16px',
                          color: watermarkColor === 'white' ? '#6b7280' : watermarkColor === 'black' ? '#000000' : '#ef4444',
                          transform: `rotate(${watermarkRotation}deg)`,
                          ...(watermarkPosition === 'top-left' && { top: '8px', left: '8px' }),
                          ...(watermarkPosition === 'top-right' && { top: '8px', right: '8px' }),
                          ...(watermarkPosition === 'bottom-left' && { bottom: '8px', left: '8px' }),
                          ...(watermarkPosition === 'bottom-right' && { bottom: '8px', right: '8px' }),
                        }}
                      >
                        {watermarkText}
                        {watermarkRotation !== 0 && (
                          <span className="text-xs text-slate-500 ml-1">({watermarkRotation}°)</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reset Watermark Button */}
                {showWatermark && (
                  <div className="pt-2">
                    <Button
                      onClick={resetWatermarkSettings}
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-200 hover:bg-slate-100 text-slate-700"
                    >
                      Reset to Defaults
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Generated Content */}
          <div className="lg:col-span-2">
            {/* Generated Content */}
            {generatedSlideshow && (
              <div className="space-y-6">
                {/* Action Buttons */}
                <Card className="shadow-sm border border-slate-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-4">
                      <Button
                        onClick={() => copyToClipboard(formatSlidesForCopy(), 'slides')}
                        variant="outline"
                        className="border-slate-200 hover:bg-slate-100"
                      >
                        {copied === 'slides' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy all Slides
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={() => copyToClipboard(generatedSlideshow.tiktokDescription, 'description')}
                        variant="outline"
                        className="border-slate-200 hover:bg-slate-100"
                      >
                        {copied === 'description' ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy TikTok Description
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={downloadAllSlides}
                        className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download All PNGs (HTML)
                      </Button>
                      <Button 
                        onClick={downloadAllSlidesCanvas} 
                        variant="secondary"
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download All PNGs
                      </Button>
                      {/* <Button onClick={debugScaling} variant="outline" size="sm" className="border-slate-200 hover:bg-slate-100">
                        <Bug className="h-4 w-4 mr-2" />
                        Debug Scaling
                      </Button>
                      <Button onClick={testPexelsAPI} variant="outline" size="sm" className="border-slate-200 hover:bg-slate-100">
                        <Search className="h-4 w-4 mr-2" />
                        Test Pexels API
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>

                {/* Slideshow Preview */}
                <Card className="shadow-sm border border-slate-200 bg-white">
                  <CardHeader className="bg-slate-50 border-b border-slate-200">
                    <CardTitle className="text-slate-900">{generatedSlideshow.title}</CardTitle>
                    <p className="text-slate-600">{generatedSlideshow.description}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {generatedSlideshow.slides.map((slide, index) => (
                        <div key={index} className="relative">
                          {/* TikTok 9:16 Slide Preview */}
                          <div
                            ref={(el) => {
                              slideRefs.current[index] = el;
                            }}
                            className="rounded-lg aspect-[9/16] flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden shadow-xl"
                            style={{ 
                              width: '270px', 
                              height: '480px',
                              backgroundColor: (selectedBackground || selectedGradient) ? 'transparent' : '#000000',
                              color: '#ffffff',
                              padding: '32px',
                              backgroundImage: selectedBackground ? `url(${selectedBackground.src.portrait})` : 'none',
                              background: selectedGradient ? selectedGradient.gradient : 'none',
                              backgroundSize: backgroundScale,
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            }}
                          >
                            {/* Dark overlay for text readability when background image is present */}
                            {selectedBackground && (
                              <div 
                                className="absolute inset-0 bg-black"
                                style={{ 
                                  opacity: 0.6,
                                  borderRadius: '8px'
                                }}
                              />
                            )}
                            
                            {/* Light overlay for gradient backgrounds to ensure text readability */}
                            {selectedGradient && (
                              <div 
                                className="absolute inset-0 bg-black"
                                style={{ 
                                  opacity: 0.3,
                                  borderRadius: '8px'
                                }}
                              />
                            )}
                            
                            <div className="space-y-4 relative z-10">
                              <h3 
                                className="text-2xl font-bold leading-tight"
                                style={{ 
                                  fontFamily: selectedFont.family,
                                  color: selectedTextColor.color,
                                  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                                }}
                              >
                                {slide.title}
                              </h3>
                              <p 
                                className="text-lg leading-relaxed"
                                style={{ 
                                  fontFamily: selectedFont.family,
                                  color: selectedTextColor.color, 
                                  opacity: 0.95,
                                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                                }}
                              >
                                {slide.content}
                              </p>
                              {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                                <ul className="space-y-2 text-left">
                                  {slide.bulletPoints.map((point, pointIndex) => (
                                    <li key={pointIndex} className="flex items-start gap-2">
                                      <span style={{ 
                                        color: selectedAccentColor.color, 
                                        marginTop: '4px',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                                      }}>•</span>
                                      <span 
                                        className="text-sm"
                                        style={{ 
                                          fontFamily: selectedFont.family,
                                          color: selectedTextColor.color,
                                          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                                        }}
                                      >
                                        {point}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            
                            <div 
                              className="absolute bottom-4 right-4 text-xs relative z-10"
                              style={{ 
                                fontFamily: selectedFont.family,
                                color: selectedTextColor.color, 
                                opacity: 0.8,
                                textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                              }}
                            >
                              {index + 1}/{generatedSlideshow.slides.length}
                            </div>

                            {/* Watermark */}
                            {showWatermark && (
                              <div
                                className="absolute font-medium relative z-10"
                                style={{
                                  fontFamily: selectedFont.family,
                                  color: watermarkColor === 'white' ? '#ffffff' : watermarkColor === 'black' ? '#000000' : '#ef4444',
                                  opacity: watermarkOpacity,
                                  textShadow: watermarkColor === 'white' ? '0 1px 2px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.8)',
                                  fontSize: watermarkSize === 'small' ? '12px' : watermarkSize === 'medium' ? '14px' : '18px',
                                  transform: `rotate(${watermarkRotation}deg)`,
                                  ...(watermarkPosition === 'top-left' && { top: '16px', left: '16px' }),
                                  ...(watermarkPosition === 'top-right' && { top: '16px', right: '16px' }),
                                  ...(watermarkPosition === 'bottom-left' && { bottom: '16px', left: '16px' }),
                                  ...(watermarkPosition === 'bottom-right' && { bottom: '16px', right: '16px' }),
                                }}
                              >
                                {watermarkText}
                              </div>
                            )}
                          </div>
                          
                          {/* Download Individual Slide */}
                          <div className="mt-2 space-y-2">
                            {/* <Button
                              onClick={() => downloadSlideAsPNG(index)}
                              size="sm"
                              variant="outline"
                              className="w-full border-slate-200 hover:bg-slate-100"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download PNG (HTML)
                            </Button> */}
                            <Button
                              onClick={() => downloadSlideAsCanvas(index)}
                              size="sm"
                              variant="secondary"
                              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download PNG
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* TikTok Description */}
                <Card className="shadow-sm border border-slate-200 bg-white">
                  <CardHeader className="bg-slate-50 border-b border-slate-200">
                    <CardTitle className="text-slate-900">TikTok Video Description</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <pre className="text-sm whitespace-pre-wrap font-mono text-slate-700">
                        {generatedSlideshow.tiktokDescription}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Instructions */}
                <Card className="shadow-sm border border-slate-200 bg-white">
                  <CardHeader className="bg-slate-50 border-b border-slate-200">
                    <CardTitle className="text-slate-900">📱 How to Use This Content</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3 text-sm text-slate-700">
                      <p><strong>1. Download slide images:</strong> Click &quot;Download All PNGs&quot; or individual slide download buttons</p>
                      <p><strong>2. Create your TikTok video:</strong> Upload the slide images to TikTok in order</p>
                      <p><strong>3. Add transitions:</strong> Use TikTok&apos;s built-in transitions between slides</p>
                      <p><strong>4. Copy the description:</strong> Use the generated TikTok description with hashtags</p>
                      <p><strong>5. Optimize timing:</strong> Each slide should display for 2-3 seconds for best engagement</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
