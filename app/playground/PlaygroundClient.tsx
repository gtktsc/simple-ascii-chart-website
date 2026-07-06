"use client";

import {
  PageSection,
  Prose,
  PublicPage,
  Stack,
} from "@pixxl-tools/components";
import EditablePlot from "../../components/EditablePlot";
import messages from "../../messages/en.json";
import { usePlaygroundState } from "./usePlaygroundState";

export default function PlaygroundClient() {
  const { input, options } = usePlaygroundState();

  return (
    <PublicPage
      description={messages.playground.description}
      title={messages.playground.title}
    >
      <Stack gap="lg">
        <PageSection>
          <Prose>
            <p>{messages.playground.shortcutHint}</p>
          </Prose>
        </PageSection>
        <PageSection>
          <EditablePlot input={input} options={options} />
        </PageSection>
      </Stack>
    </PublicPage>
  );
}
