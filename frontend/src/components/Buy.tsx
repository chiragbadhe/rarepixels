import React, { useEffect, useState } from "react";
import NftCard from "./NftCard";
import { RarePixelsAbi } from "@/abis/RarePixels";
import { RarePixelsContractAddress } from "@/utils/constants";
import { useReadContract, useWriteContract } from "wagmi";
import { getMetadataFromIPFS, Metadata } from "../utils/ipfs";
import { localNfts } from "@/utils/locakNfts";
import { parseEther } from "viem";

type Props = {};

function Buy({}: Props) {
  const [allNftsMinted, setAllNftsMinted] = useState<number[]>([]); // Assuming NFT IDs are of type 'number'

  const { writeContract, error } = useWriteContract();

  const [selectedTokenId, setSelectedTokenId] = useState(null);

  // console.log(allNftsMinted);

  const handleNftBuy = (tokenId: React.SetStateAction<null>) => {
    setSelectedTokenId(tokenId);
    writeContract({
      abi: RarePixelsAbi,
      address: RarePixelsContractAddress,
      functionName: "buyNFT",
      args: [selectedTokenId],
    });
    console.log("Selected Token ID:", tokenId, error?.message);
  };

  const { isLoading, data, isError } = useReadContract({
    abi: RarePixelsAbi,
    address: RarePixelsContractAddress,
    functionName: "getAllNFTs",
    args: [],
  });

  useEffect(() => {
    const fetchAllMintedNFTs = async () => {
      try {
        setAllNftsMinted((data || []) as any[]);
      } catch (error) {
        console.error("Error fetching minted NFTs:", error);
      }
    };
    fetchAllMintedNFTs();
  }, [data]);

  return (
    <div className="container mx-auto justify-center w-full pt-[60px]">
      <div className="flex items-center space-y-[12px]">
        <div className="text-left flex flex-col max-w-[900px]">
          <span className="text-[42px] font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Unlock Digital Delights: Shop Your NFT Favorites Now!
          </span>
          <span className="text-[16px] pr-[100px] mt-[12px] opacity-60">
            By purchasing this unique NFT, you become a patron of the arts,
            directly supporting the brilliant mind behind the creation. What
            sets this NFT apart is its commitment to the artist, ensuring that
            every time it changes hands, a portion of the transaction goes
            straight into the hands of the visionary who brought it to life.
          </span>

          <div className="mt-[20px] space-x-[16px]">
            <button className="px-[16px] py-[12px] rounded-[6px]  bg-pink-600 text-[18px]">
              Source Code
            </button>
            <button className="px-[16px] py-[12px] rounded-[6px]  bg-yellow-600 text-[18px]">
              View Contracts
            </button>
          </div>
        </div>

        <video
          className="rounded-[12px] opacity-50 w-[550px]"
          //   controls
          autoPlay
          muted
          loop
          src="https://cdn.dribbble.com/userupload/2603878/file/original-d33e7bb79fb269252f7565d63b1b68e0.mp4"
        ></video>
      </div>
      <div className=" border-white/20 mt-[40px] grid grid-cols-4 gap-[30px] py-[30px]">
        {!isLoading ? (
          Array.isArray(allNftsMinted) && allNftsMinted.length > 0 ? (
            <>
              {allNftsMinted.map((nft: any) => {
                if (nft.isForSale) {
                  return (
                    <div key={nft.tokenId}>
                      <NftCard
                        onDashboard={false}
                        tokenId={nft.tokenId.toString()}
                        walletAddress={nft.owner}
                        nftPrice={nft.price.toString()}
                        royalty={nft.creatorRoyalty.toString()}
                        BuyNft={handleNftBuy}
                        imageUri={nft.hash.toString()}
                      />
                    </div>
                  );
                } else {
                  return null; // Skip rendering NFTs that are not for sale
                }
              })}
            </>
          ) : (
            "No NFTs minted"
          )
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
}

export default Buy;
