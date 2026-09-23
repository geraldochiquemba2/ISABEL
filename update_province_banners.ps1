
# Script para converter o banner estático de província em botão clicável com modal
$basePath = "C:\Users\geral\Desktop\Nova pasta (3)\ISABEL LOJA\artifacts\guia-lojas\src\pages"

$configs = @(
    @{ File = "AlimentacaoHome.tsx"; Color = "#D84315"; BgColor = "#fbe9e7"; BorderColor = "#ffccbc"; HoverBg = "#fbe9e7"; Route = "/explorar-alimentacao"; Subtitle = "Encontre os melhores restaurantes e produtos alimentares perto de si." },
    @{ File = "AutomoveisHome.tsx"; Color = "#c9913a"; BgColor = "#fff8e1"; BorderColor = "#ffe082"; HoverBg = "#fff8e1"; Route = "/explorar-automoveis"; Subtitle = "Encontre veículos e serviços automóveis perto de si." },
    @{ File = "BelezaHome.tsx"; Color = "#7A4549"; BgColor = "#fce4ec"; BorderColor = "#f8bbd9"; HoverBg = "#fce4ec"; Route = "/explorar-beleza"; Subtitle = "Encontre os melhores salões e serviços de beleza perto de si." },
    @{ File = "CasaHome.tsx"; Color = "#68635D"; BgColor = "#f5f5f0"; BorderColor = "#d7d4cf"; HoverBg = "#f5f5f0"; Route = "/explorar-casa"; Subtitle = "Encontre serviços e produtos para a sua casa perto de si." },
    @{ File = "DesportoHome.tsx"; Color = "#E65100"; BgColor = "#fff3e0"; BorderColor = "#ffcc80"; HoverBg = "#fff3e0"; Route = "/explorar-desporto"; Subtitle = "Encontre equipamentos e serviços desportivos perto de si." },
    @{ File = "EmpregosHome.tsx"; Color = "#4527A0"; BgColor = "#ede7f6"; BorderColor = "#ce93d8"; HoverBg = "#ede7f6"; Route = "/explorar-empregos"; Subtitle = "Oportunidades profissionais perto de si, onde estiver." },
    @{ File = "InfluenciadoresHome.tsx"; Color = "#C2185B"; BgColor = "#fce4ec"; BorderColor = "#f48fb1"; HoverBg = "#fce4ec"; Route = "/explorar-influenciadores"; Subtitle = "Encontre influenciadores e criadores de conteúdo perto de si." },
    @{ File = "SaudeHome.tsx"; Color = "#2E7D32"; BgColor = "#e8f5e9"; BorderColor = "#c8e6c9"; HoverBg = "#e8f5e9"; Route = "/explorar-saude"; Subtitle = "Encontre clínicas e profissionais de saúde perto de si." },
    @{ File = "ServicosProfHome.tsx"; Color = "#1A237E"; BgColor = "#e8eaf6"; BorderColor = "#c5cae9"; HoverBg = "#e8eaf6"; Route = "/explorar-servicos-prof"; Subtitle = "Encontre serviços profissionais perto de si, onde estiver." },
    @{ File = "TecnologiaHome.tsx"; Color = "#1565C0"; BgColor = "#e3f2fd"; BorderColor = "#bbdefb"; HoverBg = "#e3f2fd"; Route = "/explorar-tecnologia"; Subtitle = "Encontre soluções tecnológicas e serviços digitais perto de si." },
    @{ File = "TransportesHome.tsx"; Color = "#F57F17"; BgColor = "#fffde7"; BorderColor = "#fff176"; HoverBg = "#fffde7"; Route = "/explorar-transportes"; Subtitle = "Encontre serviços de transporte perto de si, onde estiver." },
    @{ File = "TurismoHome.tsx"; Color = "#00796B"; BgColor = "#e0f2f1"; BorderColor = "#b2dfdb"; HoverBg = "#e0f2f1"; Route = "/explorar-turismo"; Subtitle = "Encontre destinos e serviços turísticos perto de si." }
)

foreach ($cfg in $configs) {
    $filePath = Join-Path $basePath $cfg.File
    Write-Host "Processing banner: $($cfg.File)"

    $content = Get-Content $filePath -Raw -Encoding UTF8

    $col = $cfg.Color
    $bgCol = $cfg.BgColor
    $borderCol = $cfg.BorderColor
    $hoverBg = $cfg.HoverBg

    # Skip if already converted
    if ($content -match "setShowProvinceModal\(true\)") {
        Write-Host "  Already converted - skipping."
        continue
    }

    # Build the replacement modal HTML
    $modal = @"

      {/* Province Selection Modal */}
      {showProvinceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setShowProvinceModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#171717]">Escolha a sua localização</h3>
              <button onClick={() => setShowProvinceModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-[#6F7780] uppercase tracking-wider mb-2">Província</h4>
                <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                  {ANGOLA_PROVINCES.map((province) => (
                    <button
                      key={province.id}
                      onClick={() => { setSelectedProvince(province.name); setSelectedMunicipality(null); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${'$'}{
                        selectedProvince === province.name ? "bg-[$col] text-white font-medium" : "hover:bg-[$bgCol] text-[#171717]"
                      }`}
                    >
                      {province.name}
                    </button>
                  ))}
                </div>
              </div>
              {selectedProvince && municipalities.length > 0 && (
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#6F7780] uppercase tracking-wider mb-2">Município</h4>
                  <div className="space-y-1 max-h-[50vh] overflow-y-auto">
                    {municipalities.map((municipality) => (
                      <button
                        key={municipality}
                        onClick={() => setSelectedMunicipality(municipality)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${'$'}{
                          selectedMunicipality === municipality ? "bg-[$col] text-white font-medium" : "hover:bg-[$bgCol] text-[#171717]"
                        }`}
                      >
                        {municipality}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {selectedProvince && (
              <button
                onClick={handleProvinceSelect}
                className="w-full mt-6 bg-[$col] text-white py-3 rounded-xl font-medium transition-colors"
              >
                {selectedMunicipality ? `Explorar em ${'$'}{selectedMunicipality}` : `Explorar em ${'$'}{selectedProvince}`}
              </button>
            )}
          </div>
        </div>
      )}

"@

    # Pattern to find the static province section
    # Replace the static <div> banner with a clickable <button> + modal
    $oldPattern = '(?s)(\{/\* Province \*/\}\s*<section[^>]*>\s*)<div[^>]*>\s*(<div[^>]*>.*?</div>)\s*(<div[^>]*>\s*<p[^>]*>Em todas as prov[^<]*</p>\s*<p[^>]*>[^<]*</p>\s*</div>)\s*(<ChevronRight[^/]*/>\s*)</div>\s*</section>'
    
    if ($content -match $oldPattern) {
        $subtitle = $cfg.Subtitle
        $newBanner = @"
{/* Province */}
      <section className="px-5 py-3">
        <button
          onClick={() => setShowProvinceModal(true)}
          className="w-full flex items-center gap-4 bg-white rounded-2xl px-4 py-4 border border-[$borderCol] hover:border-[$col] transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[$bgCol] flex items-center justify-center"><MapPin size={18} className="text-[$col]" /></div>
          <div className="flex-1 text-left">
            <p className="text-[14px] font-semibold text-[$col]">
              {selectedProvince ? selectedProvince + (selectedMunicipality ? " · " + selectedMunicipality : "") : "Em todas as províncias de Angola"}
            </p>
            <p className="text-[11px] text-[#6B7280]">$subtitle</p>
          </div>
          <ChevronRight size={18} className="text-[$col]" />
        </button>
      </section>$modal
"@
        $content = $content -replace $oldPattern, $newBanner
        Write-Host "  Banner replaced OK"
    } else {
        Write-Host "  WARNING: Could not find static banner pattern in $($cfg.File)"
    }

    Set-Content $filePath $content -Encoding UTF8
    Write-Host "  Done: $($cfg.File)"
}

Write-Host "`nAll banner replacements complete!"
