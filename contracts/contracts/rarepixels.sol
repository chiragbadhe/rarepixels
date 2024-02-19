// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RarePixels is ERC721, Ownable {
        // Counter to keep track of token IDs
    uint256 private tokenIdCounter;

    // Mapping to store IPFS hash, price, and creator royalty percentage for each token ID
    mapping(uint256 => string) private ipfsHashes;
    mapping(uint256 => uint256) private tokenPrices;
    mapping(uint256 => uint256) private creatorRoyalties;

    // Mapping to store the list of minted NFTs by wallet address
    mapping(address => uint256[]) private mintedNFTsByWallet;

    // Event emitted when a new NFT is minted
    event NFTMinted(uint256 indexed tokenId, address indexed owner, string ipfsHash, uint256 price, uint256 creatorRoyalty);

    // Event emitted when an NFT is sold
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);

    // Constructor to initialize the contract
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    // Function to mint a new NFT
    function mintNFT(string memory _ipfsHash, uint256 _price, uint256 _creatorRoyalty) external {
        require(_creatorRoyalty <= 100, "Royalty percentage must be between 0 and 100");

        uint256 newTokenId = tokenIdCounter;

        // Increment the token ID counter
        tokenIdCounter++;

        // Mint the new NFT
        _safeMint(msg.sender, newTokenId);

        // Set IPFS hash, price, and creator royalty percentage for the new token ID
        ipfsHashes[newTokenId] = _ipfsHash;
        tokenPrices[newTokenId] = _price;
        creatorRoyalties[newTokenId] = _creatorRoyalty;

        // Record the minted NFT for the owner
        mintedNFTsByWallet[msg.sender].push(newTokenId);

        // Emit the minted event
        emit NFTMinted(newTokenId, msg.sender, _ipfsHash, _price, _creatorRoyalty);
    }

    // Function to get IPFS hash for a given token ID
    function getIpfsHash(uint256 _tokenId) external view returns (string memory) {
        return ipfsHashes[_tokenId];
    }

    // Function to get price for a given token ID
    function getTokenPrice(uint256 _tokenId) external view returns (uint256) {
        return tokenPrices[_tokenId];
    }

    // Function to get creator royalty percentage for a given token ID
    function getCreatorRoyalty(uint256 _tokenId) external view returns (uint256) {
        return creatorRoyalties[_tokenId];
    }

    // Function to get minted NFTs by wallet address
    function getMintedNFTsByWallet(address _wallet) external view returns (uint256[] memory) {
        return mintedNFTsByWallet[_wallet];
    }

    // Function to sell an NFT
    function sellNFT(uint256 _tokenId, uint256 _salePrice) external {
        require(_exists(_tokenId), "Token ID does not exist");
        address seller = ownerOf(_tokenId);
        require(seller == msg.sender, "You are not the owner of this NFT");
        require(_salePrice > 0, "Sale price must be greater than 0");

        // Transfer the NFT to the contract
        _safeTransfer(seller, address(this), _tokenId, "");

        // Emit the NFT sold event
        emit NFTSold(_tokenId, seller, address(0), _salePrice);
    }
    // Function to buy an NFT
    function buyNFT(uint256 _tokenId) external payable {
        require(_exists(_tokenId), "Token ID does not exist");

        address seller = ownerOf(_tokenId);
        address buyer = msg.sender;
        uint256 salePrice = tokenPrices[_tokenId];
        uint256 creatorRoyaltyPercentage = creatorRoyalties[_tokenId];

        // Check if the buyer is not the owner of the NFT
        require(seller != buyer, "You cannot buy your own NFT");

        // Check if the provided Ether is exactly equal to the sale price
        require(msg.value == salePrice, "Incorrect Ether amount sent");

        // Check if the buyer sent enough funds to cover the sale price and creator royalty
        uint256 totalPayment = salePrice + (salePrice * creatorRoyaltyPercentage) / 100;
        require(msg.value >= totalPayment, "Insufficient funds");

        // Transfer ownership of the NFT to the buyer
        _safeTransfer(seller, buyer, _tokenId, "");

        // Transfer the sale price to the seller
        payable(seller).transfer(salePrice);

        // Distribute royalty to the creator (minting address)
        uint256 creatorRoyalty = (salePrice * creatorRoyaltyPercentage) / 100;
        payable(buyer).transfer(creatorRoyalty);

        // Emit the NFT sold event
        emit NFTSold(_tokenId, seller, buyer, salePrice);
    }

    function getAllMintedNFTsByWallet(address _wallet) external view returns (uint256[] memory, string[] memory) {
        uint256[] memory mintedNFTs = mintedNFTsByWallet[_wallet];
        uint256 length = mintedNFTs.length;

        uint256[] memory tokenIds = new uint256[](length);
        string[] memory ipfsHashesArray = new string[](length);

        for (uint256 i = 0; i < length; i++) {
            uint256 tokenId = mintedNFTs[i];
            string memory ipfsHash = ipfsHashes[tokenId];

            // Store token ID and IPFS hash in separate arrays
            tokenIds[i] = tokenId;
            ipfsHashesArray[i] = ipfsHash;
        }

        return (tokenIds, ipfsHashesArray);
    }
    
    function getAllMintedNFTs() external view returns (uint256[] memory, string[] memory) {
        uint256 totalMinted = tokenIdCounter;

        uint256[] memory tokenIds = new uint256[](totalMinted);
        string[] memory ipfsHashesArray = new string[](totalMinted);

        for (uint256 i = 0; i < totalMinted; i++) {
            uint256 tokenId = i;
            string memory ipfsHash = ipfsHashes[tokenId];

            // Store token ID and IPFS hash in the result arrays
            tokenIds[i] = tokenId;
            ipfsHashesArray[i] = ipfsHash;
        }

        return (tokenIds, ipfsHashesArray);
    }


}
