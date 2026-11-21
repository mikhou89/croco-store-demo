"""Transforms the raw crocostore.tn capture into the demo's typed data files + optimized images.
Source of truth: data/catalogue.json captured from https://crocostore.tn/ on 2026-11-21."""
import json, re, os, html, sys, unicodedata
import bleach
from PIL import Image

RAW = '/home/claude/data/catalogue.json'
IMG = '/home/claude/data/img'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'data')
PUB = os.path.join(ROOT, 'public', 'img')
os.makedirs(OUT, exist_ok=True); os.makedirs(PUB + '/p', exist_ok=True); os.makedirs(PUB + '/site', exist_ok=True)

d = json.load(open(RAW))
det, cats = d['det'], d['cats']

# ---- taxonomy (mirrors the live menu; empty live categories are left out) ----
TAXO = [
  ('proteines', 'Protéines', 'Whey, isolats et caséine pour construire et réparer le muscle.', ['whey-protein', 'isolats-et-hydrolysats', 'caseine-et-proteines-lentes']),
  ('gainers-prise-de-masse', 'Prise de masse', 'Gainers riches en calories pour les profils qui peinent à prendre du poids.', []),
  ('creatine', 'Créatine', 'Le complément le plus étudié pour la force et la puissance.', ['creatine-monohydrate', 'autres-formes-de-creatine']),
  ('acides-amines', 'Acides aminés', 'BCAA, EAA et glutamine pour la récupération.', ['eaa', 'glutamine', 'bcaa', 'autres-acides-amines']),
  ('boosters-et-pre-workout', 'Pré-workout & boosters', "Énergie, congestion et focus avant l'entraînement.", ['testosterone-boosters', 'energie-et-endurance']),
  ('bruleurs-de-graisse', 'Brûleurs de graisse', 'Thermogéniques, L-carnitine et fat blockers pour la sèche.', ['thermogeniques', 'fat-blockers']),
  ('sante-et-bien-etre', 'Santé & bien-être', 'Vitamines, minéraux, oméga-3 et sommeil au quotidien.', ['multivitamines', 'mineraux', 'omega-et-huiles-essentielles', 'sante-articulaire', 'sante-digestive', 'sommeil-et-relaxation']),
  ('accessoires-nutrition', 'Accessoires', 'Shakers et gourdes pour vos séances.', ['shakers-gourdes']),
]
SUBLABEL = {k: html.unescape(v['label']).replace('Catégorie : ', '') for k, v in cats.items() if 'label' in v}
SUBLABEL.update({'eaa': 'EAA', 'bcaa': 'BCAA', 'whey-protein': 'Whey protéine', 'isolats-et-hydrolysats': 'Isolats & hydrolysats',
  'caseine-et-proteines-lentes': 'Caséine', 'creatine-monohydrate': 'Créatine monohydrate', 'autres-formes-de-creatine': 'Autres créatines',
  'autres-acides-amines': 'Autres acides aminés', 'testosterone-boosters': 'Boosters de testostérone', 'energie-et-endurance': 'Énergie & endurance',
  'thermogeniques': 'Thermogéniques', 'fat-blockers': 'Fat blockers', 'multivitamines': 'Multivitamines', 'mineraux': 'Minéraux',
  'omega-et-huiles-essentielles': 'Oméga-3 & huiles', 'sante-articulaire': 'Santé articulaire', 'sante-digestive': 'Santé digestive',
  'sommeil-et-relaxation': 'Sommeil & relaxation', 'shakers-gourdes': 'Shakers & gourdes'})

def ids(slug):
    return cats.get(slug, {}).get('ids', [])

categories = []
for slug, label, blurb, subs in TAXO:
    sub = [{'slug': s, 'name': SUBLABEL[s], 'count': len(ids(s))} for s in subs if len(ids(s)) > 0]
    members = set(ids(slug))
    for s in subs: members |= set(ids(s))
    categories.append({'slug': slug, 'name': label, 'blurb': blurb, 'subs': sub, 'count': len(members)})

# ---- helpers ----
ALLOWED = ['h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'br', 'table', 'thead', 'tbody', 'tr', 'td', 'th']
def clean_html(h):
    h = bleach.clean(h or '', tags=ALLOWED, attributes={}, strip=True)
    h = re.sub(r'<p>\s*(&nbsp;)?\s*</p>', '', h)
    h = re.sub(r'\s+', ' ', h).replace('> <', '><').strip()
    return h

def text(h):
    return re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', ' ', h or ''))).strip()

USAGE = re.compile(r"utilisation|comment utiliser|posologie|dosage|précaution", re.I)
NUTRI = re.compile(r"composition|valeurs nutritionnelles|ingrédient|profil nutritionnel", re.I)
def split_sections(h):
    """Split the original description at its own h2/h3 headings into description / usage / composition."""
    parts = re.split(r'(?=<h[23]>)', h)
    out = {'description': '', 'usage': '', 'composition': ''}
    for p in parts:
        m = re.match(r'<h[23]>(.*?)</h[23]>', p)
        title = text(m.group(1)) if m else ''
        key = 'usage' if USAGE.search(title) else 'composition' if NUTRI.search(title) else 'description'
        out[key] += p
    # first h2 usually repeats the product name -> drop it
    out['description'] = re.sub(r'^<h2>.*?</h2>', '', out['description'])
    return out

def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')

def norm_brand(b):
    return re.sub(r'\s+', ' ', b).strip() if b else None

def short_name(name, brand):
    n = re.sub(r'\s+', ' ', name).strip()
    if not brand:
        return n
    btoks = set(re.findall(r'[A-Z0-9]+', brand.upper()))
    for sep in (r'\s[-–]\s', r'\s?[-–]\s', r'\s[-–]\s?'):
        parts = re.split(sep, n, maxsplit=1)
        if len(parts) == 2:
            ptoks = re.findall(r'[A-Z0-9]+', parts[0].upper())
            if ptoks and (sum(t in btoks for t in ptoks) >= max(1, len(ptoks) - 1)):
                return parts[1].strip()
    return n

STOCK = {'En Stock': 'in_stock', 'Derniers articles en stock': 'low_stock', 'En attente de réapprovisionnement': 'backorder', 'Rupture de stock': 'out_of_stock'}

best = ids('meilleures-ventes'); new = set(ids('nouveaux-produits'))
L = {p['id']: p for p in d['list']}

# category membership (deepest + top)
member = {}
for slug, label, blurb, subs in TAXO:
    for s in [slug] + subs:
        for i in ids(s):
            member.setdefault(i, {'top': set(), 'sub': set()})
            member[i]['top'].add(slug)
            if s != slug: member[i]['sub'].add(s)
for i in ids('packs'):
    member.setdefault(i, {'top': set(), 'sub': set()})['top'].add('packs')

products, slugs = [], set()
for p in d['list']:
    x = det[p['id']]
    brand = norm_brand(p['brand'])
    slug = slugify(p['rewrite'] or p['name'])
    while slug in slugs: slug += '-2'
    slugs.add(slug)
    sec = split_sections(clean_html(x['desc']))
    flavours = []
    for v in x['variants']:
        flavours = [re.sub(r'\s+', ' ', o).strip() for o in v['o'] if o.strip()]
    is_pack = bool(x['pack']) or 'packs' in member.get(p['id'], {}).get('top', set())
    m = member.get(p['id'], {'top': set(), 'sub': set()})
    imgs = [str(i) for i in x['imgs']]
    cover = str(p['cover']) if p['cover'] else (imgs[0] if imgs else None)
    if cover in imgs: imgs.remove(cover); imgs.insert(0, cover)
    products.append({
        'id': p['id'], 'slug': slug, 'name': re.sub(r'\s+', ' ', p['name']).strip(),
        'shortName': short_name(p['name'], brand), 'brand': brand, 'brandSlug': slugify(brand) if brand else None,
        'categories': sorted(m['top']), 'subcategories': sorted(m['sub']),
        'price': p['price'], 'regularPrice': p['regular'] if p['hasDiscount'] and p['regular'] > p['price'] else None,
        'stock': STOCK.get(x['msg'], 'in_stock'), 'flavours': flavours,
        'images': imgs, 'summary': text(x['short']), 'meta': (x.get('meta') or '').strip(),
        'description': sec['description'], 'usage': sec['usage'], 'composition': sec['composition'],
        'isPack': is_pack, 'isNew': p['id'] in new,
        'bestRank': best.index(p['id']) if p['id'] in best else None,
        'dateAdded': x['date'], 'sourceUrl': p['url'],
        'packItems': [{'id': i['id'], 'qty': int(i['q']), 'label': re.sub(r'\s+', ' ', i['n']).strip()} for i in x['pack']],
    })

# ---- pack goals: classified ONLY from the actual pack contents ----
GOALS = [
  ('prise-de-masse', 'Prise de masse', r'gainer|mass(?! tech)|bulk|masse'),
  ('force-performance', 'Force & performance', r'creatin|créatin|pre ?workout|inferno|beta alanine|citrulline|arginine|tribulus|testo'),
  ('recuperation', 'Récupération', r'whey|isolat|isolean|glutamine|eaa|hydra|zma|protein'),
  ('bien-etre', 'Bien-être au quotidien', r'multivitamin|one-a-day|omega|magnesium|zinc|ashwagandha|vitamin'),
  ('seche', 'Sèche & définition', r'lipo|carnitine|brûleur|burner|cla'),
]
BEGINNER = re.compile(r'starter|essentiel|débutant', re.I)
P = {p['id']: p for p in products}
for p in products:
    if not p['packItems']: continue
    content = ' '.join(i['label'] for i in p['packItems']).lower()
    p['goals'] = [g for g, _, rx in GOALS if re.search(rx, content, re.I)]
    if BEGINNER.search(p['name']) or BEGINNER.search(text(p['description'])):
        p['goals'].append('debutant')
    # savings only when every item price is known in today's catalogue
    known = all(i['id'] in P for i in p['packItems'])
    total = round(sum(P[i['id']]['price'] * i['qty'] for i in p['packItems']), 3) if known else None
    # consistency check: each configured item should be named in the pack's own description
    desc = unicodedata.normalize('NFKD', text(p['description'])).encode('ascii', 'ignore').decode().lower()
    STOP = {'pack', 'saveur', 'great', 'sport', 'nutrition', 'capsules', 'caps', 'tablets', 'black', 'white', 'vanille', 'chocolat', 'fruit', 'punch', 'research', 'resarch', 'kevin', 'levrone', 'biotech', 'real', 'pharm', 'ultimate'}
    def words(i):
        n = P[i['id']]['shortName'] if i['id'] in P else i['label']
        n = unicodedata.normalize('NFKD', n).encode('ascii', 'ignore').decode().lower()
        return [w for w in re.findall(r'[a-z]{4,}', n) if w not in STOP]
    mismatch = bool(desc) and any(words(i) and not any(w in desc for w in words(i)) for i in p['packItems'])
    p['packChecked'] = not mismatch
    p['packValue'] = total if total and total > p['price'] and not mismatch else None
pack_goals = [{'slug': g, 'name': n} for g, n, _ in GOALS] + [{'slug': 'debutant', 'name': 'Débuter'}]

# ---- brands ----
from collections import Counter
bc = Counter(p['brand'] for p in products if p['brand'])
brands = [{'name': b, 'slug': slugify(b), 'count': n} for b, n in sorted(bc.items(), key=lambda x: -x[1])]

# ---- images: webp 800 + 400 ----
used = {i for p in products for i in p['images']}
done = 0
for iid in used:
    src = f'{IMG}/p/{iid}.jpg'
    if not os.path.exists(src): print('missing', iid); continue
    for w in (800, 400):
        dst = f'{PUB}/p/{iid}-{w}.webp'
        if os.path.exists(dst): continue
        im = Image.open(src).convert('RGB')
        if im.width > w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        im.save(dst, 'WEBP', quality=80, method=6)
    done += 1
print('images', done)

json.dump(products, open(f'{OUT}/products.json', 'w'), ensure_ascii=False)
json.dump({'categories': categories, 'brands': brands, 'packGoals': pack_goals, 'capturedAt': d['scrapedAt']}, open(f'{OUT}/catalog.json', 'w'), ensure_ascii=False, indent=1)
print(len(products), 'products', os.path.getsize(f'{OUT}/products.json') // 1024, 'KB')
