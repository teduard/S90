import {
  Alert,
  Box,
  Button,
  Container,
  Header,
  KeyValuePairs,
  Link,
  Modal,
  SpaceBetween,
  StatusIndicator,
  Toggle,
} from "@cloudscape-design/components";
import Layout from "./Layout";
import { DashboardRoutes } from "../../routes";

import React, { useContext, useEffect, useState } from "react";
import AppBreadcrumbs from "../../components/AppBreadcrumbs";
import { STORAGE_KEYS } from "../../lib/storageKeys";
import { logger } from "../../lib/logger";
import { DataSourceContext } from "../../contexts/DataSourceContext";
import { useWebLLM } from "../../contexts/WebLLMContext";
import { useDatabase } from "../../db/hooks/useDatabase";

function DatabaseConfig() {
  const handleDbDownload = () => {
    const b64 = localStorage.getItem("sqlite_db");
    const bin = Uint8Array.from(atob(b64 || ""), (c) => c.charCodeAt(0));
    const blob = new Blob([bin]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "S90_db.sqlite";
    a.click();
  };

  const [visibleModal, setVisibleModal] = React.useState(false);

  const handleDbResetConfirmation = () => {
    localStorage.removeItem(STORAGE_KEYS.SQLITE_DB);
    localStorage.removeItem(STORAGE_KEYS.SESSION_USER);
    localStorage.removeItem(STORAGE_KEYS.LAYOUT_THEME);
    localStorage.removeItem(STORAGE_KEYS.LAYOUT_DENSITY);
    localStorage.removeItem(STORAGE_KEYS.SESSION_AUTH);
    window.location.reload();
  };

  return (
    <>
      <Container header={<Header variant="h2">Database configuration</Header>}>
        <p>
          This demo uses{" "}
          <Link href="https://www.npmjs.com/package/sql.js" external>
            sql.js
          </Link>{" "}
          for handling your data and caches it in the browser's localStorage so
          that data is persistent during your sessions.
          <br />
          The database can be download and used with any SQLite explorers
        </p>
        <Button onClick={handleDbDownload}>Download database</Button>
        <br />
        <br />
        Reseting the database to the initial state is also possible.
        <br />
        This will empty all tables and restore the <b>Users</b> tables to the
        default user.
        <br />
        <Button onClick={() => setVisibleModal(true)}>Reset data</Button>
        <Modal
          onDismiss={() => setVisibleModal(false)}
          visible={visibleModal}
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="link" onClick={() => setVisibleModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleDbResetConfirmation}>
                  Ok
                </Button>
              </SpaceBetween>
            </Box>
          }
          header="Reset data"
        >
          This operation is cannot be undone.
          <br />
          Are you sure you want to reset all data?
        </Modal>
      </Container>
    </>
  );
}

function AiConfig() {
  const { isReady } = useDatabase();
  const { preferencesService } = useContext(DataSourceContext);
  const {
    isEnabled,
    enable,
    disable,
    loadingState,
    loadingProgress,
    isMobile,
  } = useWebLLM();
  const [prefId, setPrefId] = useState<number | null>(null);

  useEffect(() => {
    preferencesService.getPreferences().then((prefs) => {
      if (prefs) {
        setPrefId(prefs.preferencesId);
      }
    });
  }, [isReady]);

  const handleWebLLMToggle = async (checked: boolean) => {
    logger.debug("in handleWebLLMToggle: checked = ", checked);
    if (!prefId) return;

    logger.debug("after pref");

    const prefs = await preferencesService.getPreferences();
    await preferencesService.updatePreferences({
      preferencesId: prefId,
      theme: prefs.theme,
      layoutDensity: prefs.layoutDensity,
      currency: prefs.currency,
      embeddings: prefs.embeddings,
      webllm: checked,
    });

    if (checked) {
      enable();
    } else {
      disable();
    }
  };

  return (
    <>
      <Container header={<Header variant="h2">AI configuration</Header>}>
        {!isMobile() && (
          <Alert type="warning" header="Known issues/limitations">
            Enabling this setting will make possible the in-browser inference
            through the{" "}
            <Link external href="https://webllm.mlc.ai/">
              WebLLM
            </Link>{" "}
            project.
            <br />
            This will download just once and cache locally the{" "}
            <i>SmolLM2-135M-Instruct-q0f32-MLC</i> model (aprox 280MB)
            <br />
            Once the model has completely loaded, the{" "}
            <b>AI Expense Assistant</b> will become visible in the Expense
            dashboard.
          </Alert>
        )}
        <KeyValuePairs
          columns={2}
          items={[
            // {
            //   label: "Embeddings",
            //   value: (
            //     <Toggle
            //       onChange={({ detail }) => setChecked(detail.checked)}
            //       checked={checked}
            //       disabled
            //     >
            //       Enabled
            //     </Toggle>
            //   ),
            //   info: (
            //     <span>Disabled for current demo</span>
            //   ),
            // },
            {
              label: "WebLLM",
              value: (
                <SpaceBetween size="xs">
                  {isMobile() && <>Not available on mobile</>}
                  {!isMobile() && (
                    <>
                      <Toggle
                        onChange={({ detail }) =>
                          handleWebLLMToggle(detail.checked)
                        }
                        checked={isEnabled}
                        disabled={loadingState === "loading"}
                      >
                        {loadingState === "loading"
                          ? "Loading model..."
                          : "Enabled"}
                      </Toggle>

                      {loadingState === "loading" && (
                        <Box color="text-body-secondary" fontSize="body-s">
                          {loadingProgress}
                        </Box>
                      )}
                      {loadingState === "error" && (
                        <StatusIndicator type="error">
                          Failed to load model
                        </StatusIndicator>
                      )}
                      {loadingState === "ready" && (
                        <StatusIndicator type="success">
                          Model ready
                        </StatusIndicator>
                      )}
                    </>
                  )}
                </SpaceBetween>
              ),
            },
          ]}
        />
      </Container>
    </>
  );
}

function Content() {
  return (
    <>
      <SpaceBetween size="m">
        <Header variant="h1">System tools</Header>

        <SpaceBetween direction="vertical" size="l">
          <DatabaseConfig />
          <AiConfig />
        </SpaceBetween>
      </SpaceBetween>
    </>
  );
}

function Breadcrumbs() {
  return (
    <AppBreadcrumbs
      items={[
        {
          text: "Dashboard",
          href: import.meta.env.BASE_URL + DashboardRoutes.path,
        },
      ]}
    />
  );
}

function SystemLogsDashboard() {
  return (
    <>
      <Layout content={<Content />} breadcrumbs={<Breadcrumbs />} />
    </>
  );
}

export default SystemLogsDashboard;
