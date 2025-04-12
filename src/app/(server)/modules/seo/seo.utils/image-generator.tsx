/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'
import React from 'react'
import ApiCustomError from '@/types/api-custom-error'

const siteName = 'Iptn Blog'
const logoUrl = '/assets/iptn-logo.svg'

// Helper function to load Google fonts
async function loadGoogleFont(font: string, text: string) {
  const API = `https://fonts.googleapis.com/css2?family=${font}:wght@400;700&text=${encodeURIComponent(
    text
  )}`

  const css = await fetch(API, {
    headers: {
      // Make sure it returns TTF
      'User-Agent':
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
    },
  }).then((response) => response.text())

  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (!resource) {
    throw new ApiCustomError('Failed to load font', 500)
  }

  const font_url = resource[1]
  return fetch(font_url).then((response) => response.arrayBuffer())
}

export async function generateOgImage({
  title,
  image,
}: {
  title: string
  image?: string | null
}) {
  try {
    // If an image is provided, just resize it to the recommended OG size
    if (image) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '1200px',
              height: '630px',
              display: 'flex',
              position: 'relative',
            }}
          >
            <img
              src={image}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      )
    }

    const interFont = await loadGoogleFont('Inter', title + siteName)
    const playfairFont = await loadGoogleFont('Playfair Display', title)

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '40px',
          }}
        >
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(to bottom, rgba(248, 249, 250, 0.8), rgba(248, 249, 250, 1))',
              zIndex: 1,
            }}
          />

          {/* Content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
              maxWidth: '1000px',
              zIndex: 2,
            }}
          >
            {/* Header with logo and site name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <img
                src={logoUrl}
                alt="Blog Logo"
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'contain',
                  marginRight: '16px',
                }}
              />
              <div
                style={{
                  fontSize: '24px',
                  color: '#333333',
                  fontWeight: 700,
                  fontFamily: 'Inter',
                }}
              >
                {siteName}
              </div>
            </div>

            {/* Article title */}
            <div
              style={{
                fontSize: '64px',
                lineHeight: 1.2,
                color: '#111111',
                fontWeight: 700,
                fontFamily: 'Playfair Display',
                marginBottom: '24px',
              }}
            >
              {title}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              fontSize: '16px',
              color: '#666666',
              fontFamily: 'Inter',
              zIndex: 2,
            }}
          >
            {new URL(logoUrl).origin}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: interFont,
            style: 'normal',
          },
          {
            name: 'Playfair Display',
            data: playfairFont,
            style: 'normal',
          },
        ],
      }
    )
  } catch (error) {
    console.error('OG Image generation error:', error)
    throw new ApiCustomError('Failed to generate blog image', 500)
  }
}

export async function generateTwitterImage({
  title,
  image,
}: {
  title: string
  image?: string | null
}) {
  try {
    // If an image is provided, just resize it to the recommended Twitter size
    if (image) {
      return new ImageResponse(
        (
          <div
            style={{
              width: '1200px',
              height: '600px',
              display: 'flex',
              position: 'relative',
            }}
          >
            <img
              src={image}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        ),
        {
          width: 1200,
          height: 600,
        }
      )
    }

    const interFont = await loadGoogleFont('Inter', title + siteName)
    const playfairFont = await loadGoogleFont('Playfair Display', title)

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '600px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '32px',
          }}
        >
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(to bottom, rgba(248, 249, 250, 0.8), rgba(248, 249, 250, 1))',
              zIndex: 1,
            }}
          />

          {/* Content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '90%',
              maxWidth: '1000px',
              zIndex: 2,
            }}
          >
            {/* Header with logo and site name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '32px',
              }}
            >
              <img
                src={logoUrl}
                alt="Blog Logo"
                style={{
                  width: '40px',
                  height: '40px',
                  objectFit: 'contain',
                  marginRight: '12px',
                }}
              />
              <div
                style={{
                  fontSize: '22px',
                  color: '#333333',
                  fontWeight: 700,
                  fontFamily: 'Inter',
                }}
              >
                {siteName}
              </div>
            </div>

            {/* Article title */}
            <div
              style={{
                fontSize: '56px',
                lineHeight: 1.2,
                color: '#111111',
                fontWeight: 700,
                fontFamily: 'Playfair Display',
                marginBottom: '20px',
              }}
            >
              {title}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              fontSize: '14px',
              color: '#666666',
              fontFamily: 'Inter',
              zIndex: 2,
            }}
          >
            {new URL(logoUrl).origin}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 600,
        fonts: [
          {
            name: 'Inter',
            data: interFont,
            style: 'normal',
          },
          {
            name: 'Playfair Display',
            data: playfairFont,
            style: 'normal',
          },
        ],
      }
    )
  } catch (error) {
    console.error('Twitter Image generation error:', error)
    throw new ApiCustomError('Failed to generate Twitter image', 500)
  }
}
