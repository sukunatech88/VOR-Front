import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../../../core/http/api-client-context";
import type { ApiError } from "../../../core/http/api-error";
import { getOperationsDashboard } from "../../dashboard/api/dashboard.api";
import { activateBankConnection, createBankConnection, deactivateBankConnection, getBankConnection, listBankConnections, testBankConnection, updateBankConnection } from "../api/bank-connections.api";
import { bankConnectionIdSchema } from "../schemas/bank-connections.schemas";
import type { BankConnectionInput } from "../types/bank-connections.types";

export const bankConnectionKeys = { all:["bank-connections"] as const, list:["bank-connections","list"] as const, detail:(id:string)=>["bank-connections","detail",id] as const };
export function useBankConnections() { const client=useApiClient(); return useQuery({queryKey:bankConnectionKeys.list,queryFn:({signal})=>listBankConnections(client,signal)}); }
export function useBankConnection(id:string) { const client=useApiClient();return useQuery({queryKey:bankConnectionKeys.detail(id),queryFn:({signal})=>getBankConnection(client,id,signal),enabled:bankConnectionIdSchema.safeParse(id).success}); }
export function useConnectionHealth() { const client=useApiClient();return useQuery({queryKey:["bank-connections","health"],queryFn:({signal})=>getOperationsDashboard(client,signal),retry:false}); }
export function useCreateBankConnection() { const client=useApiClient(),qc=useQueryClient();return useMutation<unknown,ApiError,BankConnectionInput>({mutationFn:(input)=>createBankConnection(client,input),retry:false,onSuccess:()=>qc.invalidateQueries({queryKey:bankConnectionKeys.list})}); }
export function useUpdateBankConnection(id:string) { const client=useApiClient(),qc=useQueryClient();return useMutation<unknown,ApiError,BankConnectionInput>({mutationFn:(input)=>updateBankConnection(client,id,input),retry:false,onSuccess:async()=>{await Promise.all([qc.invalidateQueries({queryKey:bankConnectionKeys.list}),qc.invalidateQueries({queryKey:bankConnectionKeys.detail(id)})]);}}); }
export function useTestBankConnection(id:string) { const client=useApiClient(),qc=useQueryClient();return useMutation({mutationFn:()=>testBankConnection(client,id),retry:false,onSuccess:()=>qc.invalidateQueries({queryKey:["bank-connections","health"]})}); }
export function useLifecycleBankConnection(id:string,action:"activate"|"deactivate") { const client=useApiClient(),qc=useQueryClient();return useMutation({mutationFn:()=>action==="activate"?activateBankConnection(client,id):deactivateBankConnection(client,id),retry:false,onSuccess:async()=>{await Promise.all([qc.invalidateQueries({queryKey:bankConnectionKeys.list}),qc.invalidateQueries({queryKey:bankConnectionKeys.detail(id)}),qc.invalidateQueries({queryKey:["bank-connections","health"]})]);}}); }
