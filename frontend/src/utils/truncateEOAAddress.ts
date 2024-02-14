export function truncateEOAAddress(address: string, length: number = 8): string {
    // Check if the address is a valid Ethereum address
    if (!/^(0x)?[0-9a-fA-F]{40}$/i.test(address)) {
      throw new Error('Invalid Ethereum address');
    }
  
    // Remove the '0x' prefix if present
    const cleanAddress = address.replace(/^0x/i, '');
  
    // Truncate the address
    const truncatedAddress = cleanAddress.slice(0, length);
  
    // Add '0x' prefix back, if the original address had it
    const truncatedWithPrefix = (address.toLowerCase().startsWith('0x') ? '0x' : '') + truncatedAddress;
  
    return truncatedWithPrefix;
  }
  