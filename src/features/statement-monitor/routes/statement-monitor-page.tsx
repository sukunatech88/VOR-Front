import { useState, type FormEvent, type ReactNode } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../shared/components/page-header";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";
import { StatementMonitorError } from "../components/statement-monitor-error";
import { useStatements } from "../hooks/use-statement-monitor";
import { statementFiltersSchema } from "../schemas/statement-monitor.schemas";
import type { StatementFilters } from "../types/statement-monitor.types";
import { amount, dateTime, shortId, text } from "../utils/statement-monitor-formatters";

const initial: StatementFilters = { page: 0, size: 25, sortField: "updatedAt", sortDirection: "desc" };
const controls = "h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-indigo-500";

export function StatementMonitorPage() {
  const [draft, setDraft] = useState({ search: "", bankConnectionId: "", currency: "", messageStatus: "", validationStatus: "", size: 25, sortField: "updatedAt", sortDirection: "desc" });
  const [filters, setFilters] = useState<StatementFilters>(initial);
  const [filterError, setFilterError] = useState<string | null>(null);
  const query = useStatements(filters);
  const filtered = Boolean(filters.search || filters.bankConnectionId || filters.currency || filters.messageStatus || filters.validationStatus);

  function apply(event: FormEvent) {
    event.preventDefault();
    const candidate = {
      search: draft.search.trim() || undefined,
      bankConnectionId: draft.bankConnectionId.trim() || undefined,
      currency: draft.currency.trim().toUpperCase() || undefined,
      messageStatus: draft.messageStatus || undefined,
      validationStatus: draft.validationStatus || undefined,
      page: 0,
      size: draft.size,
      sortField: draft.sortField,
      sortDirection: draft.sortDirection,
    };
    const parsed = statementFiltersSchema.safeParse(candidate);
    if (!parsed.success) { setFilterError(parsed.error.issues[0]?.message || "Review the filters."); return; }
    setFilterError(null); setFilters(parsed.data);
  }

  function clear() {
    setDraft({ search: "", bankConnectionId: "", currency: "", messageStatus: "", validationStatus: "", size: 25, sortField: "updatedAt", sortDirection: "desc" });
    setFilterError(null); setFilters(initial);
  }

  return <section>
    <div className="flex items-start justify-between gap-4">
      <PageHeader title="Statement Monitor" description="Review normalized CAMT.053 statements, balances and bank movements." />
      <Button variant="secondary" onClick={() => void query.refetch()} disabled={query.isFetching} title="Refresh statements"><RefreshCw className={`h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`} /></Button>
    </div>
    <Card className="mb-5">
      <form onSubmit={apply}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Search"><input className={controls} value={draft.search} maxLength={200} onChange={(e) => setDraft({ ...draft, search: e.target.value })} placeholder="Reference, file or ID" /></Field>
          <Field label="Bank connection ID"><input className={controls} value={draft.bankConnectionId} onChange={(e) => setDraft({ ...draft, bankConnectionId: e.target.value })} placeholder="GUID" /></Field>
          <Field label="Currency"><input className={controls} value={draft.currency} maxLength={3} onChange={(e) => setDraft({ ...draft, currency: e.target.value.toUpperCase() })} placeholder="COP" /></Field>
          <Field label="Message status"><select className={controls} value={draft.messageStatus} onChange={(e) => setDraft({ ...draft, messageStatus: e.target.value })}><option value="">All</option>{["IDENTIFIED","PARSED","NORMALIZED","VALIDATED","FAILED","REJECTED"].map(x => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Validation"><select className={controls} value={draft.validationStatus} onChange={(e) => setDraft({ ...draft, validationStatus: e.target.value })}><option value="">All</option><option>PASSED</option><option>FAILED</option></select></Field>
          <Field label="Sort field"><select className={controls} value={draft.sortField} onChange={(e) => setDraft({ ...draft, sortField: e.target.value })}>{["updatedAt","createdAt","statementCreationDate","currency","openingBalance","closingBalance"].map(x => <option key={x}>{x}</option>)}</select></Field>
          <Field label="Sort direction"><select className={controls} value={draft.sortDirection} onChange={(e) => setDraft({ ...draft, sortDirection: e.target.value })}><option value="desc">Descending</option><option value="asc">Ascending</option></select></Field>
          <Field label="Page size"><select className={controls} value={draft.size} onChange={(e) => setDraft({ ...draft, size: Number(e.target.value) })}>{[10,25,50,100].map(x => <option key={x}>{x}</option>)}</select></Field>
        </div>
        {filterError ? <p className="mt-3 text-sm text-rose-300" role="alert">{filterError}</p> : null}
        <div className="mt-4 flex gap-3"><Button type="submit">Apply filters</Button><Button type="button" variant="ghost" onClick={clear}>Clear filters</Button></div>
      </form>
    </Card>
    {query.isLoading ? <Card><p className="text-sm text-slate-400">Loading statements...</p></Card> : null}
    {query.error ? <StatementMonitorError error={query.error} onRetry={() => void query.refetch()} retrying={query.isFetching} /> : null}
    {query.data && query.data.statements.length === 0 ? <Card><h2 className="font-medium text-white">{filtered ? "No statements match these filters" : "No statements available"}</h2><p className="mt-2 text-sm text-slate-400">{filtered ? "Clear or adjust the filters." : "Validated CAMT.053 statements will appear here."}</p></Card> : null}
    {query.data && query.data.statements.length > 0 ? <>
      <div className="overflow-x-auto border-y border-slate-800 bg-slate-900/40"><table className="min-w-[1600px] text-left text-sm"><thead className="bg-slate-950 text-slate-400"><tr>{["Statement","Source file","Bank connection","Account","Currency","Statement date","Opening","Closing","Entries","Credit total","Debit total","Message status","Validation","Updated",""] .map((h,i)=><th key={`${h}-${i}`} className="px-3 py-3 font-medium">{h}</th>)}</tr></thead><tbody>{query.data.statements.map(item => <tr key={item.statementId} className="border-t border-slate-800 align-top text-slate-200">
        <td className="max-w-56 px-3 py-4"><Link className="font-medium text-indigo-300 hover:underline" to={`/statement-monitor/${item.statementId}`}>{text(item.statementReference) !== "—" ? item.statementReference : shortId(item.statementId)}</Link><span className="mt-1 block text-xs text-slate-500">{text(item.messageReference)}</span></td>
        <td className="max-w-52 px-3 py-4"><Link className="text-indigo-300 hover:underline" to={`/file-registry/${item.fileId}`}>{item.originalFileName}</Link></td>
        <td className="px-3 py-4">{item.bankConnection.displayName}<span className="block text-xs text-slate-500">{item.bankConnection.code}</span></td><td className="px-3 py-4 font-mono">{text(item.accountMasked)}</td><td className="px-3 py-4">{text(item.currency)}</td><td className="whitespace-nowrap px-3 py-4">{dateTime(item.statementCreationDate)}</td><td className="whitespace-nowrap px-3 py-4">{amount(item.openingBalance?.amount,item.openingBalance?.currency)}</td><td className="whitespace-nowrap px-3 py-4">{amount(item.closingBalance?.amount,item.closingBalance?.currency)}</td><td className="px-3 py-4">{item.entryCount}</td><td className="whitespace-nowrap px-3 py-4 text-emerald-300">{amount(item.creditTotal,item.currency)}</td><td className="whitespace-nowrap px-3 py-4 text-rose-300">{amount(item.debitTotal,item.currency)}</td><td className="px-3 py-4"><Badge value={item.messageStatus} /></td><td className="px-3 py-4"><Badge value={item.validationStatus || "NOT VALIDATED"} /></td><td className="whitespace-nowrap px-3 py-4">{dateTime(item.updatedAt)}</td><td className="px-3 py-4"><Link aria-label={`View statement ${item.statementReference || item.statementId}`} to={`/statement-monitor/${item.statementId}`} className="text-indigo-300"><ExternalLink className="h-4 w-4" /></Link></td>
      </tr>)}</tbody></table></div>
      <Pagination page={query.data.page} onPage={(page) => setFilters({ ...filters, page })} />
    </> : null}
  </section>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="space-y-2 text-sm font-medium text-slate-300"><span className="block">{label}</span>{children}</label>; }
function Badge({ value }: { value: string }) { const ok = value === "VALIDATED" || value === "PASSED" || value === "CRDT"; return <span className={`inline-flex rounded-full border px-2 py-1 text-xs ${ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-slate-700 bg-slate-800 text-slate-300"}`}>{value}</span>; }
function Pagination({ page, onPage }: { page: { number:number; totalPages:number; totalElements:number; first:boolean; last:boolean }; onPage:(page:number)=>void }) { return <nav className="mt-4 flex items-center justify-between" aria-label="Statement pagination"><p className="text-sm text-slate-400">{page.totalElements} statements · Page {page.totalPages === 0 ? 0 : page.number + 1} of {page.totalPages}</p><div className="flex gap-2"><Button variant="secondary" disabled={page.first} onClick={() => onPage(page.number - 1)}>Previous</Button><Button variant="secondary" disabled={page.last} onClick={() => onPage(page.number + 1)}>Next</Button></div></nav>; }
