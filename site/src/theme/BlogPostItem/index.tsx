import React from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import type { Props } from "@theme/BlogPostItem";
import GitLabComments from "@site/src/components/GitLabComments";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";

export default function BlogPostItemWrapper(props: Props): JSX.Element {
  const { metadata, isBlogPostPage } = useBlogPost();

  return (
    <>
      <BlogPostItem {...props} />
      {isBlogPostPage && (
        <GitLabComments
          projectId="nixoshispano/nixoshispano.org"
          issueSearchTerm={`blog: ${metadata.title}`}
        />
      )}
    </>
  );
}
