import path from "path"
import { fileURLToPath } from "url"

// Suppress punycode deprecation warning from transitive deps (uri-js → ajv)
const _origEmit = process.emit;
process.emit = function (event, error) {
  if (
    event === 'warning' &&
    error?.name === 'DeprecationWarning' &&
    error?.message?.includes('punycode')
  ) {
    return false;
  }
  return _origEmit.apply(process, arguments);
};

/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const nextConfig = {
    rewrites: async () => {
        // for sitemap.xml
        return [
            {
                source: `/sitemap-:id.xml`,
                destination: `/sitemap.xml/:id`
            }
        ]
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate, max-age=0',
                    },
                    {
                        key: 'Pragma',
                        value: 'no-cache',
                    },
                    {
                        key: 'Expires',
                        value: '0',
                    },
                    {
                        key: 'X-Accel-Expires',
                        value: '0',
                    },
                    {
                        key: 'Vary',
                        value: '*',
                    },
                ],
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "i.pravatar.cc",
                port: "",
                pathname: "/300",
            },
            {
                protocol: 'https',
                hostname: "source.unsplash.com",
                port: "",
                pathname: "/random/200x200",
            }
        ]
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    turbopack: {
        root: __dirname,
    },
    pageExtensions: ['mdx', 'ts', 'tsx'],
    experimental: {
        mdxRs: true,
        viewTransition: true,
    },
}

const withMDX = createMDX({
    // Add markdown plugins here, as desired
})
export default withMDX(nextConfig)
