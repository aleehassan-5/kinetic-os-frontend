"use client";

import * as React from "react";
import { Topnav } from "@/components/layout/topnav";
import { SettingsNav, type SettingsTab } from "@/components/settings/settings-nav";
import { ProfileSection } from "@/components/settings/profile-section";
import { WorkspaceSection } from "@/components/settings/workspace-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { IntegrationsSection } from "@/components/settings/integrations-section";
import { ApiKeysSection } from "@/components/settings/api-keys-section";
import { DangerZoneSection } from "@/components/settings/danger-zone-section";

export default function SettingsPage() {
  const [tab, setTab] = React.useState<SettingsTab>("profile");

  return (
    <>
      <Topnav title="Settings" subtitle="Manage your account, workspace, and integrations" />
      <main className="p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <SettingsNav active={tab} onChange={setTab} />
          <div className="min-w-0 flex-1 space-y-6">
            {tab === "profile" && <ProfileSection />}
            {tab === "workspace" && <WorkspaceSection />}
            {tab === "notifications" && <NotificationsSection />}
            {tab === "integrations" && <IntegrationsSection />}
            {tab === "api-keys" && <ApiKeysSection />}
            {tab === "danger" && <DangerZoneSection />}
          </div>
        </div>
      </main>
    </>
  );
}
