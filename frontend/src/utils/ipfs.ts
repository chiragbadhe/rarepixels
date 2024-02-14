// utils/ipfs.ts

import axios from 'axios';

export interface Metadata {
  // Define your metadata properties here
  title: string;
  description: string;
  // Add more properties as needed
}

export const getMetadataFromIPFS = async (ipfsHash: string): Promise<Metadata | null> => {
  try {
    const response = await axios.get(`https://ipfs.io/ipfs/${ipfsHash}`);
    
    // Parse and return metadata from the response
    const metadata: Metadata = {
      title: response.data.title,
      description: response.data.description,
      // Add more properties based on your IPFS response
    };

    return metadata;
  } catch (error) {
    console.error('Error fetching metadata from IPFS:', error);
    return null;
  }
};
