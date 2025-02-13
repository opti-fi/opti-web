import { queryProof } from "@/graphql/query"
import { ProofResponse } from "@/types/graphql/proof"
import { useQuery } from "@tanstack/react-query"
import request from "graphql-request"

interface Proof {
  optiTaskRespondeds: ProofResponse[]
}

export const useProofHistory = ({ address }: { address: HexAddress }) => {
  const { data, isLoading, refetch } = useQuery<Proof>({
    queryKey: ["optiTaskRespondeds", address],
    queryFn: async () => {
      return await request(process.env.NEXT_PUBLIC_API_GRAPHQL_AVS_URL || "", queryProof((address.toString()).toLowerCase()));
    },
    refetchInterval: 30000,
  })

  const optiTaskRespondeds = data?.optiTaskRespondeds || []

  return {
    dProof: optiTaskRespondeds,
    sLoading: isLoading,
    sRefetch: refetch,
  }
}