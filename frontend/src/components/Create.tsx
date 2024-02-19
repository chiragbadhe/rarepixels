import { RarePixelsContractAddress } from "@/utils/constants";
import { NFTStorage } from "nft.storage";
import React, { ChangeEvent, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { RarePixelsAbi } from "@/abis/RarePixels";

type Props = {};

interface TokenInput {
  image: any;
  walletAddress: string;
  priceToList: string;
  royaltyPercentage: string;
}
function Create({}: Props) {
  const { writeContract, error } = useWriteContract();
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    walletAddress: address,
    priceToList: "",
    royaltyPercentage: "",
  });

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: event.target.value,
    }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const selectedFile = fileInput.files && fileInput.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const MintNft = async () => {
    try {
      if (
        !formData.walletAddress ||
        !formData.priceToList ||
        !formData.royaltyPercentage
      ) {
        setErrorMessage("Please fill in all required fields.");
        return;
      }

      setLoading(true);

      const nftStorage = new NFTStorage({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMxRWZEYkU4MTU1RTQ0Y2NEOWNhNkIwNDBjYTc5MzJmOWNlRjdmNzciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwNzkwMTg1NDA4OSwibmFtZSI6InJhcmVwaXhlbCJ9.kAfHRL7t9VuSwzU6Z4JI3mVBbue009CRiRcRu_R02wA",
      });

      const imageBlob = new Blob([
        Buffer.from(imagePreview!.split(",")[1], "base64"),
      ]);

      const dataResult = await nftStorage.storeBlob(imageBlob);

      writeContract({
        abi: RarePixelsAbi,
        address: RarePixelsContractAddress,
        functionName: "mintNFT",
        args: [
          `https://${dataResult}.ipfs.nftstorage.link`,
          BigInt(formData.priceToList),
          formData.royaltyPercentage,
        ],
      });

      console.log(
        "NFT.Storage URL:",
        `https://${dataResult}.ipfs.nftstorage.link`
      );
    } catch (error) {
      console.error("Error saving to NFT.Storage:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(error);

  return (
    <div className="container mx-auto flex flex-col  h-[600px] w-screen mt-[50px]">
      <span className="text-[42px] font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create/Mint NFT
      </span>
      <span className="max-w-[700px] opacity-70">
        Unlock the power of blockchain by creating your own Non-Fungible Token
        (NFT) using our smart contract! Simply provide your wallet address,
        choose a distinctive NFT name, set the desired price, and determine the
        royalty percentage for the creator.
      </span>
      <div className="flex mt-[30px] w-screen">
        <div className="w-1/2 h-[600px] pr-[200px]">
          <div className="border border-green-400 rounded-[16px] bg-white/5 p-[22px] flex flex-col items-center justify-center h-[500px]">
            <label
              htmlFor="imageUpload"
              className="cursor-pointer flex flex-col items-center"
            >
              <img
                id="previewImage"
                className={`h-[150px] w-[150px] rounded-[12px] ${
                  imagePreview ? "h-[400px] w-[400px]" : "opacity-10"
                }`}
                src={imagePreview || "/images/upload.svg"}
                alt="Upload Image"
              />

              <span className="text-[24px] mt-[20px] opacity-70 px-[16px] bg-green-400 text-black py-[6px] max-w-[400px]">
                Upload Image
              </span>

              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div className="w-[500px] ">
          <div className="w-full">
            {!isConnected ? (
              <div className="w-full  bg-red-500 py-[12px] rounded-[12px] px-[16px] mb-[12px]">
                Please connect your wallet to continue
              </div>
            ) : (
              <div className="w-full  bg-green-500 py-[12px] rounded-[12px] px-[16px] mb-[12px]">
                Wallet is connected
              </div>
            )}
            <div className="space-y-[20px]">
              <p className="flex flex-col">
                <span className="text-[16px]">Wallet Address</span>
                <span className="px-[12px] py-[8px] outline-none rounded-[6px] border border-white/20 bg-transparent mt-[6px] opacity-70 cursor-no-drop">
                  {isConnected ? formData.walletAddress : "Your Wallet Addess"}
                </span>
              </p>

              <p className="flex flex-col">
                <span className="text-[16px]">Price To List</span>
                <input
                  className="px-[12px] py-[8px] outline-none rounded-[6px] border border-white/20 bg-transparent mt-[6px]"
                  placeholder="Enter Price To List NFT"
                  type="number"
                  value={formData.priceToList}
                  onChange={(e) => handleInputChange(e, "priceToList")}
                />
              </p>

              <p className="flex flex-col">
                <span className="text-[16px]">Royalty Percentage (%)</span>
                <input
                  className="px-[12px] py-[8px] outline-none rounded-[6px] border border-white/20 bg-transparent mt-[6px]"
                  placeholder="Enter the royalty percentage you want"
                  type="number"
                  value={formData.royaltyPercentage}
                  onChange={(e) => handleInputChange(e, "royaltyPercentage")}
                />
              </p>
            </div>

            <button
              onClick={MintNft}
              disabled={loading}
              className="bg-cyan-400 rounded-[6px] w-full py-[12px] font-bold text-[16px] text-black mt-[20px]"
            >
              {!loading ? "Create Nft" : "Loading..."}
            </button>
            <span className="text-red-600">{errorMessage && errorMessage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
