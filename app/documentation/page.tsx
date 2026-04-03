import React from "react";
import Link from "next/link";
import CodeBlock from "../../components/CopyablePlot";
import {
  SETTINGS_DOCS,
  SETTINGS_PREVIEW_INPUT_CODE,
} from "../generated/settings-docs";

export default function Documentation() {
  return (
    <div>
      <p>
        The options below are generated from the installed
        <code> simple-ascii-chart </code>
        package metadata. This page updates through the docs generation pipeline
        to stay in parity with the library.
      </p>

      <ul>
        {SETTINGS_DOCS.map((setting) => (
          <li key={setting.key}>
            <Link href={`#${setting.anchor}`}>{setting.title}</Link>
          </li>
        ))}
      </ul>

      {SETTINGS_DOCS.map((setting) => (
        <section key={setting.key} id={setting.anchor}>
          <h2>{setting.title}</h2>
          <p>
            <strong>Setting key:</strong> <code>{setting.key}</code>
          </p>
          <p>
            <strong>Description:</strong> {setting.description}
          </p>
          <p>
            <strong>Type:</strong> <code>{setting.typeSignature}</code>
          </p>
          <CodeBlock javascript>{`const input = ${SETTINGS_PREVIEW_INPUT_CODE};
const settings = ${setting.exampleSettings};

console.log(plot(input, settings));`}</CodeBlock>
          <CodeBlock bash>{setting.preview}</CodeBlock>
        </section>
      ))}
    </div>
  );
}
