import {
  AppFooter,
  Container,
  Inline,
  Link as PixxlLink,
  Tag,
  Text,
} from "@pixxl-tools/components";
import { EXTERNAL_LINKS } from "../lib/siteConstants";
import { formatMessage } from "../lib/messages.mjs";
import messages from "../messages/en.json";

type SiteFooterProps = {
  year: number;
};

export default function SiteFooter({ year }: SiteFooterProps) {
  return (
    <AppFooter>
      <Container maxWidth="lg" padding="none">
        <Inline gap="md" justify="between" wrap>
          <Text size="sm" tone="muted">
            {messages.footer.credit}
          </Text>
          <Inline gap="sm" wrap>
            <PixxlLink href={EXTERNAL_LINKS.support}>
              <Tag tone="primary" variant="soft">
                {messages.footer.support}
              </Tag>
            </PixxlLink>
            <Text as="span" size="sm" tone="muted">
              {messages.footer.separator}
            </Text>
            <Text as="span" size="sm" tone="muted">
              {formatMessage(messages.footer.copyright, {
                year: String(year),
              })}
            </Text>
          </Inline>
        </Inline>
      </Container>
    </AppFooter>
  );
}
