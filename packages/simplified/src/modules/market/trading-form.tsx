import React, { ReactNode, useEffect, useMemo, useState, useCallback } from "react";
import Styles from "../market/trading-form.styles.less";
import ButtonStyles from "../common/buttons.styles.less";
import classNames from "classnames";
import { useSimplifiedStore } from "../stores/simplified";
import { BigNumber as BN } from "bignumber.js";
import {
  Formatter,
  Constants,
  ContractCalls,
  useAppStatusStore,
  useUserStore,
  useDataStore,
  Components,
  useApprovalStatus,
  ApprovalHooks,
} from "@augurproject/comps";
import type { AmmOutcome, Cash, EstimateTradeResult, AmmExchange } from "@augurproject/comps/build/types";
import { Slippage } from "../common/slippage";
import getUSDC from "../../utils/get-usdc";
const { doTrade, estimateBuyTrade, estimateSellTrade } = ContractCalls;
const { approveERC20Contract } = ApprovalHooks;
const {
  Icons: { CloseIcon },
  LabelComps: { generateTooltip },
  InputComps: { AmountInput, OutcomesGrid },
  ButtonComps: { SecondaryThemeButton },
  SelectionComps: { BuySellToggleSwitch },
} = Components;
const { formatCash, formatCashPrice, formatPercent, formatSimpleShares } = Formatter;
const {
  ApprovalAction,
  ApprovalState,
  SHARES,
  INSUFFICIENT_LIQUIDITY,
  ENTER_AMOUNT,
  ERROR_AMOUNT,
  TX_STATUS,
  BUY,
  SELL,
  TradingDirection,
  RESOLVED_MARKET,
} = Constants;

const AVG_PRICE_TIP = "The difference between the market price and estimated price due to trade size.";
const RATE_WARNING_THRESHOLD = 10;

interface InfoNumber {
  label: string;
  value: string;
  tooltipText?: string;
  tooltipKey?: string;
  svg?: ReactNode;
}

interface InfoNumbersProps {
  infoNumbers: InfoNumber[];
  unedited?: boolean;
}

export const InfoNumbers = ({ infoNumbers, unedited }: InfoNumbersProps) => {
  return (
    <div
      className={classNames(Styles.OrderInfo, {
        [Styles.Populated]: !unedited,
      })}
    >
      {infoNumbers.map((infoNumber) => (
        <div key={infoNumber.label}>
          <span>
            {infoNumber.label}
            {infoNumber.tooltipText &&
              infoNumber.tooltipKey &&
              generateTooltip(infoNumber.tooltipText, infoNumber.tooltipKey)}
          </span>
          <span>
            {infoNumber.value}
            {infoNumber.svg && infoNumber.svg}
          </span>
        </div>
      ))}
    </div>
  );
};

const getEnterBreakdown = (breakdown: EstimateTradeResult | null, cash: Cash) => {
  return [
    {
      label: "Average Price",
      value: !isNaN(Number(breakdown?.averagePrice))
        ? formatCashPrice(breakdown?.averagePrice || 0, cash?.name).full
        : "-",
      tooltipText: AVG_PRICE_TIP,
      tooltipKey: "averagePrice",
    },
    {
      label: "Estimated Shares",
      value: !isNaN(Number(breakdown?.outputValue)) ? formatSimpleShares(breakdown?.outputValue || 0).full : "-",
    },
    {
      label: "Max Profit",
      value: !isNaN(Number(breakdown?.maxProfit)) ? formatCash(breakdown?.maxProfit || 0, cash?.name).full : "-",
    },
    {
      label: `Estimated Fees (${cash.name})`,
      value: !isNaN(Number(breakdown?.tradeFees)) ? formatCash(breakdown?.tradeFees || 0, cash?.name).full : "-",
    },
  ];
};

const getExitBreakdown = (breakdown: EstimateTradeResult | null, cash: Cash) => {
  return [
    {
      label: "Average Price",
      value: !isNaN(Number(breakdown?.averagePrice))
        ? formatCashPrice(breakdown?.averagePrice || 0, cash?.name).full
        : "-",
      tooltipText: AVG_PRICE_TIP,
      tooltipKey: "averagePrice",
    },
    {
      label: `Amount You'll Recieve`,
      value: !isNaN(Number(breakdown?.outputValue)) ? formatCash(breakdown?.outputValue || 0, cash?.name).full : "-",
    },
    {
      label: "Remaining Shares",
      value: !isNaN(Number(breakdown?.remainingShares))
        ? formatSimpleShares(breakdown?.remainingShares || 0).full
        : "-",
    },
    {
      label: "Estimated Fees (Shares)",
      value: !isNaN(Number(breakdown?.tradeFees)) ? formatSimpleShares(breakdown?.tradeFees || 0).full : "-",
    },
  ];
};

const formatBreakdown = (isBuy: boolean, breakdown: EstimateTradeResult | null, cash: Cash) =>
  isBuy ? getEnterBreakdown(breakdown, cash) : getExitBreakdown(breakdown, cash);

interface TradingFormProps {
  amm: any;
  initialSelectedOutcome: AmmOutcome | any;
}

interface CanTradeProps {
  disabled: boolean;
  actionText: string;
  subText?: string | null;
}

const TradingForm = ({ initialSelectedOutcome, amm }: TradingFormProps) => {
  const { isLogged } = useAppStatusStore();
  const { cashes, blocknumber } = useDataStore();
  const {
    showTradingForm,
    actions: { setShowTradingForm },
    settings: { slippage },
  } = useSimplifiedStore();
  const {
    account,
    loginAccount,
    balances,
    actions: { addTransaction },
  } = useUserStore();
  const [orderType, setOrderType] = useState(BUY);
  const [selectedOutcome, setSelectedOutcome] = useState(initialSelectedOutcome);
  const [breakdown, setBreakdown] = useState<EstimateTradeResult | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [waitingToSign, setWaitingToSign] = useState(false);
  const ammCash = getUSDC(cashes);
  const outcomes = amm?.ammOutcomes || [];
  const isBuy = orderType === BUY;
  const approvalAction = isBuy ? ApprovalAction.ENTER_POSITION : ApprovalAction.EXIT_POSITION;
  const outcomeShareToken = selectedOutcome?.shareToken;
  const approvalStatus = useApprovalStatus({
    cash: ammCash,
    amm,
    refresh: blocknumber,
    actionType: approvalAction,
    outcomeShareToken,
  });
  const isApprovedTrade = approvalStatus === ApprovalState.APPROVED;
  const { hasLiquidity } = amm;
  const selectedOutcomeId = selectedOutcome?.id;
  const marketShares = balances?.marketShares && balances?.marketShares[amm?.marketId];
  const hasWinner = amm?.market.hasWinner;
  const outcomeSharesRaw = JSON.stringify(marketShares?.outcomeSharesRaw);
  const amountError = amount !== "" && (isNaN(Number(amount)) || Number(amount) === 0 || Number(amount) < 0);
  const buttonError = amountError ? ERROR_AMOUNT : "";

  useEffect(() => {
    let isMounted = true;
    function handleShowTradingForm() {
      if (window.innerWidth >= 1200 && showTradingForm && isMounted) {
        setShowTradingForm(false);
        setAmount("");
      }
    }
    window.addEventListener("resize", handleShowTradingForm);
    isMounted && setShowTradingForm(false);
    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleShowTradingForm);
    };
  }, []);

  const userBalance = String(
    useMemo(() => {
      return isBuy
        ? ammCash?.name
          ? balances[ammCash?.name]?.balance
          : "0"
        : marketShares?.outcomeShares
        ? marketShares?.outcomeShares[selectedOutcomeId]
        : "0";
    }, [orderType, ammCash?.name, amm?.id, selectedOutcomeId, balances])
  );

  useEffect(() => {
    let isMounted = true;

    const getEstimate = async () => {
      const breakdown = isBuy
        ? estimateBuyTrade(amm, amount, selectedOutcomeId, ammCash)
        : estimateSellTrade(amm, amount, selectedOutcomeId, marketShares);

      isMounted && setBreakdown(breakdown);
    };

    if (amount && Number(amount) > 0 && new BN(amount).lte(new BN(userBalance))) {
      getEstimate();
    } else if (breakdown !== null) {
      isMounted && setBreakdown(null);
    }

    return () => {
      isMounted = false;
    };
  }, [orderType, selectedOutcomeId, amount, outcomeSharesRaw, amm?.volumeTotal, amm?.liquidity, userBalance]);

  const canMakeTrade: CanTradeProps = useMemo(() => {
    let actionText = buttonError || orderType;
    let subText: string | null = null;
    let disabled = false;
    if (!isLogged) {
      actionText = "Connect Wallet";
      disabled = true;
    } else if (hasWinner) {
      actionText = RESOLVED_MARKET;
      disabled = true;
    } else if (!hasLiquidity) {
      actionText = "Liquidity Depleted";
      disabled = true;
    } else if (Number(amount) === 0 || isNaN(Number(amount)) || amount === "") {
      actionText = ENTER_AMOUNT;
      disabled = true;
    } else if (new BN(amount).gt(new BN(userBalance))) {
      actionText = `Insufficient ${isBuy ? ammCash.name : "Share"} Balance`;
      disabled = true;
    } else if (breakdown?.maxSellAmount && breakdown?.maxSellAmount !== "0") {
      actionText = INSUFFICIENT_LIQUIDITY;
      console.log("this is getting called");
      subText = `Max Shares to Sell ${breakdown?.maxSellAmount}`;
      disabled = true;
    } else if (waitingToSign) {
      actionText = "Waiting for Confirmation";
      disabled = true;
      subText = "(Confirm the transaction in your wallet)";
    } else if (breakdown === null) {
      // todo: need better way to determine if there is liquidity
      actionText = INSUFFICIENT_LIQUIDITY;
      disabled = true;
    }

    return {
      disabled,
      actionText,
      subText,
    };
  }, [orderType, amount, buttonError, breakdown, userBalance, hasLiquidity, waitingToSign, hasWinner]);

  const makeTrade = () => {
    const minOutput = breakdown?.outputValue;
    const outcomeShareTokensIn = breakdown?.outcomeShareTokensIn;
    const direction = isBuy ? TradingDirection.ENTRY : TradingDirection.EXIT;
    setWaitingToSign(true);
    setShowTradingForm(false);
    doTrade(
      direction,
      loginAccount?.library,
      amm,
      minOutput,
      amount,
      selectedOutcomeId,
      account,
      ammCash,
      slippage,
      outcomeShareTokensIn
    )
      .then((response) => {
        if (response) {
          const { hash } = response;
          setAmount("");
          setWaitingToSign(false);
          addTransaction({
            hash,
            chainId: loginAccount.chainId,
            seen: false,
            status: TX_STATUS.PENDING,
            from: loginAccount.account,
            addedTime: new Date().getTime(),
            message: `${direction === TradingDirection.ENTRY ? "Buy" : "Sell"} Shares`,
            marketDescription: `${amm?.market?.title} ${amm?.market?.description}`,
          });
        }
      })
      .catch((error) => {
        setWaitingToSign(false);
        console.log("Error when trying to trade: ", error?.message);
        addTransaction({
          hash: `trade-failure${Date.now()}`,
          chainId: loginAccount.chainId,
          seen: false,
          status: TX_STATUS.FAILURE,
          from: loginAccount.account,
          addedTime: new Date().getTime(),
          message: `${direction === TradingDirection.ENTRY ? "Buy" : "Sell"} Shares`,
          marketDescription: `${amm?.market?.title} ${amm?.market?.description}`,
        });
      });
  };

  const getRate = (): React.Fragment | null => {
    const priceImpact = formatPercent(breakdown?.priceImpact);
    const shares = !isNaN(Number(breakdown?.ratePerCash))
      ? `1 ${ammCash?.name} = ${
          formatSimpleShares(breakdown?.ratePerCash || 0, {
            denomination: (v) => `${v} Shares`,
          }).full
        }`
      : null;
    const rate = `(${priceImpact.full})`;
    return shares ? (
      <>
        <span>{shares}</span>
        <span
          className={classNames({
            [Styles.rateWarning]: Math.abs(Number(priceImpact.formatted)) >= RATE_WARNING_THRESHOLD,
          })}
        >
          {rate}
        </span>
      </>
    ) : null;
  };

  return (
    <div className={Styles.TradingForm}>
      <div>
        <BuySellToggleSwitch
          toggle={isBuy}
          setToggle={() => {
            if (isBuy) {
              setOrderType(SELL);
            } else {
              setOrderType(BUY);
            }
            setBreakdown(null);
            setAmount("");
          }}
        />
        <div>
          <span>fee</span>
          <span>{formatPercent(amm?.feeInPercent).full}</span>
        </div>
        <div
          onClick={() => {
            setShowTradingForm(false);
            setAmount("");
          }}
        >
          {CloseIcon}
        </div>
      </div>
      <div>
        <OutcomesGrid
          outcomes={outcomes}
          selectedOutcome={selectedOutcome}
          setSelectedOutcome={(outcome) => {
            setSelectedOutcome(outcome);
            setAmount("");
          }}
          orderType={orderType}
          ammCash={ammCash}
          dontFilterInvalid
          hasLiquidity={hasLiquidity}
          marketFactoryType={amm?.market?.marketFactoryType}
          isFutures={amm?.market?.isFuture}
        />
        <AmountInput
          chosenCash={isBuy ? ammCash?.name : SHARES}
          updateInitialAmount={setAmount}
          initialAmount={amount}
          error={amountError}
          maxValue={userBalance}
          ammCash={ammCash}
          disabled={!hasLiquidity || hasWinner}
          rate={getRate()}
          isBuy={orderType === BUY}
        />
        {isBuy && <Slippage />}
        <InfoNumbers infoNumbers={formatBreakdown(isBuy, breakdown, ammCash)} />
        {isLogged && !isApprovedTrade && (
          <ApprovalButton
            {...{
              amm,
              cash: ammCash,
              actionType: approvalAction,
              isApproved: isApprovedTrade,
              shareToken: outcomeShareToken,
            }}
          />
        )}
        <SecondaryThemeButton
          disabled={canMakeTrade.disabled || !isApprovedTrade}
          action={makeTrade}
          text={canMakeTrade.actionText}
          subText={canMakeTrade.subText}
          error={buttonError}
          customClass={ButtonStyles.BuySellButton}
        />
      </div>
    </div>
  );
};

export default TradingForm;

export const ApprovalButton = ({
  amm,
  cash,
  actionType,
  isApproved = false,
  shareToken = null,
}: {
  amm?: AmmExchange;
  cash: Cash;
  actionType: string | number;
  isApproved?: boolean;
  shareToken?: string;
}) => {
  const [isPendingTx, setIsPendingTx] = useState(false);
  const {
    loginAccount,
    actions: { addTransaction },
  } = useUserStore();
  const marketCashType = cash?.name;
  const ammFactory = amm.ammFactoryAddress;
  const marketDescription = `${amm?.market?.title} ${amm?.market?.description}`;
  useEffect(() => {
    // make sure to flip local state off if we are approved, logged, pending
    if (isApproved && loginAccount && isPendingTx) {
      setIsPendingTx(false);
    }
  }, [isApproved, loginAccount, isPendingTx]);

  const approve = useCallback(async () => {
    try {
      setIsPendingTx(true);
      // defaults for ADD_LIQUIDITY/most used values.
      let approvalAction = approveERC20Contract;
      let address = cash?.address;
      let spender = ammFactory;
      let text = `Liquidity (${marketCashType})`;
      switch (actionType) {
        case ApprovalAction.EXIT_POSITION: {
          address = shareToken;
          text = `To Sell (${marketCashType})`;
          break;
        }
        case ApprovalAction.ENTER_POSITION: {
          text = `To Buy (${marketCashType})`;
          break;
        }
        case ApprovalAction.REMOVE_LIQUIDITY: {
          address = amm?.id;
          spender = ammFactory;
          text = `Liquidity (${marketCashType})`;
          break;
        }
        case ApprovalAction.MINT_SETS: {
          address = amm?.cash?.address;
          spender = amm?.marketFactoryAddress;
          text = `Mint Complete Sets`;
          break;
        }
        case ApprovalAction.ADD_LIQUIDITY:
        default: {
          break;
        }
      }
      const tx = await approvalAction(address, text, spender, loginAccount);
      tx.marketDescription = marketDescription;
      addTransaction(tx);
    } catch (error) {
      setIsPendingTx(false);
      console.error(error);
    }
  }, [cash, loginAccount, shareToken, amm]);

  if (!loginAccount || isApproved) {
    return null;
  }

  let buttonText = "";
  let subText = "";
  switch (actionType) {
    case ApprovalAction.ENTER_POSITION: {
      buttonText = "Approve to Buy";
      break;
    }
    case ApprovalAction.EXIT_POSITION: {
      buttonText = "Approve to Sell";
      break;
    }
    case ApprovalAction.REMOVE_LIQUIDITY: {
      buttonText = "Approve Removal";
      subText = "(approve to see removal estimation)";
      break;
    }
    default:
      buttonText = `Approve ${marketCashType}`;
      break;
  }

  return (
    <SecondaryThemeButton
      disabled={isPendingTx}
      text={isPendingTx ? "Approving..." : buttonText}
      subText={subText}
      action={() => approve()}
      customClass={ButtonStyles.ApproveButton}
    />
  );
};