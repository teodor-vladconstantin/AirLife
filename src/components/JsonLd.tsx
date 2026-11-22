// Reusable JSON-LD <script>. "<" is escaped so a stray "</script>" in the data can't break out of the tag,
// and the output is plain text, so server and client markup match (no hydration warnings).
export type JsonLdData = Record<string, unknown> | Array<Record<string, unknown>>;

export const serializeJsonLd = (data: JsonLdData) => JSON.stringify(data).split("<").join(String.fromCharCode(92) + "u003c");

export const JsonLd = ({ data }: { data: JsonLdData }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
);

export default JsonLd;
