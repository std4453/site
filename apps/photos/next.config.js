//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nrwl/next/plugins/with-nx');
const { withSentryConfig } = require('@sentry/nextjs');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  sentry: {
    hideSourceMaps: false,
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

// There's currently no native way to specify environment variables from nx 
// project.json, one should add ANALYZE to .env.local
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withSentryConfig(
  withBundleAnalyzer(withPWA(withNx(nextConfig))),
  {
    silent: true,
  }
);
