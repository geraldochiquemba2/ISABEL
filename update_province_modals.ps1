
# Script para atualizar banners de província estáticos em todos os HomePages
$basePath = "C:\Users\geral\Desktop\Nova pasta (3)\ISABEL LOJA\artifacts\guia-lojas\src\pages"

# Definição de cada arquivo com suas propriedades
$configs = @(
    @{ File = "AlimentacaoHome.tsx"; Color = "#D84315"; BgColor = "#fbe9e7"; BorderColor = "#ffccbc"; TextColor = "#3e1007"; Route = "/explorar-alimentacao"; Subtitle = "Encontre os melhores restaurantes e produtos alimentares perto de si." },
    @{ File = "AutomoveisHome.tsx"; Color = "#c9913a"; BgColor = "#fff8e1"; BorderColor = "#ffe082"; TextColor = "#1a1200"; Route = "/explorar-automoveis"; Subtitle = "Encontre veículos e serviços automóveis perto de si." },
    @{ File = "BelezaHome.tsx"; Color = "#7A4549"; BgColor = "#fce4ec"; BorderColor = "#f8bbd9"; TextColor = "#1a0a0a"; Route = "/explorar-beleza"; Subtitle = "Encontre os melhores salões e serviços de beleza perto de si." },
    @{ File = "CasaHome.tsx"; Color = "#68635D"; BgColor = "#f5f5f0"; BorderColor = "#d7d4cf"; TextColor = "#1a1a14"; Route = "/explorar-casa"; Subtitle = "Encontre serviços e produtos para a sua casa perto de si." },
    @{ File = "DesportoHome.tsx"; Color = "#E65100"; BgColor = "#fff3e0"; BorderColor = "#ffcc80"; TextColor = "#1a0d00"; Route = "/explorar-desporto"; Subtitle = "Encontre equipamentos e serviços desportivos perto de si." },
    @{ File = "EmpregosHome.tsx"; Color = "#4527A0"; BgColor = "#ede7f6"; BorderColor = "#ce93d8"; TextColor = "#0d0020"; Route = "/explorar-empregos"; Subtitle = "Oportunidades profissionais perto de si, onde estiver." },
    @{ File = "InfluenciadoresHome.tsx"; Color = "#C2185B"; BgColor = "#fce4ec"; BorderColor = "#f48fb1"; TextColor = "#1a0011"; Route = "/explorar-influenciadores"; Subtitle = "Encontre influenciadores e criadores de conteúdo perto de si." },
    @{ File = "SaudeHome.tsx"; Color = "#2E7D32"; BgColor = "#e8f5e9"; BorderColor = "#c8e6c9"; TextColor = "#0a1f0a"; Route = "/explorar-saude"; Subtitle = "Encontre clínicas e profissionais de saúde perto de si." },
    @{ File = "ServicosProfHome.tsx"; Color = "#1A237E"; BgColor = "#e8eaf6"; BorderColor = "#c5cae9"; TextColor = "#080d30"; Route = "/explorar-servicos-prof"; Subtitle = "Encontre serviços profissionais perto de si, onde estiver." },
    @{ File = "TecnologiaHome.tsx"; Color = "#1565C0"; BgColor = "#e3f2fd"; BorderColor = "#bbdefb"; TextColor = "#060e22"; Route = "/explorar-tecnologia"; Subtitle = "Encontre soluções tecnológicas e serviços digitais perto de si." },
    @{ File = "TransportesHome.tsx"; Color = "#F57F17"; BgColor = "#fffde7"; BorderColor = "#fff176"; TextColor = "#1a1200"; Route = "/explorar-transportes"; Subtitle = "Encontre serviços de transporte perto de si, onde estiver." },
    @{ File = "TurismoHome.tsx"; Color = "#00796B"; BgColor = "#e0f2f1"; BorderColor = "#b2dfdb"; TextColor = "#00100e"; Route = "/explorar-turismo"; Subtitle = "Encontre destinos e serviços turísticos perto de si." }
)

foreach ($cfg in $configs) {
    $filePath = Join-Path $basePath $cfg.File
    Write-Host "Processing: $($cfg.File)"
    
    $content = Get-Content $filePath -Raw -Encoding UTF8
    
    # 1. Add ANGOLA_PROVINCES import if not present
    if ($content -notmatch "ANGOLA_PROVINCES") {
        $content = $content -replace "(import \{ fetchStores \} from `"@/lib/api`";)", "`$1`nimport { ANGOLA_PROVINCES } from `"@/data/angolaData`";"
    }
    
    # 2. Add modal states if not present - after const [menuOpen, setMenuOpen]
    if ($content -notmatch "showProvinceModal") {
        $content = $content -replace "(const \[menuOpen, setMenuOpen\] = useState\(false\);)", "`$1`n  const [showProvinceModal, setShowProvinceModal] = useState(false);`n  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);`n  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);"
    }
    
    # 3. Add municipalities computed var and handleProvinceSelect before return ()
    if ($content -notmatch "handleProvinceSelect") {
        $route = $cfg.Route
        $insertCode = @"

  const municipalities = selectedProvince
    ? ANGOLA_PROVINCES.find((p) => p.name === selectedProvince)?.municipalities || []
    : [];

  const handleProvinceSelect = () => {
    if (selectedProvince) {
      const params = new URLSearchParams();
      params.set("provincia", selectedProvince);
      if (selectedMunicipality) params.set("municipio", selectedMunicipality);
      navigate(`$route?`+ params.toString());
      setShowProvinceModal(false);
    }
  };

  return (
"@
        $content = $content -replace "(\r?\n  return \()", $insertCode
    }
    
    Write-Host "  States and functions added OK"
    Set-Content $filePath $content -Encoding UTF8
    Write-Host "  Done: $($cfg.File)"
}

Write-Host "`nAll files processed!"
