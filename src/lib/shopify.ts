import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION || '2025-01',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
});

export interface MediaImage {
  id: string;
  image: {
    id: string;
    url: string;
    altText?: string;
  };
}

export interface Video {
  id: string;
  sources: {
    url: string;
    format: string;
    mimeType: string;
  }[];
  previewImage?: {
    id: string;
    url: string;
    altText?: string;
  };
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  media: {
    nodes: (MediaImage | Video)[];
  };
  variants: {
    nodes: {
      id: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
      compareAtPrice?: {
        amount: string;
        currencyCode: string;
      };
      availableForSale: boolean;
      selectedOptions: {
        name: string;
        value: string;
      }[];
    }[];
  };
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  tags: string[];
  availableForSale: boolean;
}

export interface CartItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    selectedOptions?: {
      name: string;
      value: string;
    }[];
    image?: {
      id: string;
      url: string;
      altText?: string;
    };
    product: {
      id: string;
      title: string;
      handle: string;
      images: {
        nodes: {
          id: string;
          url: string;
          altText?: string;
        }[];
      };
    };
  };
}

export interface Cart {
  id: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount?: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    nodes: CartItem[];
  };
  checkoutUrl: string;
}

// GraphQL queries
const PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        title
        handle
        description
        tags
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        media(first: 10) {
          nodes {
            ... on MediaImage {
              id
              image {
                id
                url
                altText
              }
            }
            ... on Video {
              id
              sources {
                url
                format
                mimeType
              }
              previewImage {
                id
                url
                altText
              }
            }
          }
        }
        variants(first: 100) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
        options {
          id
          name
          values
        }
      }
    }
  }
`;

const PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      tags
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      media(first: 10) {
        nodes {
          ... on MediaImage {
            id
            image {
              id
              url
              altText
            }
          }
          ... on Video {
            id
            sources {
              url
              format
              mimeType
            }
            previewImage {
              id
              url
              altText
            }
          }
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
      options {
        id
        name
        values
      }
    }
  }
`;

const CART_QUERY = `
  query getCart($id: ID!) {
    cart(id: $id) {
      id
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        nodes {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                id
                url
                altText
              }
              product {
                id
                title
                handle
                images(first: 1) {
                  nodes {
                    id
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
      checkoutUrl
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  id
                  url
                  altText
                }
                product {
                  id
                  title
                  handle
                  images(first: 1) {
                    nodes {
                      id
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  id
                  url
                  altText
                }
                product {
                  id
                  title
                  handle
                  images(first: 1) {
                    nodes {
                      id
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  id
                  url
                  altText
                }
                product {
                  id
                  title
                  handle
                  images(first: 1) {
                    nodes {
                      id
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  id
                  url
                  altText
                }
                product {
                  id
                  title
                  handle
                  images(first: 1) {
                    nodes {
                      id
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// API functions
export async function getProducts(first: number = 20, after?: string) {
  const response = await client.request(PRODUCTS_QUERY, {
    variables: { first, after },
  });

  return response.data?.products;
}

export async function getProduct(handle: string) {
  const response = await client.request(PRODUCT_QUERY, {
    variables: { handle },
  });

  return response.data?.product;
}

export async function getCart(cartId: string) {
  const response = await client.request(CART_QUERY, {
    variables: { id: cartId },
  });

  return response.data?.cart;
}

export async function createCart() {
  const response = await client.request(CART_CREATE_MUTATION, {
    variables: { input: {} },
  });

  return response.data?.cartCreate;
}

export async function addToCart(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
  const response = await client.request(CART_LINES_ADD_MUTATION, {
    variables: { cartId, lines },
  });

  return response.data?.cartLinesAdd;
}

export async function updateCartLines(cartId: string, lines: Array<{ id: string; quantity: number }>) {
  const response = await client.request(CART_LINES_UPDATE_MUTATION, {
    variables: { cartId, lines },
  });

  return response.data?.cartLinesUpdate;
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const response = await client.request(CART_LINES_REMOVE_MUTATION, {
    variables: { cartId, lineIds },
  });

  return response.data?.cartLinesRemove;
}

export { client };
