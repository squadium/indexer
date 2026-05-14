export const RewardDistributorAbi = [
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
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "CLIFF_DURATION",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint64",
                            "internalType":  "uint64"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "VEST_DURATION",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint64",
                            "internalType":  "uint64"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "claim",
        "inputs":  [
                       {
                           "name":  "grantIdx",
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
        "name":  "claimAll",
        "inputs":  [

                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "claimable",
        "inputs":  [
                       {
                           "name":  "user",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "grantIdx",
                           "type":  "uint256",
                           "internalType":  "uint256"
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
        "name":  "distribute",
        "inputs":  [
                       {
                           "name":  "weekId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "users",
                           "type":  "address[]",
                           "internalType":  "address[]"
                       },
                       {
                           "name":  "amounts",
                           "type":  "uint256[]",
                           "internalType":  "uint256[]"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "grantCount",
        "inputs":  [
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
        "name":  "grants",
        "inputs":  [
                       {
                           "name":  "user",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "totalAmount",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "claimedAmount",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "startTime",
                            "type":  "uint64",
                            "internalType":  "uint64"
                        },
                        {
                            "name":  "cliffEnd",
                            "type":  "uint64",
                            "internalType":  "uint64"
                        },
                        {
                            "name":  "vestEnd",
                            "type":  "uint64",
                            "internalType":  "uint64"
                        },
                        {
                            "name":  "weekId",
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
        "name":  "rescueToken",
        "inputs":  [
                       {
                           "name":  "token",
                           "type":  "address",
                           "internalType":  "address"
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
        "name":  "RewardClaimed",
        "inputs":  [
                       {
                           "name":  "user",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "grantIdx",
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
        "name":  "RewardDistributed",
        "inputs":  [
                       {
                           "name":  "weekId",
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
                           "name":  "grantIdx",
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

