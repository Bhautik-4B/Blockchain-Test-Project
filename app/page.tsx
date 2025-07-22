'use client'

import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'

interface TokenInfo {
  name: string
  symbol: string
  totalSupply: string
}

interface WalletInfo {
  address: string
  network: string
  balance: string
}

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null)
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contractAddress, setContractAddress] = useState<string>('')

  useEffect(() => {
    // Load contract address from deployment
    const loadContractAddress = async () => {
      try {
        console.log('Loading contract address...')
        const response = await fetch('/contract-address.json')
        console.log('Response status:', response.status)
        
        if (response.ok) {
          const contractData = await response.json()
          console.log('Contract data:', contractData)
          setContractAddress(contractData.address)
          console.log('Contract address set:', contractData.address)
        } else {
          console.error('Failed to load contract address:', response.status)
        }
      } catch (e) {
        console.error('Error loading contract address:', e)
      }
    }
    loadContractAddress()
  }, [])

  const connectWallet = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const provider = await detectEthereumProvider()
      
      if (!provider) {
        throw new Error('Please install MetaMask!')
      }

      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      })

      const account = accounts[0]
      
      // Get network info
      const network = await (window as any).ethereum.request({
        method: 'eth_chainId'
      })

      // Get balance
      const balance = await (window as any).ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      })

      setWalletInfo({
        address: account,
        network: getNetworkName(network),
        balance: ethers.formatEther(balance)
      })
      
      setIsConnected(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getTokenInfo = async () => {
    console.log('Getting token info...')
    console.log('Contract address:', contractAddress)
    
    if (!contractAddress) {
      setError('Contract not deployed. Please deploy the contract first.')
      return
    }

    if (!isConnected) {
      setError('Please connect your wallet first.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('Creating provider...')
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      
      // First, check if the contract exists at the address
      console.log('Checking contract existence...')
      const code = await provider.getCode(contractAddress)
      if (code === '0x') {
        throw new Error(`No contract found at address ${contractAddress}. Please deploy the contract first.`)
      }
      
      console.log('Creating contract instance...')
      const contract = new ethers.Contract(
        contractAddress,
        [
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function totalSupply() view returns (uint256)'
        ],
        provider
      )

      console.log('Calling contract functions...')
      
      // Call individual functions
      const name = await contract.name()
      console.log('Name:', name)
      
      const symbol = await contract.symbol()
      console.log('Symbol:', symbol)
      
      const totalSupply = await contract.totalSupply()
      console.log('Total Supply:', totalSupply)

      setTokenInfo({
        name,
        symbol,
        totalSupply: ethers.formatEther(totalSupply)
      })
      
      console.log('Token info set successfully')
    } catch (err: any) {
      console.error('Error details:', err)
      setError(`Error fetching token info: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getNetworkName = (chainId: string) => {
    const networks: { [key: string]: string } = {
      '0x1': 'Ethereum Mainnet',
      '0x3': 'Ropsten Testnet',
      '0x4': 'Rinkeby Testnet',
      '0x5': 'Goerli Testnet',
      '0x2a': 'Kovan Testnet',
      '0x539': 'Localhost 8545',
      '0x89': 'Polygon Mainnet',
      '0x13881': 'Mumbai Testnet'
    }
    return networks[chainId] || `Chain ID: ${parseInt(chainId, 16)}`
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletInfo(null)
    setTokenInfo(null)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 opacity-20"></div>
      
      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="floating mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-2xl pulse-glow">
              <span className="text-3xl">🔗</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Blockchain Test Project
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Advanced MetaMask Integration & Web3 Functionality with Modern UI
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Connection Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">
                <span className="text-yellow-400">⚡</span> Wallet Connection
              </h2>
              {isConnected && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold">Connected</span>
                </div>
              )}
            </div>
            
            {!isConnected ? (
              <div className="text-center">
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>🦊</span>
                      <span>Connect MetaMask</span>
                    </div>
                  )}
                </button>
                <p className="text-slate-400 mt-4">
                  Click to connect your MetaMask wallet and start testing
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="status-card">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-blue-400">👤</span>
                      </div>
                      <h3 className="font-semibold text-white">Wallet Address</h3>
                    </div>
                    <p className="text-sm text-slate-300 font-mono break-all">
                      {walletInfo?.address}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatAddress(walletInfo?.address || '')}
                    </p>
                  </div>
                  
                  <div className="status-card">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-green-400">🌐</span>
                      </div>
                      <h3 className="font-semibold text-white">Network</h3>
                    </div>
                    <p className="text-sm text-slate-300">
                      {walletInfo?.network}
                    </p>
                  </div>
                  
                  <div className="status-card">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-purple-400">💰</span>
                      </div>
                      <h3 className="font-semibold text-white">Balance</h3>
                    </div>
                    <p className="text-lg font-bold text-yellow-400">
                      {walletInfo?.balance} ETH
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={disconnectWallet}
                    className="btn-secondary"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Token Info Section */}
          {isConnected && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">
                  <span className="text-yellow-400">🪙</span> Token Information
                </h2>
                {tokenInfo && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-yellow-400 font-semibold">Loaded</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <button
                    onClick={getTokenInfo}
                    disabled={loading || !contractAddress || !isConnected}
                    className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>📊</span>
                        <span>Get Token Info</span>
                      </div>
                    )}
                  </button>
                  
                  {contractAddress && (
                    <div className="glass-effect rounded-xl p-4">
                      <p className="text-sm text-slate-400 mb-1">Contract Address:</p>
                      <p className="text-sm text-white font-mono break-all">
                        {contractAddress}
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="text-xs text-yellow-400 hover:text-yellow-300 mt-2"
                      >
                        🔄 Refresh
                      </button>
                    </div>
                  )}
                  
                  {/* Debug Info */}
                  <div className="glass-effect rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-1">Debug Info:</p>
                    <p className="text-xs text-white">
                      Connected: {isConnected ? 'Yes' : 'No'}
                    </p>
                    <p className="text-xs text-white">
                      Contract: {contractAddress ? 'Loaded' : 'Not Found'}
                    </p>
                    <p className="text-xs text-white">
                      Network: {walletInfo?.network || 'Unknown'}
                    </p>
                  </div>
                </div>

                {tokenInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="info-card">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-400 text-lg">🏷️</span>
                        </div>
                        <h3 className="font-semibold text-white">Token Name</h3>
                      </div>
                      <p className="text-2xl font-bold text-yellow-400">
                        {tokenInfo?.name}
                      </p>
                    </div>
                    
                    <div className="info-card">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-400 text-lg">💎</span>
                        </div>
                        <h3 className="font-semibold text-white">Token Symbol</h3>
                      </div>
                      <p className="text-2xl font-bold text-yellow-400">
                        {tokenInfo?.symbol}
                      </p>
                    </div>
                    
                    <div className="info-card">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-400 text-lg">📈</span>
                        </div>
                        <h3 className="font-semibold text-white">Total Supply</h3>
                      </div>
                      <p className="text-2xl font-bold text-yellow-400">
                        {tokenInfo?.totalSupply}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="error-card">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-red-400">⚠️</span>
                </div>
                <h3 className="text-red-400 font-semibold text-lg">Error</h3>
              </div>
              <p className="text-red-300">{error}</p>
              <div className="mt-3 p-3 bg-red-900/20 rounded-lg">
                <p className="text-xs text-red-200">
                  <strong>Troubleshooting:</strong>
                </p>
                <ul className="text-xs text-red-200 mt-1 space-y-1">
                  <li>• Make sure MetaMask is connected</li>
                  <li>• Ensure you're on the correct network (localhost:8546)</li>
                  <li>• Check that the contract is deployed</li>
                  <li>• Open browser console (F12) for more details</li>
                </ul>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 text-lg">📋</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Instructions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-500 text-slate-900 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    1
                  </div>
                  <p className="text-slate-300">Click "Connect MetaMask" to connect your wallet</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-500 text-slate-900 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    2
                  </div>
                  <p className="text-slate-300">Ensure you're on the correct network (localhost:8546 for testing)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-500 text-slate-900 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    3
                  </div>
                  <p className="text-slate-300">Click "Get Token Info" to fetch token details from the smart contract</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-yellow-500 text-slate-900 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    4
                  </div>
                  <p className="text-slate-300">Verify that wallet address, network, and token info display correctly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-slate-500">
              Built with ❤️ using Next.js, Hardhat, and Ethers.js
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 