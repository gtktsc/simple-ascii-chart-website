type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export default function JsonLd({ data }: JsonLdProps) {
  const payload = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      dangerouslySetInnerHTML={{ __html: payload }}
      type="application/ld+json"
    />
  );
}
