import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prose, PublicPage, Stack } from "@pixxl-tools/components";
import historicalOutputs from "../../../docs/versions/5.4.0/example-outputs.json";
import historicalSources from "../../../docs/versions/5.4.0/example-sources.json";
import {
  DOCUMENTATION_VERSIONS,
  findDocumentationVersion,
  LATEST_DOCUMENTATION_VERSION,
} from "../../../lib/documentationVersions.mjs";
import { formatMessage } from "../../../lib/messages.mjs";
import { buildPlaygroundHref } from "../../../lib/optionsSerialization.mjs";
import { buildPageMetadata } from "../../../lib/seoMetadata";
import { examplesVersionRoute } from "../../../lib/siteConstants";
import messages from "../../../messages/en.json";
import ExampleSection from "../ExampleSection";
import {
  EXAMPLE_DEFINITIONS,
  getExampleSource,
  renderExample,
} from "../exampleData";
import VersionBreadcrumbs from "../../../components/VersionBreadcrumbs";

type PageProps = { params: Promise<{ version: string }> };

export function generateStaticParams() {
  return DOCUMENTATION_VERSIONS.map(({ id }) => ({ version: id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { version } = await params;
  if (!findDocumentationVersion(version)) return {};

  return buildPageMetadata({
    description:
      version === LATEST_DOCUMENTATION_VERSION
        ? messages.examples.description
        : formatMessage(messages.examples.historicalDescription, { version }),
    pathname: examplesVersionRoute(version),
    title: formatMessage(messages.examples.versionTitle, { version }),
  });
}

export default async function VersionedExamples({ params }: PageProps) {
  const { version } = await params;
  if (!findDocumentationVersion(version)) notFound();
  const isLatest = version === LATEST_DOCUMENTATION_VERSION;
  const description = isLatest
    ? messages.examples.description
    : formatMessage(messages.examples.historicalDescription, { version });
  const examples = isLatest
    ? EXAMPLE_DEFINITIONS.map((example) => {
        const playgroundHref =
          example.method === "plot"
            ? buildPlaygroundHref(example.input, example.options, version)
            : null;

        return {
          id: example.id,
          inputSource: undefined,
          optionsSource: undefined,
          output: renderExample(example),
          playgroundHref,
          showNotShareable: example.method === "plot" && !playgroundHref,
          source: getExampleSource(example),
        };
      })
    : (Object.keys(historicalSources) as (keyof typeof historicalSources)[]).map(
        (id) => {
          const definition = EXAMPLE_DEFINITIONS.find(
            (example) => example.id === id,
          );
          const playgroundHref =
            definition?.method === "plot"
              ? buildPlaygroundHref(
                  definition.input,
                  definition.options,
                  version,
                )
              : null;

          return {
            id,
            inputSource: historicalSources[id].input,
            optionsSource: historicalSources[id].options,
            output: historicalOutputs[id],
            playgroundHref,
            showNotShareable: !playgroundHref,
            source: undefined,
          };
        },
      );

  return (
    <PublicPage
      breadcrumbs={<VersionBreadcrumbs section="examples" version={version} />}
      description={description}
      title={formatMessage(messages.examples.versionTitle, { version })}
    >
      <Stack gap="lg">
        {!isLatest ? (
          <Prose>
            <p>{description}</p>
          </Prose>
        ) : null}

        {examples.map((example) => (
          <ExampleSection
            inputSource={example.inputSource}
            key={example.id}
            optionsSource={example.optionsSource}
            output={example.output}
            playgroundHref={example.playgroundHref}
            showNotShareable={example.showNotShareable}
            source={example.source}
            title={messages.examples.items[example.id]}
          />
        ))}
      </Stack>
    </PublicPage>
  );
}
