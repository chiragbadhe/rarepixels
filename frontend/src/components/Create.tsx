import { RarePixelsContractAddress } from "@/utils/constants";
import { NFTStorage } from "nft.storage";
import React, { ChangeEvent, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { RarePixelsAbi } from "@/abis/RarePixels";

type Props = {};

interface TokenInput {
  name: string;
  description: string;
  image: Blob;
  walletAddress: string;
  priceToList: string;
  royaltyPercentage: string;
}
function Create({}: Props) {
  const { writeContract, error } = useWriteContract();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nftName: "",
    creatorName: "",
    walletAddress: "", // Default value, replace with actual wallet address logic
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

  const saveToNFTStorage = async () => {
    try {
      const nftStorage = new NFTStorage({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMxRWZEYkU4MTU1RTQ0Y2NEOWNhNkIwNDBjYTc5MzJmOWNlRjdmNzciLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwNzkwMTg1NDA4OSwibmFtZSI6InJhcmVwaXhlbCJ9.kAfHRL7t9VuSwzU6Z4JI3mVBbue009CRiRcRu_R02wA",
      });

      // Convert the image data to a Blob
      const imageBlob = new Blob([
        Buffer.from(imagePreview!.split(",")[1], "base64"),
      ]);

      // Upload image to nft.storage
      const imageResult = await nftStorage.storeBlob(imageBlob);

      // Create a JSON object with the form data and image nft.storage URL
      const dataWithImageURL = {
        ...formData,
        imageUrl: imageResult,
      };

      const tokenInput: TokenInput = {
        name: formData.nftName,
        description: formData.creatorName, // You can choose another property for description
        image: imageBlob,
        walletAddress: formData.walletAddress,
        priceToList: formData.priceToList,
        royaltyPercentage: formData.royaltyPercentage,
      };

      // Upload form data to nft.storage
      const dataResult = await nftStorage.store(tokenInput);

      console.log("NFT.Storage URL:", dataResult.url);
    } catch (error) {
      console.error("Error saving to NFT.Storage:", error);
    }
  };

  console.log(error);

  const MintNFT = () => {
    console.log("Test");
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
            <div className="space-y-[20px]">
              <p className="flex flex-col">
                <span className="text-[16px]">NFT Name</span>
                <input
                  className="px-[12px] py-[8px] outline-none rounded-[6px] border border-white/20 bg-transparent mt-[6px]"
                  placeholder="Enter NFT Name"
                  type="text"
                  value={formData.nftName}
                  onChange={(e) => handleInputChange(e, "nftName")}
                />
              </p>

              <p className="flex flex-col">
                <span className="text-[16px]">Creator Name</span>
                <input
                  className="px-[12px] py-[8px] outline-none rounded-[6px] border border-white/20 bg-transparent mt-[6px]"
                  placeholder="Enter Creator Name"
                  type="text"
                  value={formData.creatorName}
                  onChange={(e) => handleInputChange(e, "creatorName")}
                />
              </p>

              <p className="flex flex-col">
                <span className="text-[16px]">Wallet Address</span>
                <span className="px-[12px] py-[8px] outline-none rounded-[6px] border border-white/20 bg-transparent mt-[6px] opacity-70 cursor-no-drop">
                  {formData.walletAddress}
                </span>
              </p>

              <p className="flex flex-col">
                <span className="text-[16px]">Price To List</span>
                <input
                  className="px-[12px] py-[8px] outline-none rounded-[6px] border border-white/20 bg-transparent mt-[6px]"
                  placeholder="Enter Price To List NFT"
                  type="text"
                  value={formData.priceToList}
                  onChange={(e) => handleInputChange(e, "priceToList")}
                />
              </p>

              <p className="flex flex-col">
                <span className="text-[16px]">Royalty Percentage (%)</span>
                <input
                  className="px-[12px] py-[8px] outline-none rounded-[6px] border border-white/20 bg-transparent mt-[6px]"
                  placeholder="Enter the royalty percentage you want"
                  type="text"
                  value={formData.royaltyPercentage}
                  onChange={(e) => handleInputChange(e, "royaltyPercentage")}
                />
              </p>
            </div>
            <button
              onClick={saveToNFTStorage}
              className="bg-cyan-400 rounded-[6px] w-full py-[12px] font-bold text-[16px] text-black mt-[20px]"
            >
              Create Nft
            </button>

            <button
              onClick={() => MintNFT()}
              className="bg-green-400 rounded-[6px] w-full py-[12px] font-bold text-[16px] text-black mt-[20px]"
            >
              Mint NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;
