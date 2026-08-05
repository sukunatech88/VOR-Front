import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../layout/app-shell";
import { ProtectedRoute } from "./protected-route";
import { NotFoundPage } from "./not-found-page";

const LoginPage = lazy(() => import("../../features/auth/routes/login-page").then(m => ({ default: m.LoginPage })));
const AuthCallbackPage = lazy(() => import("../../features/auth/routes/auth-callback-page").then(m => ({ default: m.AuthCallbackPage })));
const DashboardPage = lazy(() => import("../../features/dashboard/routes/dashboard-page").then(m => ({ default: m.DashboardPage })));
const FileRegistryPage = lazy(() => import("../../features/file-registry/routes/file-registry-page").then(m => ({ default: m.FileRegistryPage })));
const FileRegistryDetailPage = lazy(() => import("../../features/file-registry/routes/file-registry-detail-page").then(m => ({ default: m.FileRegistryDetailPage })));
const MessageHubPage = lazy(() => import("../../features/message-hub/routes/message-hub-page").then(m => ({ default: m.MessageHubPage })));
const MessageHubDetailPage = lazy(() => import("../../features/message-hub/routes/message-hub-detail-page").then(m => ({ default: m.MessageHubDetailPage })));
const PaymentMonitorPage = lazy(() => import("../../features/payment-monitor/routes/payment-monitor-page").then(m => ({ default: m.PaymentMonitorPage })));
const PaymentMonitorDetailPage = lazy(() => import("../../features/payment-monitor/routes/payment-monitor-detail-page").then(m => ({ default: m.PaymentMonitorDetailPage })));
const StatementMonitorPage = lazy(() => import("../../features/statement-monitor/routes/statement-monitor-page").then(m => ({ default: m.StatementMonitorPage })));
const StatementMonitorDetailPage = lazy(() => import("../../features/statement-monitor/routes/statement-monitor-detail-page").then(m => ({ default: m.StatementMonitorDetailPage })));
const BankConnectionsPage = lazy(() => import("../../features/bank-connections/routes/bank-connections-page").then(m => ({ default: m.BankConnectionsPage })));
const BankConnectionDetailPage = lazy(() => import("../../features/bank-connections/routes/bank-connection-detail-page").then(m => ({ default: m.BankConnectionDetailPage })));

function RouteLoading() { return <div className="py-12 text-center text-sm text-slate-400" role="status">Loading workspace...</div>; }

export function AppRouter() {
  return <Suspense fallback={<RouteLoading/>}><Routes>
    <Route path="/login" element={<LoginPage/>}/><Route path="/auth/callback" element={<AuthCallbackPage/>}/>
    <Route element={<ProtectedRoute/>}><Route element={<AppShell/>}>
      <Route path="/" element={<Navigate to="/dashboard" replace/>}/><Route path="/dashboard" element={<DashboardPage/>}/>
      <Route path="/file-registry" element={<FileRegistryPage/>}/><Route path="/file-registry/:fileId" element={<FileRegistryDetailPage/>}/>
      <Route path="/message-hub" element={<MessageHubPage/>}/><Route path="/message-hub/:messageId" element={<MessageHubDetailPage/>}/>
      <Route path="/payment-monitor" element={<PaymentMonitorPage/>}/><Route path="/payment-monitor/:paymentInstructionId" element={<PaymentMonitorDetailPage/>}/>
      <Route path="/statement-monitor" element={<StatementMonitorPage/>}/><Route path="/statement-monitor/:statementId" element={<StatementMonitorDetailPage/>}/>
      <Route path="/bank-connections" element={<BankConnectionsPage/>}/><Route path="/bank-connections/:bankConnectionId" element={<BankConnectionDetailPage/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Route></Route>
  </Routes></Suspense>;
}
