export const SquadiumAbi = [
    {
        "type":  "constructor",
        "inputs":  [
                       {
                           "name":  "_registry",
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
        "name":  "SALARY_CAP",
        "inputs":  [

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
        "name":  "SQUAD_SIZE",
        "inputs":  [

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
        "name":  "advanceWeek",
        "inputs":  [

                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "chipsUsed",
        "inputs":  [
                       {
                           "name":  "user",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "chip",
                           "type":  "uint8",
                           "internalType":  "enum Squadium.Chip"
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
        "name":  "currentWeekId",
        "inputs":  [

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
        "name":  "draftSquad",
        "inputs":  [
                       {
                           "name":  "agentIds",
                           "type":  "uint256[5]",
                           "internalType":  "uint256[5]"
                       },
                       {
                           "name":  "captainIdx",
                           "type":  "uint8",
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "chip",
                           "type":  "uint8",
                           "internalType":  "enum Squadium.Chip"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "lockWeek",
        "inputs":  [
                       {
                           "name":  "weekId",
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

                    ],
        "stateMutability":  "nonpayable"
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
        "name":  "registry",
        "inputs":  [

                   ],
        "outputs":  [
                        {
                            "name":  "",
                            "type":  "address",
                            "internalType":  "contract AgentRegistry"
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
        "name":  "settleSquad",
        "inputs":  [
                       {
                           "name":  "weekId",
                           "type":  "uint256",
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "user",
                           "type":  "address",
                           "internalType":  "address"
                       },
                       {
                           "name":  "finalScore",
                           "type":  "int256",
                           "internalType":  "int256"
                       }
                   ],
        "outputs":  [

                    ],
        "stateMutability":  "nonpayable"
    },
    {
        "type":  "function",
        "name":  "squads",
        "inputs":  [
                       {
                           "name":  "weekId",
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
                            "name":  "captainIdx",
                            "type":  "uint8",
                            "internalType":  "uint8"
                        },
                        {
                            "name":  "activeChip",
                            "type":  "uint8",
                            "internalType":  "enum Squadium.Chip"
                        },
                        {
                            "name":  "locked",
                            "type":  "bool",
                            "internalType":  "bool"
                        },
                        {
                            "name":  "settled",
                            "type":  "bool",
                            "internalType":  "bool"
                        },
                        {
                            "name":  "finalScore",
                            "type":  "int256",
                            "internalType":  "int256"
                        }
                    ],
        "stateMutability":  "view"
    },
    {
        "type":  "event",
        "name":  "SquadDrafted",
        "inputs":  [
                       {
                           "name":  "user",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "weekId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "agentIds",
                           "type":  "uint256[5]",
                           "indexed":  false,
                           "internalType":  "uint256[5]"
                       },
                       {
                           "name":  "captainIdx",
                           "type":  "uint8",
                           "indexed":  false,
                           "internalType":  "uint8"
                       },
                       {
                           "name":  "chip",
                           "type":  "uint8",
                           "indexed":  false,
                           "internalType":  "enum Squadium.Chip"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "SquadScored",
        "inputs":  [
                       {
                           "name":  "user",
                           "type":  "address",
                           "indexed":  true,
                           "internalType":  "address"
                       },
                       {
                           "name":  "weekId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "score",
                           "type":  "int256",
                           "indexed":  false,
                           "internalType":  "int256"
                       }
                   ],
        "anonymous":  false
    },
    {
        "type":  "event",
        "name":  "WeekSettled",
        "inputs":  [
                       {
                           "name":  "weekId",
                           "type":  "uint256",
                           "indexed":  true,
                           "internalType":  "uint256"
                       },
                       {
                           "name":  "settledCount",
                           "type":  "uint256",
                           "indexed":  false,
                           "internalType":  "uint256"
                       }
                   ],
        "anonymous":  false
    }
] as const;

