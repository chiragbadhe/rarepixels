import React, { useEffect, useState } from "react";
import NftCard from "./NftCard";
import { useReadContract, useWriteContract } from "wagmi";
import { RarePixelsAbi } from "@/abis/RarePixels";
import { RarePixelsContractAddress } from "@/utils/constants";
import { getAddress, parseEther } from "viem";
import { localNfts } from "@/utils/locakNfts";
import { truncateEOAAddress } from "@/utils/truncateEOAAddress";

type Props = {};

function Dashboard({}: Props) {
  const [nftsMinted, setNftsMinted] = useState<number[]>([]); // Assuming NFT IDs are of type 'number'
  const [sellAmount, setSellAmount] = useState();

  const { isLoading, data } = useReadContract({
    abi: RarePixelsAbi,
    address: RarePixelsContractAddress,
    functionName: "getAllMintedNFTsByWallet",
    args: ["0x16B2a4AEd3648723e4BDe7638507fCE7792982e3"],
  });

  const { writeContract, error, isSuccess } = useWriteContract();

  const setAmountToSell = (value: React.SetStateAction<undefined>) => {
    setSellAmount(value);
  };

  const sellNft = ({ tokenId }: any) => {
    console.log("Sell");
    writeContract({
      abi: RarePixelsAbi,
      address: RarePixelsContractAddress,
      functionName: "mintNFT",
      args: [
        "bafyreid4c6mcuvmd5zpalwpsfvwqdoxgj3zvf3mk23d3xvzyoyoebba25s",
        parseEther("0.1"),
        10,
      ],
    });
  };

  console.log(data);

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

  console.log(nftsMinted[1]);

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
        {/* {!isLoading ? (
          Array.isArray(nftsMinted[0]) && nftsMinted[0].length > 0 ? (
            <>
              {nftsMinted[0].map((id, index) => (
                <div key={id}>
                  <NftCard
                    onDashboard={true}
                    sellNft={sellNft}
                    setSellAmount={setAmountToSell}
                    sellAmountValue={sellAmount}
                    imageUri={""}
                    nftName={""}
                    tokenId={""}
                    walletAddress={""}
                    nftPrice={""}
                    royalty={""}
                  />
                </div>
              ))}
            </>
          ) : (
            "No NFTs minted"
          )
        ) : (
          "Loading..."
        )} */}

        {!isLoading ? (
          <>
            {localNfts.map((nft, index) => {
              const truncatedAddress = truncateEOAAddress(nft.walletAddress);

              return (
                <div key={index}>
                  <NftCard
                    onDashboard={true}
                    sellNft={sellNft}
                    setSellAmount={setAmountToSell}
                    sellAmountValue={sellAmount}
                    imageUri={nft.imageUri}
                    nftName={nft.name}
                    tokenId={nft.tokenId}
                    walletAddress={truncatedAddress}
                    nftPrice={nft.tokenPrice}
                    royalty={nft.royalty}
                  />
                </div>
              );
            })}
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
}

export default Dashboard;
