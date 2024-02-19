import result from "postcss/lib/result";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { parseEther } from "viem";
import { truncateEOAAddress } from "@/utils/truncateEOAAddress";

type Props = {
  onDashboard?: boolean;
  sellNft?: any;
  setSellAmount?: any;
  sellAmountValue?: any;
  tokenId: any;
  walletAddress: any;
  nftPrice: any;
  royalty: any;
  imageUri: any;
  BuyNft?: any;
};

function NftCard({
  onDashboard,
  sellNft,
  setSellAmount,
  BuyNft,
  tokenId,
  walletAddress,
  nftPrice,
  royalty,
  imageUri,
}: Props) {
  const [sellAmountValueForComponent, setSellAmountValueForComponent] =
    useState("");

  const sellAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSellAmountValueForComponent(event.target.value);
  };

  const buyNftHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    // Your logic for buying the NFT using the tokenId
    BuyNft(tokenId);
  };

  return (
    <div>
      <div className="opacity-80 w-full border border-white/20 rounded-[12px] bg-white/5 backdrop-blur-lg p-[16px]">
        <img
          src={imageUri}
          className="h-[190px] w-full rounded-md mb-[12px] opacity-80 border border-white/20"
          alt=""
        />
        <div className="flex  flex-col">
          <div className="justify-between w-full flex">
            <span className="opacity-60">Token Id: #{tokenId}</span>
          </div>
          <span className=" text-[14px] mt-[6px] opacity-80">
            {truncateEOAAddress(walletAddress)}
          </span>

          <div className="flex space-x-[18px]">
            <div className="flex flex-col">
              <span className="font-semibold text-[16px] mt-[12px] opacity-60">
                Price
              </span>
              <span className=" text-[14px] mt-[3px]">{nftPrice} ETH</span>
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-[16px] mt-[12px] opacity-60">
                Royalty
              </span>
              <span className=" text-[14px] mt-[3px]">{royalty} %</span>
            </div>
          </div>

          {onDashboard ? (
            <div>
              <input
                className="px-[12px] py-[6px] bg-transparent outline-none border rounded-[6px] mt-[12px] border-white/20 w-full"
                type="number"
                value={sellAmountValueForComponent}
                onChange={sellAmount}
                placeholder="Enter Price To Sell"
                name=""
                id=""
              />
              <button
                onClick={() => sellNft(tokenId, sellAmountValueForComponent)}
                className="w-full bg-red-600 text-white font-bold mt-[12px] py-[6px] rounded-[6px] hover:bg-green-700 duration-300 animate"
              >
                Sell
              </button>
            </div>
          ) : (
            <button
              onClick={() => buyNftHandler(tokenId)}
              className="w-full bg-green-400 text-black font-bold mt-[12px] py-[6px] rounded-[6px] hover:bg-green-700 duration-300 animate"
            >
              Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NftCard;
