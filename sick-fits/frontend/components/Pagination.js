import React from 'react';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import { Query } from 'react-apollo';
import { perPage } from '../config';
import PaginationStyles from './styles/PaginationStyles';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`

const Pagination = (props) => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error: { error.message }</p>
      const { page } = props;
      const count = Math.ceil(data.itemsConnection.aggregate.count / perPage);
      const paginationLabel = `Page ${page} of ${count}`;
      return (
        <PaginationStyles>
          <Head>
            <title>Sick Fits - {paginationLabel}</title>
          </Head>
          <Link
            href={{
              pathname: '/',
              query: { page: page - 1 }
            }}
            prefetch
          >
            <a className="prev" aria-disabled={page <= 1}>Prev</a>
          </Link>
          <p>{paginationLabel}</p>
          <Link
            href={{
              pathname: '/',
              query: { page: page + 1 }
            }}
            prefetch
          >
            <a className="next" aria-disabled={page >= count}>Next</a>
          </Link>
        </PaginationStyles>
      )
    }}
  </Query>
);

export default Pagination;
