import type { AppStatusState, GraphDataState, UserState, ParaDeploys } from "../types";
import { addresses } from "@augurproject/smart";

export const DEFAULT_NETWORK_ID = (process.env.DEFAULT_NETWORK_ID || "80001").toString();
export const PARA_CONFIG: ParaDeploys = {
  networkId: DEFAULT_NETWORK_ID,
  ...addresses[DEFAULT_NETWORK_ID],
} as ParaDeploys;

export const STUBBED_GRAPH_DATA_ACTIONS = {
  updateGraphHeartbeat: (processed, blocknumber, errors) => {},
};

export const DEFAULT_GRAPH_DATA_STATE: GraphDataState = {
  ammExchanges: {},
  blocknumber: null,
  cashes: {},
  errors: null,
  markets: {},
};

export const GRAPH_DATA_KEYS = {
  AMM_EXCHANGES: "ammExchanges",
  BLOCKNUMBER: "blocknumber",
  CASHES: "cashes",
  ERRORS: "errors",
  MARKETS: "markets",
  LOADING: "loading",
};

export const GRAPH_DATA_ACTIONS = {
  UPDATE_GRAPH_HEARTBEAT: "UPDATE_GRAPH_HEARTBEAT",
};

export const STUBBED_USER_ACTIONS = {
  addSeenPositionWarnings: (seenPositionWarnings) => {},
  addTransaction: (transaction) => {},
  finalizeTransaction: (hash, receipt) => {},
  removeTransaction: (hash) => {},
  updateLoginAccount: (updateLoginAccount) => {},
  updateSeenPositionWarning: (id, seenPositionWarning, warningType) => {},
  updateTransaction: (hash, updates) => {},
  updateUserBalances: (balances) => {},
  logout: () => {},
};

export const DEFAULT_USER_STATE: UserState = {
  account: null,
  balances: {
    ETH: {
      balance: null,
      rawBalance: null,
      usdValue: null,
    },
    USDC: {
      balance: null,
      rawBalance: null,
      usdValue: null,
    },
    totalAccountValue: null,
    totalPositionUsd: null,
    total24hrPositionUsd: null,
    change24hrPositionUsd: null,
    availableFundsUsd: null,
    lpTokens: {},
    marketShares: {},
    claimableWinnings: {},
    claimableFees: null,
    rep: null,
    legacyRep: null,
  },
  loginAccount: null,
  seenPositionWarnings: {},
  transactions: [],
};

export const USER_KEYS = {
  ACCOUNT: "account",
  BALANCES: "balances",
  LOGIN_ACCOUNT: "loginAccount",
  SEEN_POSITION_WARNINGS: "seenPositionWarnings",
  TRANSACTIONS: "transactions",
};

export const USER_ACTIONS = {
  ADD_TRANSACTION: "ADD_TRANSACTION",
  REMOVE_TRANSACTION: "REMOVE_TRANSACTION",
  FINALIZE_TRANSACTION: "FINALIZE_TRANSACTION",
  UPDATE_SEEN_POSITION_WARNING: "UPDATE_SEEN_POSITION_WARNING",
  UPDATE_TRANSACTION: "UPDATE_TRANSACTION",
  ADD_SEEN_POSITION_WARNINGS: "ADD_SEEN_POSITION_WARNINGS",
  SET_LOGIN_ACCOUNT: "SET_LOGIN_ACCOUNT",
  UPDATE_USER_BALANCES: "UPDATE_USER_BALANCES",
  LOGOUT: "LOGOUT",
};

export const STUBBED_APP_STATUS_ACTIONS = {
  setIsMobile: (isMobile) => {},
  setModal: (modal) => {},
  closeModal: () => {},
  setIsLogged: (account) => {},
  setIsRpcDown: (rpcDown) => {},
  setIsDegraded: (isDegraded) => {},
};

export const DEFAULT_APP_STATUS_STATE: AppStatusState = {
  isMobile: false,
  isLogged: false,
  isRpcDown: false,
  isDegraded: false,
  modal: {},
};

export const APP_STATE_KEYS = {
  IS_MOBILE: "isMobile",
  MODAL: "modal",
  IS_LOGGED: "isLogged",
  IS_RPC_DOWN: "isRpcDown",
  IS_DEGRADED: "isDegraded",
};

export const APP_STATUS_ACTIONS = {
  SET_IS_MOBILE: "SET_IS_MOBILE",
  SET_MODAL: "SET_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL",
  SET_IS_LOGGED: "SET_IS_LOGGED",
  SET_RPC_DOWN: "SET_RPC_DOWN",
  SET_DEGRADED: "SET_DEGRADED",
};

export const MOCK_APP_STATUS_STATE = {
  ...DEFAULT_APP_STATUS_STATE,
};

export const STUBBED_DATA_ACTIONS = {
  updateDataHeartbeat: (processed, blocknumber, errors) => {},
  updateTransactions: (transactions) => {},
};

export const DEFAULT_DATA_STATE: GraphDataState = {
  ammExchanges: {},
  blocknumber: null,
  cashes: {},
  errors: null,
  markets: {},
  transactions: {},
};

export const DATA_KEYS = {
  AMM_EXCHANGES: "ammExchanges",
  BLOCKNUMBER: "blocknumber",
  CASHES: "cashes",
  ERRORS: "errors",
  MARKETS: "markets",
  TRANSACTIONS: "transactions",
};

export const DATA_ACTIONS = {
  UPDATE_DATA_HEARTBEAT: "UPDATE_DATA_HEARTBEAT",
  UPDATE_TRANSACTIONS: "UPDATE_TRANSACTIONS",
};

export const MAINNET: string = "1";
export const KOVAN: string = "42";
export const NETWORK_NAMES = {
  1: "Mainnet",
  3: "Ropsten",
  4: "Rinkeby",
  5: "Goerli",
  42: "Kovan",
};

export const NETWORK_BLOCK_REFRESH_TIME = {
  1: 15000,
  3: 5000,
  4: 5000,
  5: 5000,
  42: 5000,
  80001: 5000,
  137: 7000,
};

// used to store markets to ignore, in format
// { [marketfactory]: [market_indexes] }
export const MARKET_IGNORE_LIST = {};
export const MULTICALL_MARKET_IGNORE_LIST = {};
