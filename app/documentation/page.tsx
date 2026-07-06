import {
  AnchorNav,
  Card,
  Code,
  Prose,
  PublicPage,
  Section,
  SimpleGrid,
  Stack,
} from "@pixxl/components";
import CodeSnippet from "../../components/CodeSnippet";
import {
  SETTINGS_DOCS,
  SETTINGS_PREVIEW_INPUT_CODE,
} from "../generated/settings-docs";

const navItems = SETTINGS_DOCS.map((setting) => ({
  href: `#${setting.anchor}`,
  id: setting.key,
  label: setting.title,
}));

export default function Documentation() {
  return (
    <PublicPage
      description="Generated configuration reference from the installed package metadata."
      title="Documentation"
    >
      <Stack gap="lg">
        <Prose>
          <p>
            The options below are generated from the installed{" "}
            <Code>simple-ascii-chart</Code> package metadata. This page updates
            through the docs generation pipeline to stay in parity with the
            library.
          </p>
        </Prose>

        <Card title="Settings index" variant="soft">
          <AnchorNav items={navItems} orientation="vertical" />
        </Card>

        {SETTINGS_DOCS.map((setting) => (
          <Section id={setting.anchor} key={setting.key} title={setting.title}>
            <Stack gap="md">
              <SimpleGrid minItemWidth="220px">
                <Card title="Setting key" variant="soft">
                  <Code>{setting.key}</Code>
                </Card>
                <Card title="Type" variant="soft">
                  <Code>{setting.typeSignature}</Code>
                </Card>
              </SimpleGrid>

              <Prose density="compact">
                <p>{setting.description}</p>
              </Prose>

              <CodeSnippet language="javascript" maxHeight="22rem">{`const input = ${SETTINGS_PREVIEW_INPUT_CODE};
const settings = ${setting.exampleSettings};

console.log(plot(input, settings));`}</CodeSnippet>
              <CodeSnippet language="bash" maxHeight="28rem">
                {setting.preview}
              </CodeSnippet>
            </Stack>
          </Section>
        ))}
      </Stack>
    </PublicPage>
  );
}
