/** @type {import('next').NextConfig} */
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
    eslint: {
        ignoreDuringBuilds: true,
    },
}
export default nextConfig
