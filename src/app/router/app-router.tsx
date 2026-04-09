import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "../layout/app-shell";
import { ProtectedRoute } from "./protected-route";
import { LoginPage } from "../../features/auth/routes/login-page";
import { DashboardPage } from "../../features/dashboard/routes/dashboard-page";
import { FileRegistryPage } from "../../features/file-registry/routes/file-registry-page";
import { FileRegistryDetailPage } from "../../features/file-registry/routes/file-registry-detail-page";
import { MessageHubPage } from "../../features/message-hub/routes/message-hub-page";
import { UserAdministrationPage } from "../../features/user-administration/routes/user-administration-page";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/file-registry" element={<FileRegistryPage />} />
            <Route
              path="/file-registry/:fileId"
              element={<FileRegistryDetailPage />}
            />
            <Route path="/message-hub" element={<MessageHubPage />} />
            <Route
              path="/user-administration"
              element={<UserAdministrationPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}