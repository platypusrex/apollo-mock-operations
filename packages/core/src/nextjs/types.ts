import type { ParsedUrlQuery } from 'querystring';
import type { IncomingMessage, ServerResponse } from 'http';

export type Redirect =
  | {
      statusCode: 301 | 302 | 303 | 307 | 308;
      destination: string;
      basePath?: false;
    }
  | {
      permanent: boolean;
      destination: string;
      basePath?: false;
    };

export type PreviewData = string | false | object | undefined;

export declare type NextApiRequestCookies = Partial<{
  [key: string]: string;
}>;

export type GetStaticPropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = {
  params?: Q;
  preview?: boolean;
  previewData?: D;
  locale?: string;
  locales?: string[];
  defaultLocale?: string;
};

export type GetStaticPropsResult<P> =
  | { props: P; revalidate?: number | boolean }
  | { redirect: Redirect; revalidate?: number | boolean }
  | { notFound: true; revalidate?: number | boolean };

export type GetStaticProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = (
  context: GetStaticPropsContext<Q, D>
) => Promise<GetStaticPropsResult<P>> | GetStaticPropsResult<P>;

export type InferGetStaticPropsType<T extends (args: any) => any> = Extract<
  Awaited<ReturnType<T>>,
  { props: any }
>['props'];

export type GetStaticPathsContext = {
  locales?: string[];
  defaultLocale?: string;
};

export type GetStaticPathsResult<P extends ParsedUrlQuery = ParsedUrlQuery> = {
  paths: Array<string | { params: P; locale?: string }>;
  fallback: boolean | 'blocking';
};

export type GetStaticPaths<P extends ParsedUrlQuery = ParsedUrlQuery> = (
  context: GetStaticPathsContext
) => Promise<GetStaticPathsResult<P>> | GetStaticPathsResult<P>;

export type GetServerSidePropsContext<
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = {
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  };
  res: ServerResponse;
  params?: Q;
  query: ParsedUrlQuery;
  preview?: boolean;
  previewData?: D;
  resolvedUrl: string;
  locale?: string;
  locales?: string[];
  defaultLocale?: string;
};

export type GetServerSidePropsResult<P> =
  | { props: P | Promise<P> }
  | { redirect: Redirect }
  | { notFound: true };

export type GetServerSideProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = (context: GetServerSidePropsContext<Q, D>) => Promise<GetServerSidePropsResult<P>>;
