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
    }
}
export default nextConfig
