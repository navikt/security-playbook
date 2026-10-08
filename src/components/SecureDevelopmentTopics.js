import React from "react";
import { useCurrentSidebarCategory } from "@docusaurus/plugin-content-docs/client";
import DocCardList from "@theme/DocCardList";
import Heading from "@theme/Heading";

export default function SecureDevelopmentTopics() {
  const { items } = useCurrentSidebarCategory();

  return items.map((category) => (
    <section
      key={category.customProps.overviewId}
      aria-labelledby={category.customProps.overviewId}
      className="margin-bottom--lg"
    >
      <Heading as="h2" id={category.customProps.overviewId}>
        {category.label}
      </Heading>
      <p>{category.description}</p>
      <DocCardList items={category.items} />
    </section>
  ));
}
