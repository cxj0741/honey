'use client'
export default function Error({ statusCode }: { statusCode: string }) {
  return (
    <div>
      <h1>{statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}</h1>
      <p>Sorry, something went wrong.</p>
    </div>
  )
}

