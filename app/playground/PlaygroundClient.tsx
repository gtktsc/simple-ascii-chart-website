"use client";

import {
  PageSection,
  Prose,
  PublicPage,
  Stack,
} from "@pixxl-tools/components";
import EditablePlot from "../../components/EditablePlot";
import { formatMessage } from "../../lib/messages.mjs";
import messages from "../../messages/en.json";
import { usePlaygroundState } from "./usePlaygroundState";

export default function PlaygroundClient({ version }: { version: string }) {
  const { input, options } = usePlaygroundState();

  return (
    <PublicPage
      description={messages.playground.description}
      title={formatMessage(messages.playground.versionTitle, { version })}
    >
      <Stack gap="lg">
        <PageSection>
          <Prose>
            <p>{messages.playground.shortcutHint}</p>
          </Prose>
        </PageSection>
        <PageSection>
          <EditablePlot input={input} options={options} version={version} />
        </PageSection>
      </Stack>
    </PublicPage>
  );
}
