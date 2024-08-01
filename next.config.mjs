/** @type {import('next').NextConfig} */
const nextConfig = {
    // Make sure to set this to false because if not you will have your logic run twice. For example the 
    // GlobalLoading component will invoke the showCurrentUser thunk twice. But by setting the "reactStrictMode"
    // to false. I prevent that.
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                hostname: 'res.cloudinary.com',
                protocol: 'https'
            }
        ]
    }
};

export default nextConfig;
