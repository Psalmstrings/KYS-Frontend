export default async function handler(req, res) {
  // Extract ID from query parameter or raw URL path
  let id = req.query?.id;
  if (!id && req.url) {
    const cleanUrl = req.url.split("?")[0];
    const segments = cleanUrl.split("/").filter(Boolean);
    id = segments[segments.length - 1];
  }

  if (!id || id === "undefined" || id === "[id]") {
    return res.redirect("https://officeoftheprozoned.com/headlines");
  }

  try {
    const backendApi = (process.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api")
      .trim()
      .replace(/\/$/, "");

    let response = await fetch(`${backendApi}/news/${id}`);
    if (!response.ok) {
      response = await fetch(`https://blogbackend-xzrv.onrender.com/api/news/${id}`);
    }

    if (!response.ok) {
      return res.redirect(`https://officeoftheprozoned.com/news/${id}`);
    }

    const data = await response.json();
    const news = data.news || data;

    const rawTitle = news.title ? `${news.title} — NANS Southwest Zone D` : "NANS Southwest Zone D — Office of the PRO";
    const cleanTitle = rawTitle.replace(/"/g, "&quot;").replace(/[\r\n]+/g, " ").trim();

    // Clean plain text description
    let rawDesc = news.content 
      ? news.content.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim() 
      : "Official press statement and student update from the Office of the PRO, NANS Southwest Zone D.";
    
    if (rawDesc.length > 200) {
      rawDesc = rawDesc.slice(0, 197) + "...";
    }
    const cleanDescription = rawDesc.replace(/"/g, "&quot;");

    const canonicalUrl = `https://officeoftheprozoned.com/news/${news._id || id}`;

    // Optimal Cloudinary Image for WhatsApp & Facebook (1200x630 JPEG, < 300KB)
    let imageUrl = news.coverImage || "https://res.cloudinary.com/dd5p5t2rs/image/upload/v1773514865/blog_images/pd3q0fe4cnvj4pr5yr1i.jpg";
    imageUrl = imageUrl.trim().replace(/^http:\/\//, "https://");
    
    let socialImageUrl = imageUrl;
    if (imageUrl.includes("res.cloudinary.com") && imageUrl.includes("/upload/")) {
      if (!imageUrl.includes("c_fill")) {
        socialImageUrl = imageUrl.replace("/upload/", "/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/");
      }
    }

    const publishedDate = news.createdAt ? new Date(news.createdAt).toISOString() : new Date().toISOString();

    const html = `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns# article: https://ogp.me/ns/article#">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${cleanTitle}</title>
  <meta name="description" content="${cleanDescription}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph / WhatsApp / Facebook / LinkedIn / Telegram -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="NANS Southwest Zone D — Office of the PRO" />
  <meta property="og:title" content="${cleanTitle}" />
  <meta property="og:description" content="${cleanDescription}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="${socialImageUrl}" />
  <meta property="og:image:secure_url" content="${socialImageUrl}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${cleanTitle}" />
  <meta property="article:published_time" content="${publishedDate}" />
  <meta property="article:section" content="Student Leadership & Press" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@NansZoneD" />
  <meta name="twitter:creator" content="@NansZoneD" />
  <meta name="twitter:domain" content="officeoftheprozoned.com" />
  <meta name="twitter:title" content="${cleanTitle}" />
  <meta name="twitter:description" content="${cleanDescription}" />
  <meta name="twitter:image" content="${socialImageUrl}" />
  <meta name="twitter:image:alt" content="${cleanTitle}" />

  <!-- Structured Data JSON-LD for Search Engines -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "${cleanTitle}",
    "image": ["${socialImageUrl}"],
    "datePublished": "${publishedDate}",
    "description": "${cleanDescription}",
    "mainEntityOfPage": "${canonicalUrl}",
    "publisher": {
      "@type": "Organization",
      "name": "NANS Southwest Zone D - Office of the PRO",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/dd5p5t2rs/image/upload/v1773514865/blog_images/pd3q0fe4cnvj4pr5yr1i.jpg"
      }
    }
  }
  </script>

  <!-- Instant Browser Redirect (for humans clicking direct link; crawlers ignore this) -->
  <meta http-equiv="refresh" content="0;url=${canonicalUrl}" />
  <script>
    if (typeof window !== "undefined") {
      window.location.replace("${canonicalUrl}");
    }
  </script>
</head>
<body style="font-family: system-ui, sans-serif; padding: 40px; text-align: center; background: #f8fafc; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <h1 style="font-size: 1.4rem; color: #052e16; margin-bottom: 16px;">${cleanTitle}</h1>
    <img src="${socialImageUrl}" alt="${cleanTitle}" style="max-width: 100%; height: auto; border-radius: 10px; margin-bottom: 16px;" />
    <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">${cleanDescription}</p>
    <a href="${canonicalUrl}" style="display: inline-block; background: #15803d; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
      Continue Reading on Official Portal →
    </a>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=86400");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Vercel Social SSR Error:", error);
    return res.redirect(`https://officeoftheprozoned.com/news/${id}`);
  }
}
