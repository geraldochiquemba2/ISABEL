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
    municipalities: ["Dande (Caxito)", "Panguila", "Ambriz", "Bula Atumba", "Dembos", "Nambuangongo", "Pango Aluquém"],
    localities: {
      "Dande (Caxito)": ["Caxito / Centro", "Açucareira", "Açucareira-Centro", "Bairro 8", "Kalundende", "Sassa Cária", "Kinjanda / Tentativa", "Mubungo", "Quitonhe / Kitonhe", "Quintongola", "Kawango", "Mifuma", "Kingombe", "Quixiquela", "Mussungo", "Kissoma", "Santa Ana", "Kijoão Mendes", "Kingungo", "Riceno", "Caboxa", "Bula", "Mabubas", "Mabubas Militar", "25 de Dezembro", "CCA", "Sassa Pedreira", "Quicabo / Balacende"],
      "Panguila": ["Panguila", "Brasileiros", "Roque Santeiro", "Capari", "Santo Estêvão", "São Tiago", "Rocha Emanuel", "Sassalamba", "Boa Esperança", "Porto Quipiri / Quipire", "Bom Jesus do Dande / Ramal Bom Jesus"],
      "Ambriz": ["Ambriz / Sede", "Ambriz / Centro", "Ambriz-Vila", "Bela Vista", "Tabi"],
      "Bula Atumba": ["Bula Atumba / Sede", "Bula Atumba / Centro", "Bula Atumba-Vila", "Quiage", "Quiage / Centro"],
      "Dembos": ["Quibaxe", "Quibaxe / Sede", "Quibaxe / Centro", "Paredes", "Piri", "São José das Matas", "Coxe"],
      "Nambuangongo": ["Muxaluando", "Muxaluando / Sede", "Muxaluando / Centro", "Cage", "Canacassala", "Gombe", "Quicunzo", "Quixico", "Zala", "Cage Mazumbo"],
      "Pango Aluquém": ["Pango Aluquém / Sede", "Pango Aluquém / Centro", "Pango Aluquém-Vila", "Cazuangongo", "Cazuangongo / Centro"]
    }
  },
  {
    id: "benguela",
    name: "Benguela",
    municipalities: ["Benguela", "Lobito", "Catumbela", "Baía Farta", "Balombo", "Bocoio", "Caimbambo", "Chongorói", "Ganda"],
    localities: {
      "Benguela": ["Asfalto / Centro", "Camunda", "Calundo", "Cambanda", "Candumbo", "Canequetela", "Casas Novas", "Dokota", "Bimbas", "Kalongoloti", "Kalossombékua", "Kamaninga 1", "Kamaninga 2", "Lixeira", "Lupeio", "Nhime", "Setenta", "Setenta e Um", "28 de Maio", "Utomba", "Baía de Santo António", "Bela Vista", "Caota", "Calonomi", "Calohombo", "Calombutão", "Casseque Goa", "Casseque Macau", "Casseque Marítimo", "Esperança", "Morros", "Navegantes", "Talamaniamba", "Uchi", "São João", "Benfica", "Capiras", "Caponte", "Cassoco", "Fronteira", "Asseque", "Seta Antiga", "Calilongue", "Calomanga", "Chingoma", "Pecuária", "Massangarala", "Cotel", "Quioche", "Graça", "Calomburaco", "Cambangela", "Capilongo", "Tchipiandalo / Capiandalo", "Cavaco", "Cawango", "Damba Maria", "Gama", "Mina", "Taca", "Cambambe", "Santa Teresa", "4 de Abril", "11 de Novembro", "17 de Setembro"],
      "Lobito": ["Restinga", "Comercial / Zona Comercial", "Compão", "Cabaia", "Canata", "Caponte", "Bairro da Luz", "4 de Fevereiro", "Cassai", "Porto", "São Miguel", "N'golo de Areia", "São João", "Boa Vida", "Caimama I", "Caimama II", "Kalumba", "Kalumba I", "Kalumba II", "Akongo", "Santa Cruz", "Morro da Rádio", "Vista Alegre", "Bela Vista Baixa", "Naca Preta", "Boa Esperança", "Alto Esperança", "Bela Vista Alta", "Popular", "1.º Chimbula", "2.º Chimbula", "3.º Chimbula", "Alto Liro", "Zâmbia", "Alto Bocoio", "27 de Março", "17 de Setembro", "Golfe", "Liro", "Bandeira", "Estrela", "Canjendende", "Cavipa", "Pomba", "Lobito Velho", "Centralidade Lobito 3000", "Canjala", "Egito Praia"],
      "Catumbela": ["Catumbela / Sede", "Catumbela / Centro", "Catumbela-Vila", "Gama", "Biópio", "Praia Bebé"],
      "Baía Farta": ["Baía Farta / Sede", "Baía Farta / Centro", "Baía Farta-Vila", "Dombe Grande", "Calahanga", "Equimina", "Kalohanga", "Calohanga"],
      "Balombo": ["Balombo / Sede", "Balombo / Centro", "Balombo-Vila", "Chindumbo", "Chingongo", "Maca Mombolo"],
      "Bocoio": ["Bocoio / Sede", "Bocoio / Centro", "Bocoio-Vila", "Chila", "Monte Belo", "Passe", "Cavimbe", "Cubal do Lumbo"],
      "Caimbambo": ["Caimbambo / Sede", "Caimbambo / Centro", "Catengue", "Caiave", "Canhamela", "Viangombe", "Cayave", "Wiyangombe"],
      "Chongorói": ["Chongorói / Sede", "Chongorói / Centro", "Bolonguera", "Camuine", "Kamuine", "Camuine / Sede"],
      "Ganda": ["Ganda / Sede", "Ganda / Centro", "Ganda-Vila", "Babaera", "Chicuma", "Ebanga", "Casseque", "Chikuma"]
    }
  },
  {
    id: "bie",
    name: "Bié",
    municipalities: ["Cuito", "Andulo", "Camacupa", "Catabola", "Chinguar", "Chitembo", "Cuemba", "Cunhinga", "Nharea"],
    localities: {
      "Cuito": ["Centro / Cidade do Cuito", "Catemo", "Catraio", "Sousa", "Chitumba", "Mayaya", "Embala", "Castanheira", "Piloto", "Bairro Azul I", "Bairro Azul II", "Chissindo", "Bairro Militar", "Caluapanda / Kaluapanda", "Cambulucuto / Kambulucuto", "Cantíflas", "Bairro Popular", "Bairro Fátima", "Bairro Câmara", "Bairro Caluco", "Bairro São António", "Cangoti", "Catala", "Centralidade Horizonte", "Cunje", "Camalaia", "Setecol", "Boa Vista"],
      "Andulo": ["Andulo / Sede", "Andulo / Centro", "Andulo-Vila", "Calucinga", "Cassumbe", "Chivaúlo"],
      "Camacupa": ["Camacupa / Sede", "Camacupa / Centro", "Cuanza", "Muinha", "Santo António da Muinha", "Ringoma", "Umpulo"],
      "Catabola": ["Catabola / Sede", "Catabola / Centro", "Caiuera", "Chipeta", "Chiuca", "Sande", "Chissamba"],
      "Chinguar": ["Chinguar / Sede", "Chinguar / Centro", "Cutato", "Cangote"],
      "Chitembo": ["Chitembo / Sede", "Chitembo / Centro", "Cachingues", "Mutumbo", "Mumbué", "Malengue", "Soma Cuanza"],
      "Cuemba": ["Cuemba / Sede", "Cuemba / Centro", "Luando", "Munhango", "Sachinemuna"],
      "Cunhinga": ["Cunhinga / Sede", "Cunhinga / Centro", "Belo Horizonte", "Comuna Sede", "Vouga"],
      "Nharea": ["Nharea / Sede", "Nharea / Centro", "Gamba", "Lúbia", "Caiei", "Dando", "Caieie"]
    }
  },
  {
    id: "cabinda",
    name: "Cabinda",
    municipalities: ["Cabinda", "Cacongo", "Buco-Zau", "Belize"],
    localities: {
      "Cabinda": ["Centro / Baixa da Cidade", "1.º de Maio", "4 de Fevereiro", "Deolinda Rodrigues", "Marien Ngouabi", "A Luta Continua", "A Resistência", "Vitória é Certa", "Amílcar Cabral", "Comandante Gika", "Lombo-Lombo", "Simulambuco", "Vala", "Mbuco", "Cabassango", "Lucola", "Chinga", "Chibodo", "Zongolo", "Subantando", "Chiazi", "Urbanização 4 de Abril / Chibodo", "Centralidade do Chibodo", "Centralidade do Chibodo II", "Vila Olímpica do Cabassango", "Santa Catarina", "Tchinganga", "Povo Grande", "Fortaleza", "Tafe", "Fútila", "Caio", "Malembo", "Malongo"],
      "Cacongo": ["Cacongo / Sede", "Cacongo / Centro", "Cacongo-Vila", "Landana", "Dinge", "Massabi"],
      "Buco-Zau": ["Buco-Zau / Sede", "Buco-Zau / Centro", "Buco-Zau-Vila", "Inhuca", "Necuto"],
      "Belize": ["Belize / Sede", "Belize / Centro", "Luali", "Miconje"]
    }
  },
  {
    id: "cuanza-norte",
    name: "Cuanza Norte",
    municipalities: ["Cazengo (Ndalatando)", "Ambaca", "Cambambe", "Golungo Alto", "Gonguembo", "Lucala", "Quiculungo", "Samba Caju"],
    localities: {
      "Cazengo (Ndalatando)": ["Centro / Ndalatando", "Camundai", "Sassá", "Vieta", "Zona Verde", "Kipata", "Kilamba", "11 de Novembro", "Dom Bosco", "Miradouro", "Mesquita", "Kirima", "Catome de Cima", "Quem Me Ama", "Kudinhenga", "Umeira", "Kamujekete", "Kissecula", "Protótipo", "Pedra d'Água", "Guardachiga", "Tumbinga", "Catoco", "Mutémua", "Mulemba de Baixo", "Mulemba de Cima", "Caxilo", "Capexe", "Cassassa", "Caculuculo", "Cazanga", "Zavula", "Kifue", "Queta", "Pedreira", "Quilómetro 11", "Quilómetro 13", "Quinjio", "Zanga", "Calolo", "Caculo Camuiza"],
      "Ambaca": ["Camabatela", "Camabatela / Sede", "Camabatela / Centro", "Tango", "Maúa", "Bindo", "Luinga", "Mufongo"],
      "Cambambe": ["Dondo", "Dondo / Sede", "Dondo / Centro", "Massangano", "Danje-ia-Menha", "Zenza do Itombe", "São Pedro da Quilemba", "Cambambe-Velho"],
      "Golungo Alto": ["Golungo Alto / Sede", "Golungo Alto / Centro", "Cambondo", "Cêrca", "Quiluanje", "Quilombo quía Puto"],
      "Gonguembo": ["Quilombo dos Dembos", "Quilombo dos Dembos / Sede", "Camame", "Cavunga"],
      "Lucala": ["Lucala / Sede", "Lucala / Centro", "Lucala-Vila", "Quiangombe", "Vale do Benbeze"],
      "Quiculungo": ["Quiculungo / Sede", "Quiculungo / Centro", "Kiculungo", "Comuna Sede"],
      "Samba Caju": ["Samba Caju / Sede", "Samba Caju / Centro", "Samba Caju-Vila", "Samba Lucala", "Samba Lucala / Centro"]
    }
  },
  {
    id: "cuanza-sul",
    name: "Cuanza Sul",
    municipalities: ["Sumbe", "Porto Amboim", "Amboim", "Cassongue", "Cela (Waku Kungo)", "Conda", "Ebo", "Libolo", "Mussende", "Quibala", "Quilenda", "Seles"],
    localities: {
      "Sumbe": ["Centro / Cidade do Sumbe", "Chingo", "Alto Chingo", "Pindu", "Assaca 1", "Assaca 2", "Américo Boa Vida", "Caboqueiro", "Estaleiro", "Pedra 1", "Pedra 2", "Brisa-Mar", "Bumba", "E-15", "Bairro Popular", "Firmar", "1.º de Maio", "Bairro Novo", "Bota Fogo", "Zona 3", "Mundo Verde", "João Simione", "Capembe", "Cangombe", "Kissala 1", "Kissala 2", "Kimbambala", "Boa Esperança", "Dinga Horta", "Cerâmica", "Canjala 2", "Pena Calundo", "Londa 1", "Londa 2", "Pedro Jardim", "Cató", "Serração", "Salinas do Ngunza", "Centralidade do Sumbe", "Terra Prometida", "Quicombo", "Sandinos"],
      "Porto Amboim": ["Porto Amboim / Sede", "Porto Amboim / Centro", "Porto Amboim-Vila", "Capolo", "Kissonde", "Capolo / Centro"],
      "Amboim": ["Gabela", "Gabela / Sede", "Gabela / Centro", "Assango", "Amboim-Vila", "Assango / Centro"],
      "Cassongue": ["Cassongue / Sede", "Cassongue / Centro", "Pambangala", "Dumbi", "Atome"],
      "Cela (Waku Kungo)": ["Waku Kungo", "Waku Kungo / Sede", "Uaco Cungo / Centro", "Quissanga", "Sanga", "Uaco Cungo", "Waku Kungo / Centro"],
      "Conda": ["Conda / Sede", "Conda / Centro", "Conda-Vila", "Cunjo", "Cunjo / Centro"],
      "Ebo": ["Ebo / Sede", "Ebo / Centro", "Condé", "Quissanje", "Cassanje"],
      "Libolo": ["Calulo", "Calulo / Sede", "Calulo / Centro", "Cabuta", "Munenga", "Quissongo"],
      "Mussende": ["Mussende / Sede", "Mussende / Centro", "São Lucas", "Quienha", "Quipaxi"],
      "Quibala": ["Quibala / Sede", "Quibala / Centro", "Cariango", "Dala Cachibo", "Lonhe"],
      "Quilenda": ["Quilenda / Sede", "Quilenda / Centro", "Quilenda-Vila", "Quirimbo", "Quirimbo / Centro"],
      "Seles": ["Seles / Sede", "Ucu-Seles / Centro", "Amboiva", "Botera"]
    }
  },
  {
    id: "cunene",
    name: "Cunene",
    municipalities: ["Cuanhama (Ondjiva)", "Cahama", "Curoca", "Cuvelai", "Namacunde", "Ombadja"],
    localities: {
      "Cahama": ["Cahama / Sede", "Cahama Velha", "Caholo", "Ediva", "Ekonko", "Hacavamba", "Liambinga", "Kambandje", "Mapupu", "Mapeta", "Mercado Municipal", "Mulola", "Mupapa", "Miyumba", "Mbome", "Munhandi", "Ngando", "Okombo I", "Okombo II", "Hatchivandje", "Kawalawa", "Thicua", "Thicua-Sede", "Tchipelongo", "Tangandiva / Uia", "Tityongombe", "Tchipemba", "Tchifito", "Otchinjau / Sede", "Bairro Administrativo", "Caminhei", "Catutula", "Evava", "Etunda", "Evole", "Kambulungo", "Luano", "Matatona", "Mavilahitu", "Mbanho", "Muana", "Nandjimba", "Telapia", "Tchindindi", "Tchindjumba", "Tchiundje", "Tcitoto", "Vilulu"],
      "Cuanhama (Ondjiva)": ["Centro / Ondjiva", "Pioneiro Zeca I", "Pioneiro Zeca II", "Bangula I", "Bangula II", "Castilhos", "Kachila I", "Kachila II", "Kafito I", "Kafito II", "Kakuluvale", "Naipalala I", "Naipalala II", "Okapale", "Oshomukuiyu", "Oshomukuiyu II", "Ekuma"],
      "Curoca": ["Oncócua", "Oncócua / Sede", "Oncócua / Centro", "Chitado", "Chitado / Sede"],
      "Cuvelai": ["Mucolongodijo", "Mucolongodijo / Sede", "Mupa", "Calonga", "Cuvati", "Cubati", "Mukolongodjo", "Omunda", "Mupa / Sede"],
      "Namacunde": ["Namacunde / Sede", "Namacunde / Centro", "Namacunde-Vila", "Chiede", "Melunga-Chiede", "Chiede / Sede"],
      "Ombadja": ["Xangongo", "Xangongo / Sede", "Xangongo / Centro", "Ombala yo Mungu", "Naulila", "Humbe", "Mucope", "Ombala-Yo-Mungo", "Humbe / Sede"]
    }
  },
  {
    id: "huambo",
    name: "Huambo",
    municipalities: ["Huambo", "Caála", "Bailundo", "Catchiungo", "Ecunha", "Londuimbale", "Longonjo", "Mungo", "Tchicala-Tcholoanga", "Tchindjenje", "Ucuma"],
    localities: {
      "Huambo": ["São João", "São João Vilinga", "Cambiote", "Chitutula", "Sassonde 1", "Sassonde 2", "Sassonde 3", "Santo António", "Cavongue", "Cavongue Centro", "Cavongue Baixo", "Cacilhas", "Santa Iria", "Bairro Académico", "Vila Verde", "Calute", "Joaquim Kapango / Kapango", "Munda Paiva", "8 de Fevereiro", "Canhe", "Macolocolo", "Calomanda", "São Luís", "Juventude", "Centralidade do Lossambo", "Lossambo", "Culimahala", "Benfica", "Casseque", "Casseque I", "Casseque II", "Cassenda", "Lufefena", "Lufefena I", "Lufefena II", "Bairro de Fátima", "Bom Pastor", "Camussamba", "Capilongo Baixo", "Capilongo Alto", "Aeroporto", "Bairro do Comércio", "Brigada", "Colemba", "Frederico", "Santa Teresa", "Carilongue", "Lumato", "Camunda Sede", "Cacareua", "Estêvão", "Cidade Alta", "Cidade Alta Sul", "Cidade Baixa", "Casa dos Rapazes", "Bairro Azul", "Mukulonda", "São José", "Canata", "Sandangote", "Bomba Baixa", "Bomba Centro", "Vila Graça", "Tchiva / Chiva", "Quilombo", "Kandjaya", "Calilongue da Cuca", "São Pedro", "São Pedro Urbano", "Licima", "Catumanda", "Aviação", "Mungonane", "Amidos", "Calombringo", "Calilongue", "São Bento", "Kalundo", "Kakelewa", "Chivela", "Munda", "Santa Nganguela", "Belém do Huambo", "Lissimo", "Raimundo", "Ussolo", "Zona Alta", "Rua Bié / Bairro Militar", "Bairro Militar"],
      "Caála": ["Caála Sede", "Caála Velha", "Cemitério (Kalundo)", "Catelenga Velha", "Catelenga Nova", "Cayengula", "Sanhami", "Lenha", "Caterça", "Bloco 7", "Cangola", "Katerça", "Kalilongue", "Kangoti", "Codume", "São Paulo", "CRC", "Mwangunja", "Tchandenda", "Tchipa-Tchiwa", "Compão", "Santa Teresa", "Calai-Brita", "Mangumbala", "Camiliquinhentos", "Cantão Paula", "Mussili", "Ndongwa", "Ngundgi", "Vicassa", "Kambongue", "Kaluwe", "Bem Morar / Quadra Zero", "Centralidade Fernando Faustino Muteca", "Lufefena"],
      "Bailundo": ["Bailundo / Sede", "Bailundo / Centro", "Bailundo-Vila", "Lunge", "Luvemba", "Bimbe", "Hengue", "Hengue-Caculo"],
      "Catchiungo": ["Cachiungo / Sede", "Catchiungo / Centro", "Chinhama", "Chiumbo", "Cachiungo", "Tchinhama", "Tchiumbo"],
      "Ecunha": ["Ecunha / Sede", "Ecunha / Centro", "Quipeio", "Comuna Sede", "Chipeio", "Quipeio / Sede"],
      "Londuimbale": ["Londuimbale / Sede", "Londuimbale / Centro", "Alto Hama", "Ussoque", "Galanga", "Cumbira", "Londuimbali", "Cumbila", "Kumbila", "Ngalanga"],
      "Longonjo": ["Longonjo / Sede", "Longonjo / Centro", "Lépi", "Catabola", "Chilata", "Lépi / Sede"],
      "Mungo": ["Mungo / Sede", "Mungo / Centro", "Cambuengo", "Comuna Sede", "Cambuengo / Sede"],
      "Tchicala-Tcholoanga": ["Chicala-Choloanga / Sede", "Tchicala-Tcholoanga / Centro", "Mbave", "Sambo", "Chicala", "Hungulo", "Samboto"],
      "Tchindjenje": ["Chinjenje / Sede", "Tchindjenje / Centro", "Chiaca", "Comuna Sede", "Chinjenje", "Tchiaca", "Chiaca / Sede"],
      "Ucuma": ["Ucuma / Sede", "Ucuma / Centro", "Cacoma", "Mundundo", "Mundundo (Eleva)", "Cacoma / Sede"]
    }
  },
  {
    id: "huila",
    name: "Huíla",
    municipalities: ["Lubango", "Caconda", "Caluquembe", "Chibia", "Chicomba", "Chipindo", "Cuvango", "Humpata", "Jamba", "Quilengues", "Quipungo"],
    localities: {
      "Lubango": ["Comercial", "Comandante N'zaji", "Dr. António Agostinho Neto", "Sofrio", "A Luta Continua", "Lucrécia", "Lage", "Bula Matady", "João de Almeida", "Mitcha", "Caxote / Socombar", "Lalula", "Nambambi", "Tchioco", "Arimba", "Mateta", "Caculuvule", "Figueira", "Comandante Valódia", "Patrice Lumumba", "Comandante Cowboy", "Cowboy 1", "Mapunda", "Ferrovia", "Zona Industrial", "Santo António", "Veterinária", "Casa Verde", "Escola Portuguesa", "Mutundo", "Benfica", "Capelinha", "Venâncio", "14 de Abril", "Hélder Neto", "Comandante Dack-Doy", "Tchavola"],
      "Caconda": ["Caconda / Sede", "Caconda / Centro", "Gungue", "Uaba", "Cusse", "Gungui", "Waba"],
      "Caluquembe": ["Caluquembe / Sede", "Caluquembe / Centro", "Calépi", "Ngola", "Negola", "Calepi / Sede", "Negola / Sede"],
      "Chibia": ["Chibia / Sede", "Chibia / Centro", "Capunda-Cavilongo", "Quihita", "Jau"],
      "Chicomba": ["Chicomba / Sede", "Chicomba / Centro", "Cutenda", "Comuna Sede", "Kutenda", "Libongue", "Quê"],
      "Chipindo": ["Chipindo / Sede", "Chipindo / Centro", "Bambi", "Comuna Sede", "Bunjei", "Bambi / Sede"],
      "Cuvango": ["Cuvango / Sede", "Cuvango / Centro", "Galangue", "Vicungo", "Vicungo / Sede"],
      "Humpata": ["Humpata / Sede", "Humpata / Centro", "Bata-Bata", "Caholo", "Neves", "Palanca"],
      "Jamba": ["Jamba / Sede", "Jamba / Centro", "Cassinga", "Dongo", "Jamba Mineira", "Cassinga / Sede"],
      "Quilengues": ["Quilengues / Sede", "Quilengues / Centro", "Impulo", "Dinde", "Catala", "Macúli", "Pecuária", "Camunjengue", "Cavinjiliti", "Mulois I", "Mulois II", "Serração", "Zona A"],
      "Quipungo": ["Quipungo / Sede", "Quipungo / Centro", "Comuna Sede", "Cainda", "Ombo", "Hombo", "Sêndi", "Chicungo", "Thicungo"]
    }
  },
  {
    id: "luanda",
    name: "Luanda",
    municipalities: ["Luanda", "Belas", "Cazenga", "Cacuaco", "Viana", "Talatona", "Kilamba Kiaxi", "Ingombota", "Mussulo", "Sambizanga", "Rangel", "Maianga", "Samba", "Camama", "Mulenvos", "Kilamba", "Hoji ya Henda"],
    localities: {
      "Ingombota": ["Ingombota", "Mutamba", "Maculusso", "Kinaxixi", "Coqueiros", "Ilha de Luanda", "Chicala", "Miramar", "Bairro Azul", "Patrice Lumumba", "Porto Pesqueiro", "Soviéticos", "Boa Vista", "Ilha do Cabo", "Chicala I", "Chicala II", "Cidade Alta", "Praia do Bispo"],
      "Cacuaco": ["Cacuaco", "Kikolo", "Paraíso", "Boa Esperança", "Augusto Ngangula", "Cerâmica", "Vidrul", "Belo Monte", "Pescadores", "Kianda", "Pedreira", "Kifangondo", "Panguila", "Barra do Bengo", "Forno de Cal", "Boa Esperanca Central"],
      "Cazenga": ["Cazenga", "Kima Kieza", "Tala Hady", "Cariango", "Calawenda", "Comissão do Cazenga", "Asa Branca", "Madeira", "Quizanga", "Românticos", "Somague", "Tala Hadi", "Grafanil", "Curtumes", "Mabor", "Cuca", "Sonefe"],
      "Viana": ["Viana", "Vila de Viana", "Estalagem", "Comarca", "Taki", "Vila Nova", "Km 9", "Km 12", "Km 14/Suave", "Bita Norte", "Bita Sapú 2", "Boa Esperança", "Vila Chinesa", "Grafanil", "Baía", "Boa Fé", "Capalanga", "Kikuxi", "Vila Flor", "Vila Sede", "Km 30", "Robaldina"],
      "Belas": ["Belas", "Benfica", "Cabolombo", "Ramiros", "Barra do Cuanza", "Quenguela", "Morro dos Veados", "Mundial", "Futungo de Belas", "Quifica", "Miradouro da Lua", "Tombo", "Acongo"],
      "Kilamba Kiaxi": ["Golfe", "Golf 1", "Golf 2", "Nova Vida", "Sapú", "Calemba 2", "Vila Estoril", "Soba Kapassa", "Pia Marta", "Catinton", "Matadidi", "Golfe I", "Golfe II", "Palanca I", "Palanca II", "Havemos de Voltar"],
      "Talatona": ["Talatona", "Talatona 1", "Patriota", "Lar do Patriota", "Zona Verde", "Dangereux", "Benvindo", "Bairro Militar", "Futungo I", "Futungo II", "Fubu", "Chimbicato", "Cidade Universitaria"],
      "Mussulo": ["Mussulo", "Ilha do Mussulo", "Ponta da Barra", "Macoco", "Cambaxi", "Ilha da Cazanga", "Ilheu dos Passaros", "Ilha do Desterro", "Ilha da Quissanga", "Ponta da Mussulo"],
      "Sambizanga": ["Sambizanga", "São Paulo", "Bairro Operário", "Lixeira", "Mota", "Madeira", "Ngola Kiluanje", "Santo Rosa", "Valodia", "Miramar"],
      "Rangel": ["Rangel", "Vila Alice", "Vila Clotilde", "Nelito Soares", "Terra Nova", "Precol", "Marçal", "Congoleses", "Combatentes", "Comissao do Rangel"],
      "Maianga": ["Maianga", "Alvalade", "Cassenda", "Bairro Popular", "Prenda", "Bairro Militar", "Mártires de Kifangondo", "Catambor", "Rocha Pinto", "Cassequel", "Neves Bendinha", "Catinton", "Calemba"],
      "Samba": ["Samba", "Corimba", "Mabunda", "Morro Bento", "Gamek", "Triângulo do Futungo", "Zamba 2", "Pedalé", "Rocha Pinto", "Camuxiba", "Samba Pequena"],
      "Camama": ["Camama", "Camama Sede", "Nova Esperança", "Rei Mandume", "4 de Abril", "Njinga Bande", "Chimbicato", "Simione", "Sonho da Casa Própria", "Jardim do Éden", "Progresso", "Simione I", "Simione II", "Mbondo Chape", "Casas Azuis"],
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
      "Lucapa": ["Camissombo", "Lucapa", "Lucapa / Centro", "Camissombo / Sede"],
      "Xá-Muteba": ["Xá-Muteba", "Iongo", "Quitapa", "Xa-Muteba / Centro", "Iongo / Sede"],
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
      "Saurimo": ["Agostinho Neto", "11 de Novembro", "Sassamba", "Bairro Verde", "Luavur", "Chicumina", "Candembe II", "Sacombe", "Nzaji", "Acampamento", "Mona Quimbundo", "Lufune", "Catoca", "Saulimbo", "Nguali", "Muatxissengue", "Sambau", "Txicucu", "Luele-Samahiji", "Txicomina", "Candala", "Salupa", "Sombo", "Santo Antonio", "Sambuquila", "Terra-Nova", "Chizainga I", "Chizainga II", "Juventude", "Candembe", "Soma", "Fera"],
      "Cacolo": ["Cacolo / Sede", "Cacolo / Centro", "Alto Chicapa", "Xassengue", "Cucumbi", "Alto-Chicapa"],
      "Dala": ["Dala / Sede", "Dala / Centro", "Cazage", "Luma Cassai"],
      "Muconda": ["Muconda / Sede", "Muconda / Centro", "Muriege", "Chiluage", "Cassai Sul"]
    }
  },
  {
    id: "malanje",
    name: "Malanje",
    municipalities: ["Malanje", "Cacuso", "Calandula", "Cambundi-Catembo", "Cangandala", "Caombo", "Cunda-Dia-Baze", "Luquembo", "Marimba", "Massango", "Mucari", "Quela", "Quirima"],
    localities: {
      "Malanje": ["Centro / Cidade de Malanje", "Maxinde", "Catepa / Katepa", "Canâmbua", "Cangambo / Kangambu", "Ritondo", "Quizanga / Kizanga", "Vila Matilde", "Carreira de Tiro I", "Carreira de Tiro II", "Centralidade de Malanje", "Cahala", "Camoma", "Cambundi do Kuiji", "Campo de Aviação", "Massaca", "Cambondo", "Kulamuxito", "Gaiato", "Quizanga da Barraca", "Cafucufuco", "Canzamba"],
      "Cacuso": ["Cacuso / Sede", "Cacuso / Centro", "Lombe", "Quizenga", "Pungo-Andongo", "Soqueco"],
      "Calandula": ["Calandula / Sede", "Calandula / Centro", "Cateco Cangola", "Cota", "Cuale", "Quinje"],
      "Cambundi-Catembo": ["Cambundi Catembo / Sede", "Cambundi-Catembo / Centro", "Quitapa", "Tala Mungongo", "Dumba", "Cambango", "Dumba Cambango"],
      "Cangandala": ["Cangandala / Sede", "Cangandala / Centro", "Bembo", "Culamagia", "Caribo"],
      "Caombo": ["Caombo / Sede", "Caombo / Centro", "Bange-Angola", "Cambo", "Micanda", "Cambo Suinginge", "Mbanji ya Ngola"],
      "Cunda-Dia-Baze": ["Cunda-Dia-Baze / Sede", "Cunda-Dia-Baze / Centro", "Lemba", "Milando"],
      "Luquembo": ["Luquembo / Sede", "Luquembo / Centro", "Quimbango", "Capunda", "Dombo", "Dombo wa Zanga", "Cunga Palanga", "Rimba"],
      "Marimba": ["Marimba / Sede", "Marimba / Centro", "Cabombo", "Tembo-Aluma", "Mangando"],
      "Massango": ["Massango / Sede", "Massango / Centro", "Quihuhu", "Quinguengue"],
      "Mucari": ["Mucari / Sede", "Mucari / Centro", "Catala", "Caxinga", "Muquixe", "Caculama", "Muquixi", "Caculama / Sede"],
      "Quela": ["Quela / Sede", "Quela / Centro", "Xandele", "Moma", "Bângalas"],
      "Quirima": ["Quirima / Sede", "Quirima / Centro", "Sautar", "Comuna Sede", "Sautar / Centro"]
    }
  },
  {
    id: "moxico",
    name: "Moxico",
    municipalities: ["Moxico (Luena)", "Camanongue", "Léua", "Lucano", "Cameia"],
    localities: {
      "Moxico (Luena)": ["Centro / Cidade do Luena", "Santa Rosa", "Social da Juventude", "Sinai Velho", "Sinai Novo", "Kapango", "Sangondo", "Mandembwe", "Nzaji", "Tchifuchi", "Alto Luena", "4 de Fevereiro", "11 de Novembro", "4 de Abril", "Passa Fome", "Aço", "Kawango", "Cangamba", "Tchicala", "Km 5", "Km 7", "Km 9", "Km 11", "Sacassange", "Lucusse"],
      "Camanongue": ["Camanongue / Sede", "Camanongue / Centro", "Comuna Sede"],
      "Léua": ["Léua / Sede", "Léua / Centro", "Liangongo", "Comuna Sede"],
      "Lucano": ["Lucano / Centro", "Lucano / Sede", "Comuna Sede", "Cangamba", "Cangombe", "Cassamba", "Muié", "Tempué"],
      "Cameia": ["Cameia / Sede", "Cameia / Centro", "Lumeje", "Comuna Sede", "Lumeje-Cameia"]
    }
  },
  {
    id: "namibe",
    name: "Namibe",
    municipalities: ["Moçâmedes", "Bibala", "Camucuio", "Tômbwa"],
    localities: {
      "Moçâmedes": ["Centro / Casco Urbano", "Torre do Tombo", "Platô", "Saidy Mingas", "Valódia", "Eucaliptos", "Espírito Santo / Heróis de Mucaba", "Bairro dos Corações", "Ponta de Noronha", "Zona Portuária", "Muinho", "Forte de Santa Rita", "Aida", "Cambongue", "Juventude", "Giraul de Baixo", "Aeroporto", "5 de Abril", "Centralidade 5 de Abril", "Mandume ya Ndemufayo", "Cassange", "Quatro e Meio", "Praia Amélia", "Benfica", "Boa Vista", "Porto Mineiro"],
      "Bibala": ["Bibala / Sede", "Bibala / Centro", "Vila Arriaga", "Caitou", "Lola", "Capangombe", "Bibala-Sede", "Kapagombe", "Bibala / Vila"],
      "Camucuio": ["Camucuio / Sede", "Camucuio / Centro", "Chingo", "Mamué", "Camucuio-Sede", "Cacimbas", "Chingo / Sede"],
      "Tômbwa": ["Tômbwa / Sede", "Tômbwa / Centro", "Porto Alexandre", "Iona", "São Martinho dos Tigres", "Yona", "Savo-Mar", "Torre do Tambo"]
    }
  },
  {
    id: "uige",
    name: "Uíge",
    municipalities: ["Uíge", "Negage", "Mucaba", "Maquela do Zombo", "Damba", "Sanza Pombo", "Ambuíla", "Bembe", "Buengas", "Milunga", "Puri", "Quimbele", "Quitexe"],
    localities: {
      "Uíge": ["Centro / Centro da Cidade", "Popular 1", "Popular 2 / Dunga", "Candombe Velho / Cidade Alta", "Candombe Novo", "Mbemba-Ngango / Bemba-Gango", "Pedreira", "Paviterra", "Piscina", "Kilamba-Kiaxi", "Papelão", "Caquiuia", "Quixicongo", "Bem-Vindo", "Quilala", "Cacole", "Catapa", "Capesu", "Quindenuco", "Gigi", "Paco", "Gai", "Mucondo", "Aeroporto / Paco-Aeroporto", "Ana Paula", "Condo e Bens", "Centralidade do Quilomoso", "Bungo", "Luanga", "Casseche", "Cancungo"],
      "Negage": ["Negage / Sede", "Negage / Centro", "Dimuca", "Quisseque", "Capopa", "Cangundo", "Gozolo", "Kimbanzi", "Bula", "Piri"],
      "Mucaba": ["Mucaba / Sede", "Mucaba / Centro", "Uando", "Comuna Sede", "Uando Mucaba", "Uando Mucaba / Centro"],
      "Maquela do Zombo": ["Maquela do Zombo / Sede", "Maquela do Zombo / Centro", "Quibocolo", "Béu", "Cuilo Futa", "Sacandica"],
      "Damba": ["Damba / Sede", "Damba / Centro", "Mabanza Sosso", "Camatambo", "Lêmboa", "Petecusso"],
      "Sanza Pombo": ["Sanza Pombo / Sede", "Sanza Pombo / Centro", "Cuilo Pombo", "Uamba", "Alfândega"],
      "Ambuíla": ["Nova Ambuíla", "Nova Ambuíla / Sede", "Ambuíla / Centro", "Quipedro"],
      "Bembe": ["Bembe / Sede", "Bembe / Centro", "Lucunga", "Mabaia", "Mabaia / Centro"],
      "Buengas": ["Buengas / Sede", "Buengas / Centro", "Nova Esperança", "Cuilo-Camboso", "Buenga-Sul", "Cuilo Camboso"],
      "Milunga": ["Milunga / Sede", "Milunga / Centro", "Macocola", "Macolo", "Massau", "Macocola / Centro"],
      "Puri": ["Puri / Sede", "Puri / Centro", "Comuna Sede"],
      "Quimbele": ["Quimbele / Sede", "Quimbele / Centro", "Cuango", "Icoca", "Alto Zaza", "Icoca / Centro"],
      "Quitexe": ["Quitexe / Sede", "Quitexe / Centro", "Aldeia Viçosa", "Cambamba", "Vista Alegre", "Aldeia Viçosa / Centro"]
    }
  },
  {
    id: "zaire",
    name: "Zaire",
    municipalities: ["Mbanza Kongo", "Soyo", "Nzeto", "Cuimba", "Nóqui", "Tomboco"],
    localities: {
      "Mbanza Kongo": ["Centro / Centro Histórico", "Sagrada Esperança", "4 de Fevereiro", "11 de Novembro", "Álvaro Buta", "Martins Kiditu", "Deolinda Rodrigues"],
      "Soyo": ["Soyo / Centro", "Kwanda", "Porto do Soyo", "Bairro Marinha", "Bairro Pângala", "Bairro Kikudo", "Bairro Kitona", "Bairro Kimpanzau", "Bairro Mongo Soyo", "Bairro Fina", "Pedra de Feitiço", "Sumba"],
      "Nzeto": ["Nzeto / Sede", "Nzeto / Centro", "Mussera", "Quibala Norte", "Quindeje"],
      "Cuimba": ["Cuimba / Sede", "Cuimba / Centro", "Buela", "Serra da Canda", "Luvaca"],
      "Nóqui": ["Nóqui / Sede", "Nóqui / Centro", "Lufico", "Mepala Lulendo", "Luvo", "Mpala", "Mpala Lulendo"],
      "Tomboco": ["Tomboco / Sede", "Tomboco / Centro", "Quinsimba", "Quinzau"]
    }
  },
  {
    id: "cuando",
    name: "Cuando",
    municipalities: ["Menongue", "Cuchi", "Cuito Cuanavale", "Nancova"],
    localities: {
      "Menongue": ["Centro / Cidade de Menongue", "Popular", "Castilho", "Vitória", "Azul", "Paz", "Saúde", "Forte Menongue", "Centralidade do Tukuve", "Caiundo", "Cueio", "Missombo"],
      "Cuito Cuanavale": ["Cuito Cuanavale / Centro", "Samaria", "Tchissamba", "Tchambinga", "Sacalumbo", "Mavinga", "Longa", "Lupire", "Baixo Longa", "Missombo", "Tumpo", "Chambinga", "Samungure", "Sacatengo", "Cachimbo", "Chinguanja", "Licua", "Lupembe", "Cunjamba", "Cuito Cuanavale Velho"],
      "Cuchi": ["Cuchi / Sede", "Cuchi / Centro", "Cutato", "Chinguanja", "Vissati"],
      "Nancova": ["Nancova / Sede", "Nancova / Centro", "Rito", "Comuna Sede"]
    }
  },
  {
    id: "cubango",
    name: "Cubango",
    municipalities: ["Menongue", "Mavinga", "Dirico", "Calai", "Cuangar", "Rivungo"],
    localities: {
      "Menongue": ["Centro / Cidade de Menongue", "Popular", "Castilho", "Vitória", "Hoji-ya-Henda", "Bom Dia", "Azul", "Cunha", "Paz", "Saúde", "Tomás", "Saprinho", "1.º de Maio", "4 de Abril", "17 de Setembro", "Tchivonde", "Bembua", "Tchipeio", "Forte Menongue", "Bela Vista", "Progresso", "Pandera", "Bairro Novo", "Boa Vida", "Cazenga", "Camungamba", "23 de Março", "Social da Juventude", "Caimanero", "Jubileu", "Tunga", "Calupassa", "Tukuve 1", "Tukuve 2", "Centralidade do Tukuve", "Futungo", "Makueva", "Catubo", "Militar", "Sacampoko", "Senga", "Savipanda"],
      "Mavinga": ["Mavinga / Sede", "Mavinga / Centro", "Cunjamba", "Cutuile", "Luengue", "Cunjamba-Dima"],
      "Dirico": ["Dirico / Sede", "Dirico / Centro", "Xamavera", "Mucusso"],
      "Calai": ["Calai / Sede", "Calai / Centro", "Maue", "Mavengue"],
      "Cuangar": ["Cuangar / Sede", "Cuangar / Centro", "Savate", "Bondo", "Bondo-Caila"],
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
      "Alto Zambeze": ["Cazombo", "Cazombo / Sede", "Cazombo / Centro", "Nana Candundo", "Lumbala Caquengue", "Macondo", "Caianda", "Calunda", "Cavungo", "Lóvua", "Lumbala-Caquengue"],
      "Bundas": ["Lumbala Nguimbo", "Lumbala Nguimbo / Sede", "Lutembo", "Chiume", "Ninda", "Mussuma", "Sessa", "Luvuei"],
      "Luacano": ["Luacano / Sede", "Luacano / Centro", "Lago-Dilolo", "Comuna Sede", "Lago Dilolo"]
    }
  }
];
