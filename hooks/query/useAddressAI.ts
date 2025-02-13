import apiAgent from "@/lib/api-agent"
import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

export const useAddressAI = () => {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useQuery<{ address: string }>({
    queryKey: ["addressAI"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await apiAgent.post("action/get-wallet", { user_address: address })
      return response
    },
    retry: 3,
    retryDelay: 1000,
    refetchInterval: 30000,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 30000,
  })

  return {
    addressAI : data?.address as HexAddress,
    laAI: isLoading,
    raAI: refetch
  }
}