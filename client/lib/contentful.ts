import { Document } from '@contentful/rich-text-types';

const contentfulGraphql = process.env.NEXT_PUBLIC_CONTENTFUL_GRAPHQL ?? '';

type File = {
    url: string,
    description: string,
    contentType: string,
    fileName: string
}

type Author = {
    firstName: string,
    surname: string,
    avatar: {
        url: string
        description: string
    }
}

export type AuthorSkeleton = {
    contentTypeId: 'author',
    fields: {
        firstName: string,
        surname: string,
        avatar: File
    }
}

export type TagSkeleton = {
    contentTypeId: 'tag',
    fields: {
        tagName: string
    }
}

export type BlogPostSkeleton = {
    contentTypeId: 'blogPost',
    fields: {
        sys: {
            id: string
        },
        title: string,
        slug: string,
        subheading: string,
        postedDate: Date,
        readTime: number,
        featuredImage: File,
        body: {
            json: Document
        },
        author: Author,
        tags?: TagSkeleton[],
        relatedPosts?: Omit<Omit<BlogPostSkeleton, 'body'>, 'relatedPosts'>[];
    }
}

export async function fetchBlogPreviews(signal?: AbortSignal): Promise<Omit<BlogPostSkeleton['fields'][], 'body'>> {
    const query = `
    query {
        blogPostCollection {
            items {
                sys {
                    id
                }
                title
                slug
                subheading
                postedDate
                readTime
                featuredImage {
                    description
                    url
                }
                author {
                    firstName
                    surname
                    avatar {
                        url
                    }
                }
                tags: tagsCollection {
                        items {
                            tagName
                        }   
                    }
            }
        }
    }`;

    const response = await fetch(contentfulGraphql, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
        },
        signal,
        body: JSON.stringify({ query }),
    });
    const { data } = await response.json();
    return data.blogPostCollection.items;
}

export async function fetchBlogPost(id: string, signal?: AbortSignal): Promise<BlogPostSkeleton['fields'] | null> {
    const query = `
    query {
        blogPost(id: "${id}") {
            sys {
              id
            }
            title
            slug
            subheading
            postedDate
            readTime
            featuredImage {
              description
              url
            }
            body {
                json
            }
            author {
              firstName
              surname
              avatar {
                url
              }
            }
            tags: tagsCollection {
              items {
                tagName
              }
            }
            relatedPosts: relatedPostsCollection {
              items {
                sys {
                  id
                }
                title
                subheading
                readTime
                slug
                postedDate
                featuredImage {
                  description
                  url
                }
                author {
                  firstName
                  surname
                  avatar {
                    url
                  }
                }
                tags: tagsCollection {
                  items {
                    tagName
                  }
                }
              }
            }
        }
    }`;

    const response = await fetch(contentfulGraphql, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
        },
        signal,
        body: JSON.stringify({ query }),
    });
    const { data } = await response.json();
    return data.blogPost;
}