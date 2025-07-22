# 🔗 Blockchain Test Project

A comprehensive blockchain project demonstrating MetaMask integration and Web3 functionality with a modern React frontend.

## Features

✅ **MetaMask Integration**
- Connect/disconnect MetaMask wallet
- Display wallet address and network information
- Show account balance

✅ **Smart Contract Interaction**
- Call `name()` and `symbol()` functions using Ethers.js
- Display token information (name, symbol, total supply)
- Real-time contract data fetching

✅ **Modern UI/UX**
- Beautiful, responsive design with Tailwind CSS
- Real-time status updates
- Error handling and user feedback
- Professional blockchain interface

## Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Git

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Hardhat Dependencies

```bash
npm install --save-dev @openzeppelin/contracts
```

### 3. Compile Smart Contracts

```bash
npm run compile
```

### 4. Start Local Blockchain

In a new terminal, start the local Hardhat network:

```bash
npx hardhat node
```

### 5. Deploy Smart Contract

In another terminal, deploy the contract:

```bash
npm run deploy
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### 1. Connect MetaMask
- Click "Connect MetaMask" button
- Approve the connection in MetaMask
- Verify wallet address and network display

### 2. Configure MetaMask for Local Network
- Network Name: `Localhost 8546`
- RPC URL: `http://127.0.0.1:8546`
- Chain ID: `1337`
- Currency Symbol: `ETH`

### 3. Test Token Functions
- Click "Get Token Info" to fetch token details
- Verify that name, symbol, and total supply display correctly
- Test contract interaction functionality

## Project Structure

```
blockchain-test-project/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── contracts/             # Smart contracts
│   └── TestToken.sol      # ERC20 token contract
├── scripts/               # Deployment scripts
│   └── deploy-deterministic.js  # Contract deployment
├── hardhat.config.js      # Hardhat configuration
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind CSS config
└── README.md              # This file
```

## Smart Contract Details

### TestToken.sol
- **Name**: "Blockchain Test Token"
- **Symbol**: "BTT"
- **Total Supply**: 1,000,000 tokens
- **Functions**:
  - `name()`: Returns token name
  - `symbol()`: Returns token symbol
  - `totalSupply()`: Returns total supply
  - `getTokenInfo()`: Returns all token info

## Testing Checklist

- [ ] MetaMask connection works
- [ ] Wallet address displays correctly
- [ ] Network information shows properly
- [ ] Account balance is accurate
- [ ] Token name function call works
- [ ] Token symbol function call works
- [ ] Total supply displays correctly
- [ ] UI is responsive and modern
- [ ] Error handling works properly

## Troubleshooting

### Common Issues

1. **MetaMask not connecting**
   - Ensure MetaMask is installed and unlocked
   - Check if you're on the correct network (localhost:8546)

2. **Contract not found**
   - Make sure the contract is deployed (`npm run deploy`)
   - Verify the contract address in `contract-address.json`

3. **Network errors**
   - Ensure Hardhat node is running (`npx hardhat node`)
   - Check MetaMask network configuration

4. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

## Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Hardhat, Solidity
- **Web3**: Ethers.js, MetaMask
- **Smart Contracts**: OpenZeppelin Contracts

## License

MIT License - feel free to use this project for your blockchain development needs! 