export const SortinoOracleAbi = [
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
        "name":  "lastUpdate",
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
        "name":  "pushSortino",
        "inputs":  [
                       {
                           "name":  "agentId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "sortinoBps",
                           "type":  "int256",
                           "internalType":  "int256"
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

