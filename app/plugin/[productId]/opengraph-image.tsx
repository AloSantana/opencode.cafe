import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { EXTENSION_TYPES } from "@/lib/constants"
import type { ExtensionType } from "@/lib/constants"

export const alt = "OpenCode Extension"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params

  const extension = await fetchQuery(api.extensions.getByProductId, {
    productId,
  })

  const fontData = await readFile(
    join(process.cwd(), "assets/Inter-SemiBold.ttf")
  )

  const logoData = await readFile(
    join(process.cwd(), "public/opencode_cafe_email.png")
  )
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`

  // If extension not found, show a generic OG image
  if (!extension) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 32,
            background: "#1a1412",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "80px",
            fontFamily: "Inter",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: "40px",
            }}
          >
            <img
              src={logoBase64}
              width="300"
              height="35"
              alt="opencode.cafe"
              style={{ objectFit: "contain" }}
            />
          </div>

          <div
            style={{
              fontSize: "48px",
              fontWeight: 600,
              color: "#f5f0eb",
              lineHeight: 1.2,
            }}
          >
            Extension not found
          </div>

          {/* Accent bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "8px",
              background: "#c4a67a",
            }}
          />
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
            weight: 600,
          },
        ],
      }
    )
  }

  const typeInfo = EXTENSION_TYPES[extension.type as ExtensionType]

  // Truncate description if too long
  const maxDescriptionLength = 150
  const description =
    extension.description.length > maxDescriptionLength
      ? extension.description.slice(0, maxDescriptionLength).trim() + "..."
      : extension.description

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: "#1a1412",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Inter",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            marginBottom: "40px",
          }}
        >
          <img
            src={logoBase64}
            width="300"
            height="35"
            alt="opencode.cafe"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Type Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: "#1a1412",
              background: "#c4a67a",
              padding: "6px 16px",
              borderRadius: "4px",
              fontWeight: 600,
            }}
          >
            {typeInfo?.label || extension.type}
          </div>
        </div>

        {/* Extension Name */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 600,
            color: "#f5f0eb",
            lineHeight: 1.2,
            marginBottom: "20px",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {extension.displayName}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "26px",
            color: "#a89080",
            lineHeight: 1.5,
            maxWidth: "900px",
          }}
        >
          {description}
        </div>

        {/* Author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: "32px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: "#6b5d55",
            }}
          >
            by {extension.author.name}
          </div>
        </div>

        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "#c4a67a",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          style: "normal",
          weight: 600,
        },
      ],
    }
  )
}
