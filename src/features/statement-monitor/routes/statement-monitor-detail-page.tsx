import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../../shared/components/ui/button";
import { Card } from "../../../shared/components/ui/card";
import { StatementMonitorError } from "../components/statement-monitor-error";
import { useStatement, useStatementEntries } from "../hooks/use-statement-monitor";
import { entryFiltersSchema, statementIdSchema } from "../schemas/statement-monitor.schemas";
import type { StatementEntryFilters } from "../types/statement-monitor.types";
import { amount, dateTime, shortId, text } from "../utils/statement-monitor-formatters";

const initialEntries: StatementEntryFilters = { page: 0, size: 25, sortField: "bookingDate", sortDirection: "desc" };
const control = "h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-indigo-500";

export function StatementMonitorDetailPage() {
  const statementId = useParams().statementId || "";
  const validId = statementIdSchema.safeParse(statementId).success;
  const detail = useStatement(statementId);
  const [filters, setFilters] = useState<StatementEntryFilters>(initialEntries);
  const [draft, setDraft] = useState({ creditDebitIndicator: "", currency: "", status: "", size: 25 });
  const [filterError, setFilterError] = useState<string | null>(null);
  const entries = useStatementEntries(statementId, filters);

  if (!validId) return <><Back /><StatementMonitorError error={null} /></>;
  if (detail.isLoading) return <><Back /><Card><p className="text-sm text-slate-400">Loading statement...</p></Card></>;
  if (detail.error || !detail.data) return <><Back /><StatementMonitorError error={detail.error} onRetry={() => void detail.refetch()} retrying={detail.isFetching} /></>;
  const data = detail.data;

  function applyEntries(event: FormEvent) {
    event.preventDefault();
    const parsed = entryFiltersSchema.safeParse({
      creditDebitIndicator: draft.creditDebitIndicator || undefined,
      currency: draft.currency.trim().toUpperCase() || undefined,
      status: draft.status.trim().toUpperCase() || undefined,
      page: 0, size: draft.size, sortField: "bookingDate", sortDirection: "desc",
    });
    if (!parsed.success) { setFilterError(parsed.error.issues[0]?.message || "Review entry filters."); return; }
    setFilterError(null); setFilters(parsed.data);
  }

  return <section className="space-y-6">
    <div className="flex items-start justify-between gap-4"><div><Back /><h1 className="mt-4 text-2xl font-semibold text-white">{text(data.summary.statementReference) !== "—" ? data.summary.statementReference : shortId(statementId)}</h1><p className="mt-2 text-sm text-slate-400">CAMT.053 statement detail and paged movements</p></div><Button variant="secondary" title="Refresh statement" onClick={() => { void detail.refetch(); void entries.refetch(); }} disabled={detail.isFetching || entries.isFetching}><RefreshCw className={`h-4 w-4 ${detail.isFetching || entries.isFetching ? "animate-spin" : ""}`} /></Button></div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Metric label="Account" value={text(data.summary.accountMasked)} mono />
      <Metric label="Currency" value={text(data.summary.currency)} />
      <Metric label="Opening balance" value={amount(data.summary.openingBalance?.amount, data.summary.openingBalance?.currency)} />
      <Metric label="Closing balance" value={amount(data.summary.closingBalance?.amount, data.summary.closingBalance?.currency)} />
      <Metric label="Entries" value={String(data.summary.entryCount)} />
      <Metric label="Credit total" value={amount(data.summary.creditTotal, data.summary.currency)} accent="green" />
      <Metric label="Debit total" value={amount(data.summary.debitTotal, data.summary.currency)} accent="red" />
      <Metric label="Statement date" value={dateTime(data.summary.statementCreationDate)} />
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <Card><SectionTitle>Statement summary</SectionTitle><Details rows={[
        ["Reference", text(data.summary.statementReference)], ["Electronic sequence", text(data.summary.electronicSequenceNumber)],
        ["Message status", data.summary.messageStatus], ["Validation", data.summary.validationStatus || "Not validated"],
        ["Created", dateTime(data.summary.createdAt)], ["Updated", dateTime(data.summary.updatedAt)],
      ]} /></Card>
      <Card><SectionTitle>Source and connection</SectionTitle><Details rows={[
        ["File", data.file.originalFileName], ["File status", data.file.effectiveStatus],
        ["Message", data.message.reference || shortId(data.message.messageId)], ["Message type", data.message.type],
        ["Bank connection", data.bankConnection.displayName], ["Bank", `${data.bankConnection.code} · ${data.bankConnection.bankName}`],
      ]} /><div className="mt-4 flex flex-wrap gap-4 text-sm"><Link className="text-indigo-300 hover:underline" to={`/file-registry/${data.file.fileId}`}>Open File Registry</Link><Link className="text-indigo-300 hover:underline" to={`/message-hub/${data.message.messageId}`}>Open Message Hub</Link></div></Card>
    </div>

    <Card><SectionTitle>Validation</SectionTitle>{data.validationResults.length === 0 ? <Empty text="No validation result available." /> : data.validationResults.map(result => <div key={result.id} className="border-t border-slate-800 py-3 first:border-0"><div className="flex flex-wrap justify-between gap-2"><strong className={result.status === "PASSED" ? "text-emerald-300" : "text-rose-300"}>{result.status}</strong><time className="text-sm text-slate-400">{dateTime(result.checkedAt)}</time></div>{result.findings.map(finding => <p key={finding.id} className="mt-2 text-sm text-slate-300"><span className="font-medium">{finding.code}</span>: {finding.description}</p>)}</div>)}</Card>

    <div className="grid gap-6 xl:grid-cols-2">
      <Card><SectionTitle>Timeline</SectionTitle><ol className="space-y-3">{data.timeline.events.map((event,index) => <li key={`${event.type}-${event.occurredAt}-${index}`} className="border-l-2 border-indigo-500/40 pl-4"><p className="font-medium text-white">{event.title}</p><p className="text-xs text-slate-500">{event.type} · {dateTime(event.occurredAt)}</p></li>)}</ol></Card>
      <Card><SectionTitle>Poll traces</SectionTitle>{data.pollTraces.length === 0 ? <Empty text="No inbound poll trace is linked to this statement." /> : data.pollTraces.map(trace => <div key={trace.traceId} className="border-t border-slate-800 py-3 first:border-0"><div className="flex justify-between gap-3"><strong className="text-white">{trace.outcome}</strong><span className="text-sm text-slate-400">{dateTime(trace.processedAt || trace.detectedAt)}</span></div><p className="mt-1 break-all text-xs text-slate-500">{trace.originalFileName}</p>{trace.failureReason ? <p className="mt-2 text-sm text-rose-300">{trace.failureReason}</p> : null}</div>)}</Card>
    </div>

    <div><div className="mb-3 flex items-center justify-between"><SectionTitle>Movements</SectionTitle>{entries.isFetching ? <span className="text-xs text-slate-500">Refreshing...</span> : null}</div>
      <Card className="mb-4"><form onSubmit={applyEntries}><div className="grid gap-4 md:grid-cols-4"><Field label="Credit / debit"><select className={control} value={draft.creditDebitIndicator} onChange={e => setDraft({ ...draft, creditDebitIndicator: e.target.value })}><option value="">All</option><option>CRDT</option><option>DBIT</option></select></Field><Field label="Currency"><input className={control} maxLength={3} value={draft.currency} onChange={e => setDraft({ ...draft, currency: e.target.value.toUpperCase() })} /></Field><Field label="Status"><input className={control} maxLength={32} value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })} /></Field><Field label="Page size"><select className={control} value={draft.size} onChange={e => setDraft({ ...draft, size: Number(e.target.value) })}>{[10,25,50,100].map(x => <option key={x}>{x}</option>)}</select></Field></div>{filterError ? <p className="mt-3 text-sm text-rose-300">{filterError}</p> : null}<div className="mt-4 flex gap-3"><Button type="submit">Apply filters</Button><Button type="button" variant="ghost" onClick={() => { setDraft({ creditDebitIndicator: "", currency: "", status: "", size: 25 }); setFilters(initialEntries); }}>Clear filters</Button></div></form></Card>
      {entries.error ? <StatementMonitorError error={entries.error} onRetry={() => void entries.refetch()} retrying={entries.isFetching} /> : null}
      {entries.isLoading ? <Card><p className="text-sm text-slate-400">Loading movements...</p></Card> : null}
      {entries.data && entries.data.entries.length === 0 ? <Card><Empty text="No movements match these filters." /></Card> : null}
      {entries.data && entries.data.entries.length > 0 ? <><div className="overflow-x-auto border-y border-slate-800 bg-slate-900/40"><table className="min-w-[1250px] text-left text-sm"><thead className="bg-slate-950 text-slate-400"><tr>{["Reference","Amount","Currency","Type","Status","Booking date","Value date","Transaction code","End-to-end ID","Transaction ID"].map(h => <th key={h} className="px-3 py-3 font-medium">{h}</th>)}</tr></thead><tbody>{entries.data.entries.map(entry => <tr key={entry.entryId} className="border-t border-slate-800 text-slate-200"><td className="px-3 py-4">{text(entry.accountServicerReference)}</td><td className="whitespace-nowrap px-3 py-4">{amount(entry.amount, entry.currency)}</td><td className="px-3 py-4">{text(entry.currency)}</td><td className={`px-3 py-4 font-medium ${entry.creditDebitIndicator === "CRDT" ? "text-emerald-300" : "text-rose-300"}`}>{text(entry.creditDebitIndicator)}</td><td className="px-3 py-4">{text(entry.status)}</td><td className="px-3 py-4">{text(entry.bookingDate)}</td><td className="px-3 py-4">{text(entry.valueDate)}</td><td className="px-3 py-4">{text(entry.proprietaryTransactionCode || entry.bankTransactionCode)}</td><td className="max-w-52 break-all px-3 py-4">{text(entry.endToEndId)}</td><td className="max-w-52 break-all px-3 py-4">{text(entry.transactionId)}</td></tr>)}</tbody></table></div><EntryPagination page={entries.data.page} onPage={page => setFilters({ ...filters, page })} /></> : null}
    </div>
  </section>;
}

function Back() { return <Link to="/statement-monitor" className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:underline"><ArrowLeft className="h-4 w-4" />Back to Statement Monitor</Link>; }
function Metric({ label, value, mono=false, accent }: { label:string; value:string; mono?:boolean; accent?:"green"|"red" }) { return <div className="border-l-2 border-slate-700 bg-slate-900/40 px-4 py-3"><p className="text-xs uppercase text-slate-500">{label}</p><p className={`mt-2 break-words text-lg font-semibold ${mono ? "font-mono" : ""} ${accent === "green" ? "text-emerald-300" : accent === "red" ? "text-rose-300" : "text-white"}`}>{value}</p></div>; }
function SectionTitle({ children }: { children: ReactNode }) { return <h2 className="text-base font-semibold text-white">{children}</h2>; }
function Details({ rows }: { rows: [string,string][] }) { return <dl className="mt-4 grid gap-3 sm:grid-cols-2">{rows.map(([label,value]) => <div key={label}><dt className="text-xs uppercase text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm text-slate-200">{value}</dd></div>)}</dl>; }
function Empty({ text: value }: { text:string }) { return <p className="mt-3 text-sm text-slate-400">{value}</p>; }
function Field({ label, children }: { label:string; children:ReactNode }) { return <label className="space-y-2 text-sm font-medium text-slate-300"><span className="block">{label}</span>{children}</label>; }
function EntryPagination({ page, onPage }: { page:{ number:number; totalPages:number; totalElements:number; first:boolean; last:boolean }; onPage:(page:number)=>void }) { return <nav className="mt-4 flex items-center justify-between" aria-label="Movement pagination"><p className="text-sm text-slate-400">{page.totalElements} movements · Page {page.totalPages ? page.number + 1 : 0} of {page.totalPages}</p><div className="flex gap-2"><Button variant="secondary" disabled={page.first} onClick={() => onPage(page.number - 1)}>Previous</Button><Button variant="secondary" disabled={page.last} onClick={() => onPage(page.number + 1)}>Next</Button></div></nav>; }
