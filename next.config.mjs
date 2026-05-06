import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tu peux ajouter d’autres options ici plus tard (images, headers, etc.)
  webpack: (config) => {
    // Force l'alias @/ pour webpack (le vrai fix)
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve('./'),
    }
    return config
  },
}

export default nextConfig