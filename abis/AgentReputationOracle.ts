export const AgentReputationOracleAbi = [
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "_signer",
                           "type":  "address",
                           "internalType":  "address"
                       }
                   ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "agentSortinoBps",
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
                            "type":  "int256",
                            "internalType":  "int256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "isRated",
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
                            "type":  "bool",
                            "internalType":  "bool"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "nonces",
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
                            "type":  "uint256",
                            "internalType":  "uint256"
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
        "name":  "pushReputation",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "rep",
                           "type":  "tuple",
                           "internalType":  "struct AgentReputationOracle.Reputation",
                           "components":  [
                                              {
                                                  "name":  "score",
                                                  "type":  "uint16",
                                                  "internalType":  "uint16"
                                              },
                                              {
                                                  "name":  "confidence",
                                                  "type":  "uint16",
                                                  "internalType":  "uint16"
                                              },
                                              {
                                                  "name":  "tier",
                                                  "type":  "uint8",
                                                  "internalType":  "uint8"
                                              },
                                              {
                                                  "name":  "asOf",
                                                  "type":  "uint64",
                                                  "internalType":  "uint64"
                                              },
                                              {
                                                  "name":  "horizon",
                                                  "type":  "uint64",
                                                  "internalType":  "uint64"
                                              }
                                          ]
                       },
                       {
                           "name":  "nonce",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "sig",
                           "type":  "bytes",
                           "internalType":  "bytes"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "reputationOf",
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
                            "internalType":  "struct AgentReputationOracle.Reputation",
                            "components":  [
                                               {
                                                   "name":  "score",
                                                   "type":  "uint16",
                                                   "internalType":  "uint16"
                                               },
                                               {
                                                   "name":  "confidence",
                                                   "type":  "uint16",
                                                   "internalType":  "uint16"
                                               },
                                               {
                                                   "name":  "tier",
                                                   "type":  "uint8",
                                                   "internalType":  "uint8"
                                               },
                                               {
                                                   "name":  "asOf",
                                                   "type":  "uint64",
                                                   "internalType":  "uint64"
                                               },
                                               {
                                                   "name":  "horizon",
                                                   "type":  "uint64",
                                                   "internalType":  "uint64"
                                               }
                                           ]
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "function",
        "name":  "setSigner",
        "inputs":  [
                       {
                           "name":  "newSigner",
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
        "name":  "signer",
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
        "type":  "event",
        "name":  "ReputationPushed",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "score",
                           "type":  "uint16",
                           "indexed":  false,
                           "internalType":  "uint16"
                       },
                       {
                           "name":  "confidence",
                           "type":  "uint16",
                           "indexed":  false,
                           "internalType":  "uint16"
                       },
                       {
                           "name":  "tier",
                           "type":  "uint8",
                           "indexed":  false,
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "asOf",
                           "type":  "uint64",
                           "indexed":  false,
                           "internalType":  "uint64"
                       },
                       {
                           "name":  "horizon",
                           "type":  "uint64",
                           "indexed":  false,
                           "internalType":  "uint64"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "SignerUpdated",
        "inputs":  [
                       {
                           "name":  "oldSigner",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "newSigner",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "SortinoPushed",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "sortinoBps",
                           "type":  "int256",
                           "indexed":  false,
                           "internalType":  "int256"
                       },
                       {
                           "name":  "nonce",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "timestamp",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    }
] as const;

