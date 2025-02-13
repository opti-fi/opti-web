import { AVSAbi } from "@/lib/abis/AVSAbi";
import { useWagmiConfig } from "@/lib/wagmi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount } from "wagmi";
import {
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";

type Status = "idle" | "loading" | "success" | "error";

export const useTaskAgent = () => {
  const { address: userAddress } = useAccount();
  const wagmiConfig = useWagmiConfig();

  const [steps, setSteps] = useState<
    Array<{
      step: number;
      status: Status;
      error?: string;
    }>
  >([
    {
      step: 1,
      status: "idle",
    },
  ]);

  const [txHash, setTxHash] = useState<HexAddress | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        // Reset steps
        setSteps([{ step: 1, status: "idle" }]);

        if (!userAddress) {
          throw new Error("Invalid parameters");
        }

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const txHash = await writeContract(wagmiConfig, {
          address: "0x02B10904Ab1CF1c9FF638cc17710fBA306cC5ABF",
          abi: AVSAbi,
          functionName: "taskAgent",
          args: [
            "Uniswap_UNI"
          ],
        });

        setTxHash(txHash);

        console.log(txHash)

        const result = await waitForTransactionReceipt(wagmiConfig, {
          hash: txHash,
        });

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

        return result;
      } catch (e) {
        console.error("Bid Error", e);

        setSteps((prev) =>
          prev.map((step) => {
            if (step.status === "loading") {
              return { ...step, status: "error", error: (e as Error).message };
            }
            return step;
          })
        );

        throw e;
      }
    },
  });

  return { steps, mutation, txHash };
};