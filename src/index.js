// Worker voor etenbijdaan.nl (assets-only site met host-canonicalisatie).
//
// De site draait op zes hostnames (etenbijdaan.nl, etenvandaan.nl,
// etenmetdaan.nl, elk met en zonder www). etenbijdaan.nl is het canonieke
// domein. Alle andere hosts krijgen een permanente 301 naar etenbijdaan.nl
// met behoud van pad en query, zodat er geen duplicate content ontstaat.
//
// Onbekende paden worden door de assets-binding afgehandeld met
// not_found_handling = "404-page": dan komt public/404.html terug met een
// echte HTTP 404 in plaats van de homepage met status 200 (geen soft 404).

const CANONICAL_HOST = "etenbijdaan.nl";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname.toLowerCase() !== CANONICAL_HOST) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
