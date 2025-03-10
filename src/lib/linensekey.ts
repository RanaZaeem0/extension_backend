export const generateLicenseKey = (): string => {
    return (
      Math.random().toString(36).substring(2, 8).toUpperCase() + // First part
      '-' +
      Math.random().toString(36).substring(2, 8).toUpperCase() + // Second part
      '-' +
      Math.random().toString(36).substring(2, 8).toUpperCase()   // Third part
    );
  };