import {
  AppFooter,
  Container,
  Inline,
  Link as PixxlLink,
  Tag,
  Text,
} from "@pixxl-tools/components";

type SiteFooterProps = {
  year: number;
};

export default function SiteFooter({ year }: SiteFooterProps) {
  return (
    <AppFooter>
      <Container maxWidth="lg" padding="none">
        <Inline gap="md" justify="between" wrap>
          <Text size="sm" tone="muted">
            Designed and built by Bartosz Gryta (gtktsc).
          </Text>
          <Inline gap="sm" wrap>
            <PixxlLink href="https://buymeacoffee.com/gtktsc">
              <Tag tone="primary" variant="soft">
                Support
              </Tag>
            </PixxlLink>
            <Text as="span" size="sm" tone="muted">
              /
            </Text>
            <Text as="span" size="sm" tone="muted">
              {year} © Bartosz Gryta. All rights reserved.
            </Text>
          </Inline>
        </Inline>
      </Container>
    </AppFooter>
  );
}
