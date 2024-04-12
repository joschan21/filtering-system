// NB: Can only be used for RSC while SSR for TenstackQuery is enabled in Provider.tsx
// app/getQueryClient.jsx
import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

// cache() is scoped per request, so we don't leak data between requests
const getQueryClient = cache(() => new QueryClient())
export default getQueryClient