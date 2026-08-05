import type { ApiClient } from "../../../core/http/api-client";
import { ApiError } from "../../../core/http/api-error";
import { bankConnectionListSchema, bankConnectionSchema, bankConnectionTestSchema } from "../schemas/bank-connections.schemas";
import type { BankConnection, BankConnectionInput, BankConnectionTestResult } from "../types/bank-connections.types";

const root = "/api/bank-connections";
function parse<T>(value: unknown, schema: { safeParse(value:unknown): { success:true; data:T } | { success:false } }, method:string, path:string): T {
  const result = schema.safeParse(value); if (!result.success) throw ApiError.protocol(method, path); return result.data;
}
export async function listBankConnections(client:ApiClient, signal?:AbortSignal) { return parse(await client.get<unknown>(root,{signal}), bankConnectionListSchema,"GET",root); }
export async function getBankConnection(client:ApiClient,id:string,signal?:AbortSignal) { const path=`${root}/${id}`; return parse(await client.get<unknown>(path,{signal}),bankConnectionSchema,"GET",path); }
export async function createBankConnection(client:ApiClient,input:BankConnectionInput):Promise<BankConnection> { return parse(await client.post<unknown>(root,{json:input,retryOnUnauthorized:false}),bankConnectionSchema,"POST",root); }
export async function updateBankConnection(client:ApiClient,id:string,input:BankConnectionInput):Promise<BankConnection> { const path=`${root}/${id}`;return parse(await client.put<unknown>(path,{json:input,retryOnUnauthorized:false}),bankConnectionSchema,"PUT",path); }
export async function testBankConnection(client:ApiClient,id:string):Promise<BankConnectionTestResult> { const path=`${root}/${id}/test`;return parse(await client.post<unknown>(path,{retryOnUnauthorized:false}),bankConnectionTestSchema,"POST",path); }
export async function activateBankConnection(client:ApiClient,id:string):Promise<BankConnection> { const path=`${root}/${id}/activate`;return parse(await client.post<unknown>(path,{retryOnUnauthorized:false}),bankConnectionSchema,"POST",path); }
export async function deactivateBankConnection(client:ApiClient,id:string):Promise<BankConnection> { const path=`${root}/${id}/deactivate`;return parse(await client.post<unknown>(path,{retryOnUnauthorized:false}),bankConnectionSchema,"POST",path); }
