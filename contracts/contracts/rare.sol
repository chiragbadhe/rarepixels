// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Rare is ERC721Enumerable, Ownable {
    using SafeMath for uint256;

    // Struct to store NFT information
    struct NFTInfo {
        uint256 tokenId;
        string hash;
        address owner;
        uint256 price;
        uint256 creatorRoyalty;
        bool isForSale;
    }

    // Array to store all NFTs
    NFTInfo[] public allNFTs;

    // Events
    event Minted(address indexed owner, uint256 indexed tokenId, string hash, uint256 price, uint256 creatorRoyalty);
    event Bought(address indexed buyer, uint256 indexed tokenId, string hash);
    event Sold(address indexed seller, uint256 indexed tokenId, string hash);
    
    // Constructor
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    // Mint NFT
    function mintNFT(string memory _ipfsHash, uint256 _price, uint256 _creatorRoyalty) external {
        uint256 tokenId = totalSupply() + 1;
        _mint(msg.sender, tokenId);
        allNFTs.push(NFTInfo(tokenId, _ipfsHash, msg.sender, _price, _creatorRoyalty, false));
        emit Minted(msg.sender, tokenId, _ipfsHash, _price, _creatorRoyalty);
    }

    // Buy NFT
    function buyNFT(uint256 _tokenId) external payable {
        require(_exists(_tokenId), "NFT does not exist");
        NFTInfo storage nft = allNFTs[_tokenId - 1];
        require(nft.isForSale, "NFT is not for sale");
        require(msg.value >= nft.price, "Insufficient funds");

        uint256 creatorRoyaltyAmount = msg.value.mul(nft.creatorRoyalty).div(100);
        uint256 paymentToSeller = msg.value.sub(creatorRoyaltyAmount);

        payable(nft.owner).transfer(paymentToSeller);
        payable(owner()).transfer(creatorRoyaltyAmount);

        _transfer(nft.owner, msg.sender, _tokenId);

        // Update NFT information
        nft.owner = msg.sender;
        nft.isForSale = false;

        emit Bought(msg.sender, _tokenId, nft.hash);
    }

    // Sell NFT
    function sellNFT(uint256 _tokenId, uint256 _price) external {
        require(_exists(_tokenId), "NFT does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Not the owner of the NFT");

        NFTInfo storage nft = allNFTs[_tokenId - 1];
        nft.price = _price;
        nft.isForSale = true;

        emit Sold(msg.sender, _tokenId, nft.hash);
    }

    // Get all NFTs owned by a specific address
    function getAllNFTsByAddress(address _owner) external view returns (NFTInfo[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allNFTs.length; i++) {
            if (allNFTs[i].owner == _owner) {
                count++;
            }
        }

        NFTInfo[] memory result = new NFTInfo[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allNFTs.length; i++) {
            if (allNFTs[i].owner == _owner) {
                result[index] = allNFTs[i];
                index++;
            }
        }

        return result;
    }

    // Get all NFTs
    function getAllNFTs() external view returns (NFTInfo[] memory) {
        return allNFTs;
    }
}
