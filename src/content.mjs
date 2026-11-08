// Contenu éditorial du site (tout en français). Chaque page = une intention de recherche.
export const site = {
  name: 'Aaction Dem',
  legalName: 'AACTION DEM',
  legal: {
    form: 'SASU (société par actions simplifiée unipersonnelle) au capital de 20 000 €',
    siren: '378 031 553', siret: '378 031 553 00076', rcs: 'RCS Thionville 378 031 553', vat: 'FR62 378 031 553', naf: '49.42Z – Services de déménagement',
    director: 'Olivier Goepfert, président',
    host: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis', url: 'https://pages.github.com' },
    mediator: { name: 'MEDICYS – Centre de médiation et de règlement amiable des huissiers de justice', address: '73, boulevard de Clichy, 75009 Paris', url: 'https://www.medicys.fr', email: 'contact@medicys.fr' }
  },
  url: process.env.SITE_URL || 'https://www.aaction-dem.com',
  // Indexation par les moteurs de recherche. false = toutes les pages en « noindex, nofollow » (site en préparation).
  // Passer à true (ou SITE_INDEXABLE=1) uniquement pour la mise en ligne définitive.
  indexable: process.env.SITE_INDEXABLE === '1',
  phone: '+33 3 82 85 49 43',
  phoneDisplay: '03 82 85 49 43',
  email: 'contact@aaction-dem.com',
  // Endpoint du formulaire. Netlify Forms par défaut ; remplacez par Formspree, Getform, votre CRM…
  formAction: process.env.FORM_ACTION || '/merci/',
  sameAs: [
    'https://www.instagram.com/aactiondem/',
    'https://www.facebook.com/profile.php?id=100089757685866',
    'https://www.linkedin.com/company/aaction-dem/'
  ],
  social: [
    { name: 'Instagram', href: 'https://www.instagram.com/aactiondem/' },
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=100089757685866' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/aaction-dem/' }
  ],
  agencies: [
    {
      id: 'knutange', city: 'Knutange', name: 'Aaction Dem Knutange',
      street: '277 rue Victor Rimmel', zip: '57240', region: 'Moselle',
      hoursText: 'Lun–Ven : 08:45–12:00, 14:00–17:30',
      hours: [{ days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:45', closes: '12:00' },
              { days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '14:00', closes: '17:30' }],
      geo: { lat: 49.34286, lng: 6.02432 },
      maps: 'https://www.google.com/maps?cid=695856019348081141'
    },
    {
      id: 'metz', city: 'Metz', name: 'Aaction Dem Metz',
      street: '7 rue de Queuleu, entrée 2', zip: '57070', region: 'Moselle',
      hoursText: 'Accueil sur rendez-vous uniquement',
      hours: [],
      geo: { lat: 49.11088, lng: 6.18801 },
      maps: 'https://www.google.com/maps?cid=3373078021547382005'
    }
  ],
  areaServed: ['Moselle', 'Metz', 'Thionville', 'Knutange', 'Hayange', 'Fameck', 'Florange', 'Yutz', 'Hagondange', 'Woippy', 'Montigny-lès-Metz', 'Luxembourg', 'Lorraine', 'France']
};

export const nav = [
  { href: '/particulier/', label: 'Particulier', children: [
    { href: '/demenagement-metz/', label: 'Déménagement Metz' },
    { href: '/demenagement-thionville/', label: 'Déménagement Thionville' },
    { href: '/demenagement-knutange/', label: 'Déménagement Knutange' },
    { href: '/demenagement-longwy/', label: 'Déménagement Longwy' },
    { href: '/demenagement-luxembourg/', label: 'Déménagement Luxembourg' }
  ] },
  { href: '/services-demenagement/', label: 'Services', children: [
    { href: '/entreprise/', label: 'Entreprise' },
    { href: '/garde-meuble/', label: 'Garde-meuble' },
    { href: '/monte-meubles-demenagement/', label: 'Monte-meubles' },
    { href: '/demenagement-piano/', label: 'Déménagement de piano' },
    { href: '/vente-materiel-demenagement/', label: 'Vente de matériel' }
  ] },
  { href: '/formules-demenagement/', label: 'Formules' },
  { href: '/avis/', label: 'Avis' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/qui-sommes-nous/', label: 'Équipe' },
  { href: '/contact/', label: 'Contact' }
];

export const services = [
  { href: '/particulier/', img: 'particulier', title: 'Déménagement pour particuliers', text: 'Démontage, emballage, transport, remontage : une équipe dédiée de A à Z.' },
  { href: '/entreprise/', img: 'entreprise', title: 'Déménagement pour entreprises', text: 'Transfert de bureaux, archives, matériel informatique et équipements industriels.' },
  { href: '/garde-meuble/', img: 'garde-meuble', title: 'Service de garde-meuble', text: 'Stockage sécurisé de vos biens, pour quelques semaines ou plusieurs mois.' },
  { href: '/monte-meubles-demenagement/', img: 'monte-meuble', title: 'Location monte-meuble', text: 'Service rapide, sécurisé et accessible aux particuliers comme aux pros.' }
];

export const formules = [
  { id: 'mobilier-seul', title: 'Mobilier seul', icon: 'wardrobe', text: 'Nous protégeons, transportons et remettons en place vos meubles et votre électroménager. Vous gérez vos cartons.' },
  { id: 'dynamic-plus', title: 'Dynamic +', icon: 'tools', text: 'Meubles et cartons : vous emballez à votre rythme, nous transportons tout.' },
  { id: 'comfort', title: 'Comfort', icon: 'box', text: 'Nous emballons et déballons le fragile (vaisselle, verres, bibelots), vous préparez le reste.' },
  { id: 'comfort-plus', title: 'Comfort +', icon: 'truck', text: 'Clé en main : nous emballons tout et déballons le fragile. Déballage du non-fragile en option.' }
];

export const reviews = [
  { name: 'Amandine Mazzoni', text: 'Un très grand merci à Arnaud & Etienne qui ont effectué notre déménagement vers Chamonix ! Ponctuels, efficaces, dynamiques et super sympathiques !! On gardera un très bon souvenir de cet emménagement dont ils font partie, et nous recommandons les yeux fermés !! MERCI !' },
  { name: 'Brian Kessler', text: 'Romain, Batiste, Fabio et Evan sont venus réaliser mon déménagement. Que dire, super équipe, très professionnelle, tout s’est passé dans la bonne humeur.' },
  { name: 'Nathalie Boivin', text: 'Je viens de déménager et j’ai fait appel aux Gentlemen du Déménagement à Knutange. Je recommande vivement cette entreprise pour toutes les personnes qui souhaitent déménager sans stress et dans la bonne humeur. Encore un très grand merci et bravo à toute l’équipe.' },
  { name: 'Franca Catania', text: 'Cham et Stéphane ont été des déménageurs exceptionnels pour un déménagement de la Lorraine vers la Bretagne : courtois, professionnels, efficaces, très humains et à l’écoute. On recommande chaudement leur service.' },
  { name: 'Lola Couyras', text: 'Professionnelle, soignée et sympathique, en plus je recommande.' },
  { name: 'Marion Pocecco', text: 'Un immense merci à Aaction Dem Knutange pour notre déménagement qui s’est déroulé à la perfection, malgré des conditions météo compliquées avec la neige. Équipe ponctuelle, efficace, soigneuse et très professionnelle.' },
  { name: 'Giusz', text: 'Au top ! Déménagement sans encombre et personnel très aimable !' },
  { name: 'Johana Hollet', text: 'Déménagement rapide et sans problème. Je recommande.' },
  { name: 'Léo', text: 'Un déménagement sous la neige qui s’est fait de façon parfaite. Une équipe formidable et très à l’écoute. Je recommande vraiment.' },
  { name: 'Olivier Brocker', text: 'Équipe très sympathique et très efficace, tout s’est super bien passé.' },
  { name: 'Blondy80', text: 'Très satisfait, personnel au top, je recommanderais fortement.' },
  { name: 'Thibaut', text: 'Équipe au top. Le déménagement s’est parfaitement bien déroulé.' },
  { name: 'Adeline Couriot', text: 'Expérience très professionnelle, le déménagement s’est très bien passé, aucun dégât constaté et personnel très sympathique, je recommande fortement.' },
  { name: 'Michaël Brausewetter', text: 'Je recommande ces déménageurs à 100 % ! Malgré les intempéries, ils ont su tout gérer avec professionnalisme et efficacité. L’équipe est ponctuelle, organisée et très soigneuse avec les meubles. Le tout dans une excellente ambiance, ce qui rend le déménagement beaucoup moins stressant. Merci pour votre sérieux et votre gentillesse.' },
  { name: 'Alexandra Weyland', text: 'Merci à l’ensemble de l’équipe qui a réalisé notre déménagement le 22 octobre. Tout a été fait dans les temps et proprement, avec démontage et remontage de meubles et beaucoup de marches d’escalier dans les jambes. Un grand merci également aux deux dames de l’accueil qui m’ont très agréablement reçu aussi bien sur place que lors d’appels téléphoniques. Je recommande vivement.' },
  { name: 'Miniver', text: 'Romain, Étienne et Xavier au top pour mon déménagement. Ponctuels, très professionnels, je recommande sans problème.' },
  { name: 'Virginie Burger', text: 'Service complet du début à la fin. Équipe chaleureuse et compétente. Je recommande fortement !' },
  { name: 'Anaïs U.', text: 'Super service. Efficacité, cordialité, professionnalisme, au top ! Xavier, Gabriel, Étienne, le chef d’équipe, et désolée pour ceux que j’ai oubliés.' },
  { name: 'L. Helias', text: 'Un déménagement rapide et soigné avec une équipe sympa, souriante et dynamique ! Une équipe qui s’adapte aux demandes du client à tout moment ! Merci beaucoup.' },
  { name: 'Hub Dout', text: 'Très bon déménagement, rapide et bien fait… et sympathique équipe.' }
];

export const partners = [
  { name: 'Groupama', logo: 'groupama' }, { name: 'MAIF', logo: 'maif' }, { name: 'MMA', logo: 'mma' },
  { name: 'Crédit Mutuel', logo: 'credit-mutuel' }, { name: 'Orpi', logo: 'orpi' }, { name: 'Crédit Agricole', logo: 'credit-agricole' },
  { name: 'Direct Assurance', logo: 'direct-assurance' }, { name: 'Visa Premier', logo: 'visa-premier' }
];

// ---------------------------------------------------------------------------
// FAQ globale (réutilisée sur /faq/ et en partie sur l'accueil)
export const faqGeneral = [
  { cat: 'prix', q: 'Combien coûte un déménagement en Moselle ?', a: '<p>Le prix dépend principalement du volume à déménager (en m³), de la distance, de l’accessibilité des logements (étage, ascenseur, distance de portage) et de la formule choisie. À titre indicatif, un studio en local se chiffre en quelques centaines d’euros, une maison familiale en formule complète davantage. Le plus fiable est de <a href="/contact/">demander un devis gratuit</a> : nous évaluons votre volume par visite technique ou en visio et vous remettons un prix ferme.</p>' },
  { cat: 'organisation', q: 'Combien de temps à l’avance faut-il réserver son déménageur ?', a: '<p>Idéalement 4 à 8 semaines avant la date souhaitée, et 2 à 3 mois pour un déménagement en été (juin à septembre) ou en fin de mois, périodes les plus demandées. Nous pouvons néanmoins traiter des demandes urgentes selon nos disponibilités.</p>' },
  { cat: 'assurance', q: 'Mes biens sont-ils assurés pendant le déménagement ?', a: '<p>Oui. Tous les déménagements réalisés par Aaction Dem sont couverts par une assurance responsabilité contractuelle. Vous déclarez la valeur de votre mobilier lors de la signature du devis et, grâce au réseau Les Gentlemen du Déménagement, vous pouvez bénéficier d’une assurance renforcée (ad valorem).</p>' },
  { cat: 'zones', q: 'Déménagez-vous partout en France et à l’étranger ?', a: '<p>Oui. En plus de nos interventions quotidiennes en Moselle et au Luxembourg, nous organisons des déménagements dans toute la France et à l’international grâce au réseau Les Gentlemen du Déménagement, qui regroupe plus de 70 déménageurs sélectionnés.</p>' },
  { cat: 'services', q: 'Proposez-vous des cartons et du matériel d’emballage ?', a: '<p>Oui, nous fournissons cartons standards, cartons livres, penderies, papier bulle et adhésif. Ils sont livrés avant le jour J. Avec les formules Comfort et Comfort +, nos équipes se chargent elles-mêmes de l’emballage.</p>' },
  { cat: 'demarches', q: 'Faut-il une autorisation de stationnement pour le camion ?', a: '<p>Dans la plupart des communes, une autorisation de stationnement est nécessaire pour réserver l’emplacement du camion devant votre logement. Nous pouvons nous charger de cette démarche auprès de la mairie pour vous.</p>' },
  { cat: 'services', q: 'Peut-on stocker ses meubles entre deux logements ?', a: '<p>Bien sûr. Notre <a href="/garde-meuble/">service de garde-meuble</a> permet de stocker vos biens en conteneurs fermés, dans un entrepôt sécurisé, pour la durée de votre choix.</p>' },
  { cat: 'demarches', q: 'Le déménagement est-il déductible ou aidé ?', a: '<p>Selon votre situation, des aides existent : prime de déménagement de la CAF (familles nombreuses), aide Mobili-Pass d’Action Logement pour une mobilité professionnelle, prise en charge par l’employeur… Les entreprises peuvent également passer leurs frais de transfert en charges. Nous vous remettons tous les justificatifs nécessaires.</p>' },
  { cat: 'prix', q: 'Le devis est-il gratuit et sans engagement ?', a: '<p>Oui. La visite technique et le devis sont entièrement gratuits et ne vous engagent à rien. Vous recevez un devis écrit et détaillé, que vous êtes libre d’accepter ou non.</p>' },
  { cat: 'prix', q: 'Comment est calculé le volume de mon déménagement ?', a: '<p>Le volume s’exprime en mètres cubes (m³). Un conseiller l’estime pièce par pièce lors de la visite technique, à domicile ou en visio, en tenant compte des meubles, des cartons et des objets volumineux. Cette estimation sert de base au devis et permet de prévoir le bon camion et la bonne équipe.</p>' },
  { cat: 'prix', q: 'Le prix du devis peut-il changer le jour du déménagement ?', a: '<p>Le prix indiqué sur le devis signé est ferme pour les prestations et le volume décrits. Il ne peut évoluer que si les conditions changent : volume nettement supérieur, accès différent de celui annoncé, prestations ajoutées à votre demande. D’où l’intérêt de bien tout signaler lors de la visite.</p>' },
  { cat: 'prix', q: 'Qu’est-ce qui fait varier le prix d’un déménagement ?', a: '<p>Cinq critères principaux : le volume, la distance entre les deux logements, l’accessibilité (étage, ascenseur, distance de portage, stationnement), la formule choisie et la période. Les fins de mois, les week-ends et l’été sont les dates les plus demandées.</p>' },
  { cat: 'prix', q: 'Comment payer moins cher son déménagement ?', a: '<p>Faites le tri avant la visite technique pour réduire le volume, choisissez une formule où vous emballez vous-même vos cartons (Mobilier seul ou Dynamic +) et, si vous le pouvez, privilégiez un jour de semaine en milieu de mois, hors période estivale.</p>' },
  { cat: 'prix', q: 'Puis-je obtenir un devis rapidement ?', a: '<p>Oui. Remplissez notre <a href="/contact/">formulaire de devis</a> ou appelez le 03 82 85 49 43 : nous revenons vers vous rapidement pour organiser la visite technique. Pour un petit volume, une visite en visio permet souvent d’aller plus vite.</p>' },
  { cat: 'organisation', q: 'Comment se passe la visite technique ?', a: '<p>Un conseiller fait le tour de votre logement avec vous, à domicile ou en visio. Il note les meubles, estime le volume, repère les objets fragiles ou lourds et vérifie les accès (étages, ascenseur, stationnement). Comptez généralement 20 à 45 minutes selon la taille du logement.</p>' },
  { cat: 'organisation', q: 'Par où commencer pour préparer son déménagement ?', a: '<p>Commencez par trier : ce que vous gardez, vendez, donnez ou jetez. Demandez ensuite vos devis, fixez la date, puis préparez les cartons pièce par pièce en commençant par ce qui sert le moins (livres, décoration, vêtements hors saison). Gardez les affaires du quotidien pour la fin.</p>' },
  { cat: 'organisation', q: 'Comment étiqueter ses cartons ?', a: '<p>Indiquez sur le dessus et sur un côté la pièce de destination et le contenu principal. Ajoutez la mention « fragile » et le sens « haut » quand c’est nécessaire. Numéroter les cartons et tenir une liste aide à vérifier que tout est bien arrivé.</p>' },
  { cat: 'organisation', q: 'Que faut-il garder avec soi le jour du déménagement ?', a: '<p>Préparez un sac avec vos papiers importants, vos bijoux et objets de valeur, vos médicaments, chargeurs, clés, un nécessaire de toilette et de quoi passer la première nuit. Les objets de valeur et les documents personnels voyagent de préférence avec vous.</p>' },
  { cat: 'organisation', q: 'Faut-il vider les meubles avant le déménagement ?', a: '<p>Oui, il est préférable de vider les commodes, armoires et bibliothèques : un meuble plein est plus lourd, plus fragile et risque de se déformer. Le linge peut être placé dans des cartons ou des penderies pour les vêtements sur cintres.</p>' },
  { cat: 'organisation', q: 'Comment préparer le réfrigérateur et le lave-linge ?', a: '<p>Débranchez et dégivrez le réfrigérateur et le congélateur la veille, videz-les et laissez-les ouverts pour éviter les odeurs. Pour le lave-linge, videz l’eau résiduelle ; la bride de transport, si vous l’avez conservée, protège le tambour pendant le trajet.</p>' },
  { cat: 'organisation', q: 'Comment déménager avec des enfants ou des animaux ?', a: '<p>Le jour J, l’idéal est de confier les jeunes enfants et les animaux à un proche ou de les installer dans une pièce au calme, à l’écart des allées et venues. Préparez un carton « première nuit » avec leurs affaires préférées pour faciliter l’arrivée dans le nouveau logement.</p>' },
  { cat: 'jour', q: 'Comment se déroule le jour du déménagement ?', a: '<p>L’équipe arrive à l’heure convenue, fait le point avec vous, protège les meubles et les passages, démonte ce qui doit l’être puis charge le camion de façon organisée. À l’arrivée, les meubles sont déposés dans les pièces indiquées et remontés selon la formule choisie.</p>' },
  { cat: 'jour', q: 'Faut-il prévoir quelque chose pour l’équipe ?', a: '<p>Rien d’obligatoire. Il suffit de libérer les accès, de prévoir une place pour le camion et d’être joignable. Indiquez à l’équipe, à l’arrivée, l’emplacement de chaque meuble dans le nouveau logement : cela fait gagner beaucoup de temps.</p>' },
  { cat: 'jour', q: 'Que se passe-t-il s’il pleut ou s’il neige ?', a: '<p>Le déménagement a lieu par tous les temps. Nos équipes protègent les meubles sous housses et couvertures, et les cartons sont chargés rapidement. Seule l’utilisation du monte-meuble peut être reportée en cas de vent fort, pour des raisons de sécurité.</p>' },
  { cat: 'jour', q: 'Que faire si un objet est abîmé pendant le déménagement ?', a: '<p>Signalez-le dès la livraison sur la lettre de voiture, en décrivant précisément le dommage, puis confirmez par écrit dans les délais indiqués. Les dommages sont pris en charge selon les conditions de l’assurance choisie.</p>' },
  { cat: 'jour', q: 'Combien de déménageurs viennent le jour J ?', a: '<p>Le nombre de déménageurs dépend du volume, des accès et de la formule. Il est défini lors de la visite technique et indiqué sur votre devis, afin que le déménagement se fasse dans les temps prévus.</p>' },
  { cat: 'assurance', q: 'Quelle est la différence entre la responsabilité contractuelle et l’assurance ad valorem ?', a: '<p>La responsabilité contractuelle est incluse dans tout déménagement : elle couvre vos biens dans les limites prévues par les conditions générales. L’assurance ad valorem est une garantie renforcée calculée sur la valeur que vous déclarez, recommandée pour le mobilier de valeur ou les objets précieux.</p>' },
  { cat: 'assurance', q: 'Qu’est-ce que la déclaration de valeur ?', a: '<p>C’est le document où vous indiquez la valeur globale de votre mobilier et, séparément, celle des objets de valeur. Elle détermine le niveau d’indemnisation en cas de dommage : remplissez-la avec soin au moment de la signature du devis.</p>' },
  { cat: 'assurance', q: 'Mes objets fragiles sont-ils assurés si je les emballe moi-même ?', a: '<p>Les cartons que vous préparez vous-même sont transportés avec le même soin, mais en cas de casse à l’intérieur d’un carton fermé par vos soins, la prise en charge peut être limitée. Pour la vaisselle et les objets délicats, les formules Comfort et Comfort + confient l’emballage à nos équipes.</p>' },
  { cat: 'services', q: 'Quelles formules de déménagement proposez-vous ?', a: '<p>Quatre formules : <strong>Mobilier seul</strong> (nous transportons les meubles, vous gérez les cartons), <strong>Dynamic +</strong> (meubles et cartons, vous emballez), <strong>Comfort</strong> (nous emballons et déballons le fragile) et <strong>Comfort +</strong> (clé en main). <a href="/formules-demenagement/">Comparez les formules</a>.</p>' },
  { cat: 'services', q: 'Démontez-vous et remontez-vous les meubles ?', a: '<p>Oui. Le démontage et le remontage du mobilier courant (lits, armoires, tables) sont assurés par nos équipes, qui disposent de l’outillage adapté. Précisez lors de la visite les meubles concernés, notamment les meubles en kit ou volumineux.</p>' },
  { cat: 'services', q: 'Déménagez-vous les objets lourds et encombrants ?', a: '<p>Oui : pianos, coffres-forts, armoires massives, électroménager… Ils nécessitent du matériel et parfois une équipe renforcée. Pour les pianos, consultez notre page <a href="/demenagement-piano/">déménagement de piano</a>.</p>' },
  { cat: 'services', q: 'Quand faut-il un monte-meuble ?', a: '<p>Le monte-meuble est utile quand un meuble ne passe pas par l’escalier, quand il n’y a pas d’ascenseur à partir de quelques étages, ou pour gagner du temps et protéger les parties communes. Découvrez notre <a href="/monte-meubles-demenagement/">service de monte-meuble</a>.</p>' },
  { cat: 'services', q: 'Déménagez-vous aussi les entreprises ?', a: '<p>Oui. Bureaux, commerces, cabinets : nous organisons les transferts professionnels avec un planning adapté pour limiter l’interruption de votre activité. Voir notre page <a href="/entreprise/">déménagement d’entreprise</a>.</p>' },
  { cat: 'services', q: 'Puis-je acheter des cartons sans faire appel à vos déménageurs ?', a: '<p>Oui. Nous vendons cartons, adhésif, papier bulle et matériel d’emballage aux particuliers, même sans déménagement réservé. Voir notre page <a href="/vente-materiel-demenagement/">vente de matériel de déménagement</a>.</p>' },
  { cat: 'demarches', q: 'Quelles démarches faire avant de déménager ?', a: '<p>Prévenez votre propriétaire (préavis), résiliez ou transférez énergie, internet et assurance habitation, faites suivre votre courrier et mettez à jour votre adresse auprès des organismes (impôts, CAF, banque, employeur, carte grise). Le service en ligne de l’administration permet de déclarer un changement d’adresse à plusieurs organismes en une fois.</p>' },
  { cat: 'demarches', q: 'Faut-il faire suivre son courrier ?', a: '<p>C’est conseillé : un contrat de réexpédition du courrier évite de perdre des lettres pendant les premiers mois, le temps que tous vos interlocuteurs aient votre nouvelle adresse.</p>' },
  { cat: 'demarches', q: 'Mon employeur peut-il prendre en charge mon déménagement ?', a: '<p>Dans le cadre d’une mutation ou d’une embauche, certains employeurs participent aux frais de déménagement. Renseignez-vous auprès de votre service RH : nous vous fournissons le devis et la facture nécessaires à votre dossier.</p>' },
  { cat: 'zones', q: 'Quelles sont vos zones d’intervention ?', a: '<p>Nous intervenons au quotidien en Moselle et dans le nord de la Lorraine, notamment à <a href="/demenagement-metz/">Metz</a>, <a href="/demenagement-thionville/">Thionville</a>, Knutange, <a href="/demenagement-longwy/">Longwy</a> et leurs environs, ainsi qu’au <a href="/demenagement-luxembourg/">Luxembourg</a>. Nous organisons aussi des déménagements partout en France et à l’étranger.</p>' },
  { cat: 'zones', q: 'Où se trouvent vos agences ?', a: '<p>Notre siège est à Knutange (277 rue Victor Rimmel, 57240), ouvert du lundi au vendredi. Notre agence de Metz (7 rue de Queuleu, entrée 2, 57070) vous reçoit sur rendez-vous. Voir la page <a href="/contact/">contact</a>.</p>' },
  { cat: 'zones', q: 'Faites-vous des déménagements longue distance ?', a: '<p>Oui. Grâce au réseau Les Gentlemen du Déménagement, nous organisons des déménagements de la Moselle vers toutes les régions de France, avec le même niveau de service qu’en local.</p>' }
];

// ---------------------------------------------------------------------------
// Pages « article » (services + pages locales). Champs :
// slug, title (<title>), description (meta), h1, kicker, lead, img, heroTheme, crumb, body(h), faq[], related[]
export const pages = [
  {
    slug: 'particulier', service: 'Déménagement de particuliers',
    title: 'Déménagement particulier en Moselle | Aaction Dem',
    description: 'Déménagement de particuliers à Metz, Thionville et en Moselle : démontage, emballage, transport et remontage par des pros. Devis gratuit sous 24 h.',
    h1: 'Déménagement pour particuliers en Moselle',
    kicker: 'Appartement, maison, studio étudiant',
    lead: 'Depuis plus de 30 ans, Aaction Dem accompagne les familles de Moselle, de Lorraine et du Luxembourg dans leurs déménagements, avec des équipes formées, du matériel professionnel et un interlocuteur unique du devis à la livraison.',
    img: 'famille-demenagement', crumb: 'Particuliers',
    body: (h) => `
<h2>Un déménagement sans stress, de A à Z</h2>
<p>Déménager reste l’un des moments les plus chargés d’une vie. Notre rôle : vous libérer de la logistique pour que vous puissiez vous concentrer sur l’essentiel. Que vous quittiez un appartement au 4<sup>e</sup> étage sans ascenseur à Metz ou une maison avec jardin à Thionville, nous adaptons l’équipe, le camion et le matériel à votre projet.</p>
<ul class="checks">
  <li><strong>Visite technique gratuite</strong> (à domicile ou en visio) pour évaluer précisément le volume.</li>
  <li><strong>Devis ferme et détaillé</strong>, sans frais cachés.</li>
  <li><strong>Fourniture des cartons</strong> et du matériel de protection.</li>
  <li><strong>Démontage et remontage</strong> des meubles, protection sous housses et couvertures.</li>
  <li><strong>Transport sécurisé</strong> dans des camions capitonnés équipés de hayon.</li>
  <li><strong>Assurance</strong> responsabilité contractuelle incluse, assurance renforcée possible.</li>
</ul>
${h.figure('emballage-protection', 'L’emballage du fragile est réalisé avec du papier de soie et des cartons double cannelure.')}
<h2>Comment se déroule votre déménagement ?</h2>
<ol class="steps">
  <li><strong>Demande de devis</strong> – Remplissez notre <a href="/contact/">formulaire de devis gratuit</a> ou appelez-nous au ${site.phoneDisplay}.</li>
  <li><strong>Évaluation du volume</strong> – Un conseiller estime le cubage et note les contraintes d’accès.</li>
  <li><strong>Choix de la formule</strong> – Mobilier seul, Dynamic +, Comfort ou Comfort + selon votre budget.</li>
  <li><strong>Préparation</strong> – Livraison des cartons, autorisation de stationnement si nécessaire.</li>
  <li><strong>Jour J</strong> – Chargement, transport et livraison dans votre nouveau logement.</li>
  <li><strong>Installation</strong> – Remontage des meubles et, en Comfort +, déballage de vos cartons.</li>
</ol>
${h.figure('visite-technique', 'La visite technique gratuite permet d’estimer précisément le volume et les contraintes d’accès.')}
<h2>Quel prix pour un déménagement de particulier ?</h2>
<p>Le tarif est calculé à partir de trois critères : le <strong>volume</strong> (en m³), la <strong>distance</strong> et les <strong>conditions d’accès</strong>. Voici des volumes moyens pour vous repérer :</p>
<table class="table">
  <thead><tr><th scope="col">Logement</th><th scope="col">Volume moyen</th><th scope="col">Équipe conseillée</th></tr></thead>
  <tbody>
    <tr><td>Studio / T1</td><td>10 à 15 m³</td><td>2 déménageurs</td></tr>
    <tr><td>T2 / T3</td><td>20 à 35 m³</td><td>2 à 3 déménageurs</td></tr>
    <tr><td>T4 / petite maison</td><td>40 à 55 m³</td><td>3 à 4 déménageurs</td></tr>
    <tr><td>Grande maison</td><td>60 m³ et plus</td><td>4 déménageurs et plus</td></tr>
  </tbody>
</table>
<p>Découvrez nos <a href="/formules-demenagement/">formules de déménagement</a> pour ajuster le niveau de service à votre budget.</p>
<h2>Une flotte et des services pour chaque projet</h2>
<p>Grâce à notre flotte de véhicules légers et de poids lourds, nous réalisons aussi bien un petit déménagement en centre-ville qu’un déménagement de maison vers l’autre bout de la France ou l’étranger. Selon vos besoins, nous ajoutons :</p>
<ul class="checks">
  <li>l’<strong>emballage</strong> complet ou seulement celui des objets fragiles ;</li>
  <li>le <strong>démontage et le remontage</strong> de vos meubles ;</li>
  <li>le <a href="/garde-meuble/">stockage</a> de courte ou de longue durée en Moselle ;</li>
  <li>la <strong>mise au rebut</strong> du mobilier dont vous souhaitez vous séparer ;</li>
  <li>le transport de vos objets lourds ou délicats, comme un <a href="/demenagement-piano/">piano</a>.</li>
</ul>
${h.figure('cartons-gentlemen', 'Cartons et matériel professionnels du réseau Les Gentlemen du Déménagement.')}
<h2>Déménageur local, réseau national</h2>
<p>Membre du réseau <strong>Les Gentlemen du Déménagement</strong>, Aaction Dem associe la proximité d’une entreprise familiale de Moselle à la force d’un groupement de plus de 70 déménageurs en France. Résultat : nous pouvons organiser votre déménagement de Metz vers Lyon, Bordeaux, Paris ou Chamonix avec le même niveau d’exigence.</p>`,
    faq: [
      { q: 'Dois-je être présent le jour du déménagement ?', a: '<p>Votre présence (ou celle d’une personne de confiance) est nécessaire au début du chargement et à la livraison, pour valider l’inventaire et indiquer l’emplacement des meubles.</p>' },
      { q: 'Que faire des objets de valeur ?', a: '<p>Nous vous conseillons de transporter vous-même bijoux, documents importants et espèces. Les objets d’art peuvent faire l’objet d’un emballage spécifique et d’une déclaration de valeur.</p>' },
      { q: 'Déménagez-vous aussi le week-end ?', a: '<p>Le samedi est possible sur demande, selon disponibilités. Contactez-nous pour en parler.</p>' },
      { q: 'Combien de temps dure un déménagement de particulier ?', a: '<p>En local, comptez une demi-journée pour un studio, une journée pour un T3 et une à deux journées pour une maison, selon la formule choisie et l’accès aux logements.</p>' },
      { q: 'Comment bien préparer mes cartons ?', a: '<p>Indiquez sur chaque carton la pièce de destination et son contenu, gardez les cartons sous 20 kg, placez les objets lourds (livres) dans de petits cartons et le fragile dans des cartons dédiés. Avec les formules Comfort et Comfort +, nos équipes emballent pour vous.</p>' },
      { q: 'Démontez-vous les meubles et l’électroménager ?', a: '<p>Oui, nos déménageurs démontent et remontent lits, armoires et meubles en kit. Pensez à débrancher et vider le réfrigérateur et le lave-linge la veille.</p>' }
    ],
    related: ['demenagement-metz', 'demenagement-thionville', 'demenagement-longwy', 'demenagement-luxembourg', 'formules-demenagement']
  },
  {
    slug: 'entreprise', service: 'Déménagement d’entreprises',
    title: 'Déménagement d’entreprise & bureaux | Aaction Dem',
    description: 'Déménagement d’entreprise en Moselle et au Luxembourg : bureaux, archives, informatique et matériel industriel, sans arrêt d’activité.',
    h1: 'Déménagement d’entreprises et transfert de bureaux',
    kicker: 'Bureaux, commerces, cabinets, industrie',
    lead: 'Un transfert de bureaux réussi, c’est un transfert qui ne se voit pas : vos équipes quittent leurs postes le vendredi et les retrouvent opérationnels le lundi. Aaction Dem planifie et exécute chaque étape avec un chef de projet dédié.',
    img: 'entreprise', crumb: 'Entreprises',
    body: (h) => `
<h2>Votre transfert professionnel en toute sérénité</h2>
<p>Bureaux, commerces, cabinets ou sites industriels : nous planifions chaque étape pour limiter l’impact sur votre activité. Un chef de projet réalise l’audit, établit le planning, coordonne les équipes et reste votre interlocuteur unique jusqu’à la réinstallation, en Moselle, en France comme à l’international.</p>
<h2>Six types de transferts</h2>
<h3>Transfert administratif</h3>
<p>Déménagement des bureaux et espaces de travail : mobilier, équipements et documents sont démontés, emballés, transportés et réinstallés poste par poste selon votre plan d’implantation.</p>
<h3>Transfert industriel</h3>
<p>Machines, équipements de production et charges lourdes : démontage, levage, transport sécurisé et réinstallation sur le nouveau site, en réduisant au maximum l’arrêt de production.</p>
<h3>Transfert informatique</h3>
<p>Serveurs, postes de travail, baies de stockage et équipements réseau sont conditionnés dans des emballages adaptés et transportés en toute sécurité.</p>
<h3>Transfert d’archives</h3>
<p>Tri, conditionnement, transport et réinstallation selon votre plan de classement, dans le respect de la confidentialité de vos documents. Stockage possible en <a href="/garde-meuble/">garde-meuble</a>.</p>
<h3>Déménagement de collaborateurs</h3>
<p>Nous accompagnons vos salariés mutés : transport de leurs effets personnels, aide aux formalités et soutien à l’installation dans leur nouvelle région ou leur nouveau pays.</p>
<h3>Matériel spécifique</h3>
<p>Machines de précision, instruments médicaux, matériel scientifique ou œuvres d’art : emballage sur mesure et installation dans le respect des exigences propres à chaque équipement.</p>
${h.figure('bureaux-entreprise', 'Un chef de projet prépare avec vous l’implantation de vos nouveaux bureaux.')}
<h2>Une méthode qui protège votre activité</h2>
<ul class="checks">
  <li><strong>Audit sur site</strong> et plan d’implantation dans les nouveaux locaux.</li>
  <li><strong>Étiquetage</strong> pièce par pièce et poste par poste.</li>
  <li><strong>Intervention en horaires décalés</strong> (soir, week-end).</li>
  <li><strong>Évacuation</strong> du mobilier inutile vers des filières de réemploi ou de recyclage.</li>
  <li>Démarche qualité et environnement <strong>ISO 9001 et ISO 14001</strong>, un atout pour vos appels d’offres.</li>
</ul>
<h2>Entreprises entre la France et le Luxembourg</h2>
<p>Implantés à Knutange et à Metz, nous accompagnons de nombreux transferts transfrontaliers vers Luxembourg-Ville, Esch-sur-Alzette ou Belval. Voir notre page <a href="/demenagement-luxembourg/">déménagement Luxembourg</a>.</p>`,
    faq: [
      { q: 'Combien de temps faut-il pour préparer un transfert de bureaux ?', a: '<p>Comptez 1 à 3 mois selon la taille de l’entreprise. Un audit précoce permet de bloquer les dates et de préparer l’implantation.</p>' },
      { q: 'Pouvez-vous déménager pendant le week-end ?', a: '<p>Oui, c’est même la solution que nous recommandons pour limiter l’impact sur votre activité.</p>' },
      { q: 'Proposez-vous la destruction d’archives ?', a: '<p>Nous pouvons organiser l’évacuation et la destruction certifiée de vos archives obsolètes via un partenaire agréé.</p>' },
      { q: 'Comment protégez-vous le matériel informatique ?', a: '<p>Postes, écrans et serveurs sont débranchés, étiquetés puis transportés dans des bacs fermés et rembourrés. À l’arrivée, chaque poste est réinstallé selon le plan d’implantation.</p>' },
      { q: 'Que faites-vous du mobilier de bureau usagé ?', a: '<p>Nous pouvons évacuer le mobilier dont vous n’avez plus besoin et l’orienter vers des filières de réemploi ou de recyclage, dans le cadre de notre démarche ISO 14001.</p>' },
      { q: 'Intervenez-vous pour les commerces et cabinets médicaux ?', a: '<p>Oui : commerces, cabinets médicaux et paramédicaux, études notariales, agences… Nous adaptons l’intervention à votre matériel spécifique et à vos horaires d’ouverture.</p>' }
    ],
    related: ['garde-meuble', 'monte-meubles-demenagement', 'demenagement-luxembourg']
  },
  {
    slug: 'garde-meuble', service: 'Garde-meubles',
    title: 'Garde-meubles sécurisé à Knutange et Metz | Aaction Dem',
    description: 'Garde-meubles en Moselle : stockage de vos meubles en conteneurs fermés dans un entrepôt sécurisé, courte ou longue durée. Devis gratuit.',
    h1: 'Garde-meubles et stockage sécurisé en Moselle',
    kicker: 'Courte ou longue durée',
    lead: 'Entre deux logements, pendant des travaux, une mutation ou une succession, confiez vos biens à notre garde-meuble : un entrepôt surveillé, des conteneurs fermés et un accès sur rendez-vous.',
    img: 'garde-meuble', crumb: 'Garde-meubles',
    body: (h) => `
<h2>Un garde-meuble surveillé 24h/24 et 7j/7</h2>
<p>Vente de votre maison, travaux, décalage entre deux logements, mutation : Aaction Dem met à votre disposition un centre de stockage sécurisé à <strong>Knutange</strong>, facilement accessible depuis Thionville, Metz et le Luxembourg. Nos espaces sont propres, secs, entretenus et placés sous <strong>vidéosurveillance active 24h/24 et 7j/7</strong>.</p>
<h2>Une solution adaptée à chaque volume</h2>
<ul class="checks">
  <li><strong>Caisses en bois</strong> fermées pour les petits volumes.</li>
  <li><strong>Conteneurs</strong> de grandes dimensions pour le contenu d’une maison.</li>
  <li><strong>Box de stockage</strong> de différentes tailles pour meubles, électroménager, cartons ou archives.</li>
  <li><strong>Conteneurs sur camion</strong> pour les stockages de très courte durée.</li>
</ul>
<p>Nous vous conseillons le format adapté à votre volume : vous ne payez que l’espace dont vous avez besoin, pour quelques semaines ou plusieurs mois.</p>
<h2>Pour qui ?</h2>
<p>Particuliers entre deux logements, familles en travaux, étudiants partis en stage ou à l’étranger, militaires en attente de logement, entreprises qui ont besoin d’un espace temporaire pour leur mobilier ou leurs archives.</p>
<h2>Le stockage intégré à votre déménagement</h2>
<p>Lors d’un déménagement à <a href="/demenagement-metz/">Metz</a>, à <a href="/demenagement-thionville/">Thionville</a> ou ailleurs en Moselle, nos équipes emballent, chargent et rangent vos biens dans leur conteneur, puis vous les relivrent à la date choisie. Vous évitez une double manutention et vos affaires restent protégées jusqu’à la remise des clés.</p>
<h2>Garde-meuble ou box en libre-service ?</h2>
<p>Contrairement à un self-stockage, le garde-meuble est un <strong>service tout compris</strong> : enlèvement, transport, rangement et relivraison sont assurés par nos déménageurs. Idéal si vous n’avez pas besoin d’accéder souvent à vos affaires.</p>
<h2>Combien coûte un garde-meuble ?</h2>
<p>Le prix dépend du <strong>volume</strong> à stocker, de la <strong>durée</strong>, de l’accessibilité souhaitée et des services associés (enlèvement, emballage, livraison). <a href="/contact/">Demandez votre devis garde-meuble</a> : nous vous répondons rapidement avec une offre claire.</p>
<h2>Où se trouve notre garde-meuble ?</h2>
<p><strong>277 rue Victor Rimmel, 57240 Knutange</strong> – accès simple en voiture, parking sur place, visite sur rendez-vous. Zones desservies : Metz, Thionville, Knutange, Yutz, Hayange, Fameck et toute la Moselle.</p>`,
    faq: [
      { q: 'Puis-je récupérer un objet pendant le stockage ?', a: '<p>Oui, sur rendez-vous, vous pouvez accéder à votre conteneur pour récupérer ou ajouter des affaires.</p>' },
      { q: 'Que ne peut-on pas stocker ?', a: '<p>Les denrées périssables, produits inflammables, explosifs, animaux et plantes sont interdits.</p>' },
      { q: 'Combien de temps puis-je stocker mes meubles ?', a: '<p>Aussi longtemps que nécessaire : d’un mois à plusieurs années. La facturation est mensuelle et vous récupérez vos biens à la date de votre choix.</p>' },
      { q: 'Mes biens sont-ils assurés pendant le stockage ?', a: '<p>Oui. Vos biens sont couverts pendant toute la durée du stockage, sur la base de la valeur que vous déclarez à l’entrée en garde-meuble.</p>' },
      { q: 'Comment se passe l’entrée en garde-meuble ?', a: '<p>Nos déménageurs emballent et chargent vos biens chez vous, les transportent jusqu’à l’entrepôt et les rangent dans un conteneur fermé. Un inventaire détaillé vous est remis.</p>' },
      { q: 'Où se trouve le garde-meuble ?', a: '<p>Les conteneurs sont stockés dans un entrepôt sécurisé en Moselle, à proximité de notre agence de Knutange, facilement accessible depuis Thionville, Metz et le Luxembourg.</p>' }
    ],
    related: ['particulier', 'entreprise']
  },
  {
    slug: 'monte-meubles-demenagement', service: 'Location de monte-meuble',
    title: 'Location monte-meuble avec opérateur – Moselle | Aaction Dem',
    description: 'Location de monte-meuble avec opérateur à Metz, Thionville et en Moselle : installation en 30 min, autorisations gérées, 7j/7 sur rendez-vous. Devis gratuit.',
    h1: 'Location de monte-meuble avec opérateur',
    kicker: 'Escalier étroit ? Pas d’ascenseur ?',
    lead: 'Le monte-meuble fait passer canapés, armoires et électroménager par la fenêtre ou le balcon, en toute sécurité. Moins d’efforts, moins de risques pour vos murs… et un gain de temps considérable.',
    img: 'monte-meuble', crumb: 'Monte-meuble',
    body: (h) => `
<h2>Un monte-meuble toujours livré avec son opérateur</h2>
<p>Besoin de monter ou de descendre des meubles encombrants en toute sécurité ? Nous louons nos monte-meubles avec un <strong>technicien dédié</strong>, formé et assuré, qui installe, stabilise et manœuvre l’appareil. Vos biens passent par la fenêtre ou le balcon, sans risque pour l’escalier ni pour vos meubles. Comptez environ <strong>20 à 30 minutes</strong> d’installation sur place.</p>
${h.figure('monte-meuble-rue', 'Monte-meuble déployé jusqu’aux étages, en pleine rue de centre-ville.')}
<h2>Trois usages courants</h2>
<h3>Déménagement d’un logement</h3>
<p>Canapé, armoire, piano, réfrigérateur américain : tout le mobilier volumineux passe directement par l’extérieur, dans la limite de la capacité de l’appareil. Idéal pour les immeubles anciens sans ascenseur ou avec un ascenseur trop petit.</p>
<h3>Livraison de meubles ou d’électroménager</h3>
<p>Canapé d’angle, lit king-size, lave-linge qui ne passe pas par l’escalier ? Une intervention rapide suffit pour livrer l’objet à l’étage, sans mobiliser une équipe de porteurs.</p>
<h3>Travaux de rénovation</h3>
<p>Plaques de plâtre, fenêtres neuves, baignoire, parquet : le monte-meuble achemine les matériaux lourds jusqu’aux étages élevés. Vous gagnez du temps sur le chantier et évitez de vous blesser.</p>
<h2>Pourquoi louer votre monte-meuble chez Aaction Dem ?</h2>
<ul class="checks">
  <li><strong>Opérateurs formés et assurés</strong> pour toutes les manipulations.</li>
  <li><strong>Matériel régulièrement entretenu</strong> et contrôlé.</li>
  <li><strong>Disponibilité 7j/7</strong> sur rendez-vous.</li>
  <li><strong>Autorisations de stationnement</strong> gérées pour vous auprès de la mairie.</li>
  <li>Une équipe qui connaît les <strong>centres historiques</strong> de Metz et Thionville, leurs rues étroites et leurs accès compliqués.</li>
</ul>
<h2>Zones d’intervention</h2>
<p><strong>Metz</strong> : centre-ville, Montigny-lès-Metz, Plantières, Queuleu, Borny. <strong>Thionville</strong> : centre, Yutz, Terville, Florange, Hayange, Knutange. <strong>Pays-Haut</strong> : Longwy, Mont-Saint-Martin, Herserange, Lexy. Et aussi Maizières-lès-Metz, Amnéville, Rombas et toute la Moselle.</p>
<p>Le monte-meuble se loue seul ou en complément d’une de nos <a href="/formules-demenagement/">formules de déménagement</a>.</p>`,
    faq: [
      { q: 'Puis-je utiliser le monte-meuble moi-même ?', a: '<p>Non. Pour votre sécurité, un technicien expérimenté est toujours compris dans la location et réalise toutes les manipulations.</p>' },
      { q: 'Combien de temps faut-il pour installer le monte-meuble ?', a: '<p>Comptez environ 20 à 30 minutes d’installation sur place, selon la configuration de la rue et de la façade.</p>' },
      { q: 'Faut-il une autorisation pour installer un monte-meuble ?', a: '<p>Oui, l’installation sur la voie publique nécessite en général une autorisation de stationnement ou d’occupation du domaine public. Nous nous chargeons de la demande auprès de la mairie.</p>' },
      { q: 'Peut-on louer un monte-meuble sans déménageurs ?', a: '<p>Oui. Le monte-meuble est toujours loué avec son opérateur, mais vous pouvez charger et décharger vous-même vos affaires si vous le souhaitez.</p>' },
      { q: 'Le monte-meuble fonctionne-t-il par mauvais temps ?', a: '<p>Par temps de pluie, il reste utilisable et vos biens sont protégés. En cas de vent fort, l’opérateur peut suspendre l’intervention pour des raisons de sécurité.</p>' }
    ],
    related: ['particulier', 'demenagement-metz', 'formules-demenagement']
  },
  {
    slug: 'demenagement-metz', service: 'Déménagement à Metz', local: 'Metz',
    title: 'Déménageur à Metz – devis gratuit | Aaction Dem',
    description: 'Votre déménageur à Metz (7 rue de Queuleu) : déménagement local et national, garde-meuble, monte-meuble. Membre des Gentlemen du Déménagement.',
    h1: 'Votre déménageur à Metz',
    kicker: 'Agence de Metz – 7 rue de Queuleu, entrée 2',
    lead: 'Du quartier Impérial à Borny, de Queuleu à Devant-les-Ponts, nos déménageurs connaissent Metz par cœur : ses rues pavées, ses immeubles en pierre de Jaumont et ses contraintes de stationnement.',
    img: 'demenagement-metz', crumb: 'Déménageur Metz',
    body: (h) => `
<h2>Votre déménageur à Metz, du devis à la livraison</h2>
<p>Appartement du centre-ville, maison en périphérie, bureaux ou local commercial : chaque déménagement à Metz a ses contraintes. Nous organisons votre projet en tenant compte du volume, des accès, du calendrier et des particularités de chaque adresse, pour limiter les imprévus le jour J.</p>
<p>Notre agence messine, située <strong>7 rue de Queuleu (entrée 2), 57070 Metz</strong>, vous reçoit sur rendez-vous. Un conseiller évalue votre besoin, vous propose la formule adaptée et reste votre interlocuteur jusqu’à la fin du chantier.</p>
<h2>Nos prestations de déménagement à Metz</h2>
<h3>Maisons et appartements</h3>
<p>Studio étudiant près de l’université, appartement familial à Queuleu ou maison à Montigny-lès-Metz : nous adaptons l’équipe et le véhicule à votre logement et à votre mobilier.</p>
<h3>Bureaux et locaux professionnels</h3>
<p>Transfert de bureaux, d’archives et de matériel informatique au centre-ville ou au Technopôle, en dehors des heures d’ouverture si nécessaire. Voir notre page <a href="/entreprise/">déménagement d’entreprise</a>.</p>
<h3>Emballage, démontage et protection</h3>
<p>Selon la <a href="/formules-demenagement/">formule choisie</a>, nous emballons le fragile ou l’ensemble de vos affaires, démontons et remontons vos meubles et protégeons chaque pièce sous housses et couvertures.</p>
<h3>Services complémentaires</h3>
<p><a href="/monte-meubles-demenagement/">Monte-meuble</a> pour les étages sans ascenseur, <a href="/garde-meuble/">garde-meuble</a> entre deux logements, <a href="/demenagement-piano/">transport de piano</a> : nous complétons le déménagement selon vos besoins.</p>
${h.figure('demenagement-knutange', 'Mobilier protégé et chargé avec soin dans un camion Aaction Dem.')}
<h2>Une équipe qui connaît le terrain messin</h2>
<p>Rues pavées du centre historique, secteurs piétons, immeubles en pierre de Jaumont sans ascenseur, stationnement réglementé : nos équipes connaissent les réalités de Metz. Nous intervenons dans tous les quartiers – Centre, Queuleu, Plantières, Borny, Bellecroix, Sablon, Devant-les-Ponts, Magny – et dans toute la métropole : Montigny-lès-Metz, Woippy, Marly, Moulins-lès-Metz, Longeville-lès-Metz, Saint-Julien-lès-Metz, Ars-sur-Moselle.</p>
<ul class="checks">
  <li>Demande d’<strong>autorisation de stationnement</strong> auprès de la Ville de Metz prise en charge.</li>
  <li>Organisation adaptée aux <strong>zones à fort trafic</strong> et aux contraintes horaires.</li>
  <li>Véhicules de différents gabarits pour les rues étroites du centre.</li>
</ul>
<h2>De Metz vers toute la France et l’étranger</h2>
<p>Metz–Paris, Metz–Strasbourg, Metz–Lyon ou Metz–Luxembourg : grâce au réseau Les Gentlemen du Déménagement, nous organisons aussi votre déménagement longue distance et international, avec la même équipe de confiance au départ.</p>`,
    faq: [
      { q: 'Faut-il une autorisation de stationnement à Metz ?', a: '<p>Oui, pour réserver l’emplacement du camion sur la voie publique. La demande doit être déposée environ 15 jours avant. Nous pouvons nous en occuper pour vous.</p>' },
      { q: 'L’agence de Metz est-elle ouverte sans rendez-vous ?', a: '<p>L’accueil à Metz se fait uniquement sur rendez-vous. Appelez le ' + site.phoneDisplay + ' pour convenir d’un créneau.</p>' },
      { q: 'Dans quels quartiers et communes autour de Metz intervenez-vous ?', a: '<p>Dans tous les quartiers de Metz (Centre, Queuleu, Borny, Sablon, Devant-les-Ponts, Magny…) et dans toute la métropole : Montigny-lès-Metz, Woippy, Marly, Moulins-lès-Metz, Ars-sur-Moselle, Saint-Julien-lès-Metz…</p>' },
      { q: 'Comment déménager dans le centre historique de Metz ?', a: '<p>Rues pavées, secteurs piétons et immeubles anciens sans ascenseur demandent de l’organisation : nous adaptons la taille du véhicule, demandons les autorisations nécessaires et utilisons un <a href="/monte-meubles-demenagement/">monte-meuble</a> si besoin.</p>' },
      { q: 'Combien coûte un déménagement à Metz ?', a: '<p>Le prix dépend du volume, de la formule et de l’accès aux logements. Un déménagement local dans Metz revient moins cher qu’un longue distance. <a href="/contact/">Demandez un devis gratuit</a> pour un prix précis.</p>' }
    ],
    related: ['demenagement-thionville', 'demenagement-luxembourg', 'particulier']
  },
  {
    slug: 'demenagement-thionville', service: 'Déménagement à Thionville', local: 'Thionville',
    title: 'Déménageur à Thionville – devis gratuit | Aaction Dem',
    description: 'Déménageur à Thionville, Yutz, Terville et Manom depuis 30 ans. Agence à 10 minutes, à Knutange. Visite technique et devis gratuits.',
    h1: 'Déménageur à Thionville et environs',
    kicker: 'À quelques minutes de notre siège de Knutange',
    lead: 'Centre-ville, Côte des Roses, Guentrange ou Yutz : nos équipes, basées à quelques minutes à Knutange, déménagent chaque semaine des familles et des entreprises du Thionvillois, jusqu’à la frontière luxembourgeoise.',
    img: 'demenagement-thionville', crumb: 'Déménageur Thionville',
    body: (h) => `
<h2>Le déménageur de proximité du nord mosellan</h2>
<p>Notre <a href="/demenagement-knutange/">siège de Knutange</a>, à quelques minutes de Thionville, est ouvert du lundi au vendredi (08:45–12:00 et 14:00–17:30). C’est d’ici que partent la majorité de nos 1 200 déménagements annuels. Depuis plus de 30 ans, nous accompagnons les familles et les professionnels de Thionville et de ses environs avec des prestations sur mesure.</p>
<h2>Thionville, quartier par quartier</h2>
<p>Centre-ville et ses rues commerçantes, Côte des Roses, Guentrange, Veymerange, Garche, Volkrange, Œutrange : nous connaissons les contraintes de circulation, de stationnement et d’accès propres à chaque secteur. Nous intervenons aussi dans toutes les communes voisines : Yutz, Terville, Manom, Hayange, Fameck, Florange, Uckange, Nilvange, Algrange, Hettange-Grande, Cattenom, Audun-le-Tiche.</p>
${h.figure('camion-centre-ville', 'Camion et monte-meuble installés en centre-ville pour un déménagement en étage.')}
<h2>Pourquoi choisir Aaction Dem à Thionville ?</h2>
<ul class="checks">
  <li><strong>30 ans d’expérience</strong> dans le Thionvillois et des déménageurs habitués aux accès locaux.</li>
  <li><strong>Estimation sur place</strong> à Thionville, gratuite et sans engagement.</li>
  <li><strong>Matériel adapté</strong> aux immeubles, aux maisons et aux rues étroites du centre.</li>
  <li><strong>Réactivité</strong> pour les déménagements urgents ou spécifiques.</li>
  <li><a href="/garde-meuble/">Garde-meuble</a> sécurisé à Knutange, à proximité immédiate.</li>
</ul>
<h2>Thionville – Luxembourg : notre quotidien</h2>
<p>À 20 minutes de la frontière, nous réalisons chaque semaine des déménagements de frontaliers entre la Moselle et le Grand-Duché, dans les deux sens. Découvrez notre offre de <a href="/demenagement-luxembourg/">déménagement au Luxembourg</a>.</p>`,
    faq: [
      { q: 'Où se trouve l’agence la plus proche de Thionville ?', a: '<p>Notre siège est à <a href="/demenagement-knutange/">Knutange</a> (277 rue Victor Rimmel), à une dizaine de minutes de Thionville. Il est ouvert du lundi au vendredi, de 08:45 à 12:00 et de 14:00 à 17:30.</p>' },
      { q: 'Quelles communes autour de Thionville desservez-vous ?', a: '<p>Thionville, Yutz, Terville, Hayange, Fameck, Florange, Uckange, Knutange, Nilvange, Algrange, Hettange-Grande, Cattenom et tout le nord mosellan.</p>' },
      { q: 'Combien coûte un déménagement à Thionville ?', a: '<p>Le tarif dépend du volume, de la formule et des conditions d’accès. Notre agence étant à Knutange, les déménagements locaux autour de Thionville bénéficient de frais de déplacement réduits. <a href="/contact/">Demandez votre devis gratuit</a>.</p>' },
      { q: 'Faut-il une autorisation de stationnement à Thionville ?', a: '<p>Oui, pour réserver l’emplacement du camion devant votre logement. Nous pouvons effectuer la demande auprès de la mairie de Thionville pour vous.</p>' },
      { q: 'Proposez-vous un garde-meuble près de Thionville ?', a: '<p>Oui, notre <a href="/garde-meuble/">garde-meuble</a> se trouve à proximité de notre agence de Knutange, à quelques minutes de Thionville.</p>' }
    ],
    related: ['demenagement-knutange', 'demenagement-luxembourg', 'garde-meuble']
  },
  {
    slug: 'demenagement-knutange', service: 'Déménagement à Knutange', local: 'Knutange',
    title: 'Déménageur à Knutange et vallée de la Fensch | Aaction Dem',
    description: 'Siège Aaction Dem au 277 rue Victor Rimmel à Knutange : déménagements à Knutange, Hayange, Nilvange, Algrange et dans toute la vallée de la Fensch.',
    h1: 'Déménageur à Knutange, au cœur de la Fensch',
    kicker: 'Siège – 277 rue Victor Rimmel, Knutange',
    lead: 'Knutange, c’est chez nous : notre siège, nos camions et nos équipes y sont installés. Nous déménageons les habitants de la vallée de la Fensch depuis plus de 30 ans, de Hayange à Fontoy.',
    img: 'demenagement-knutange', crumb: 'Déménageur Knutange',
    body: (h) => `
<h2>Une entreprise née dans la vallée de la Fensch</h2>
<p>Aaction Dem a été fondée en avril 1990 à <strong>Algrange</strong>, a grandi à <strong>Hayange</strong> pendant près de trente ans, puis a installé son siège à <strong>Knutange</strong>, au 277 rue Victor Rimmel. Trois communes voisines, une même vallée : nos déménageurs connaissent la Fensch rue par rue.</p>
<p>Cette proximité change tout le jour du déménagement : pas de longs trajets à vide, des équipes qui arrivent à l’heure et qui connaissent déjà les accès, les rues en pente et les règles de stationnement de votre commune.</p>
<h2>Nos déménagements à Knutange et dans la vallée</h2>
<p>Maisons mitoyennes des anciennes cités ouvrières, pavillons sur les hauteurs, appartements en résidence : chaque logement de la vallée a ses contraintes. Escaliers étroits, rues à forte pente, places de stationnement rares devant les maisons en bande… Lors de la <strong>visite technique gratuite</strong>, nous repérons ces points pour prévoir le bon camion, le bon nombre de déménageurs et, si besoin, un <a href="/monte-meubles-demenagement/">monte-meuble</a>.</p>
<p>Nous intervenons chaque semaine à <strong>Knutange, Nilvange, Hayange, Algrange, Fontoy, Neufchef, Ranguevaux, Serémange-Erzange, Florange, Fameck et Uckange</strong>, ainsi qu’à <a href="/demenagement-thionville/">Thionville</a> et jusqu’au <a href="/demenagement-luxembourg/">Luxembourg</a>.</p>
${h.figure('cartons-gentlemen', 'Cartons et matériel du réseau Les Gentlemen du Déménagement, disponibles dans notre agence.')}
<h2>Votre agence au 277 rue Victor Rimmel</h2>
<ul class="checks">
  <li><strong>Ouverte du lundi au vendredi</strong>, de 08:45 à 12:00 et de 14:00 à 17:30.</li>
  <li><strong>Conseils et devis</strong> : nos conseillers préparent avec vous votre déménagement, sur place ou par téléphone au 03 82 85 49 43.</li>
  <li><strong>Cartons et matériel</strong> : achetez vos cartons, adhésif et papier bulle directement à l’agence (<a href="/vente-materiel-demenagement/">voir le matériel</a>).</li>
  <li><strong>Garde-meuble</strong> : stockez vos meubles entre deux logements dans notre <a href="/garde-meuble/">garde-meuble sécurisé</a>.</li>
</ul>
<h2>Du local à l’international depuis Knutange</h2>
<p>Un déménagement de quelques rues à Knutange, un départ vers Metz, Lyon ou la Bretagne, une mutation au Luxembourg ou en Europe : grâce au réseau <strong>Les Gentlemen du Déménagement</strong>, nous organisons depuis notre siège des déménagements partout en France et à l’étranger, avec la même équipe comme interlocuteur. Comparez nos <a href="/formules-demenagement/">formules de déménagement</a> pour choisir le niveau de service qui vous convient.</p>`,
    faq: [
      { q: 'Quels sont les horaires de l’agence de Knutange ?', a: '<p>Du lundi au vendredi, de 08:45 à 12:00 et de 14:00 à 17:30. Vous pouvez aussi nous joindre au 03 82 85 49 43.</p>' },
      { q: 'Quelles communes de la vallée de la Fensch desservez-vous ?', a: '<p>Knutange, Nilvange, Hayange, Algrange, Fontoy, Neufchef, Ranguevaux, Serémange-Erzange, Florange, Fameck, Uckange et toutes les communes voisines, ainsi que Thionville et le Pays-Haut.</p>' },
      { q: 'Peut-on acheter des cartons à l’agence de Knutange ?', a: '<p>Oui, cartons, adhésif, papier bulle et housses sont disponibles à l’agence, même si vous ne faites pas appel à nos déménageurs.</p>' },
      { q: 'Faut-il une autorisation de stationnement à Knutange ?', a: '<p>Pour réserver l’emplacement du camion devant votre logement, une demande est généralement faite auprès de la mairie. Nous pouvons nous en charger pour vous.</p>' },
      { q: 'Combien coûte un déménagement à Knutange ?', a: '<p>Le prix dépend du volume, de la formule et des accès. Nos camions partant de Knutange, les déménagements dans la vallée n’entraînent quasiment pas de frais d’approche. <a href="/contact/">Demandez votre devis gratuit</a>.</p>' }
    ],
    related: ['demenagement-thionville', 'garde-meuble', 'vente-materiel-demenagement']
  },
  {
    slug: 'demenagement-luxembourg', service: 'Déménagement au Luxembourg', local: 'Luxembourg',
    title: 'Déménageur Luxembourg – France ↔ Grand-Duché | Aaction Dem',
    description: 'Déménagement entre la France et le Luxembourg : Luxembourg-Ville, Esch-sur-Alzette, Belval. Déménageur frontalier basé en Moselle, devis gratuit.',
    h1: 'Déménagement au Luxembourg',
    kicker: 'France ↔ Grand-Duché',
    lead: 'Vous vous installez au Luxembourg ou revenez en France ? Basés à Knutange, à quelques minutes de la frontière, nous sommes le partenaire naturel des déménagements transfrontaliers.',
    img: 'demenagement-luxembourg', crumb: 'Luxembourg',
    body: (h) => `
<h2>Votre déménageur de confiance au Luxembourg</h2>
<p>Avec plus de 30 ans d’expérience, Aaction Dem accompagne les particuliers, les expatriés et les professionnels pour leurs déménagements au Luxembourg : studio, appartement, villa ou départ à l’étranger. Notre équipe <strong>multilingue</strong> vous accompagne de l’emballage à l’installation, montage des meubles compris.</p>
<h2>Nos déménagements au Grand-Duché</h2>
<h3>À Luxembourg-Ville</h3>
<p>Gare, Kirchberg, Limpertsberg, Belair, Gasperich, Bonnevoie, Merl… nous connaissons les règles des résidences luxembourgeoises : réservation des ascenseurs, accès aux parkings souterrains, protection des parties communes.</p>
<h3>Entre la France et le Luxembourg</h3>
<p>Installés à Knutange, à quelques minutes de la frontière, nous gérons les accès, la logistique et les démarches liées au passage de frontière pour les frontaliers qui s’installent au Luxembourg ou reviennent en France.</p>
<h3>Vers l’Europe et l’international</h3>
<p>Allemagne, Belgique, Pays-Bas ou destination plus lointaine : grâce au réseau Les Gentlemen du Déménagement, nous organisons votre déménagement international de bout en bout.</p>
<h3>Particuliers, entreprises et administrations</h3>
<p>Familles, étudiants, institutions européennes ou sociétés qui s’implantent au Grand-Duché : nous adaptons notre organisation à chaque projet. Voir aussi notre offre de <a href="/entreprise/">transfert d’entreprise</a>.</p>
${h.figure('dechargement-camion', 'Chargement et déchargement soignés, quelle que soit la destination.')}
<h2>Pourquoi un déménageur mosellan pour le Luxembourg ?</h2>
<ul class="checks">
  <li>Des <strong>tarifs français</strong> transparents, assurance incluse, pour une qualité de service identique.</li>
  <li>Une équipe <strong>multilingue</strong>, réactive et à l’écoute.</li>
  <li>Les <strong>formalités administratives</strong> prises en charge si nécessaire.</li>
  <li>Un <a href="/garde-meuble/">garde-meuble</a> en Moselle, plus économique qu’au Luxembourg.</li>
  <li>Un <strong>devis gratuit</strong> et personnalisé, adapté à vos besoins réels.</li>
</ul>`,
    faq: [
      { q: 'Y a-t-il des formalités pour déménager au Luxembourg ?', a: '<p>Aucune formalité douanière pour vos biens personnels. Pensez en revanche à vous déclarer auprès de votre nouvelle commune dans les 8 jours suivant votre arrivée.</p>' },
      { q: 'Combien coûte un déménagement entre la France et le Luxembourg ?', a: '<p>Le prix dépend du volume, de la distance et de l’accès aux logements. Basés en Moselle, nous appliquons des tarifs français pour une qualité de service identique. <a href="/contact/">Demandez un devis gratuit</a>.</p>' },
      { q: 'Faut-il réserver l’ascenseur dans une résidence luxembourgeoise ?', a: '<p>Souvent oui : de nombreuses résidences demandent de réserver l’ascenseur et de protéger les parties communes. Nous vous indiquons les démarches à faire auprès du syndic.</p>' },
      { q: 'Intervenez-vous dans tout le Grand-Duché ?', a: '<p>Oui : Luxembourg-Ville, Esch-sur-Alzette, Belval, Differdange, Dudelange, Bettembourg, Mondorf-les-Bains et l’ensemble du pays.</p>' },
      { q: 'Pouvez-vous stocker nos meubles avant l’emménagement au Luxembourg ?', a: '<p>Oui, notre <a href="/garde-meuble/">garde-meuble</a> en Moselle permet de stocker vos biens à un tarif plus avantageux qu’au Luxembourg, en attendant la remise des clés.</p>' }
    ],
    related: ['demenagement-thionville', 'entreprise', 'demenagement-metz']
  },
  {
    slug: 'demenagement-longwy', service: 'Déménagement à Longwy', local: 'Longwy',
    title: 'Déménagement Longwy – déménageur Pays-Haut | Aaction Dem',
    description: 'Déménagement à Longwy et dans le Pays-Haut : inventaire précis, emballage pro, transport sûr et garde-meuble sécurisé. 30 ans d’expérience, devis gratuit.',
    h1: 'Votre déménageur à Longwy',
    kicker: 'Longwy, Pays-Haut et frontière belgo-luxembourgeoise',
    lead: 'Vous cherchez un déménageur professionnel à Longwy ? Aaction Dem met à votre service son expertise locale, des équipes qualifiées et des formules adaptées pour un déménagement simple, rapide et serein.',
    img: 'demenagement-longwy', crumb: 'Déménagement Longwy',
    body: (h) => `
<h2>Un déménagement sur mesure à Longwy</h2>
<p>Depuis notre agence de Knutange, nous accompagnons les particuliers et les professionnels de Longwy et du Pays-Haut dans tous leurs projets, quelle que soit leur complexité : préparation, protection de vos biens, transport et remise en place dans votre nouveau logement. Notre objectif : un déménagement fluide, efficace et sans mauvaise surprise.</p>
<p>Habitat ancien, immeubles du centre ou maisons individuelles en périphérie : nous adaptons nos moyens à la réalité de Longwy-Haut et de sa ville fortifiée, de Longwy-Bas, de Mont-Saint-Martin, Herserange, Réhon, Longlaville, Lexy, Saulnes, Villerupt ou Mexy.</p>
${h.figure('longwy-ville-haute', 'Nos camions dans la ville haute de Longwy, classée au patrimoine mondial de l’UNESCO.')}
<ul class="checks">
  <li><strong>Visite technique</strong> et inventaire précis pour un devis ferme.</li>
  <li><strong>Équipes qualifiées</strong> et régulièrement formées, respectueuses de vos biens.</li>
  <li><a href="/monte-meubles-demenagement/">Monte-meuble</a> pour les étages sans ascenseur et les rues étroites.</li>
  <li><a href="/garde-meuble/">Garde-meuble</a> sécurisé entre deux logements.</li>
</ul>
<h2>Longwy, Luxembourg, Belgique : au carrefour des trois frontières</h2>
<p>À quelques minutes de la Belgique et du Luxembourg, Longwy est une ville de frontaliers. Nous organisons régulièrement des déménagements vers <a href="/demenagement-luxembourg/">le Luxembourg</a>, Arlon, Athus ou Esch-sur-Alzette, ainsi que partout en France grâce au réseau <strong>Les Gentlemen du Déménagement</strong>.</p>
<h2>Une formule pour chaque budget</h2>
<p>Mobilier seul, Dynamic +, Comfort ou Comfort + : <a href="/formules-demenagement/">comparez nos formules</a> et choisissez jusqu’où nous vous aidons, de l’économique au clé en main.</p>`,
    faq: [
      { q: 'Intervenez-vous dans tout le Pays-Haut ?', a: '<p>Oui : Longwy, Mont-Saint-Martin, Herserange, Villerupt, Audun-le-Tiche et l’ensemble du bassin de Longwy, ainsi que vers la Belgique et le Luxembourg.</p>' },
      { q: 'Combien coûte un déménagement à Longwy ?', a: '<p>Le tarif dépend du volume, de la formule choisie et de l’accès aux logements. <a href="/contact/">Demandez un devis gratuit</a> : nous vous remettons un prix ferme après évaluation.</p>' },
      { q: 'Déménagez-vous vers la Belgique depuis Longwy ?', a: '<p>Oui, nous réalisons des déménagements vers Arlon, Athus, Aubange et toute la province du Luxembourg belge, ainsi que vers le Grand-Duché.</p>' },
      { q: 'Comment déménager dans la ville haute de Longwy ?', a: '<p>Les rues étroites de la ville fortifiée demandent un véhicule adapté et parfois un <a href="/monte-meubles-demenagement/">monte-meuble</a>. Nous repérons les accès lors de la visite technique et gérons les autorisations.</p>' },
      { q: 'Puis-je acheter des cartons pour mon déménagement à Longwy ?', a: '<p>Oui, nous vendons cartons et matériel d’emballage. Voir notre page <a href="/vente-materiel-demenagement/">vente de matériel</a>.</p>' }
    ],
    related: ['demenagement-luxembourg', 'demenagement-thionville', 'formules-demenagement']
  },
  {
    slug: 'demenagement-piano', service: 'Déménagement de piano',
    title: 'Déménagement de piano Metz & Thionville | Aaction Dem',
    description: 'Déménagement de piano droit, à queue ou numérique en Moselle : équipe spécialisée, protections complètes, monte-meuble et assurance incluse. Devis gratuit.',
    h1: 'Déménagement de piano en Moselle',
    kicker: 'Piano droit, piano à queue, piano numérique',
    lead: 'Un piano est lourd, encombrant et fragile : son déplacement ne s’improvise pas. Nos équipes spécialisées le transportent en toute sécurité à Metz, Thionville et partout en Moselle.',
    img: 'demenagement-piano', crumb: 'Piano',
    body: (h) => `
<h2>Pourquoi faire appel à un professionnel ?</h2>
<p>Un escalier étroit ou un couloir mal négocié suffisent à abîmer un piano – ou à blesser quelqu’un. Nos déménageurs maîtrisent les techniques propres à ces instruments : démontage des éléments (pieds, pédalier, pupitre), basculement d’un piano droit dans un escalier, utilisation de sangles, chariots et housses de protection.</p>
<ul class="checks">
  <li><strong>Matériel spécialisé</strong> : sangles, chariots à piano, housses et couvertures épaisses.</li>
  <li><a href="/monte-meubles-demenagement/">Monte-meuble</a> si l’escalier ne permet pas le passage.</li>
  <li><strong>Assurance professionnelle</strong> pendant toute la manutention et le transport.</li>
</ul>
${h.figure('protection-mobilier', 'Chaque meuble fragile est entièrement protégé avant d’être manipulé.')}
<h2>Votre spécialiste des objets lourds et fragiles en Moselle</h2>
<p>Nos déménageurs sont formés à la manutention des objets lourds et délicats : pianos, mais aussi coffres-forts et billards. Piano droit à descendre d’un escalier ancien à Metz, piano à queue à livrer dans une maison près de Thionville ou transport longue distance : nous adaptons l’équipe, le matériel et le véhicule, du trajet local à l’international.</p>
<h2>Combien coûte un déménagement de piano ?</h2>
<p>Le prix dépend du type d’instrument, de l’accès et de la distance. À titre indicatif :</p>
<table class="table">
  <thead><tr><th scope="col">Instrument</th><th scope="col">Prix indicatif (local)</th></tr></thead>
  <tbody>
    <tr><td>Piano numérique</td><td>dès 300 €</td></tr>
    <tr><td>Piano droit</td><td>350 € à 500 €</td></tr>
    <tr><td>Piano à queue</td><td>500 € à 800 €</td></tr>
  </tbody>
</table>
<p>Escaliers sans ascenseur, couloirs étroits ou recours au monte-meuble peuvent entraîner un supplément. Pour une longue distance, le tarif est calculé au kilomètre. <a href="/contact/">Demandez votre devis personnalisé</a>.</p>`,
    faq: [
      { q: 'Faut-il réaccorder le piano après le déménagement ?', a: '<p>Oui, il est conseillé de faire accorder votre piano 2 à 3 semaines après son installation, le temps qu’il s’adapte à la température et à l’hygrométrie de la nouvelle pièce.</p>' },
      { q: 'Pouvez-vous déménager uniquement un piano ?', a: '<p>Oui, nous réalisons des transports de piano seuls, sans autre déménagement.</p>' },
      { q: 'Comment protégez-vous le piano pendant le transport ?', a: '<p>Le piano est enveloppé dans des housses et couvertures épaisses, sanglé sur un chariot ou une planche à piano, puis calé dans le camion pour éviter tout mouvement.</p>' },
      { q: 'Peut-on passer un piano à queue dans un escalier ?', a: '<p>Oui : nous démontons les pieds et la lyre, le piano est posé sur le flanc sur une planche spéciale. Si l’escalier est trop étroit, nous utilisons un monte-meuble.</p>' },
      { q: 'Le piano est-il assuré pendant le déménagement ?', a: '<p>Oui, votre instrument est couvert par notre assurance professionnelle pendant toute la manutention et le transport.</p>' }
    ],
    related: ['monte-meubles-demenagement', 'particulier', 'garde-meuble']
  },
  {
    slug: 'vente-materiel-demenagement', service: 'Vente de matériel de déménagement',
    title: 'Vente de cartons de déménagement en Moselle | Aaction Dem',
    description: 'Cartons standards et renforcés, cartons penderie, papier bulle, adhésif : achetez votre matériel de déménagement dans nos agences de Knutange et Metz.',
    h1: 'Vente de cartons et matériel de déménagement',
    kicker: 'En agence à Knutange et Metz',
    lead: 'Vous préférez faire votre déménagement vous-même ? Nous mettons à votre disposition tout le matériel professionnel pour emballer et protéger vos affaires.',
    img: 'vente-materiel', crumb: 'Vente de matériel',
    body: (h) => `
<h2>Cartons et emballages professionnels</h2>
<p>Avec plus de 30 ans d’expérience, nous savons qu’un déménagement réussi commence par un bon emballage. Nous vendons le même matériel que celui utilisé par nos équipes :</p>
<ul class="checks">
  <li><strong>Cartons standards</strong> double cannelure, solides et réutilisables.</li>
  <li><strong>Cartons pour objets fragiles</strong> : vaisselle, verres (avec croisillons), bibelots.</li>
  <li><strong>Cartons penderie</strong> avec barre intégrée pour transporter vos vêtements sur cintres.</li>
  <li><strong>Papier bulle, papier de soie et adhésif</strong> pour protéger et fermer vos cartons.</li>
</ul>
${h.figure('protection-mobilier', 'Couvertures et housses protègent vos meubles pendant le transport.')}
<h2>Des conseils en agence</h2>
<p>Combien de cartons prévoir ? Quel modèle pour vos livres ou votre vaisselle ? Nos équipes vous conseillent dans nos agences de <a href="/demenagement-thionville/">Knutange</a> (du lundi au vendredi) et de <a href="/demenagement-metz/">Metz</a> (sur rendez-vous). Comptez en moyenne 10 cartons par pièce.</p>
<p>Vous changez d’avis ? Nos <a href="/formules-demenagement/">formules de déménagement</a> s’adaptent à votre budget, du transport du mobilier seul au clé en main.</p>`,
    faq: [
      { q: 'Combien de cartons faut-il pour un déménagement ?', a: '<p>Comptez environ 10 à 15 cartons par pièce : 20 à 30 pour un studio, 40 à 60 pour un T3, 80 et plus pour une maison familiale.</p>' },
      { q: 'Quels cartons choisir pour la vaisselle et les verres ?', a: '<p>Utilisez des cartons renforcés de petite taille, avec croisillons pour les verres, et emballez chaque pièce dans du papier de soie ou du papier bulle.</p>' },
      { q: 'Quand acheter ses cartons ?', a: '<p>Prévoyez vos cartons 3 à 4 semaines avant le déménagement pour emballer progressivement, en commençant par ce dont vous vous servez le moins.</p>' },
      { q: 'Faut-il prendre rendez-vous pour acheter du matériel ?', a: '<p>À Knutange, vous pouvez venir du lundi au vendredi aux heures d’ouverture. À Metz, l’accueil se fait uniquement sur rendez-vous.</p>' },
      { q: 'Fournissez-vous les cartons si vous faites le déménagement ?', a: '<p>Oui, lorsque vous nous confiez votre déménagement, les cartons et le matériel sont livrés chez vous avant le jour J.</p>' }
    ],
    related: ['formules-demenagement', 'garde-meuble', 'particulier']
  }
];

// Page « formules » : contenu dédié
export const formulesPage = {
  slug: 'formules-demenagement',
  title: 'Formules de déménagement : du mobilier seul au clé en main',
  description: 'Comparez nos 4 formules de déménagement : Mobilier seul, Dynamic +, Comfort et Comfort +. Choisissez jusqu’où on vous aide et maîtrisez votre budget.',
  h1: 'À vous de choisir jusqu’où on vous aide',
  lead: 'Quatre formules pour tous les budgets et tous les types de déménagement, de l’économique au clé en main.'
};
