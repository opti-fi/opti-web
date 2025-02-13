'use client';

import {
  Transaction,
  TransactionButton
} from '@coinbase/onchainkit/transaction';
import type {
  TransactionError,
  TransactionResponse,
} from '@coinbase/onchainkit/transaction';
import { useCallback, useState } from 'react';
import type { ContractFunctionParameters } from 'viem';
import Loading from '../loader/loading';
import ButtonConnectWallet from './button-connect-wallet';
import ModalTransaction from '../modal/modal-transaction';
import { AVSAbi } from '@/lib/abis/AVSAbi';

interface ButtonSwapProps {
  buttonText: string;
  disabled: boolean;
}

export default function ButtonAVS({
  buttonText,
  disabled
}: ButtonSwapProps) {
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<TransactionError | null>(null);

  const contracts = [
    {
      address: "0x29A8B84566Ebaf9348699EaadE9A942eaaF6068D",
      abi: AVSAbi,
      functionName: 'taskAgent',
      args: ["Uniswap_UNI"],
    }
  ] as unknown as ContractFunctionParameters[];

  const handleError = useCallback((err: TransactionError) => {
    setError(err);
    setIsModalOpen(true);
  }, []);

  const handleSuccess = useCallback((response: TransactionResponse) => {
    setTransactionData(response);
    setIsModalOpen(true);
  }, []);

  const handleStatusChange = useCallback((status: { statusName: string }) => {
    setTransactionStatus(status.statusName);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div>
      {(transactionStatus === "transactionPending" || 
        transactionStatus === "transactionLegacyExecuted") && <Loading />}
      
      <Transaction
        contracts={contracts}
        chainId={84532}
        onError={handleError}
        onSuccess={handleSuccess}
        onStatus={handleStatusChange}
      >
        <ButtonConnectWallet>
          <TransactionButton
            className={`h-14 min-h-14 z-0 group w-full text-sm relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none text-default-foreground data-[hover=true]:opacity-hover flex-1`}
            text={buttonText}
            disabled={disabled}
          />
        </ButtonConnectWallet>
      </Transaction>

      <ModalTransaction
        isOpen={isModalOpen}
        setIsOpen={closeModal}
        status={transactionStatus || ""}
        data={transactionData || { transactionReceipts: [] }}
        errorMessage={error || undefined}
        name='mint'
      />
    </div>
  );
}