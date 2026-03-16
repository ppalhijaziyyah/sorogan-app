export async function onRequest(context) {
  const url = new URL(context.request.url);
  const userAgent = context.request.headers.get('User-Agent') || '';
  
  // Basic bot detection to only apply to social media scrapers
  const isBot = /bot|facebook|whatsapp|telegram|twitter|linkedin|skype/i.test(userAgent);

  // Fetch the original response (the index.html from static assets)
  const response = await context.next();
  
  // If not a bot or not an HTML response, just return the response directly
  const contentType = response.headers.get('content-type') || '';
  if (!isBot || !contentType.includes('text/html')) {
    return response;
  }

  // Define default meta
  let title = "Sorogan - Belajar Membaca Kitab Kuning";
  let description = "Aplikasi Belajar Membaca dan Memahami Teks Arab Gundul";
  let imageUrl = `${url.origin}/thumbnail_home.png`;

  // Check if the URL is a lesson page (e.g., /belajar/2-pasal-rukun-islam/1-utama)
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  if (pathParts[0] === 'belajar' && pathParts.length >= 3) {
    let rawSlug = pathParts[2];
    
    // Clean up the slug (e.g., "2-pasal-rukun-islam" -> "pasal rukun islam")
    let cleanSlug = rawSlug.replace(/^\d+-/, '').replace(/-/g, ' ');
    
    // Capitalize words
    cleanSlug = cleanSlug.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    title = `Sorogan App: ${cleanSlug}`;
    imageUrl = `${url.origin}/thumbnail_chapter.png`;
  } else if (pathParts[0] === 'sponsors') {
    title = "Dukung Kami - Sorogan";
  } else if (pathParts[0] === 'how-to-use') {
    title = "Panduan Membaca - Sorogan";
  }

  // Use HTMLRewriter to inject/modify the meta tags
  return new HTMLRewriter()
    .on('head', new MetaTagInjector(title, description, imageUrl, url.href))
    .transform(response);
}

class MetaTagInjector {
  constructor(title, description, image, url) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.url = url;
  }

  element(element) {
    // Append new meta tags. (We inject them at the end of <head>.
    // They will override the default ones or just be used by bots since they read the first/last depending on platform,
    // usually HTMLRewriter appending ensures they are seen. To be safer, we can just append, but robots usually pick up standard tags.)
    element.append(`\n    <meta property="og:url" content="${this.url}" />`, { html: true });
    element.append(`\n    <meta property="og:title" content="${this.title}" />`, { html: true });
    element.append(`\n    <meta property="og:description" content="${this.description}" />`, { html: true });
    element.append(`\n    <meta property="og:image" content="${this.image}" />`, { html: true });
    
    element.append(`\n    <meta name="twitter:url" content="${this.url}" />`, { html: true });
    element.append(`\n    <meta name="twitter:title" content="${this.title}" />`, { html: true });
    element.append(`\n    <meta name="twitter:description" content="${this.description}" />`, { html: true });
    element.append(`\n    <meta name="twitter:image" content="${this.image}" />`, { html: true });
  }
}
