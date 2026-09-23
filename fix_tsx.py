import re, os

base = r'C:\Users\geral\Desktop\Nova pasta (3)\ISABEL LOJA\artifacts\guia-lojas\src\pages'

configs = {
    'AlimentacaoHome.tsx': '/explorar-alimentacao',
    'BelezaHome.tsx': '/explorar-beleza',
    'CasaHome.tsx': '/explorar-casa',
    'DesportoHome.tsx': '/explorar-desporto',
    'EmpregosHome.tsx': '/explorar-empregos',
    'InfluenciadoresHome.tsx': '/explorar-influenciadores',
    'SaudeHome.tsx': '/explorar-saude',
    'ServicosProfHome.tsx': '/explorar-servicos-prof',
    'TecnologiaHome.tsx': '/explorar-tecnologia',
    'TransportesHome.tsx': '/explorar-transportes',
    'TurismoHome.tsx': '/explorar-turismo',
}

for fname, route in configs.items():
    path = os.path.join(base, fname)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    original = c

    # Fix 1: All broken navigate variants
    broken_patterns = [
        r'navigate\(\\\\+\$route\?\\\\+\+\s*params\.toString\(\)\)',
        r'navigate\(\\\$route\?\\\+\s*params\.toString\(\)\)',
        r'navigate\(\$route\?\+\s*params\.toString\(\)\)',
        r'navigate\(`/[^?]+\?`\s*\+\s*params\.toString\(\)\)',
    ]
    correct = 'navigate(`' + route + '?` + params.toString())'
    for pat in broken_patterns:
        c = re.sub(pat, correct, c)

    # Fix 2: className={w-full ...} -> className={`w-full ...`}
    # Pattern: className={w-full text-left px3 py2.5 rounded-lg text-sm transition-colors ${...}}
    def fix_classname(m):
        inner = m.group(1)
        # Already has backticks? skip
        if inner.startswith('`'):
            return m.group(0)
        return 'className={`' + inner + '`}'
    c = re.sub(r'className=\{(w-full text-left[^}]+\})\}', fix_classname, c)

    # Fix 3: broken button text without template literals
    c = c.replace(
        '{selectedMunicipality ? Explorar em {selectedMunicipality} : Explorar em {selectedProvince}}',
        '{selectedMunicipality ? `Explorar em ${selectedMunicipality}` : `Explorar em ${selectedProvince}`}'
    )

    if c != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f'Fixed: {fname}')
    else:
        print(f'No changes: {fname}')

print('All done!')
