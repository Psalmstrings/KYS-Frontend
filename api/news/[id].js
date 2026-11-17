export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const backendApi = process.env.VITE_API || "https://blogbackend-xzrv.onrender.com/api";
    const response = await fetch(`${backendApi}/news/${id}`);

    if (!response.ok) {
      return res.status(404).send("Article not found");
    }

    const news = await response.json();

    const title = news.title ? `${news.title} | NANS Southwest Zone D` : "NANS Southwest Zone D — Office of the PRO";
    const rawDesc = news.content ? news.content.replace(/<[^>]*>?/gm, "").slice(0, 180) + "..." : "Latest update from the Office of the PRO, NANS Southwest Zone D.";
    const description = rawDesc.replace(/"/g, "&quot;");
    const canonicalUrl = `https://officeoftheprozoned.com/news/${news._id || id}`;

    let imageUrl = news.coverImage || "https://res.cloudinary.com/dd5p5t2rs/image/upload/v1773514865/blog_images/pd3q0fe4cnvj4pr5yr1i.jpg";
    if (!imageUrl.startsWith("http")) {
      imageUrl = `https://officeoftheprozoned.com/${imageUrl}`;
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="NANS Southwest Zone D — Office of the PRO" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title}" />
  <meta property="og:url" content="${canonicalUrl}" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <!-- Instant redirect for normal visitors who might land on this endpoint directly -->
  <meta http-equiv="refresh" content="0;url=${canonicalUrl}" />
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <img src="${imageUrl}" alt="${title}" />
  <p><a href="${canonicalUrl}">Continue to article</a></p>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
    return res.status(200).send(html);
  } catch (error) {
    console.error("Vercel OG Handler Error:", error);
    return res.redirect(`https://officeoftheprozoned.com/news/${id}`);
  }
}
