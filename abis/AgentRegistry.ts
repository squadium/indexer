export const AgentRegistryAbi = [
    {
        "type":  "constructor",
        "inputs":  [
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
        "name":  "agents",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "wallet",
                            "type":  "address",
                            "internalType":  "address"
                        },
                        {
                            "name":  "erc8004TokenId",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "tier",
                            "type":  "uint8",
                            "internalType":  "enum AgentRegistry.Tier"
                        },
                        {
                            "name":  "sortinoBps",
                            "type":  "int256",
                            "internalType":  "int256"
                        },
                        {
                            "name":  "volume30d",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "isSmartMoney",
                            "type":  "bool",
                            "internalType":  "bool"
                        },
                        {
                            "name":  "lastUpdate",
                            "type":  "uint256",
                            "internalType":  "uint256"
                        },
                        {
                            "name":  "registered",
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "getAgent",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "tuple",
                            "internalType":  "struct AgentRegistry.Agent",
                            "components":  [
                                               {
                                                   "name":  "wallet",
                                                   "type":  "address",
                                                   "internalType":  "address"
                                               },
                                               {
                                                   "name":  "erc8004TokenId",
                                                   "type":  "uint256",
                                                   "internalType":  "uint256"
                                               },
                                               {
                                                   "name":  "tier",
                                                   "type":  "uint8",
                                                   "internalType":  "enum AgentRegistry.Tier"
                                               },
                                               {
                                                   "name":  "sortinoBps",
                                                   "type":  "int256",
                                                   "internalType":  "int256"
                                               },
                                               {
                                                   "name":  "volume30d",
                                                   "type":  "uint256",
                                                   "internalType":  "uint256"
                                               },
                                               {
                                                   "name":  "isSmartMoney",
                                                   "type":  "bool",
                                                   "internalType":  "bool"
                                               },
                                               {
                                                   "name":  "lastUpdate",
                                                   "type":  "uint256",
                                                   "internalType":  "uint256"
                                               },
                                               {
                                                   "name":  "registered",
                                                   "type":  "bool",
                                                   "internalType":  "bool"
                                               }
                                           ]
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "getAgentCost",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "uint8",
                            "internalType":  "uint8"
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
        "name":  "registerAgent",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "wallet",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "erc8004TokenId",
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
        "type":  "function",
        "name":  "tierCredits",
        "inputs":  [
                       {
                           "name":  "tier",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       }
                   ],
        "outputs":  [
                        {
                            "name":  "credits",
                            "type":  "uint8",
                            "internalType":  "uint8"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "updateAgent",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "newTier",
                           "type":  "uint8",
                           "internalType":  "enum AgentRegistry.Tier"
                       },
                       {
                           "name":  "sortinoBps",
                           "type":  "int256",
                           "internalType":  "int256"
                       },
                       {
                           "name":  "volume30d",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "isSmartMoney",
                           "type":  "bool",
                           "internalType":  "bool"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "event",
        "name":  "AgentRegistered",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "wallet",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "erc8004TokenId",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "AgentUpdated",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "tier",
                           "type":  "uint8",
                           "indexed":  false,
                           "internalType":  "enum AgentRegistry.Tier"
                       },
                       {
                           "name":  "sortinoBps",
                           "type":  "int256",
                           "indexed":  false,
                           "internalType":  "int256"
                       },
                       {
                           "name":  "volume30d",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "isSmartMoney",
                           "type":  "bool",
                           "indexed":  false,
                           "internalType":  "bool"
                       }
                   ],
        "anonymous":  false
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
    }
] as const;

