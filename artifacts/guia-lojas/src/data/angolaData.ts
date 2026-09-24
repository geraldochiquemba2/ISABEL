export interface Province {
  id: string;
  name: string;
  municipalities: string[];
  /** Bairros/localidades por município (cadastro e filtros). Chave = nome do município. */
  localities?: Record<string, string[]>;
}

export const ANGOLA_PROVINCES: Province[] = [
  {
    id: "bengo",
    name: "Bengo",
    municipalities: ["Dande (Caxito)", "Panguila", "Ambriz", "Bula Atumba", "Dembos", "Nambuangongo", "Pango Aluquém", "Barra do Dande", "Úcua"],
    localities: {
      "Úcua": ["Úcua / Sede", "Úcua / Centro"],
      "Barra do Dande": ["Barra do Dande / Sede", "Barra do Dande / Centro", "Foz do Dande"],
      "Dande (Caxito)": ["Caxito / Centro", "Açucareira", "Açucareira-Centro", "Bairro 8", "Kalundende", "Sassa Cária", "Kinjanda / Tentativa", "Mubungo", "Quitonhe / Kitonhe", "Quintongola", "Kawango", "Mifuma", "Kingombe", "Quixiquela", "Mussungo", "Kissoma", "Santa Ana", "Kijoão Mendes", "Kingungo", "Riceno", "Caboxa", "Bula", "Mabubas", "Mabubas Militar", "25 de Dezembro", "CCA", "Sassa Pedreira", "Quicabo / Balacende", "Cidade de Dande"],
      "Panguila": ["Panguila", "Brasileiros", "Roque Santeiro", "Capari", "Santo Estêvão", "São Tiago", "Rocha Emanuel", "Sassalamba", "Boa Esperança", "Porto Quipiri / Quipire", "Bom Jesus do Dande / Ramal Bom Jesus"],
      "Ambriz": ["Ambriz / Sede", "Ambriz / Centro", "Ambriz-Vila", "Bela Vista", "Tabi"],
      "Bula Atumba": ["Bula Atumba / Sede", "Bula Atumba / Centro", "Bula Atumba-Vila", "Quiage", "Quiage / Centro"],
      "Dembos": ["Quibaxe", "Quibaxe / Sede", "Quibaxe / Centro", "Paredes", "Piri", "São José das Matas", "Coxe", "Piri / Sede", "Piri / Centro"],
      "Nambuangongo": ["Muxaluando", "Muxaluando / Sede", "Muxaluando / Centro", "Cage", "Canacassala", "Gombe", "Quicunzo", "Quixico", "Zala", "Cage Mazumbo", "Quicunzo / Sede", "Quicunzo / Centro"],
      "Pango Aluquém": ["Pango Aluquém / Sede", "Pango Aluquém / Centro", "Pango Aluquém-Vila", "Cazuangongo", "Cazuangongo / Centro"]
    }
  },
  {
    id: "benguela",
    name: "Benguela",
    municipalities: ["Benguela", "Lobito", "Catumbela", "Baía Farta", "Balombo", "Bocoio", "Caimbambo", "Chongorói", "Ganda", "Cubal"],
    localities: {
      "Cubal": ["Cubal / Sede", "Capupa", "Tumbulo", "Iambala", "Capupa / Sede", "Capupa / Centro", "Iambala / Sede", "Iambala / Centro"],
      "Benguela": ["Asfalto / Centro", "Camunda", "Calundo", "Cambanda", "Candumbo", "Canequetela", "Casas Novas", "Dokota", "Bimbas", "Kalongoloti", "Kalossombékua", "Kamaninga 1", "Kamaninga 2", "Lixeira", "Lupeio", "Nhime", "Setenta", "Setenta e Um", "28 de Maio", "Utomba", "Baía de Santo António", "Bela Vista", "Caota", "Calonomi", "Calohombo", "Calombutão", "Casseque Goa", "Casseque Macau", "Casseque Marítimo", "Esperança", "Morros", "Navegantes", "Talamaniamba", "Uchi", "São João", "Benfica", "Capiras", "Caponte", "Cassoco", "Fronteira", "Asseque", "Seta Antiga", "Calilongue", "Calomanga", "Chingoma", "Pecuária", "Massangarala", "Cotel", "Quioche", "Graça", "Calomburaco", "Cambangela", "Capilongo", "Tchipiandalo / Capiandalo", "Cavaco", "Cawango", "Damba Maria", "Gama", "Mina", "Taca", "Cambambe", "Santa Teresa", "4 de Abril", "11 de Novembro", "17 de Setembro", "Zona A", "Zona B", "Zona C", "Zona D", "Zona E", "Zona F"],
      "Lobito": ["Restinga", "Comercial / Zona Comercial", "Compão", "Cabaia", "Canata", "Caponte", "Bairro da Luz", "4 de Fevereiro", "Cassai", "Porto", "São Miguel", "N'golo de Areia", "São João", "Boa Vida", "Caimama I", "Caimama II", "Kalumba", "Kalumba I", "Kalumba II", "Akongo", "Santa Cruz", "Morro da Rádio", "Vista Alegre", "Bela Vista Baixa", "Naca Preta", "Boa Esperança", "Alto Esperança", "Bela Vista Alta", "Popular", "1.º Chimbula", "2.º Chimbula", "3.º Chimbula", "Alto Liro", "Zâmbia", "Alto Bocoio", "27 de Março", "17 de Setembro", "Golfe", "Liro", "Bandeira", "Estrela", "Canjendende", "Cavipa", "Pomba", "Lobito Velho", "Centralidade Lobito 3000", "Canjala", "Egito Praia", "Hanha"],
      "Catumbela": ["Catumbela / Sede", "Catumbela / Centro", "Catumbela-Vila", "Gama", "Biópio", "Praia Bebé", "Biópio / Sede", "Biópio / Centro"],
      "Baía Farta": ["Baía Farta / Sede", "Baía Farta / Centro", "Baía Farta-Vila", "Dombe Grande", "Calahanga", "Equimina", "Kalohanga", "Calohanga", "Dombe Grande / Sede", "Dombe Grande / Centro"],
      "Balombo": ["Balombo / Sede", "Balombo / Centro", "Balombo-Vila", "Chindumbo", "Chingongo", "Maca Mombolo", "Chingonjo"],
      "Bocoio": ["Bocoio / Sede", "Bocoio / Centro", "Bocoio-Vila", "Chila", "Monte Belo", "Passe", "Cavimbe", "Cubal do Lumbo", "Chila / Sede", "Chila / Centro"],
      "Caimbambo": ["Caimbambo / Sede", "Caimbambo / Centro", "Catengue", "Caiave", "Canhamela", "Viangombe", "Cayave", "Wiyangombe", "Catengue / Sede", "Catengue / Centro", "Canhamela / Sede", "Canhamela / Centro"],
      "Chongorói": ["Chongorói / Sede", "Chongorói / Centro", "Bolonguera", "Camuine", "Kamuine", "Camuine / Sede", "Bolonguera / Sede", "Bolonguera / Centro"],
      "Ganda": ["Ganda / Sede", "Ganda / Centro", "Ganda-Vila", "Babaera", "Chicuma", "Ebanga", "Casseque", "Chikuma", "Chicuma / Sede", "Chicuma / Centro", "Babaera / Sede", "Babaera / Centro"]
    }
  },
  {
    id: "bie",
    name: "Bié",
    municipalities: ["Cuito", "Andulo", "Camacupa", "Catabola", "Chinguar", "Chitembo", "Cuemba", "Cunhinga", "Nharea", "Chicala"],
    localities: {
      "Chicala": ["Chicala / Sede", "Chicala / Centro"],
      "Cuito": ["Centro / Cidade do Cuito", "Catemo", "Catraio", "Sousa", "Chitumba", "Mayaya", "Embala", "Castanheira", "Piloto", "Bairro Azul I", "Bairro Azul II", "Chissindo", "Bairro Militar", "Caluapanda / Kaluapanda", "Cambulucuto / Kambulucuto", "Cantíflas", "Bairro Popular", "Bairro Fátima", "Bairro Câmara", "Bairro Caluco", "Bairro São António", "Cangoti", "Catala", "Centralidade Horizonte", "Cunje", "Camalaia", "Setecol", "Boa Vista", "Trumba"],
      "Andulo": ["Andulo / Sede", "Andulo / Centro", "Andulo-Vila", "Calucinga", "Cassumbe", "Chivaúlo", "Calucinga / Sede", "Calucinga / Centro"],
      "Camacupa": ["Camacupa / Sede", "Camacupa / Centro", "Cuanza", "Muinha", "Santo António da Muinha", "Ringoma", "Umpulo", "Ringoma / Sede", "Ringoma / Centro"],
      "Catabola": ["Catabola / Sede", "Catabola / Centro", "Caiuera", "Chipeta", "Chiuca", "Sande", "Chissamba", "Chipeta / Sede", "Chipeta / Centro"],
      "Chinguar": ["Chinguar / Sede", "Chinguar / Centro", "Cutato", "Cangote"],
      "Chitembo": ["Chitembo / Sede", "Chitembo / Centro", "Cachingues", "Mutumbo", "Mumbué", "Malengue", "Soma Cuanza", "Mumbué / Sede"],
      "Cuemba": ["Cuemba / Sede", "Cuemba / Centro", "Luando", "Munhango", "Sachinemuna", "Luando / Sede", "Luando / Centro"],
      "Cunhinga": ["Cunhinga / Sede", "Cunhinga / Centro", "Belo Horizonte", "Comuna Sede", "Vouga", "Belo Horizonte / Sede", "Belo Horizonte / Centro"],
      "Nharea": ["Nharea / Sede", "Nharea / Centro", "Gamba", "Lúbia", "Caiei", "Dando", "Caieie", "Lúbia / Sede", "Lúbia / Centro"]
    }
  },
  {
    id: "cabinda",
    name: "Cabinda",
    municipalities: ["Cabinda", "Cacongo", "Buco-Zau", "Belize", "Tando Zinze", "Liambo", "Ngoio"],
    localities: {
      "Ngoio": ["Ngoio / Sede", "Ngoio / Centro", "Cabinda Norte"],
      "Liambo": ["Liambo / Sede", "Liambo / Centro"],
      "Tando Zinze": ["Tando Zinze / Sede", "Tando Zinze / Centro", "Malembo"],
      "Cabinda": ["Centro / Baixa da Cidade", "1.º de Maio", "4 de Fevereiro", "Deolinda Rodrigues", "Marien Ngouabi", "A Luta Continua", "A Resistência", "Vitória é Certa", "Amílcar Cabral", "Comandante Gika", "Lombo-Lombo", "Simulambuco", "Vala", "Mbuco", "Cabassango", "Lucola", "Chinga", "Chibodo", "Zongolo", "Subantando", "Chiazi", "Urbanização 4 de Abril / Chibodo", "Centralidade do Chibodo", "Centralidade do Chibodo II", "Vila Olímpica do Cabassango", "Santa Catarina", "Tchinganga", "Povo Grande", "Fortaleza", "Tafe", "Fútila", "Caio", "Malembo", "Malongo", "Tando-Zinze", "Ponta do Farol", "Luvassa", "Mongo Balança", "Ambaca", "Lúcio Tchiweka", "Morro do Chizo", "Zangoio", "Mangue Seco"],
      "Cacongo": ["Cacongo / Sede", "Cacongo / Centro", "Cacongo-Vila", "Landana", "Dinge", "Massabi", "Massabi / Sede", "Massabi / Centro", "Lagoa Massabi"],
      "Buco-Zau": ["Buco-Zau / Sede", "Buco-Zau / Centro", "Buco-Zau-Vila", "Inhuca", "Necuto", "Necuto / Sede", "Necuto / Centro"],
      "Belize": ["Belize / Sede", "Belize / Centro", "Luali", "Miconje", "Miconje / Sede", "Miconje / Centro", "Miconje-Vila"]
    }
  },
  {
    id: "cuanza-norte",
    name: "Cuanza Norte",
    municipalities: ["Cazengo (Ndalatando)", "Ambaca", "Cambambe", "Golungo Alto", "Gonguembo", "Lucala", "Quiculungo", "Samba Caju", "Banga", "Bolongongo", "Terreiro", "Aldeia Nova", "Caculo Cabaça"],
    localities: {
      "Caculo Cabaça": ["Caculo Cabaça / Sede", "Caculo Cabaça / Centro", "Cariamba"],
      "Aldeia Nova": ["Aldeia Nova / Sede", "Aldeia Nova / Centro", "Cariamba"],
      "Terreiro": ["Terreiro / Sede", "Terreiro / Centro", "Quiquiemba"],
      "Bolongongo": ["Bolongongo / Sede", "Bolongongo / Centro", "Quiquiemba"],
      "Banga": ["Banga / Sede", "Banga / Centro", "Cariamba"],
      "Cazengo (Ndalatando)": ["Centro / Ndalatando", "Camundai", "Sassá", "Vieta", "Zona Verde", "Kipata", "Kilamba", "11 de Novembro", "Dom Bosco", "Miradouro", "Mesquita", "Kirima", "Catome de Cima", "Quem Me Ama", "Kudinhenga", "Umeira", "Kamujekete", "Kissecula", "Protótipo", "Pedra d'Água", "Guardachiga", "Tumbinga", "Catoco", "Mutémua", "Mulemba de Baixo", "Mulemba de Cima", "Caxilo", "Capexe", "Cassassa", "Caculuculo", "Cazanga", "Zavula", "Kifue", "Queta", "Pedreira", "Quilómetro 11", "Quilómetro 13", "Quinjio", "Zanga", "Calolo", "Caculo Camuiza"],
      "Ambaca": ["Camabatela", "Camabatela / Sede", "Camabatela / Centro", "Tango", "Maúa", "Bindo", "Luinga", "Mufongo", "Tango / Sede", "Tango / Centro", "Luinga / Sede", "Luinga / Centro"],
      "Cambambe": ["Dondo", "Dondo / Sede", "Dondo / Centro", "Massangano", "Danje-ia-Menha", "Zenza do Itombe", "São Pedro da Quilemba", "Cambambe-Velho", "Massangano / Sede", "Massangano / Centro"],
      "Golungo Alto": ["Golungo Alto / Sede", "Golungo Alto / Centro", "Cambondo", "Cêrca", "Quiluanje", "Quilombo quía Puto", "Cêrca / Sede", "Cêrca / Centro"],
      "Gonguembo": ["Quilombo dos Dembos", "Quilombo dos Dembos / Sede", "Camame", "Cavunga"],
      "Lucala": ["Lucala / Sede", "Lucala / Centro", "Lucala-Vila", "Quiangombe", "Vale do Benbeze"],
      "Quiculungo": ["Quiculungo / Sede", "Quiculungo / Centro", "Kiculungo", "Comuna Sede"],
      "Samba Caju": ["Samba Caju / Sede", "Samba Caju / Centro", "Samba Caju-Vila", "Samba Lucala", "Samba Lucala / Centro"]
    }
  },
  {
    id: "cuanza-sul",
    name: "Cuanza Sul",
    municipalities: ["Sumbe", "Porto Amboim", "Amboim", "Cassongue", "Cela (Waku Kungo)", "Conda", "Ebo", "Libolo", "Mussende", "Quibala", "Quilenda", "Seles", "Gungo", "Gangula", "Boa Entrada"],
    localities: {
      "Boa Entrada": ["Boa Entrada / Sede", "Boa Entrada / Centro"],
      "Gangula": ["Gangula / Sede", "Gangula / Centro", "Quicombo"],
      "Gungo": ["Gungo / Sede", "Gungo / Centro", "Quicombo"],
      "Sumbe": ["Centro / Cidade do Sumbe", "Chingo", "Alto Chingo", "Pindu", "Assaca 1", "Assaca 2", "Américo Boa Vida", "Caboqueiro", "Estaleiro", "Pedra 1", "Pedra 2", "Brisa-Mar", "Bumba", "E-15", "Bairro Popular", "Firmar", "1.º de Maio", "Bairro Novo", "Bota Fogo", "Zona 3", "Mundo Verde", "João Simione", "Capembe", "Cangombe", "Kissala 1", "Kissala 2", "Kimbambala", "Boa Esperança", "Dinga Horta", "Cerâmica", "Canjala 2", "Pena Calundo", "Londa 1", "Londa 2", "Pedro Jardim", "Cató", "Serração", "Salinas do Ngunza", "Centralidade do Sumbe", "Terra Prometida", "Quicombo", "Sandinos"],
      "Porto Amboim": ["Porto Amboim / Sede", "Porto Amboim / Centro", "Porto Amboim-Vila", "Capolo", "Kissonde", "Capolo / Centro"],
      "Amboim": ["Gabela", "Gabela / Sede", "Gabela / Centro", "Assango", "Amboim-Vila", "Assango / Centro"],
      "Cassongue": ["Cassongue / Sede", "Cassongue / Centro", "Pambangala", "Dumbi", "Atome", "Pambangala / Sede", "Pambangala / Centro"],
      "Cela (Waku Kungo)": ["Waku Kungo", "Waku Kungo / Sede", "Uaco Cungo / Centro", "Quissanga", "Sanga", "Uaco Cungo", "Waku Kungo / Centro", "Sanga / Sede", "Sanga / Centro"],
      "Conda": ["Conda / Sede", "Conda / Centro", "Conda-Vila", "Cunjo", "Cunjo / Centro"],
      "Ebo": ["Ebo / Sede", "Ebo / Centro", "Condé", "Quissanje", "Cassanje", "Condé / Sede", "Condé / Centro"],
      "Libolo": ["Calulo", "Calulo / Sede", "Calulo / Centro", "Cabuta", "Munenga", "Quissongo", "Munenga / Sede", "Munenga / Centro", "Quissongo / Sede", "Quissongo / Centro"],
      "Mussende": ["Mussende / Sede", "Mussende / Centro", "São Lucas", "Quienha", "Quipaxi", "Quenha / Sede", "Quenha / Centro"],
      "Quibala": ["Quibala / Sede", "Quibala / Centro", "Cariango", "Dala Cachibo", "Lonhe", "Lonhe / Sede", "Lonhe / Centro"],
      "Quilenda": ["Quilenda / Sede", "Quilenda / Centro", "Quilenda-Vila", "Quirimbo", "Quirimbo / Centro", "Quirimbo / Sede"],
      "Seles": ["Seles / Sede", "Ucu-Seles / Centro", "Amboiva", "Botera", "Amboiva / Sede", "Amboiva / Centro"]
    }
  },
  {
    id: "cunene",
    name: "Cunene",
    municipalities: ["Cuanhama (Ondjiva)", "Cahama", "Curoca", "Cuvelai", "Namacunde", "Ombadja", "Nehone", "Chissuata"],
    localities: {
      "Chissuata": ["Chissuata / Sede", "Chissuata / Centro"],
      "Nehone": ["Nehone / Sede", "Nehone / Centro", "Evale"],
      "Cahama": ["Cahama / Sede", "Cahama Velha", "Caholo", "Ediva", "Ekonko", "Hacavamba", "Liambinga", "Kambandje", "Mapupu", "Mapeta", "Mercado Municipal", "Mulola", "Mupapa", "Miyumba", "Mbome", "Munhandi", "Ngando", "Okombo I", "Okombo II", "Hatchivandje", "Kawalawa", "Thicua", "Thicua-Sede", "Tchipelongo", "Tangandiva / Uia", "Tityongombe", "Tchipemba", "Tchifito", "Otchinjau / Sede", "Bairro Administrativo", "Caminhei", "Catutula", "Evava", "Etunda", "Evole", "Kambulungo", "Luano", "Matatona", "Mavilahitu", "Mbanho", "Muana", "Nandjimba", "Telapia", "Tchindindi", "Tchindjumba", "Tchiundje", "Tcitoto", "Vilulu", "Otchinjau"],
      "Cuanhama (Ondjiva)": ["Centro / Ondjiva", "Pioneiro Zeca I", "Pioneiro Zeca II", "Bangula I", "Bangula II", "Castilhos", "Kachila I", "Kachila II", "Kafito I", "Kafito II", "Kakuluvale", "Naipalala I", "Naipalala II", "Okapale", "Oshomukuiyu", "Oshomukuiyu II", "Ekuma", "Môngua", "Evale", "Simporo", "Tchimporo-Yonde"],
      "Curoca": ["Oncócua", "Oncócua / Sede", "Oncócua / Centro", "Chitado", "Chitado / Sede", "Chitado / Centro"],
      "Cuvelai": ["Mucolongodijo", "Mucolongodijo / Sede", "Mupa", "Calonga", "Cuvati", "Cubati", "Mukolongodjo", "Omunda", "Mupa / Sede", "Mupa / Centro"],
      "Namacunde": ["Namacunde / Sede", "Namacunde / Centro", "Namacunde-Vila", "Chiede", "Melunga-Chiede", "Chiede / Sede", "Melunga"],
      "Ombadja": ["Xangongo", "Xangongo / Sede", "Xangongo / Centro", "Ombala yo Mungu", "Naulila", "Humbe", "Mucope", "Ombala-Yo-Mungo", "Humbe / Sede", "Calueque", "Ombala-Ya-Nalueque", "Roçadas", "Santa Clara", "Oshietekela"]
    }
  },
  {
    id: "huambo",
    name: "Huambo",
    municipalities: ["Huambo", "Caála", "Bailundo", "Catchiungo", "Ecunha", "Londuimbale", "Longonjo", "Mungo", "Tchicala-Tcholoanga", "Tchindjenje", "Ucuma"],
    localities: {
      "Huambo": ["São João", "São João Vilinga", "Cambiote", "Chitutula", "Sassonde 1", "Sassonde 2", "Sassonde 3", "Santo António", "Cavongue", "Cavongue Centro", "Cavongue Baixo", "Cacilhas", "Santa Iria", "Bairro Académico", "Vila Verde", "Calute", "Joaquim Kapango / Kapango", "Munda Paiva", "8 de Fevereiro", "Canhe", "Macolocolo", "Calomanda", "São Luís", "Juventude", "Centralidade do Lossambo", "Lossambo", "Culimahala", "Benfica", "Casseque", "Casseque I", "Casseque II", "Cassenda", "Lufefena", "Lufefena I", "Lufefena II", "Bairro de Fátima", "Bom Pastor", "Camussamba", "Capilongo Baixo", "Capilongo Alto", "Aeroporto", "Bairro do Comércio", "Brigada", "Colemba", "Frederico", "Santa Teresa", "Carilongue", "Lumato", "Camunda Sede", "Cacareua", "Estêvão", "Cidade Alta", "Cidade Alta Sul", "Cidade Baixa", "Casa dos Rapazes", "Bairro Azul", "Mukulonda", "São José", "Canata", "Sandangote", "Bomba Baixa", "Bomba Centro", "Vila Graça", "Tchiva / Chiva", "Quilombo", "Kandjaya", "Calilongue da Cuca", "São Pedro", "São Pedro Urbano", "Licima", "Catumanda", "Aviação", "Mungonane", "Amidos", "Calombringo", "Calilongue", "São Bento", "Kalundo", "Kakelewa", "Chivela", "Munda", "Santa Nganguela", "Belém do Huambo", "Lissimo", "Raimundo", "Ussolo", "Zona Alta", "Rua Bié / Bairro Militar", "Bairro Militar", "Calima", "Chipipa"],
      "Caála": ["Caála Sede", "Caála Velha", "Cemitério (Kalundo)", "Catelenga Velha", "Catelenga Nova", "Cayengula", "Sanhami", "Lenha", "Caterça", "Bloco 7", "Cangola", "Katerça", "Kalilongue", "Kangoti", "Codume", "São Paulo", "CRC", "Mwangunja", "Tchandenda", "Tchipa-Tchiwa", "Compão", "Santa Teresa", "Calai-Brita", "Mangumbala", "Camiliquinhentos", "Cantão Paula", "Mussili", "Ndongwa", "Ngundgi", "Vicassa", "Kambongue", "Kaluwe", "Bem Morar / Quadra Zero", "Centralidade Fernando Faustino Muteca", "Lufefena", "Calenga", "Catata", "Cuima"],
      "Bailundo": ["Bailundo / Sede", "Bailundo / Centro", "Bailundo-Vila", "Lunge", "Luvemba", "Bimbe", "Hengue", "Hengue-Caculo", "Bimbe / Sede", "Bimbe / Centro"],
      "Catchiungo": ["Cachiungo / Sede", "Catchiungo / Centro", "Chinhama", "Chiumbo", "Cachiungo", "Tchinhama", "Tchiumbo"],
      "Ecunha": ["Ecunha / Sede", "Ecunha / Centro", "Quipeio", "Comuna Sede", "Chipeio", "Quipeio / Sede"],
      "Londuimbale": ["Londuimbale / Sede", "Londuimbale / Centro", "Alto Hama", "Ussoque", "Galanga", "Cumbira", "Londuimbali", "Cumbila", "Kumbila", "Ngalanga", "Galanga / Sede", "Galanga / Centro", "Alto Hama / Sede", "Alto Hama / Centro"],
      "Longonjo": ["Longonjo / Sede", "Longonjo / Centro", "Lépi", "Catabola", "Chilata", "Lépi / Sede", "Iava", "Ngombe Ya Lamba"],
      "Mungo": ["Mungo / Sede", "Mungo / Centro", "Cambuengo", "Comuna Sede", "Cambuengo / Sede"],
      "Tchicala-Tcholoanga": ["Chicala-Choloanga / Sede", "Tchicala-Tcholoanga / Centro", "Mbave", "Sambo", "Chicala", "Hungulo", "Samboto", "Sambo / Sede", "Sambo / Centro"],
      "Tchindjenje": ["Chinjenje / Sede", "Tchindjenje / Centro", "Chiaca", "Comuna Sede", "Chinjenje", "Tchiaca", "Chiaca / Sede"],
      "Ucuma": ["Ucuma / Sede", "Ucuma / Centro", "Cacoma", "Mundundo", "Mundundo (Eleva)", "Cacoma / Sede"]
    }
  },
  {
    id: "huila",
    name: "Huíla",
    municipalities: ["Lubango", "Caconda", "Caluquembe", "Chibia", "Chicomba", "Chipindo", "Cuvango", "Humpata", "Jamba", "Quilengues", "Quipungo", "Cacula", "Gambos", "Matala", "Hoque", "Chituto", "Viti Vivali"],
    localities: {
      "Viti Vivali": ["Viti Vivali / Sede", "Viti Vivali / Centro"],
      "Chituto": ["Chituto / Sede", "Chituto / Centro"],
      "Hoque": ["Hoque / Sede", "Hoque / Centro"],
      "Matala": ["Matala / Sede", "Matala / Centro", "Capelongo", "Mulondo", "Capelongo / Sede", "Capelongo / Centro"],
      "Gambos": ["Gambos / Sede", "Chiange", "Chimbemba"],
      "Cacula": ["Cacula / Sede", "Cacula / Centro", "Tchicuaqueia"],
      "Lubango": ["Comercial", "Comandante N'zaji", "Dr. António Agostinho Neto", "Sofrio", "A Luta Continua", "Lucrécia", "Lage", "Bula Matady", "João de Almeida", "Mitcha", "Caxote / Socombar", "Lalula", "Nambambi", "Tchioco", "Arimba", "Mateta", "Caculuvule", "Figueira", "Comandante Valódia", "Patrice Lumumba", "Comandante Cowboy", "Cowboy 1", "Mapunda", "Ferrovia", "Zona Industrial", "Santo António", "Veterinária", "Casa Verde", "Escola Portuguesa", "Mutundo", "Benfica", "Capelinha", "Venâncio", "14 de Abril", "Hélder Neto", "Comandante Dack-Doy", "Tchavola", "Quilemba", "Chimucua", "Eywa", "Kwawa", "Nangombe", "Tchituno", "Centro Histórico", "Bairro Ferroviário"],
      "Caconda": ["Caconda / Sede", "Caconda / Centro", "Gungue", "Uaba", "Cusse", "Gungui", "Waba", "Calonundo", "Cavinde", "Chissuata", "Cutoliongue", "Sacalique", "Tchiteculo", "Uaba Alto", "Chicumandumbo"],
      "Caluquembe": ["Caluquembe / Sede", "Caluquembe / Centro", "Calépi", "Ngola", "Negola", "Calepi / Sede", "Negola / Sede"],
      "Chibia": ["Chibia / Sede", "Chibia / Centro", "Capunda-Cavilongo", "Quihita", "Jau", "Tchicuatiti", "Lufinda", "Olivença-a-Nova"],
      "Chicomba": ["Chicomba / Sede", "Chicomba / Centro", "Cutenda", "Comuna Sede", "Kutenda", "Libongue", "Quê"],
      "Chipindo": ["Chipindo / Sede", "Chipindo / Centro", "Bambi", "Comuna Sede", "Bunjei", "Bambi / Sede"],
      "Cuvango": ["Cuvango / Sede", "Cuvango / Centro", "Galangue", "Vicungo", "Vicungo / Sede", "Galangue / Sede", "Galangue / Centro"],
      "Humpata": ["Humpata / Sede", "Humpata / Centro", "Bata-Bata", "Caholo", "Neves", "Palanca", "Tchivinguiro", "Leba", "Alto-Bimbi", "Estação Zootécnica", "Heva", "Bimbi", "Cipembe", "Hongo"],
      "Jamba": ["Jamba / Sede", "Jamba / Centro", "Cassinga", "Dongo", "Jamba Mineira", "Cassinga / Sede", "Dongo / Sede", "Dongo / Centro", "Tchamutete", "Colui"],
      "Quilengues": ["Quilengues / Sede", "Quilengues / Centro", "Impulo", "Dinde", "Catala", "Macúli", "Pecuária", "Camunjengue", "Cavinjiliti", "Mulois I", "Mulois II", "Serração", "Zona A", "Zona B", "Camulemba", "Bonga", "Ukali", "Mussandji", "Pira", "Quicuco", "Hole", "Tchituli", "Vombo"],
      "Quipungo": ["Quipungo / Sede", "Quipungo / Centro", "Comuna Sede", "Cainda", "Ombo", "Hombo", "Sêndi", "Chicungo", "Thicungo", "Tchiconco", "Barragem do Sendi", "Barragem do Chicungo"]
    }
  },
  {
    id: "luanda",
    name: "Luanda",
    municipalities: ["Luanda", "Belas", "Cazenga", "Cacuaco", "Viana", "Talatona", "Kilamba Kiaxi", "Ingombota", "Mussulo", "Sambizanga", "Rangel", "Maianga", "Samba", "Camama", "Mulenvos", "Kilamba", "Hoji ya Henda"],
    localities: {
      "Ingombota": ["Ingombota", "Mutamba", "Maculusso", "Kinaxixi", "Coqueiros", "Ilha de Luanda", "Chicala", "Miramar", "Bairro Azul", "Patrice Lumumba", "Porto Pesqueiro", "Soviéticos", "Boa Vista", "Ilha do Cabo", "Chicala I", "Chicala II", "Cidade Alta", "Praia do Bispo"],
      "Cacuaco": ["Cacuaco", "Kikolo", "Paraíso", "Boa Esperança", "Augusto Ngangula", "Cerâmica", "Vidrul", "Belo Monte", "Pescadores", "Kianda", "Pedreira", "Kifangondo", "Panguila", "Barra do Bengo", "Forno de Cal", "Boa Esperanca Central"],
      "Cazenga": ["Cazenga", "Kima Kieza", "Tala Hady", "Cariango", "Calawenda", "Comissão do Cazenga", "Asa Branca", "Madeira", "Quizanga", "Românticos", "Somague", "Tala Hadi", "Grafanil", "Curtumes", "Mabor", "Cuca", "Sonefe", "Agostinho Neto", "Terra Vermelha", "Vila Flor", "11 de Novembro"],
      "Viana": ["Viana", "Vila de Viana", "Estalagem", "Comarca", "Taki", "Vila Nova", "Km 9", "Km 12", "Km 14/Suave", "Bita Norte", "Bita Sapú 2", "Boa Esperança", "Vila Chinesa", "Grafanil", "Baía", "Boa Fé", "Capalanga", "Kikuxi", "Vila Flor", "Vila Sede", "Km 30", "Robaldina", "Jardim de Viana", "Vila Azul", "Luanda Sul", "Regedoria", "500 Casas", "Zona Industrial", "Complexo Kikuxi", "Bita Vacaria"],
      "Belas": ["Belas", "Benfica", "Cabolombo", "Ramiros", "Barra do Cuanza", "Quenguela", "Morro dos Veados", "Mundial", "Futungo de Belas", "Quifica", "Miradouro da Lua", "Tombo", "Acongo", "Vila Estoril", "Cambamba", "Bairro Honga", "Bairro Partido"],
      "Kilamba Kiaxi": ["Golfe", "Golf 1", "Golf 2", "Nova Vida", "Sapú", "Calemba 2", "Vila Estoril", "Soba Kapassa", "Pia Marta", "Catinton", "Matadidi", "Golfe I", "Golfe II", "Palanca I", "Palanca II", "Havemos de Voltar", "Palanca"],
      "Talatona": ["Talatona", "Talatona 1", "Patriota", "Lar do Patriota", "Zona Verde", "Dangereux", "Benvindo", "Bairro Militar", "Futungo I", "Futungo II", "Fubu", "Chimbicato", "Cidade Universitaria", "Cidade Financeira"],
      "Mussulo": ["Mussulo", "Ilha do Mussulo", "Ponta da Barra", "Macoco", "Cambaxi", "Ilha da Cazanga", "Ilheu dos Passaros", "Ilha do Desterro", "Ilha da Quissanga", "Ponta da Mussulo"],
      "Sambizanga": ["Sambizanga", "São Paulo", "Bairro Operário", "Lixeira", "Mota", "Madeira", "Ngola Kiluanje", "Santo Rosa", "Valodia", "Miramar"],
      "Rangel": ["Rangel", "Vila Alice", "Vila Clotilde", "Nelito Soares", "Terra Nova", "Precol", "Marçal", "Congoleses", "Combatentes", "Comissao do Rangel"],
      "Maianga": ["Maianga", "Alvalade", "Cassenda", "Bairro Popular", "Prenda", "Bairro Militar", "Mártires de Kifangondo", "Catambor", "Rocha Pinto", "Cassequel", "Neves Bendinha", "Catinton", "Calemba"],
      "Samba": ["Samba", "Corimba", "Mabunda", "Morro Bento", "Gamek", "Triângulo do Futungo", "Zamba 2", "Pedalé", "Rocha Pinto", "Camuxiba", "Samba Pequena"],
      "Camama": ["Camama", "Camama Sede", "Nova Esperança", "Rei Mandume", "4 de Abril", "Njinga Bande", "Chimbicato", "Simione", "Sonho da Casa Própria", "Jardim do Éden", "Progresso", "Simione I", "Simione II", "Mbondo Chape", "Casas Azuis", "Camama II", "Cidade Universitária", "Estádio 11 de Novembro"],
      "Mulenvos": ["Mulenvos", "Mulenvos de Cima", "CAOP-B", "Capalanga", "Estalagem", "Mulenvos de Baixo", "Balumuka", "Bairro dos Mulenvos"],
      "Kilamba": ["Centralidade do Kilamba", "Kilamba", "KK5000", "Projecto Mil Cores", "Vila Flor", "Bita", "Cinco Fios", "Povoado Kimbele", "Sapu Velho"],
      "Hoji ya Henda": ["Hoji ya Henda", "São João", "Fabimor", "Bairro dos Ossos", "Sao Pedro", "Santo Antonio", "Adriano Moreira", "11 de Novembro"],
      "Luanda": ["Luanda / Centro", "Baixa de Luanda", "Mutamba", "Kinaxixi", "Coqueiros", "Ilha de Luanda", "Cruzeiro", "Vila Clotilde"]
    }
  },
  {
    id: "lunda-norte",
    name: "Lunda Norte",
    municipalities: ["Chitato (Dundo)", "Cambulo", "Caungula", "Cuilo", "Cuango", "Lóvua", "Lubalo", "Capenda-Camulemba", "Xá-Muteba", "Dundo", "Chitato", "Mussungue", "Lucapa", "Canzar", "Cassanje Calucala", "Camaxilo", "Cafunfo", "Luremo", "Luangue", "Xá Cassau"],
    localities: {
      "Cambulo": ["Cambulo", "Cachimo", "Nzage", "Nzagi", "Luia", "Canzar", "Andrada"],
      "Capenda-Camulemba": ["Capenda Camulemba", "Xinge", "Capenda-Camulemba", "Capenda", "Camulemba", "Xinge / Sede"],
      "Caungula": ["Caungula", "Caungula / Sede", "Caungula / Centro"],
      "Chitato": ["Chitato", "Dundo-Chitato", "Luachimo", "Samacaca", "Camaquenzo", "Centralidade do Dundo", "Bairro Norte", "Bairro Sul", "Sachindongo", "4 de Abril", "Caxinde", "Cacanda", "Camatundo", "Cassanguidi"],
      "Cuango": ["Cuango", "Luzamba", "Luremo", "Cuango / Sede", "Luzamba / Centro"],
      "Cuilo": ["Caluango", "Cuilo", "Cuilo / Centro", "Cuilo / Sede", "Caluango / Sede"],
      "Lóvua": ["Lóvua", "Lovua / Centro", "Lovua / Sede"],
      "Lubalo": ["Muvuluege", "Lubalo", "Muvulege", "Lubalo / Centro", "Muvuluege / Sede"],
      "Lucapa": ["Camissombo", "Lucapa", "Lucapa / Centro", "Camissombo / Sede", "Capaia", "Xa-Cassau"],
      "Xá-Muteba": ["Xá-Muteba", "Iongo", "Quitapa", "Xa-Muteba / Centro", "Iongo / Sede", "Cassanje Calucala"],
      "Dundo": ["Dundo", "Luachimo", "Cacanda", "Camatundo", "Cassanguidi", "Samacaca", "Camaquenzo", "Centralidade do Dundo", "Bairro Norte", "Estufa", "Bairro Sul", "Sachindongo", "4 de Abril"],
      "Mussungue": ["Mussungue", "Caíta", "Mussungue / Centro", "Caita / Sede"],
      "Canzar": ["Canzar", "Luia", "Canzar / Centro", "Luia / Sede"],
      "Cassanje Calucala": ["Cassanje Calucala", "Iongo", "Cassanje", "Calucala", "Iongo / Sede"],
      "Camaxilo": ["Camaxilo", "Camaxilo / Centro", "Camaxilo / Sede"],
      "Cafunfo": ["Cafunfo", "Cafunfo / Centro", "Cafunfo / Sede", "Vila Mineira de Cafunfo"],
      "Luremo": ["Luremo", "Luremo / Centro", "Luremo / Sede"],
      "Luangue": ["Luangue", "Luangue / Centro", "Luangue / Sede"],
      "Xá Cassau": ["Xá Cassau", "Capaia", "Xa-Cassau", "Xa-Cassau / Centro", "Capaia / Sede"],
      "Chitato (Dundo)": ["Dundo / Centro", "Dundo-Chitato", "Luachimo", "Samacaca", "Camaquenzo", "Centralidade do Dundo", "Bairro Norte", "Bairro Sul", "Estufa", "Sachindongo", "4 de Abril", "Caxinde"]
    }
  },
  {
    id: "lunda-sul",
    name: "Lunda Sul",
    municipalities: ["Saurimo", "Cacolo", "Dala", "Muconda"],
    localities: {
      "Saurimo": ["Agostinho Neto", "11 de Novembro", "Sassamba", "Bairro Verde", "Luavur", "Chicumina", "Candembe II", "Sacombe", "Nzaji", "Acampamento", "Mona Quimbundo", "Lufune", "Catoca", "Saulimbo", "Nguali", "Muatxissengue", "Sambau", "Txicucu", "Luele-Samahiji", "Txicomina", "Candala", "Salupa", "Sombo", "Santo Antonio", "Sambuquila", "Terra-Nova", "Chizainga I", "Chizainga II", "Juventude", "Candembe", "Soma", "Fera", "Camitundo", "Passa-bem", "Manalto", "Aldeia Missão", "Fina"],
      "Cacolo": ["Cacolo / Sede", "Cacolo / Centro", "Alto Chicapa", "Xassengue", "Cucumbi", "Alto-Chicapa", "Xassengue / Sede", "Xassengue / Centro", "Alto Chicapa / Sede", "Alto Chicapa / Centro"],
      "Dala": ["Dala / Sede", "Dala / Centro", "Cazage", "Luma Cassai", "Luma Cassai / Sede", "Luma Cassai / Centro", "Cazage / Sede", "Cazage / Centro"],
      "Muconda": ["Muconda / Sede", "Muconda / Centro", "Muriege", "Chiluage", "Cassai Sul", "Chiluage / Sede", "Chiluage / Centro", "Muriege / Sede", "Muriege / Centro", "Cassai Sul / Sede", "Cassai Sul / Centro"]
    }
  },
  {
    id: "malanje",
    name: "Malanje",
    municipalities: ["Malanje", "Cacuso", "Calandula", "Cambundi-Catembo", "Cangandala", "Caombo", "Cunda-Dia-Baze", "Luquembo", "Marimba", "Massango", "Mucari", "Quela", "Quirima", "Kiwaba Nzoji"],
    localities: {
      "Kiwaba Nzoji": ["Kiwaba Nzoji / Sede", "Kiwaba Nzoji / Centro", "Mufuma"],
      "Malanje": ["Centro / Cidade de Malanje", "Maxinde", "Catepa / Katepa", "Canâmbua", "Cangambo / Kangambu", "Ritondo", "Quizanga / Kizanga", "Vila Matilde", "Carreira de Tiro I", "Carreira de Tiro II", "Centralidade de Malanje", "Cahala", "Camoma", "Cambundi do Kuiji", "Campo de Aviação", "Massaca", "Cambondo", "Kulamuxito", "Gaiato", "Quizanga da Barraca", "Cafucufuco", "Canzamba", "Cambaxe"],
      "Cacuso": ["Cacuso / Sede", "Cacuso / Centro", "Lombe", "Quizenga", "Pungo-Andongo", "Soqueco"],
      "Calandula": ["Calandula / Sede", "Calandula / Centro", "Cateco Cangola", "Cota", "Cuale", "Quinje", "Cateco Cangola / Sede", "Cateco Cangola / Centro"],
      "Cambundi-Catembo": ["Cambundi Catembo / Sede", "Cambundi-Catembo / Centro", "Quitapa", "Tala Mungongo", "Dumba", "Cambango", "Dumba Cambango", "Quitapa / Sede", "Quitapa / Centro"],
      "Cangandala": ["Cangandala / Sede", "Cangandala / Centro", "Bembo", "Culamagia", "Caribo"],
      "Caombo": ["Caombo / Sede", "Caombo / Centro", "Bange-Angola", "Cambo", "Micanda", "Cambo Suinginge", "Mbanji ya Ngola", "Cambo Suinginge / Sede", "Cambo Suinginge / Centro", "Mbanji Ya Ngola / Sede", "Mbanji Ya Ngola / Centro"],
      "Cunda-Dia-Baze": ["Cunda-Dia-Baze / Sede", "Cunda-Dia-Baze / Centro", "Lemba", "Milando", "Milando / Sede", "Milando / Centro"],
      "Luquembo": ["Luquembo / Sede", "Luquembo / Centro", "Quimbango", "Capunda", "Dombo", "Dombo wa Zanga", "Cunga Palanga", "Rimba", "Capunda / Sede", "Capunda / Centro"],
      "Marimba": ["Marimba / Sede", "Marimba / Centro", "Cabombo", "Tembo-Aluma", "Mangando"],
      "Massango": ["Massango / Sede", "Massango / Centro", "Quihuhu", "Quinguengue", "Quihuhu / Sede", "Quihuhu / Centro"],
      "Mucari": ["Mucari / Sede", "Mucari / Centro", "Catala", "Caxinga", "Muquixe", "Caculama", "Muquixi", "Caculama / Sede", "Muquixe / Sede", "Muquixe / Centro", "Caculama / Centro"],
      "Quela": ["Quela / Sede", "Quela / Centro", "Xandele", "Moma", "Bângalas", "Missão dos Bangalas"],
      "Quirima": ["Quirima / Sede", "Quirima / Centro", "Sautar", "Comuna Sede", "Sautar / Centro"]
    }
  },
  {
    id: "moxico",
    name: "Moxico",
    municipalities: ["Moxico (Luena)", "Camanongue", "Léua", "Lucano", "Cameia", "Lumbala Nguimbo", "Lutembo", "Lutuai", "Ninda", "Chiúme", "Alto Cuito"],
    localities: {
      "Alto Cuito": ["Alto Cuito / Sede", "Alto Cuito / Centro"],
      "Chiúme": ["Chiúme / Sede", "Chiúme / Centro", "Sessa"],
      "Ninda": ["Ninda / Sede", "Ninda / Centro", "Sessa"],
      "Lutuai": ["Lutuai / Sede", "Lutuai / Centro", "Muangai"],
      "Lutembo": ["Lutembo / Sede", "Lutembo / Centro", "Luvuei"],
      "Lumbala Nguimbo": ["Lumbala Nguimbo / Sede", "Mussuma Mitete", "Sessa"],
      "Moxico (Luena)": ["Centro / Cidade do Luena", "Santa Rosa", "Social da Juventude", "Sinai Velho", "Sinai Novo", "Kapango", "Sangondo", "Mandembwe", "Nzaji", "Tchifuchi", "Alto Luena", "4 de Fevereiro", "11 de Novembro", "4 de Abril", "Passa Fome", "Aço", "Kawango", "Cangamba", "Tchicala", "Km 5", "Km 7", "Km 9", "Km 11", "Sacassange", "Lucusse", "Cachipoque", "Muangai"],
      "Camanongue": ["Camanongue / Sede", "Camanongue / Centro", "Comuna Sede"],
      "Léua": ["Léua / Sede", "Léua / Centro", "Liangongo", "Comuna Sede"],
      "Lucano": ["Lucano / Centro", "Lucano / Sede", "Comuna Sede", "Cangamba", "Cangombe", "Cassamba", "Muié", "Tempué", "Cangamba / Sede", "Cangamba / Centro"],
      "Cameia": ["Cameia / Sede", "Cameia / Centro", "Lumeje", "Comuna Sede", "Lumeje-Cameia"]
    }
  },
  {
    id: "namibe",
    name: "Namibe",
    municipalities: ["Moçâmedes", "Bibala", "Camucuio", "Tômbwa", "Virei", "Lucira", "Sacomar"],
    localities: {
      "Sacomar": ["Sacomar / Sede", "Sacomar / Centro", "Porto do Sacomar"],
      "Lucira": ["Lucira / Sede", "Lucira / Centro", "Bentiaba"],
      "Virei": ["Virei / Sede", "Virei / Centro", "Cainde"],
      "Moçâmedes": ["Centro / Casco Urbano", "Torre do Tombo", "Platô", "Saidy Mingas", "Valódia", "Eucaliptos", "Espírito Santo / Heróis de Mucaba", "Bairro dos Corações", "Ponta de Noronha", "Zona Portuária", "Muinho", "Forte de Santa Rita", "Aida", "Cambongue", "Juventude", "Giraul de Baixo", "Aeroporto", "5 de Abril", "Centralidade 5 de Abril", "Mandume ya Ndemufayo", "Cassange", "Quatro e Meio", "Praia Amélia", "Benfica", "Boa Vista", "Porto Mineiro", "Giraul de Cima", "Praia das Conchas", "Facada"],
      "Bibala": ["Bibala / Sede", "Bibala / Centro", "Vila Arriaga", "Caitou", "Lola", "Capangombe", "Bibala-Sede", "Kapagombe", "Bibala / Vila"],
      "Camucuio": ["Camucuio / Sede", "Camucuio / Centro", "Chingo", "Mamué", "Camucuio-Sede", "Cacimbas", "Chingo / Sede", "Cacimbas / Sede", "Cacimbas / Centro"],
      "Tômbwa": ["Tômbwa / Sede", "Tômbwa / Centro", "Porto Alexandre", "Iona", "São Martinho dos Tigres", "Yona", "Savo-Mar", "Torre do Tambo", "Iona / Sede", "Iona / Centro", "Baía dos Tigres", "Ilha dos Tigres", "Lagoa do Arco", "Monte Negro", "Tchinungua", "Tchavaya", "Otchifengo", "Cambeno"]
    }
  },
  {
    id: "uige",
    name: "Uíge",
    municipalities: ["Uíge", "Negage", "Mucaba", "Maquela do Zombo", "Damba", "Sanza Pombo", "Ambuíla", "Bembe", "Buengas", "Milunga", "Puri", "Quimbele", "Quitexe", "Songo", "Cangola", "Nsosso"],
    localities: {
      "Nsosso": ["Nsosso / Sede", "Nsosso / Centro"],
      "Cangola": ["Cangola / Sede", "Cangola / Centro", "Caiongo"],
      "Songo": ["Songo / Sede", "Songo / Centro", "Quivuenga"],
      "Uíge": ["Centro / Centro da Cidade", "Popular 1", "Popular 2 / Dunga", "Candombe Velho / Cidade Alta", "Candombe Novo", "Mbemba-Ngango / Bemba-Gango", "Pedreira", "Paviterra", "Piscina", "Kilamba-Kiaxi", "Papelão", "Caquiuia", "Quixicongo", "Bem-Vindo", "Quilala", "Cacole", "Catapa", "Capesu", "Quindenuco", "Gigi", "Paco", "Gai", "Mucondo", "Aeroporto / Paco-Aeroporto", "Ana Paula", "Condo e Bens", "Centralidade do Quilomoso", "Bungo", "Luanga", "Casseche", "Cancungo", "Bungo / Sede", "Bungo / Centro", "Bungo-Vila", "Carmona"],
      "Negage": ["Negage / Sede", "Negage / Centro", "Dimuca", "Quisseque", "Capopa", "Cangundo", "Gozolo", "Kimbanzi", "Bula", "Piri", "Entre-os-Rios"],
      "Mucaba": ["Mucaba / Sede", "Mucaba / Centro", "Uando", "Comuna Sede", "Uando Mucaba", "Uando Mucaba / Centro"],
      "Maquela do Zombo": ["Maquela do Zombo / Sede", "Maquela do Zombo / Centro", "Quibocolo", "Béu", "Cuilo Futa", "Sacandica"],
      "Damba": ["Damba / Sede", "Damba / Centro", "Mabanza Sosso", "Camatambo", "Lêmboa", "Petecusso", "Nsosso", "Nsosso (Lombe)"],
      "Sanza Pombo": ["Sanza Pombo / Sede", "Sanza Pombo / Centro", "Cuilo Pombo", "Uamba", "Alfândega"],
      "Ambuíla": ["Nova Ambuíla", "Nova Ambuíla / Sede", "Ambuíla / Centro", "Quipedro", "Quipedro / Sede", "Quipedro / Centro"],
      "Bembe": ["Bembe / Sede", "Bembe / Centro", "Lucunga", "Mabaia", "Mabaia / Centro", "Lucunga / Sede", "Lucunga / Centro", "Lucanga"],
      "Buengas": ["Buengas / Sede", "Buengas / Centro", "Nova Esperança", "Cuilo-Camboso", "Buenga-Sul", "Cuilo Camboso", "Nova Esperança / Sede", "Nova Esperança / Centro"],
      "Milunga": ["Milunga / Sede", "Milunga / Centro", "Macocola", "Macolo", "Massau", "Macocola / Centro", "Massau / Sede", "Massau / Centro"],
      "Puri": ["Puri / Sede", "Puri / Centro", "Comuna Sede"],
      "Quimbele": ["Quimbele / Sede", "Quimbele / Centro", "Cuango", "Icoca", "Alto Zaza", "Icoca / Centro", "Alto Zaza / Sede", "Alto Zaza / Centro", "Cuango Calumbo"],
      "Quitexe": ["Quitexe / Sede", "Quitexe / Centro", "Aldeia Viçosa", "Cambamba", "Vista Alegre", "Aldeia Viçosa / Centro", "Vista Alegre / Sede", "Vista Alegre / Centro"]
    }
  },
  {
    id: "zaire",
    name: "Zaire",
    municipalities: ["Mbanza Kongo", "Soyo", "Nzeto", "Cuimba", "Nóqui", "Tomboco", "Quêlo"],
    localities: {
      "Quêlo": ["Quêlo / Sede", "Quêlo / Centro", "Pedra de Feitiço"],
      "Mbanza Kongo": ["Centro / Centro Histórico", "Sagrada Esperança", "4 de Fevereiro", "11 de Novembro", "Álvaro Buta", "Martins Kiditu", "Deolinda Rodrigues", "Caluca", "Quiende", "Madimba", "Calambata", "Luvo"],
      "Soyo": ["Soyo / Centro", "Kwanda", "Porto do Soyo", "Bairro Marinha", "Bairro Pângala", "Bairro Kikudo", "Bairro Kitona", "Bairro Kimpanzau", "Bairro Mongo Soyo", "Bairro Fina", "Pedra de Feitiço", "Sumba", "Soyo", "Quelo", "Mangue Grande", "Nsumba", "Kikuilo", "Mpala", "Benza"],
      "Nzeto": ["Nzeto / Sede", "Nzeto / Centro", "Mussera", "Quibala Norte", "Quindeje", "Nzeto"],
      "Cuimba": ["Cuimba / Sede", "Cuimba / Centro", "Buela", "Serra da Canda", "Luvaca", "Cuimba"],
      "Nóqui": ["Nóqui / Sede", "Nóqui / Centro", "Lufico", "Mepala Lulendo", "Luvo", "Mpala", "Mpala Lulendo", "Luvo / Sede", "Luvo / Centro", "Fronteira do Luvo", "Lufico / Sede", "Lufico / Centro"],
      "Tomboco": ["Tomboco / Sede", "Tomboco / Centro", "Quinsimba", "Quinzau"]
    }
  },
  {
    id: "cuando",
    name: "Cuando",
    municipalities: ["Menongue", "Cuchi", "Cuito Cuanavale", "Nancova", "Xipundo", "Dima", "Luiana", "Mucusso", "Luengue"],
    localities: {
      "Luengue": ["Luengue / Sede", "Luengue / Centro"],
      "Mucusso": ["Mucusso / Sede", "Mucusso / Centro"],
      "Luiana": ["Luiana / Sede", "Luiana / Centro", "Chipundo"],
      "Dima": ["Dima / Sede", "Cunjamba", "Cunjamba-Dima", "Cutuile"],
      "Xipundo": ["Xipundo / Sede", "Xipundo / Centro", "Neriquinha"],
      "Menongue": ["Centro / Cidade de Menongue", "Popular", "Castilho", "Vitória", "Azul", "Paz", "Saúde", "Forte Menongue", "Centralidade do Tukuve", "Caiundo", "Cueio", "Missombo", "Hoji-ya-Henda", "Bom Dia", "Cunha", "Tomás", "1.º de Maio"],
      "Cuito Cuanavale": ["Cuito Cuanavale / Centro", "Samaria", "Tchissamba", "Tchambinga", "Sacalumbo", "Mavinga", "Longa", "Lupire", "Baixo Longa", "Missombo", "Tumpo", "Chambinga", "Samungure", "Sacatengo", "Cachimbo", "Chinguanja", "Licua", "Lupembe", "Cunjamba", "Cuito Cuanavale Velho", "Dima", "Luengue", "Xipundo", "Luiana", "Mucusso"],
      "Cuchi": ["Cuchi / Sede", "Cuchi / Centro", "Cutato", "Chinguanja", "Vissati"],
      "Nancova": ["Nancova / Sede", "Nancova / Centro", "Rito", "Comuna Sede"]
    }
  },
  {
    id: "cubango",
    name: "Cubango",
    municipalities: ["Menongue", "Mavinga", "Dirico", "Calai", "Cuangar", "Rivungo", "Cutato", "Longa", "Chinguanja", "Caiundo"],
    localities: {
      "Caiundo": ["Caiundo / Sede", "Cueio-Betre", "Missombo"],
      "Chinguanja": ["Chinguanja / Sede", "Chinguanja / Centro"],
      "Longa": ["Longa / Sede", "Longa / Centro", "Baixo Longa"],
      "Cutato": ["Cutato / Sede", "Cutato / Centro", "Vissati"],
      "Menongue": ["Centro / Cidade de Menongue", "Popular", "Castilho", "Vitória", "Hoji-ya-Henda", "Bom Dia", "Azul", "Cunha", "Paz", "Saúde", "Tomás", "Saprinho", "1.º de Maio", "4 de Abril", "17 de Setembro", "Tchivonde", "Bembua", "Tchipeio", "Forte Menongue", "Bela Vista", "Progresso", "Pandera", "Bairro Novo", "Boa Vida", "Cazenga", "Camungamba", "23 de Março", "Social da Juventude", "Caimanero", "Jubileu", "Tunga", "Calupassa", "Tukuve 1", "Tukuve 2", "Centralidade do Tukuve", "Futungo", "Makueva", "Catubo", "Militar", "Sacampoko", "Senga", "Savipanda", "Jamba Cueio", "Caiundo", "Cueio", "Missombo", "Longa"],
      "Mavinga": ["Mavinga / Sede", "Mavinga / Centro", "Cunjamba", "Cutuile", "Luengue", "Cunjamba-Dima", "Dima", "Licua", "Xipundo", "Luiana"],
      "Dirico": ["Dirico / Sede", "Dirico / Centro", "Xamavera", "Mucusso"],
      "Calai": ["Calai / Sede", "Calai / Centro", "Maue", "Mavengue", "Mavengue / Sede", "Mavengue / Centro"],
      "Cuangar": ["Cuangar / Sede", "Cuangar / Centro", "Savate", "Bondo", "Bondo-Caila", "Savate / Sede", "Savate / Centro"],
      "Rivungo": ["Rivungo / Sede", "Rivungo / Centro", "Luiana", "Chipundo", "Jamba do Cuando", "Neriquinha", "Xipundo", "Jamba-Cueio"]
    }
  },
  {
    id: "icolo-bengo",
    name: "Icolo e Bengo",
    municipalities: ["Catete", "Bom Jesus", "Cabiri", "Caculo Cahango", "Sequele", "Cabo Ledo", "Quiçama", "Calumbo"],
    localities: {
      "Catete": ["Catete", "Cassoneca", "Caculo Cahango", "Caxicane", "Cabala", "Mazozo", "Niguimbe", "Lalama", "Quiminha"],
      "Quiçama": ["Muxima", "Quixinge", "Demba Chio", "Mumbondo", "Fortaleza da Muxima", "Santuario da Muxima", "Parque Nacional da Kissama", "Quiçama / Sede"],
      "Sequele": ["Funda", "Quifangondo", "Sequele", "Centralidade do Sequele", "Caop Casas Novas", "Mayombe", "Bairro 5M", "Rio Seco", "Vila das Ideias", "Mayé-Mayé"],
      "Bom Jesus": ["Bom Jesus", "Bom Jesus / Sede", "Bom Jesus / Centro", "Quilonga Grande", "Margem Direita do Cuanza"],
      "Cabiri": ["Cabiri", "Cabiri / Sede", "Cabiri / Centro", "Centro de Cabiri", "Mabuia", "Banza Quintel"],
      "Cabo Ledo": ["Cabo Ledo", "Cabo Ledo / Sede", "Sangano", "Praia dos Surfistas", "Bairro dos Pescadores", "Rio Longa"],
      "Calumbo": ["Calumbo", "Centralidade Zango 8000", "Zango 1", "Zango 2", "Zango 3A", "Kikuxi", "Kikuxi Betão", "Bairro Escola", "Vila de Calumbo", "Bela Vista"],
      "Caculo Cahango": ["Caculo Cahango / Sede", "Caculo Cahango / Centro", "Comuna Sede"]
    }
  },
  {
    id: "moxico-leste",
    name: "Moxico Leste",
    municipalities: ["Luau", "Alto Zambeze", "Bundas", "Luacano"],
    localities: {
      "Luau": ["Luau / Centro", "Fonte Mucamba", "Chissombo Alfredo", "Chitazo", "Camiza Liwema", "Catota 1", "Luajiji"],
      "Alto Zambeze": ["Cazombo", "Cazombo / Sede", "Cazombo / Centro", "Nana Candundo", "Lumbala Caquengue", "Macondo", "Caianda", "Calunda", "Cavungo", "Lóvua", "Lumbala-Caquengue", "Lóvua Leste"],
      "Bundas": ["Lumbala Nguimbo", "Lumbala Nguimbo / Sede", "Lutembo", "Chiume", "Ninda", "Mussuma", "Sessa", "Luvuei"],
      "Luacano": ["Luacano / Sede", "Luacano / Centro", "Lago-Dilolo", "Comuna Sede", "Lago Dilolo", "Lago Dilolo / Sede", "Lago Dilolo / Centro"]
    }
  }
];
