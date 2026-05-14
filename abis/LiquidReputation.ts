export const LiquidReputationAbi = [
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "_mETH",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "_oracle",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "_treasury",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "MAX_SLASH_BPS",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint16",
                            "internalType":  "uint16"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "balances",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "user",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "shares",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "mETH",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "contract IERC20"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "oracle",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "owner",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "pools",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "totalStaked",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "totalShares",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "previewUnstake",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "user",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "setOracle",
        "inputs":  [
                       {
                           "name":  "newOracle",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "setTreasury",
        "inputs":  [
                       {
                           "name":  "newTreasury",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "slash",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "slashBps",
                           "type":  "uint16",
                           "internalType":  "uint16"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "stake",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "amount",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "treasury",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "address"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "unstake",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "shareAmount",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "event",
        "name":  "OracleUpdated",
        "inputs":  [
                       {
                           "name":  "oldOracle",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "newOracle",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "Slashed",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "slashBps",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "amount",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "Staked",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "user",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "amount",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "sharesMinted",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "TreasuryUpdated",
        "inputs":  [
                       {
                           "name":  "oldTreasury",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "newTreasury",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "Unstaked",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "user",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "sharesBurned",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "amount",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "error",
        "name":  "SafeERC20FailedOperation",
        "inputs":  [
                       {
                           "name":  "token",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ]
    }
] as const;

