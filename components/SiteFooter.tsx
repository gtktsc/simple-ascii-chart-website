import {
  AppFooter,
  Container,
  Inline,
  Link as PixxlLink,
  Stack,
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
        <Stack align="center" className="site-footer-content" gap="sm">
          <Text size="sm" tone="muted">
            {messages.footer.credit}
          </Text>
          <Inline className="site-footer-meta" gap="sm" justify="center" wrap>
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
        </Stack>
      </Container>
    </AppFooter>
  );
}
