import React from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import type { Props } from "@theme/BlogPostItem";
import GiscusComments from "@site/src/components/GiscusComments";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";

export default function BlogPostItemWrapper(props: Props): JSX.Element {
  const { isBlogPostPage } = useBlogPost();

  return (
    <>
      <BlogPostItem {...props} />
      {isBlogPostPage && <GiscusComments />}
    </>
  );
}
