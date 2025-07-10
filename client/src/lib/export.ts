import html2canvas from 'html2canvas';

export async function exportDashboardAsImage(elementId: string): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Dashboard element not found');
    }

    // Hide resize handles and other UI elements before capture
    const resizeHandles = element.querySelectorAll('.react-resizable-handle');
    const originalDisplay: string[] = [];
    
    resizeHandles.forEach((handle, index) => {
      const htmlHandle = handle as HTMLElement;
      originalDisplay[index] = htmlHandle.style.display;
      htmlHandle.style.display = 'none';
    });

    // Generate the image
    const canvas = await html2canvas(element, {
      backgroundColor: '#FEFCF7', // soft-cream background
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      height: element.scrollHeight,
      width: element.scrollWidth,
    });

    // Restore resize handles
    resizeHandles.forEach((handle, index) => {
      const htmlHandle = handle as HTMLElement;
      htmlHandle.style.display = originalDisplay[index];
    });

    // Create download link
    const link = document.createElement('a');
    link.download = `flowboard-dashboard-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export dashboard:', error);
    throw error;
  }
}
