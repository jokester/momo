import { PageType } from '../../src/next-types';
import { Layout } from '../../src/components/layout/layout';
import { InventoryDb } from '../../src/components/inventory-list/invertory-table';
import React from 'react';
import { defaultGetServerSideProps } from '../../src/ssr/default-get-server-side-props';

/**
 * URL params from route (path) and query
 */
interface UrlParam {}

/**
 *
 */
interface PageProps {}

const ItemsIndexPage: PageType<UrlParam, PageProps> = (props) => {
  return (
    <Layout>
      <InventoryDb />
    </Layout>
  );
};

// UnnamedPage.getInitialProps = async ctx => ({ });

export default ItemsIndexPage;

export const getServerSideProps = defaultGetServerSideProps;
