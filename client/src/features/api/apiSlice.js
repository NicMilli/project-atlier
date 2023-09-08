import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// RTK Query

export const api = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  keepUnusedDataFor: 3000,
  // The "endpoints" represent operations and requests for this server
  endpoints: (build) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    // builder.mutation() would be for posts modifiying server
    getFirstProduct: build.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => '/products?page=1&count=1',
    }),
    getSpecificProduct: build.query({
      // The URL for the request is '/fakeApi/posts'
      query: (productId) => `/products/${productId}`,
    }),
    getProductStyles: build.query({
      // The URL for the request is '/fakeApi/posts'
      query: (productId) => `/products/${productId}/styles`,
    }),
    getProductReviews: build.query({
      // The URL for the request is '/fakeApi/posts'
      query: (obj) => `/reviews?count=${obj.count}&sort=${obj.sortState}&product_id=${obj.id}`,
    }),
    getMetaReviews: build.query({
      // The URL for the request is '/fakeApi/posts'
      query: (productId) => `/reviews/meta?product_id=${productId}`,
    }),
    getRelatedProducts: build.query({
      // The URL for the request is '/fakeApi/posts'
      query: (productId) => `/products/${productId}/related`,
    }),
    getQuestions: build.query({
      query: ({ productId, page, count }) => `/qa/questions?product_id=${productId}&page=${page}&count=${count}`,
    }),
    getProductInfo: build.query({
      async queryFn(productId, _queryApi, _extraOptions, fetchWithBQ) {
        const details = await fetchWithBQ(`/products/${productId}`);
        if (details.error) return { error: details.error };
        const styles = await fetchWithBQ(`/products/${productId}/styles`);
        return styles.data && styles.data.results && styles.data.results.length
          ? { data: { details: details.data, styles: styles.data } } : { error: 'Error fetching styles' };
      },
    }),
    getRelatedProductInfo: build.query({
      async queryFn(productId, _queryApi, _extraOptions, fetchWithBQ) {
        // Gets related product id's from current product
        const related = await fetchWithBQ(`/products/${productId}/related`);
        if (related.error || related.data.length === 0) return { error: related.error };
        // Iterates through list of related products
        const allItems = await Promise.all(related.data.map(async (item) => {
          const relatedItem = {};
          relatedItem.product_id = item;
          // Fetches API data at specific endpoints
          const [itemDetails, ratingsDetails, allPhotos] = await Promise.all([
            fetchWithBQ(`/products/${item}`), fetchWithBQ(`/reviews/meta?product_id=${item}`), fetchWithBQ(`/products/${item}/styles`)]);

          // const itemDetails = await fetchWithBQ(`/products/${item}`);
          // const ratingsDetails = await fetchWithBQ(`/reviews/meta?product_id=${item}`);
          // const allPhotos = await fetchWithBQ(`/products/${item}/styles`);
          // Compiles data for each related item into an object
          itemDetails.data
            ? relatedItem.details = itemDetails.data
            : relatedItem.detailsError = itemDetails.error;

          ratingsDetails.data
            ? relatedItem.ratings = ratingsDetails.data
            : relatedItem.ratings = {
              ratings: {
                1: 1,
                5: 1,
              },
            };
          allPhotos.data?.results && allPhotos.data?.results[0]?.photos
            ? relatedItem.photos = allPhotos.data
            : relatedItem.photos = errorPhotos;

          return relatedItem;
        }));
        return { data: allItems };
      },
    }),
    addToCart: build.mutation({
      query: (skuId) => ({
        url: '/cart',
        method: 'POST',
        body: { sku_id: parseInt(skuId, 10) },
      }),
    }),
    postNewReview: build.mutation({
      query: (obj) => ({
        url: '/reviews',
        method: 'POST',
        body: obj,
      }),
    }),
    helpfulReview: build.mutation({
      query: (review_id) => ({
        url: `/reviews/${review_id}/helpful`,
        method: 'PUT',
        body: { review_id },
      }),
    }),
    reportReview: build.mutation({
      query: (review_id) => ({
        url: `/reviews/${review_id}/report`,
        method: 'PUT',
        body: { review_id },
      }),
    }),
    postNewQuestion: build.mutation({
      query: (obj) => ({
        url: '/qa/questions',
        method: 'POST',
        body: obj,
      }),
    }),
    postNewAnswer: build.mutation({
      query: ({ body, questionId }) => ({
        url: `/qa/questions/${questionId}/answers`,
        method: 'POST',
        body,
      }),
    }),
    helpfulQNA: build.mutation({
      query: ({ item, itemId }) => ({
        url: `/qa/${item}/${itemId}/helpful`,
        method: 'PUT',
        validateStatus: (response) => response.status === 204,
      }),
    }),
    reportAnswer: build.mutation({
      query: (answerId) => ({
        url: `/qa/answers/${answerId}/report`,
        method: 'PUT',
        validateStatus: (response) => response.status === 204,
      }),
    }),
  }),
  // EXAMPLE MUTATION endpoint!!!
  // updateReview: build.mutation({
  //   query: reviewId => ({
  //     url: `/reviews/${reviewId}`,
  //     method: 'POST',
  //     body: updatedReview
  //   })
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetFirstProductQuery,
  useGetSpecificProductQuery,
  useGetProductStylesQuery,
  useGetProductInfoQuery,
  useGetProductReviewsQuery,
  useGetRelatedProductsQuery,
  useGetQuestionsQuery,
  useGetRelatedProductInfoQuery,
  useGetMetaReviewsQuery,
  useLazyGetMetaReviewsQuery,
  useAddToCartMutation,
  usePostNewReviewMutation,
  useHelpfulReviewMutation,
  useReportReviewMutation,
  usePostNewQuestionMutation,
  usePostNewAnswerMutation,
  useHelpfulQNAMutation,
  useReportAnswerMutation,
} = api;

const errorPhotos = {
  product_id: '1',
  results: [
    {
      name: 'Forest Green & Black',
      skus: {
        1: {
          size: 'XS',
          quantity: 8,
        },
        2: {
          size: 'S',
          quantity: 16,
        },
        3: {
          size: 'M',
          quantity: 17,
        },
        4: {
          size: 'L',
          quantity: 10,
        },
        5: {
          size: 'XL',
          quantity: 15,
        },
        6: {
          size: 'XL',
          quantity: 4,
        },
      },
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80',
        },
        {
          url: 'https://images.unsplash.com/photo-1534011546717-407bced4d25c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2734&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1534011546717-407bced4d25c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80',
        },
        {
          url: 'https://images.unsplash.com/photo-1549831243-a69a0b3d39e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2775&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1549831243-a69a0b3d39e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80',
        },
        {
          url: 'https://images.unsplash.com/photo-1527522883525-97119bfce82d?ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1527522883525-97119bfce82d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
        },
        {
          url: 'https://images.unsplash.com/photo-1556648202-80e751c133da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1556648202-80e751c133da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80',
        },
        {
          url: 'https://images.unsplash.com/photo-1532543491484-63e29b3c1f5d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
          thumbnail_url: 'https://images.unsplash.com/photo-1532543491484-63e29b3c1f5d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80',
        },
      ],
      'default?': 1,
      style_id: 1,
      sale_price: null,
      original_price: 140,
    },
  ],
};
