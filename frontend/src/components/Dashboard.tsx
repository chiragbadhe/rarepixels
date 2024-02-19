import React, { useEffect, useState } from "react";
import NftCard from "./NftCard";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { RarePixelsAbi } from "@/abis/RarePixels";
import { RarePixelsContractAddress } from "@/utils/constants";
import { getAddress, parseEther } from "viem";
import { localNfts } from "@/utils/locakNfts";
import { truncateEOAAddress } from "@/utils/truncateEOAAddress";

type Props = {};

function Dashboard({}: Props) {
  const [nftsMinted, setNftsMinted] = useState<number[]>([]); // Assuming NFT IDs are of type 'number'
  const [sellAmount, setSellAmount] = useState();
  const { address, isConnected } = useAccount();
  const [selectedTokenId, setSelectedTokenId] = useState(null);

  const {
    isLoading,
    data,
    error: err,
  } = useReadContract({
    abi: RarePixelsAbi,
    address: RarePixelsContractAddress,
    functionName: "getAllNFTsByAddress",
    args: [address],
  });

  const { writeContract, error, isSuccess } = useWriteContract();

  const handleNftSell = (
    tokenId: React.SetStateAction<null>,
    value: React.SetStateAction<undefined>
  ) => {
    setSelectedTokenId(tokenId);
    setSellAmount(value);

    console.log(selectedTokenId);
    writeContract({
      abi: RarePixelsAbi,
      address: RarePixelsContractAddress,
      functionName: "sellNFT",
      args: [selectedTokenId, sellAmount],
    });
    console.log("Selected Token ID:", tokenId, value, error?.message);
  };

  console.log(data, error, err);

  useEffect(() => {
    const fetchMintedNFTs = async () => {
      try {
        setNftsMinted((data || []) as number[]);
      } catch (error) {
        console.error("Error fetching minted NFTs:", error);
      }
    };
    fetchMintedNFTs();
  }, [data]);

  return (
    <div className="container mx-auto  top-0">
      <div className=" flex flex-col mt-[50px]">
        <span className="text-[42px] font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Dashboard
        </span>
        <span className="max-w-[800px] opacity-70 mt-[6px]">
          Unlock the power of blockchain by creating your own Non-Fungible Token
          (NFT) using our smart contract! Simply provide your wallet address,
          choose a distinctive NFT name, set the desired price, and determine
          the royalty percentage for the creator.
        </span>
      </div>

      <div className="grid grid-cols-4 gap-[30px] mt-[40px]">
        {isConnected ? (
          !isLoading ? (
            Array.isArray(nftsMinted) && nftsMinted.length > 0 ? (
              <>
                {nftsMinted.map((nft: any) => {
                  return (
                    <div key={nft.tokenId}>
                      <NftCard
                        onDashboard={true}
                        tokenId={nft.tokenId.toString()} // Convert tokenId to string if needed
                        walletAddress={nft.owner}
                        nftPrice={nft.price.toString()} // Convert price to string if needed
                        royalty={nft.creatorRoyalty.toString()} // Convert creatorRoyalty to string if needed
                        sellNft={handleNftSell}
                        imageUri={nft.hash.toString()}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              "No NFTs minted"
            )
          ) : (
            "Loading..."
          )
        ) : (
          "Please Connect Wallet First"
        )}
      </div>
    </div>
  );
}

export default Dashboard;
