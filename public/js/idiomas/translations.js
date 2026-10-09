// Static interface translations. User reviews and names retain their original language.
window.RumboTranslations={};
(()=>{
const langs=['es','en','de','fr','it','pt','ja','ko','zh','ar'];
const rows=[
['Inicio','Home','Startseite','Accueil','Home','Início','ホーム','홈','首页','الرئيسية'],
['Destinos','Destinations','Reiseziele','Destinations','Destinazioni','Destinos','目的地','여행지','目的地','الوجهات'],
['Servicios','Services','Leistungen','Services','Servizi','Serviços','サービス','서비스','服务','الخدمات'],
['Mi viaje','My trip','Meine Reise','Mon voyage','Il mio viaggio','Minha viagem','マイ旅行','내 여행','我的旅行','رحلتي'],
['Iniciar sesión','Log in','Anmelden','Se connecter','Accedi','Entrar','ログイン','로그인','登录','تسجيل الدخول'],
['Registrarse','Sign up','Registrieren','Créer un compte','Registrati','Criar conta','新規登録','회원가입','注册','إنشاء حساب'],
['Cerrar sesión','Log out','Abmelden','Se déconnecter','Esci','Sair','ログアウト','로그아웃','退出登录','تسجيل الخروج'],
['Mi cuenta','My account','Mein Konto','Mon compte','Il mio account','Minha conta','アカウント','내 계정','我的账户','حسابي'],
['Menú','Menu','Menü','Menu','Menu','Menu','メニュー','메뉴','菜单','القائمة'],
['Idioma y región','Language and region','Sprache und Region','Langue et région','Lingua e regione','Idioma e região','言語と地域','언어 및 지역','语言和地区','اللغة والمنطقة'],
['Idioma','Language','Sprache','Langue','Lingua','Idioma','言語','언어','语言','اللغة'],
['Región y moneda','Region and currency','Region und Währung','Région et devise','Regione e valuta','Região e moeda','地域と通貨','지역 및 통화','地区和货币','المنطقة والعملة'],
['Guardar preferencias','Save preferences','Einstellungen speichern','Enregistrer','Salva preferenze','Salvar preferências','設定を保存','설정 저장','保存偏好','حفظ التفضيلات'],
['Cancelar','Cancel','Abbrechen','Annuler','Annulla','Cancelar','キャンセル','취소','取消','إلغاء'],
['Cerrar','Close','Schließen','Fermer','Chiudi','Fechar','閉じる','닫기','关闭','إغلاق'],
['Buscar','Search','Suchen','Rechercher','Cerca','Buscar','検索','검색','搜索','بحث'],
['Destino','Destination','Reiseziel','Destination','Destinazione','Destino','目的地','목적지','目的地','الوجهة'],
['Tipo de viaje','Trip type','Reiseart','Type de voyage','Tipo di viaggio','Tipo de viagem','旅行タイプ','여행 유형','旅行类型','نوع الرحلة'],
['Presupuesto','Budget','Budget','Budget','Budget','Orçamento','予算','예산','预算','الميزانية'],
['Vuelos','Flights','Flüge','Vols','Voli','Voos','航空券','항공편','航班','الرحلات الجوية'],
['Vuelo','Flight','Flug','Vol','Volo','Voo','フライト','항공편','航班','رحلة جوية'],
['Hospedaje','Accommodation','Unterkunft','Hébergement','Alloggio','Hospedagem','宿泊','숙박','住宿','الإقامة'],
['Hoteles','Hotels','Hotels','Hôtels','Hotel','Hotéis','ホテル','호텔','酒店','الفنادق'],
['Traslados','Transfers','Transfers','Transferts','Trasferimenti','Traslados','送迎','이동 서비스','接送','خدمات النقل'],
['Transporte','Transport','Transport','Transport','Trasporto','Transporte','交通','교통','交通','النقل'],
['Seguro','Insurance','Versicherung','Assurance','Assicurazione','Seguro','保険','보험','保险','التأمين'],
['Seguro de viaje','Travel insurance','Reiseversicherung','Assurance voyage','Assicurazione viaggio','Seguro viagem','旅行保険','여행 보험','旅行保险','تأمين السفر'],
['Experiencias','Experiences','Aktivitäten','Activités','Esperienze','Experiências','体験','체험','体验','الأنشطة'],
['Tienda','Shop','Shop','Boutique','Negozio','Loja','ショップ','쇼핑','商店','المتجر'],
['Tienda de viaje','Travel shop','Reiseshop','Boutique de voyage','Negozio da viaggio','Loja de viagem','旅行用品店','여행 용품점','旅行商店','متجر السفر'],
['Resumen del viaje','Trip summary','Reiseübersicht','Résumé du voyage','Riepilogo viaggio','Resumo da viagem','旅行の概要','여행 요약','行程摘要','ملخص الرحلة'],
['Buscar vuelos','Search flights','Flüge suchen','Chercher des vols','Cerca voli','Buscar voos','航空券を検索','항공편 검색','搜索航班','البحث عن رحلات'],
['Ver vuelos','View flights','Flüge ansehen','Voir les vols','Vedi voli','Ver voos','航空券を見る','항공편 보기','查看航班','عرض الرحلات'],
['Buscar hoteles','Search hotels','Hotels suchen','Chercher des hôtels','Cerca hotel','Buscar hotéis','ホテルを検索','호텔 검색','搜索酒店','البحث عن فنادق'],
['Explorar destinos','Explore destinations','Reiseziele ansehen','Voir les destinations','Esplora destinazioni','Explorar destinos','目的地を見る','여행지 보기','浏览目的地','تصفح الوجهات'],
['Catálogo de destinos','Destination catalog','Reisezielübersicht','Catalogue des destinations','Catalogo destinazioni','Catálogo de destinos','目的地一覧','여행지 목록','目的地目录','دليل الوجهات'],
['Servicios de viaje','Travel services','Reiseleistungen','Services de voyage','Servizi di viaggio','Serviços de viagem','旅行サービス','여행 서비스','旅行服务','خدمات السفر'],
['Elegir un servicio','Choose a service','Leistung wählen','Choisir un service','Scegli un servizio','Escolher um serviço','サービスを選ぶ','서비스 선택','选择服务','اختيار خدمة'],
['Quiénes somos','About us','Über uns','À propos','Chi siamo','Quem somos','私たちについて','소개','关于我们','من نحن'],
['SOBRE RUMBO','ABOUT RUMBO','ÜBER RUMBO','À PROPOS DE RUMBO','SU RUMBO','SOBRE A RUMBO','RUMBOについて','RUMBO 소개','关于 RUMBO','عن RUMBO'],
['Nuestro equipo.','Our team.','Unser Team.','Notre équipe.','Il nostro team.','Nossa equipe.','私たちのチーム','우리 팀','我们的团队','فريقنا'],
['Nuestro equipo','Our team','Unser Team','Notre équipe','Il nostro team','Nossa equipe','チーム','우리 팀','我们的团队','فريقنا'],
['Francia','France','Frankreich','France','Francia','França','フランス','프랑스','法国','فرنسا'],
['Opciones flexibles','Flexible choices','Flexible Optionen','Choix flexibles','Scelte flessibili','Opções flexíveis','柔軟な選択肢','유연한 선택','灵活选择','خيارات مرنة'],
['Presupuesto visible','Clear budget','Transparentes Budget','Budget clair','Budget chiaro','Orçamento claro','明確な予算','명확한 예산','预算清晰','ميزانية واضحة'],
['Orientación para elegir','Help choosing','Entscheidungshilfe','Aide au choix','Aiuto nella scelta','Ajuda para escolher','選択のサポート','선택 안내','选择指南','مساعدة في الاختيار'],
['Correo electrónico','Email address','E-Mail-Adresse','Adresse e-mail','Indirizzo email','E-mail','メールアドレス','이메일','电子邮箱','البريد الإلكتروني'],
['Contraseña','Password','Passwort','Mot de passe','Password','Senha','パスワード','비밀번호','密码','كلمة المرور'],
['Nombre completo','Full name','Vollständiger Name','Nom complet','Nome completo','Nome completo','氏名','성명','全名','الاسم الكامل'],
['Fecha','Date','Datum','Date','Data','Data','日付','날짜','日期','التاريخ'],
['Pasajeros','Passengers','Reisende','Passagers','Passeggeri','Passageiros','乗客','승객','乘客','المسافرون'],
['Viajeros','Travelers','Reisende','Voyageurs','Viaggiatori','Viajantes','旅行者','여행자','旅客','المسافرون'],
['Habitaciones','Rooms','Zimmer','Chambres','Camere','Quartos','客室','객실','客房','الغرف'],
['Origen','Origin','Abflugort','Départ','Partenza','Origem','出発地','출발지','出发地','نقطة الانطلاق'],
['Salida','Departure','Abreise','Départ','Partenza','Saída','出発','출발','出发','المغادرة'],
['Destino y fechas','Destination and dates','Reiseziel und Termine','Destination et dates','Destinazione e date','Destino e datas','目的地と日程','목적지 및 날짜','目的地和日期','الوجهة والتواريخ'],
['Precios y condiciones','Prices and terms','Preise und Bedingungen','Prix et conditions','Prezzi e condizioni','Preços e condições','料金と条件','가격 및 조건','价格和条款','الأسعار والشروط'],
['Elegir opción','Choose option','Option wählen','Choisir','Scegli opzione','Escolher opção','選択する','옵션 선택','选择选项','اختيار العرض'],
['Ver opciones','View options','Optionen ansehen','Voir les options','Vedi opzioni','Ver opções','選択肢を見る','옵션 보기','查看选项','عرض الخيارات'],
['Limpiar filtros','Clear filters','Filter zurücksetzen','Effacer les filtres','Cancella filtri','Limpar filtros','条件をリセット','필터 초기화','清除筛选','مسح عوامل التصفية'],
['Resumen del servicio','Service summary','Leistungsübersicht','Résumé du service','Riepilogo servizio','Resumo do serviço','サービス概要','서비스 요약','服务摘要','ملخص الخدمة'],
['TU ELECCIÓN','YOUR CHOICE','DEINE AUSWAHL','VOTRE CHOIX','LA TUA SCELTA','SUA ESCOLHA','選択内容','내 선택','您的选择','اختيارك'],
['Anterior','Previous','Zurück','Précédent','Precedente','Anterior','前へ','이전','上一页','السابق'],
['Siguiente','Next','Weiter','Suivant','Successivo','Próximo','次へ','다음','下一页','التالي'],
['LA COMUNIDAD RUMBO','THE RUMBO COMMUNITY','DIE RUMBO-COMMUNITY','LA COMMUNAUTÉ RUMBO','LA COMUNITÀ RUMBO','A COMUNIDADE RUMBO','RUMBOコミュニティ','RUMBO 커뮤니티','RUMBO 社区','مجتمع RUMBO'],
['Tu opinión nos ayuda a mejorar.','Your feedback helps us improve.','Dein Feedback hilft uns, besser zu werden.','Votre avis nous aide à progresser.','La tua opinione ci aiuta a migliorare.','Sua opinião nos ajuda a melhorar.','ご意見が改善につながります。','여러분의 의견으로 더 나아집니다.','您的意见帮助我们改进。','رأيك يساعدنا على التحسين.'],
['Contanos cómo te fue al planificar tu viaje.','Tell us about planning your trip.','Erzähl uns von deiner Reiseplanung.','Racontez-nous la préparation de votre voyage.','Raccontaci come hai pianificato il viaggio.','Conte como foi planejar sua viagem.','旅行計画の感想をお聞かせください。','여행 계획 경험을 알려 주세요.','分享您的旅行规划体验。','أخبرنا عن تجربتك في تخطيط رحلتك.'],
['Valoraciones de Rumbo','Rumbo ratings','Rumbo-Bewertungen','Évaluations de Rumbo','Valutazioni di Rumbo','Avaliações do Rumbo','Rumboの評価','Rumbo 평가','Rumbo 评分','تقييمات Rumbo'],
['Dejá tu reseña','Leave a review','Bewertung schreiben','Laisser un avis','Lascia una recensione','Deixe uma avaliação','レビューを書く','리뷰 작성','撰写评价','اكتب تقييماً'],
['¿Cómo fue tu experiencia?','How was your experience?','Wie war deine Erfahrung?','Comment était votre expérience ?','Come è stata la tua esperienza?','Como foi sua experiência?','ご利用はいかがでしたか？','이용 경험은 어땠나요?','您的体验如何？','كيف كانت تجربتك؟'],
['Tu comentario','Your comment','Dein Kommentar','Votre commentaire','Il tuo commento','Seu comentário','コメント','의견','您的评论','تعليقك'],
['Publicar reseña','Publish review','Bewertung veröffentlichen','Publier un avis','Pubblica recensione','Publicar avaliação','レビューを投稿','리뷰 게시','发布评价','نشر التقييم'],
['¿Qué te gustó o qué podríamos mejorar?','What did you like or what could we improve?','Was hat dir gefallen, was können wir verbessern?','Qu’avez-vous aimé ou que pourrions-nous améliorer ?','Cosa ti è piaciuto e cosa possiamo migliorare?','Do que gostou e o que podemos melhorar?','よかった点や改善点を教えてください。','좋았던 점이나 개선할 점을 알려 주세요.','您喜欢什么？我们可以改进什么？','ما الذي أعجبك وما الذي يمكننا تحسينه؟'],
['Planificación de viajes desde Honduras.','Travel planning from Honduras.','Reiseplanung aus Honduras.','Planifier un voyage depuis le Honduras.','Pianifica il viaggio dall’Honduras.','Planejamento de viagens a partir de Honduras.','ホンジュラスからの旅行計画。','온두라스에서 시작하는 여행 계획.','从洪都拉斯出发的旅行规划。','تخطيط الرحلات من هندوراس.'],
['Somos un equipo hondureño que creó Rumbo para hacer más sencilla la planificación de un viaje.','We are a Honduran team that created Rumbo to make trip planning simpler.','Wir sind ein Team aus Honduras und haben Rumbo entwickelt, um die Reiseplanung zu vereinfachen.','Nous sommes une équipe hondurienne qui a créé Rumbo pour simplifier la préparation des voyages.','Siamo un team honduregno che ha creato Rumbo per semplificare la pianificazione dei viaggi.','Somos uma equipe hondurenha que criou o Rumbo para simplificar o planejamento de viagens.','私たちは旅行計画をもっと簡単にするためにRumboを作ったホンジュラスのチームです。','저희는 여행 계획을 더 쉽게 만들기 위해 Rumbo를 만든 온두라스 팀입니다.','我们是来自洪都拉斯的团队，创建 Rumbo 是为了让旅行规划更简单。','نحن فريق من هندوراس أنشأ Rumbo لتبسيط تخطيط الرحلات.'],
['Combina vuelo, hotel, traslados y experiencias según lo que necesitas.','Combine flights, hotels, transfers and activities to suit your needs.','Kombiniere Flüge, Hotels, Transfers und Aktivitäten nach deinen Wünschen.','Combinez vols, hôtels, transferts et activités selon vos besoins.','Combina voli, hotel, trasferimenti e attività secondo le tue esigenze.','Combine voos, hotéis, traslados e atividades conforme suas necessidades.','航空券、ホテル、送迎、体験を自由に組み合わせましょう。','필요에 맞게 항공편, 호텔, 이동 서비스와 체험을 조합하세요.','根据需要组合航班、酒店、接送和活动。','اجمع الرحلات والفنادق والنقل والأنشطة حسب احتياجاتك.'],
['Consulta precios, descuentos y el total de tus elecciones en Mi viaje.','Check prices, discounts and your total in My trip.','Preise, Rabatte und Gesamtkosten findest du unter Meine Reise.','Consultez prix, réductions et total dans Mon voyage.','Consulta prezzi, sconti e totale in Il mio viaggio.','Veja preços, descontos e total em Minha viagem.','マイ旅行で料金、割引、合計を確認できます。','내 여행에서 가격, 할인, 총액을 확인하세요.','在我的旅行中查看价格、折扣和总额。','راجع الأسعار والخصومات والإجمالي في رحلتي.'],
['Consulta con Rumbito las opciones de destinos y servicios disponibles.','Ask Rumbito about available destinations and services.','Frage Rumbito nach verfügbaren Reisezielen und Leistungen.','Demandez à Rumbito les destinations et services disponibles.','Chiedi a Rumbito le destinazioni e i servizi disponibili.','Consulte o Rumbito sobre destinos e serviços disponíveis.','目的地やサービスについてRumbitoに相談しましょう。','여행지와 서비스는 Rumbito에게 물어보세요.','向 Rumbito 咨询可选目的地和服务。','اسأل Rumbito عن الوجهات والخدمات المتاحة.']
];
langs.forEach((lang,i)=>window.RumboTranslations[lang]=Object.fromEntries(rows.map(row=>[row[0],row[i]])));
})();
(()=>{
const langs=['es','en','de','fr','it','pt','ja','ko','zh','ar'];const rows=[
['Desde','From','Ab','À partir de','Da','A partir de','から','부터','起','من'],
['por persona','per person','pro Person','par personne','a persona','por pessoa','1人あたり','1인당','每人','للشخص'],
['reseñas','reviews','Bewertungen','avis','recensioni','avaliações','件のレビュー','개 리뷰','条评价','تقييمات'],
['reseña','review','Bewertung','avis','recensione','avaliação','件のレビュー','개 리뷰','条评价','تقييم'],
['Buscá tu próximo viaje','Plan your next trip','Plane deine nächste Reise','Préparez votre prochain voyage','Pianifica il prossimo viaggio','Planeje sua próxima viagem','次の旅行を計画','다음 여행을 계획하세요','规划下一次旅行','خطط لرحلتك القادمة'],
['Un destino para tu próximo viaje','A destination for your next trip','Ein Ziel für deine nächste Reise','Une destination pour votre prochain voyage','Una meta per il prossimo viaggio','Um destino para sua próxima viagem','次の旅の目的地','다음 여행을 위한 목적지','下一次旅行的目的地','وجهة لرحلتك القادمة'],
['Ver todos los destinos','View all destinations','Alle Reiseziele','Toutes les destinations','Tutte le destinazioni','Todos os destinos','すべての目的地','모든 여행지 보기','查看所有目的地','عرض كل الوجهات'],
['Elegir al azar','Pick at random','Zufällig wählen','Choisir au hasard','Scegli a caso','Escolher ao acaso','ランダムに選ぶ','무작위 선택','随机选择','اختيار عشوائي'],
['Consultar hospedaje','Find accommodation','Unterkunft suchen','Chercher un hébergement','Cerca alloggio','Buscar hospedagem','宿泊先を検索','숙소 검색','查找住宿','البحث عن إقامة'],
['Consultar traslados','Find transfers','Transfers suchen','Chercher un transfert','Cerca trasferimenti','Buscar traslados','送迎を検索','이동 서비스 검색','查找接送','البحث عن نقل'],
['Conocer opciones','View options','Optionen ansehen','Voir les options','Vedi opzioni','Ver opções','選択肢を見る','옵션 보기','查看选项','عرض الخيارات'],
['Ver experiencias','View experiences','Aktivitäten ansehen','Voir les activités','Vedi esperienze','Ver experiências','体験を見る','체험 보기','查看体验','عرض الأنشطة'],
['Explorar tienda','Browse the shop','Shop ansehen','Voir la boutique','Visita il negozio','Explorar a loja','ショップを見る','쇼핑하기','浏览商店','تصفح المتجر'],
['Experiencias y guías locales','Activities and local guides','Aktivitäten und lokale Guides','Activités et guides locaux','Attività e guide locali','Atividades e guias locais','体験と現地ガイド','체험과 현지 가이드','活动和当地导游','أنشطة ومرشدون محليون'],
['Todos los estilos','All styles','Alle Reisearten','Tous les styles','Tutti gli stili','Todos os estilos','すべてのスタイル','모든 유형','所有类型','كل الأنواع'],
['Cualquier presupuesto','Any budget','Jedes Budget','Tout budget','Qualsiasi budget','Qualquer orçamento','すべての予算','모든 예산','不限预算','أي ميزانية'],
['Playa y descanso','Beach and relaxation','Strand und Erholung','Plage et détente','Spiaggia e relax','Praia e descanso','ビーチと休息','해변과 휴식','海滩与休闲','الشاطئ والاسترخاء'],
['Naturaleza y aventura','Nature and adventure','Natur und Abenteuer','Nature et aventure','Natura e avventura','Natureza e aventura','自然と冒険','자연과 모험','自然与探险','الطبيعة والمغامرة'],
['Cultura y ciudad','Culture and city','Kultur und Stadt','Culture et ville','Cultura e città','Cultura e cidade','文化と街','문화와 도시','文化与城市','الثقافة والمدينة'],
['Guías para preparar tu viaje','Guides for planning your trip','Tipps zur Reiseplanung','Guides pour préparer votre voyage','Guide per preparare il viaggio','Guias para preparar sua viagem','旅行準備ガイド','여행 준비 가이드','旅行准备指南','أدلة للتحضير لرحلتك'],
['Guías de viaje','Travel guides','Reiseführer','Guides de voyage','Guide di viaggio','Guias de viagem','旅行ガイド','여행 가이드','旅行指南','أدلة السفر'],
['Lista de preparativos','Travel checklist','Reisecheckliste','Liste de préparatifs','Lista dei preparativi','Lista de preparativos','旅行準備リスト','여행 준비 목록','旅行准备清单','قائمة التحضيرات'],
['Todavía no hay reseñas. Contanos cómo te fue usando Rumbo.','No reviews yet. Tell us about using Rumbo.','Noch keine Bewertungen. Erzähle uns von Rumbo.','Aucun avis pour le moment. Parlez-nous de Rumbo.','Ancora nessuna recensione. Raccontaci di Rumbo.','Ainda não há avaliações. Conte como foi usar o Rumbo.','まだレビューはありません。Rumboの感想をお聞かせください。','아직 리뷰가 없습니다. Rumbo 이용 경험을 알려 주세요.','还没有评价。分享您使用 Rumbo 的体验。','لا توجد تقييمات بعد. أخبرنا عن تجربتك مع Rumbo.'],
['Se publicará con tu primer nombre. Una reseña por cuenta; podés actualizarla cuando querás.','Published with your first name. One review per account; update it whenever you like.','Veröffentlichung mit deinem Vornamen. Eine Bewertung pro Konto, jederzeit änderbar.','Publié avec votre prénom. Un avis par compte, modifiable à tout moment.','Pubblicata con il tuo nome. Una recensione per account, modificabile in qualsiasi momento.','Publicada com seu primeiro nome. Uma avaliação por conta, editável quando quiser.','お名前で公開されます。1アカウントにつき1件、いつでも更新できます。','이름으로 공개됩니다. 계정당 리뷰 하나를 언제든 수정할 수 있습니다.','以您的名字公开。每个账户可发布一条评价，随时更新。','يُنشر باسمك الأول. تقييم واحد لكل حساب ويمكن تحديثه.'],
['Gracias por tu confianza. Nos alegra que disfrutés usando Rumbo.','Thank you for your trust. We’re glad you enjoy Rumbo.','Danke für dein Vertrauen. Schön, dass dir Rumbo gefällt.','Merci de votre confiance. Nous sommes ravis que Rumbo vous plaise.','Grazie per la fiducia. Siamo felici che Rumbo ti piaccia.','Obrigado pela confiança. Que bom que você gosta do Rumbo.','ご信頼いただきありがとうございます。Rumboを気に入っていただけて嬉しいです。','믿어 주셔서 감사합니다. Rumbo를 즐겁게 이용하셨다니 기쁩니다.','感谢您的信任。很高兴您喜欢 Rumbo。','شكراً لثقتك. يسعدنا أنك تستمتع باستخدام Rumbo.'],
['Gracias por contarnos tu experiencia. Tu opinión nos ayuda a mejorar.','Thanks for sharing your experience. Your feedback helps us improve.','Danke für deinen Erfahrungsbericht. Dein Feedback hilft uns.','Merci pour votre retour. Votre avis nous aide à progresser.','Grazie per la tua esperienza. La tua opinione ci aiuta a migliorare.','Obrigado por compartilhar. Sua opinião nos ajuda a melhorar.','ご感想ありがとうございます。改善に役立ててまいります。','경험을 공유해 주셔서 감사합니다. 개선에 도움이 됩니다.','感谢分享体验。您的反馈帮助我们改进。','شكراً لمشاركة تجربتك. رأيك يساعدنا على التحسين.'],
['Gracias por compartir lo que podemos mejorar. Sentimos que tu experiencia no haya sido la esperada.','Thank you for explaining what we can improve. We’re sorry your experience fell short.','Danke für die Hinweise. Es tut uns leid, dass deine Erfahrung nicht den Erwartungen entsprach.','Merci de vos suggestions. Nous regrettons que votre expérience n’ait pas été à la hauteur.','Grazie per i suggerimenti. Ci dispiace che l’esperienza non sia stata all’altezza.','Obrigado pelas sugestões. Lamentamos que a experiência não tenha atendido às expectativas.','改善点を教えていただきありがとうございます。ご期待に添えず申し訳ありません。','개선점을 알려 주셔서 감사합니다. 기대에 미치지 못해 죄송합니다.','感谢指出改进之处。很抱歉体验未达到您的预期。','شكراً لتوضيح ما يمكن تحسينه. نأسف لأن التجربة لم تكن كما توقعت.'],
['Inicia sesión para publicar tu reseña.','Log in to publish your review.','Melde dich an, um zu bewerten.','Connectez-vous pour publier un avis.','Accedi per pubblicare una recensione.','Entre para publicar sua avaliação.','レビューの投稿にはログインが必要です。','리뷰를 게시하려면 로그인하세요.','登录以发布评价。','سجل الدخول لنشر تقييمك.'],
['Publicando…','Publishing…','Wird veröffentlicht…','Publication…','Pubblicazione…','Publicando…','投稿中…','게시 중…','正在发布…','جارٍ النشر…'],
['El idioma de la navegación y los controles. Las reseñas se muestran en su idioma original.','Language for navigation and controls. Reviews remain in their original language.','Sprache für Navigation und Bedienelemente. Bewertungen bleiben im Original.','Langue de navigation et des commandes. Les avis restent dans leur langue originale.','Lingua della navigazione e dei comandi. Le recensioni restano nella lingua originale.','Idioma da navegação e dos controles. As avaliações mantêm o idioma original.','メニューと操作項目の言語です。レビューは原文で表示されます。','메뉴와 조작 항목의 언어입니다. 리뷰는 원래 언어로 표시됩니다.','导航和控件语言。评价保留原始语言。','لغة التنقل وعناصر التحكم. تبقى التقييمات بلغتها الأصلية.'],
['La conversión es orientativa. Los importes originales y el resumen descargable se conservan en HNL.','Conversion is indicative. Original amounts and downloaded summaries remain in HNL.','Umrechnung unverbindlich. Originalbeträge und Downloads bleiben in HNL.','Conversion indicative. Les montants originaux et résumés téléchargés restent en HNL.','Conversione indicativa. Importi originali e riepiloghi scaricati restano in HNL.','Conversão indicativa. Valores originais e resumos baixados permanecem em HNL.','換算は目安です。元の金額とダウンロードした概要はHNLのままです。','환산은 참고용입니다. 원래 금액과 다운로드 요약은 HNL로 유지됩니다.','换算仅供参考。原始金额和下载的摘要保留 HNL。','التحويل استرشادي. المبالغ الأصلية والملخصات المحملة تبقى بعملة HNL.']
];langs.forEach((lang,i)=>rows.forEach(row=>window.RumboTranslations[lang][row[0]]=row[i]));
})();

// Reviewed hero and community translations.
(()=>{const langs=["es","en","de","fr","it","pt","ja","ko","zh","ar"];const rows=[["{destination},\n{discount}% menos.","{destination},\n{discount}% off.","{destination},\n{discount}% günstiger.","{destination},\n{discount}% de réduction.","{destination},\n{discount}% di sconto.","{destination},\n{discount}% de desconto.","{destination}、\n{discount}%オフ。","{destination},\n{discount}% 할인.","{destination}，\n优惠 {discount}%。","{destination}،\nخصم {discount}٪."],["{destination},\nun viaje distinto.","{destination},\na different journey.","{destination},\neine besondere Reise.","{destination},\nun voyage différent.","{destination},\nun viaggio diverso.","{destination},\numa viagem diferente.","{destination}、\nいつもと違う旅。","{destination},\n색다른 여행.","{destination}，\n不一样的旅程。","{destination}،\nرحلة مختلفة."],["Canales, plazas y tiempo para caminar a tu ritmo.","Canals, squares and time to wander at your own pace.","Kanäle, Plätze und Zeit zum Spazieren in deinem Tempo.","Des canaux, des places et le temps de flâner à votre rythme.","Canali, piazze e tempo per passeggiare al tuo ritmo.","Canais, praças e tempo para passear no seu ritmo.","運河や広場を、自分のペースで散策。","운하와 광장을 나만의 속도로 거닐어 보세요.","漫步运河与广场，享受自己的节奏。","قنوات وساحات ووقت للتجول على إيقاعك."],["Unos días de playa para salir de la rutina.","A few days at the beach to escape the everyday.","Ein paar Tage am Strand, um dem Alltag zu entfliehen.","Quelques jours à la plage pour sortir du quotidien.","Qualche giorno al mare per uscire dalla routine.","Alguns dias de praia para sair da rotina.","日常を離れて、ビーチで過ごす数日間。","일상에서 벗어나 해변에서 보내는 며칠.","在海边小住几日，暂别日常。","أيام على الشاطئ للخروج من الروتين."],["Aprovechar oferta","Get the offer","Angebot nutzen","Profiter de l’offre","Approfitta dell’offerta","Aproveitar oferta","特典を利用","특가 보기","查看优惠","استفد من العرض"],["Buscar mi viaje","Find my trip","Meine Reise suchen","Trouver mon voyage","Cerca il mio viaggio","Buscar minha viagem","旅行を探す","내 여행 찾기","查找我的旅程","ابحث عن رحلتي"],["Vuelo a {destination}","Flight to {destination}","Flug nach {destination}","Vol vers {destination}","Volo per {destination}","Voo para {destination}","{destination}へのフライト","{destination}행 항공편","飞往{destination}的航班","رحلة إلى {destination}"],["Explorar {destination}","Explore {destination}","{destination} entdecken","Explorer {destination}","Esplora {destination}","Explorar {destination}","{destination}を探す","{destination} 둘러보기","探索{destination}","استكشف {destination}"],["Tarifa de demostración · Hospedaje aparte.","Demo fare · Accommodation separate.","Beispielpreis · Unterkunft separat.","Tarif de démonstration · Hébergement séparé.","Tariffa dimostrativa · Alloggio a parte.","Tarifa de demonstração · Hospedagem à parte.","デモ料金・宿泊費別。","데모 요금 · 숙박 별도.","演示票价 · 住宿另计。","سعر توضيحي · الإقامة منفصلة."],["Solo ida","One way","Nur Hinflug","Aller simple","Solo andata","Só ida","片道","편도","单程","ذهاب فقط"],["persona","person","Person","personne","persona","pessoa","人","명","人","شخص"],["Cambiar destino","Change destination","Reiseziel ändern","Changer de destination","Cambia destinazione","Mudar destino","目的地を変更","여행지 변경","更改目的地","تغيير الوجهة"],["Destino anterior","Previous destination","Vorheriges Reiseziel","Destination précédente","Destinazione precedente","Destino anterior","前の目的地","이전 여행지","上一个目的地","الوجهة السابقة"],["Destino siguiente","Next destination","Nächstes Reiseziel","Destination suivante","Destinazione successiva","Próximo destino","次の目的地","다음 여행지","下一个目的地","الوجهة التالية"],["{destination}, {index} de {total}","{destination}, {index} of {total}","{destination}, {index} von {total}","{destination}, {index} sur {total}","{destination}, {index} di {total}","{destination}, {index} de {total}","{destination}、{total}件中{index}件目","{destination}, {total}개 중 {index}번째","{destination}，第{index}个，共{total}个","{destination}، {index} من {total}"],["Cargando la fotografía de {destination}…","Loading the photo of {destination}…","Foto von {destination} wird geladen…","Chargement de la photo de {destination}…","Caricamento della foto di {destination}…","Carregando a foto de {destination}…","{destination}の写真を読み込み中…","{destination} 사진을 불러오는 중…","正在加载{destination}的照片…","جارٍ تحميل صورة {destination}…"],["Eliminar mi reseña","Delete my review","Meine Bewertung löschen","Supprimer mon avis","Elimina la mia recensione","Excluir minha avaliação","自分のレビューを削除","내 리뷰 삭제","删除我的评价","حذف تقييمي"],["¿Eliminar tu reseña?","Delete your review?","Deine Bewertung löschen?","Supprimer votre avis ?","Eliminare la tua recensione?","Excluir sua avaliação?","レビューを削除しますか？","리뷰를 삭제할까요?","删除您的评价？","هل تريد حذف تقييمك؟"],["Tu reseña se eliminó.","Your review was deleted.","Deine Bewertung wurde gelöscht.","Votre avis a été supprimé.","La tua recensione è stata eliminata.","Sua avaliação foi excluída.","レビューを削除しました。","리뷰가 삭제되었습니다.","您的评价已删除。","تم حذف تقييمك."],["Tu reseña dejará de ser pública. Podés publicar una nueva cuando querás.","Your review will no longer be public. You can publish a new one whenever you like.","Deine Bewertung ist danach nicht mehr öffentlich. Du kannst jederzeit eine neue schreiben.","Votre avis ne sera plus public. Vous pourrez en publier un nouveau à tout moment.","La tua recensione non sarà più pubblica. Potrai pubblicarne una nuova quando vuoi.","Sua avaliação deixará de ser pública. Você pode publicar outra quando quiser.","レビューは公開されなくなります。いつでも新しいレビューを投稿できます。","리뷰가 더 이상 공개되지 않습니다. 언제든 새 리뷰를 게시할 수 있습니다.","您的评价将不再公开。您可以随时发布新评价。","لن يعود تقييمك علنياً. يمكنك نشر تقييم جديد في أي وقت."],["Venecia","Venice","Venedig","Venise","Venezia","Veneza","ヴェネツィア","베네치아","威尼斯","البندقية"],["París","Paris","Paris","Paris","Parigi","Paris","パリ","파리","巴黎","باريس"],["Osaka","Osaka","Osaka","Osaka","Osaka","Osaka","大阪","오사카","大阪","أوساكا"],["Cancún","Cancún","Cancún","Cancún","Cancún","Cancún","カンクン","칸쿤","坎昆","كانكون"]];langs.forEach((lang,i)=>rows.forEach(row=>window.RumboTranslations[lang][row[0]]=row[i]));})();

(()=>{const words=["Hola,","Hello,","Hallo,","Bonjour,","Ciao,","Olá,","こんにちは、","안녕하세요,","您好，","مرحباً،"];["es","en","de","fr","it","pt","ja","ko","zh","ar"].forEach((lang,i)=>window.RumboTranslations[lang][words[0]]=words[i]);})();

(()=>{const langs=["es","en","de","fr","it","pt","ja","ko","zh","ar"];const rows=[["carrusel","carousel","Karussell","carrousel","carosello","carrossel","カルーセル","캐러셀","轮播","عرض شرائح"],["diapositiva","slide","Folie","diapositive","diapositiva","slide","スライド","슬라이드","幻灯片","شريحة"],["Caminá por la orilla y elegí dónde pasar la tarde.","Walk along the river and choose where to spend the afternoon.","Spaziere am Ufer entlang und entscheide, wo du den Nachmittag verbringen möchtest.","Promenez-vous sur les quais et choisissez où passer l’après-midi.","Passeggia lungo il fiume e scegli dove trascorrere il pomeriggio.","Caminhe pela margem e escolha onde passar a tarde.","川沿いを歩き、午後を過ごす場所を見つけましょう。","강변을 걷고 오후를 보낼 곳을 골라 보세요.","沿河漫步，寻找享受午后时光的好去处。","تجوّل على ضفة النهر واختر أين تقضي فترة بعد الظهر."],["Templos, jardines y calles que invitan a perderse. Tu próximo viaje empieza en Osaka.","Temples, gardens and streets to explore. Your next journey begins in Osaka.","Tempel, Gärten und Straßen zum Entdecken. Deine nächste Reise beginnt in Osaka.","Des temples, des jardins et des rues à découvrir. Votre prochain voyage commence à Osaka.","Templi, giardini e strade da esplorare. Il tuo prossimo viaggio inizia a Osaka.","Templos, jardins e ruas para explorar. Sua próxima viagem começa em Osaka.","寺院、庭園、街並みを散策。次の旅は大阪から。","사찰, 정원, 거리를 탐험해 보세요. 다음 여행은 오사카에서 시작됩니다.","探索寺庙、花园与街巷。您的下一段旅程从大阪开始。","معابد وحدائق وشوارع تستحق الاستكشاف. رحلتك القادمة تبدأ في أوساكا."],["Destinos y ofertas de Rumbo","Rumbo destinations and offers","Reiseziele und Angebote von Rumbo","Destinations et offres de Rumbo","Destinazioni e offerte di Rumbo","Destinos e ofertas do Rumbo","Rumboの目的地と特典","Rumbo 여행지와 특가","Rumbo 目的地与优惠","وجهات وعروض Rumbo"],["Elegí dónde quedarte según tu presupuesto y ubicación.","Choose where to stay based on your budget and location.","Wähle deine Unterkunft nach Budget und Lage.","Choisissez votre hébergement selon votre budget et l’emplacement.","Scegli dove soggiornare in base al budget e alla posizione.","Escolha onde ficar conforme seu orçamento e a localização.","予算と立地に合わせて宿泊先を選びましょう。","예산과 위치에 맞는 숙소를 선택하세요.","根据预算和位置选择住宿。","اختر مكان إقامتك حسب ميزانيتك والموقع."],["Maletas, mochilas, lentes, adaptadores y accesorios en un solo catálogo.","Suitcases, backpacks, sunglasses, adapters and accessories in one catalog.","Koffer, Rucksäcke, Sonnenbrillen, Adapter und Zubehör in einem Katalog.","Valises, sacs à dos, lunettes, adaptateurs et accessoires dans un seul catalogue.","Valigie, zaini, occhiali, adattatori e accessori in un unico catalogo.","Malas, mochilas, óculos, adaptadores e acessórios em um só catálogo.","スーツケース、リュック、サングラス、変換プラグ、旅行用品をひとつのカタログで。","캐리어, 배낭, 선글라스, 어댑터와 여행 용품을 한곳에서.","旅行箱、背包、太阳镜、转换插头及配件尽在同一目录。","حقائب سفر وحقائب ظهر ونظارات ومحولات وملحقات في كتالوج واحد."]];langs.forEach((lang,i)=>{for(const row of rows)window.RumboTranslations[lang][row[0]]=row[i];window.RumboTranslations[lang].Rumbo="Rumbo";window.RumboTranslations[lang].Rumbito="Rumbito";});})();

(()=>{const row=["por destino.","per destination.","pro Reiseziel.","par destination.","per destinazione.","por destino.","目的地ごと。","여행지별.","按目的地。","لكل وجهة."];["es","en","de","fr","it","pt","ja","ko","zh","ar"].forEach((lang,i)=>window.RumboTranslations[lang][row[0]]=row[i]);})();

// Reviewed headings: keep the brand name and never render tokenizer markers.
(()=>{const languages=["es","en","de","fr","it","pt","ja","ko","zh","ar"];const rows=[
  [
    "ORGANIZA TU VIAJE",
    "PLAN YOUR TRIP",
    "PLANE DEINE REISE",
    "ORGANISEZ VOTRE VOYAGE",
    "ORGANIZZA IL TUO VIAGGIO",
    "ORGANIZE SUA VIAGEM",
    "旅行を計画",
    "여행 계획하기",
    "规划您的旅行",
    "خطط لرحلتك"
  ],
  [
    "CONOCE RUMBO",
    "DISCOVER RUMBO",
    "ENTDECKE RUMBO",
    "DÉCOUVREZ RUMBO",
    "SCOPRI RUMBO",
    "CONHEÇA O RUMBO",
    "RUMBOについて",
    "RUMBO 알아보기",
    "了解 RUMBO",
    "تعرّف على RUMBO"
  ],
  [
    "Acerca de Rumbo",
    "About Rumbo",
    "Über Rumbo",
    "À propos de Rumbo",
    "Informazioni su Rumbo",
    "Sobre o Rumbo",
    "Rumboについて",
    "Rumbo 소개",
    "关于 Rumbo",
    "حول Rumbo"
  ],
  [
    "Chile",
    "Chile",
    "Chile",
    "Chili",
    "Cile",
    "Chile",
    "チリ",
    "칠레",
    "智利",
    "تشيلي"
  ],
  [
    "Consultar las guías de viaje →",
    "View travel guides →",
    "Reiseführer ansehen →",
    "Consulter les guides de voyage →",
    "Consulta le guide di viaggio →",
    "Consultar os guias de viagem →",
    "旅行ガイドを見る →",
    "여행 가이드 보기 →",
    "查看旅行指南 →",
    "اطّلع على أدلة السفر →"
  ],
  [
    "daryl_mitchell from Saskatoon, Saskatchewan, Canada",
    "daryl_mitchell from Saskatoon, Saskatchewan, Canada",
    "daryl_mitchell from Saskatoon, Saskatchewan, Canada",
    "daryl_mitchell from Saskatoon, Saskatchewan, Canada",
    "daryl_mitchell from Saskatoon, Saskatchewan, Canada",
    "daryl_mitchell from Saskatoon, Saskatchewan, Canada",
    "daryl_mitchell from Saskatoon, Saskatchewan, Canada",
    "daryl_mitchell from Saskatoon, Saskatchewan, Canada",
    "daryl_mitchell from Saskatoon, Saskatchewan, Canada",
    "daryl_mitchell from Saskatoon, Saskatchewan, Canada"
  ]
];for(const row of rows)languages.forEach((lang,index)=>{window.RumboTranslations[lang][row[0]]=row[index];});})();

// Shared booking screens and return navigation.
(()=>{const langs=["es","en","de","fr","it","pt","ja","ko","zh","ar"];const rows=[["Del aeropuerto a tu hospedaje. Elige según pasajeros y equipaje.","From the airport to your accommodation. Choose for your group and luggage.","Vom Flughafen zur Unterkunft. Wähle passend zu Personen und Gepäck.","De l’aéroport à votre hébergement. Choisissez selon les passagers et les bagages.","Dall’aeroporto al tuo alloggio. Scegli in base a passeggeri e bagagli.","Do aeroporto à sua hospedagem. Escolha conforme passageiros e bagagens.","空港から宿泊先へ。人数と荷物に合わせて選べます。","공항에서 숙소까지. 인원과 수하물에 맞게 선택하세요.","从机场到住处，按人数和行李选择。","من المطار إلى مكان إقامتك. اختر حسب عدد الركاب والأمتعة."],["Compara coberturas, límites y precio para tus fechas.","Compare coverage, limits and prices for your dates.","Vergleiche Leistungen, Grenzen und Preise für deine Reisedaten.","Comparez les garanties, les plafonds et les prix pour vos dates.","Confronta coperture, limiti e prezzi per le tue date.","Compare coberturas, limites e preços para suas datas.","旅行日程に合わせて補償内容、限度額、料金を比較。","여행 날짜에 맞는 보장 내용, 한도와 가격을 비교하세요.","按出行日期比较保障范围、限额和价格。","قارن التغطية والحدود والأسعار حسب تواريخ رحلتك."],["Opciones de transporte","Transport options","Transportoptionen","Options de transport","Opzioni di trasporto","Opções de transporte","移動手段","교통편 옵션","交通选项","خيارات النقل"],["Planes de seguro","Insurance plans","Versicherungspläne","Formules d’assurance","Piani assicurativi","Planos de seguro","保険プラン","보험 상품","保险方案","خطط التأمين"],["Precios de demostración. La selección no confirma una reserva ni contrata una póliza.","Demo prices. Selecting an option does not confirm a booking or purchase insurance.","Beispielpreise. Eine Auswahl bestätigt keine Buchung und schließt keine Versicherung ab.","Prix de démonstration. La sélection ne confirme aucune réservation et ne souscrit aucune assurance.","Prezzi dimostrativi. La selezione non conferma una prenotazione né stipula una polizza.","Preços de demonstração. A seleção não confirma reserva nem contrata seguro.","デモ料金です。選択しても予約の確定や保険の契約は行われません。","예시 가격입니다. 선택해도 예약이 확정되거나 보험에 가입되지 않습니다.","演示价格。选择选项不会确认预订或购买保险。","أسعار توضيحية. اختيار أحد الخيارات لا يؤكد حجزاً ولا يُبرم وثيقة تأمين."],["Ver condiciones","View conditions","Bedingungen ansehen","Voir les conditions","Vedi condizioni","Ver condições","条件を見る","조건 보기","查看条款","عرض الشروط"],["Recorridos locales. Compara duración, idioma y precio por persona.","Local tours. Compare duration, language and price per person.","Lokale Touren. Vergleiche Dauer, Sprache und Preis pro Person.","Visites locales. Comparez la durée, la langue et le prix par personne.","Tour locali. Confronta durata, lingua e prezzo a persona.","Passeios locais. Compare duração, idioma e preço por pessoa.","現地ツアーの所要時間、言語、1人あたりの料金を比較。","현지 투어의 소요 시간, 언어와 1인당 가격을 비교하세요.","当地游览。比较时长、语言和每人价格。","جولات محلية. قارن المدة واللغة والسعر للفرد."],["Información del destino y preguntas frecuentes","Destination information and FAQs","Reisezielinformationen und häufige Fragen","Informations sur la destination et questions fréquentes","Informazioni sulla destinazione e domande frequenti","Informações do destino e perguntas frequentes","目的地の情報とよくある質問","여행지 정보 및 자주 묻는 질문","目的地信息与常见问题","معلومات الوجهة والأسئلة الشائعة"],["Vuelos, hospedaje y lo que necesites para tu estancia. Tus elecciones, juntas en Mi viaje.","Flights, accommodation and services for your stay. Your selections, together in My trip.","Flüge, Unterkunft und Services für deinen Aufenthalt. Deine Auswahl unter Meine Reise.","Vols, hébergement et services pour votre séjour. Retrouvez vos choix dans Mon voyage.","Voli, alloggi e servizi per il soggiorno. Le tue scelte riunite in Il mio viaggio.","Voos, hospedagem e serviços para sua estadia. Suas escolhas reunidas em Minha viagem.","フライト、宿泊、滞在中のサービス。選んだ内容は「マイトリップ」にまとまります。","항공편, 숙소와 체류 중 필요한 서비스. 선택한 항목은 내 여행에 모입니다.","航班、住宿及旅途中所需服务。所选项目汇总在“我的旅行”中。","رحلات وإقامة وخدمات تحتاجها أثناء إقامتك. اختياراتك مجتمعة في رحلتي."],["Ver mis elecciones","View my selections","Meine Auswahl ansehen","Voir mes choix","Vedi le mie scelte","Ver minhas escolhas","選んだ内容を見る","내 선택 보기","查看我的选择","عرض اختياراتي"],["Volver a destinos","Back to destinations","Zurück zu den Reisezielen","Retour aux destinations","Torna alle destinazioni","Voltar aos destinos","目的地一覧に戻る","여행지 목록으로 돌아가기","返回目的地列表","العودة إلى الوجهات"],["Volver","Back","Zurück","Retour","Indietro","Voltar","戻る","뒤로","返回","رجوع"]];langs.forEach((lang,i)=>rows.forEach(row=>window.RumboTranslations[lang][row[0]]=row[i]));})();
// Additional labels for the independent store and mobile selection panel.
(()=>{
const languages=['es','en','de','fr','it','pt','ja','ko','zh','ar'];
const rows=[
['Revisar compra','Review purchase','Kauf prüfen','Vérifier l’achat','Rivedi acquisto','Revisar compra','購入内容を確認','구매 검토','查看购买内容','مراجعة الشراء'],
['Tu compra','Your purchase','Dein Einkauf','Votre achat','Il tuo acquisto','Sua compra','購入内容','구매 내역','你的购买','مشترياتك'],
['Productos de la tienda','Store products','Shop-Produkte','Produits de la boutique','Prodotti del negozio','Produtos da loja','ショップの商品','스토어 상품','商店商品','منتجات المتجر'],
['Editar carrito','Edit cart','Warenkorb bearbeiten','Modifier le panier','Modifica carrello','Editar carrinho','カートを編集','장바구니 수정','编辑购物车','تعديل السلة'],
['Pago de la tienda','Store payment','Shop-Zahlung','Paiement de la boutique','Pagamento del negozio','Pagamento da loja','ショップのお支払い','스토어 결제','商店付款','الدفع في المتجر'],
['Total de productos','Product total','Produktsumme','Total des produits','Totale prodotti','Total dos produtos','商品合計','상품 합계','商品总额','إجمالي المنتجات'],
['Subtotal de productos','Product subtotal','Produktzwischensumme','Sous-total des produits','Subtotale prodotti','Subtotal dos produtos','商品小計','상품 소계','商品小计','المجموع الفرعي للمنتجات'],
['Envío e impuestos adicionales','Shipping and additional taxes','Versand und zusätzliche Steuern','Livraison et taxes supplémentaires','Spedizione e imposte aggiuntive','Frete e impostos adicionais','送料・追加税金','배송비 및 추가 세금','运费及附加税费','الشحن والضرائب الإضافية'],
['Por confirmar','To be confirmed','Noch zu bestätigen','À confirmer','Da confermare','A confirmar','未確定','추후 확정','待确认','سيتم التأكيد'],
['Envío e impuestos adicionales por confirmar.','Shipping and additional taxes to be confirmed.','Versand und zusätzliche Steuern werden noch bestätigt.','Livraison et taxes supplémentaires à confirmer.','Spedizione e imposte aggiuntive da confermare.','Frete e impostos adicionais a confirmar.','送料と追加税金は未確定です。','배송비 및 추가 세금은 추후 확정됩니다.','运费及附加税费待确认。','سيتم تأكيد الشحن والضرائب الإضافية.'],
['Tarjetas previstas','Planned card options','Geplante Kartenoptionen','Cartes prévues','Carte previste','Cartões previstos','対応予定のカード','지원 예정 카드','计划支持的银行卡','البطاقات المخطط قبولها'],
['El pago con tarjeta aún no está disponible. Tu carrito se conserva.','Card payments are not available yet. Your cart is saved.','Kartenzahlungen sind noch nicht verfügbar. Dein Warenkorb bleibt gespeichert.','Le paiement par carte n’est pas encore disponible. Votre panier est conservé.','Il pagamento con carta non è ancora disponibile. Il carrello viene conservato.','O pagamento com cartão ainda não está disponível. Seu carrinho fica salvo.','カード決済はまだ利用できません。カートは保存されます。','카드 결제는 아직 사용할 수 없습니다. 장바구니는 저장됩니다.','暂不支持银行卡付款，购物车会保留。','الدفع بالبطاقة غير متاح بعد. ستُحفظ سلتك.'],
['Pago no disponible','Payment unavailable','Zahlung nicht verfügbar','Paiement indisponible','Pagamento non disponibile','Pagamento indisponível','お支払いは利用できません','결제 불가','暂不支持付款','الدفع غير متاح'],
['Cerrar compra','Close purchase','Einkauf schließen','Fermer l’achat','Chiudi acquisto','Fechar compra','購入画面を閉じる','구매 창 닫기','关闭购买页面','إغلاق الشراء'],
['Ir al inicio de la página','Go to the top of the page','Zum Seitenanfang','Aller en haut de la page','Vai all’inizio della pagina','Ir ao início da página','ページの先頭へ','페이지 맨 위로','回到页面顶部','الانتقال إلى أعلى الصفحة'],
['Revisar el resumen','View summary','Übersicht ansehen','Voir le récapitulatif','Vedi riepilogo','Ver resumo','概要を確認','요약 보기','查看摘要','عرض الملخص'],
['Elige un servicio','Choose a service','Service auswählen','Choisir un service','Scegli un servizio','Escolha um serviço','サービスを選択','서비스 선택','选择服务','اختر خدمة'],
['Las actividades se organizan por separado del vuelo y el hospedaje.','Activities are arranged separately from flights and accommodation.','Aktivitäten werden getrennt von Flug und Unterkunft organisiert.','Les activités sont organisées séparément du vol et de l’hébergement.','Le attività si organizzano separatamente da voli e alloggi.','As atividades são organizadas separadamente do voo e da hospedagem.','アクティビティはフライトや宿泊とは別に手配します。','액티비티는 항공편 및 숙소와 별도로 준비합니다.','活动需与航班和住宿分开安排。','تُنظَّم الأنشطة بشكل منفصل عن الرحلة الجوية والإقامة.'],
['Créditos de las fotografías','Photo credits','Bildnachweise','Crédits photographiques','Crediti fotografici','Créditos das fotografias','写真クレジット','사진 출처','图片来源','حقوق الصور'],
['Créditos del catálogo actual de destinos','Current destination catalog photo credits','Bildnachweise des aktuellen Reisezielkatalogs','Crédits du catalogue actuel des destinations','Crediti del catalogo attuale delle destinazioni','Créditos do catálogo atual de destinos','現在の目的地カタログの写真クレジット','현재 여행지 카탈로그 사진 출처','当前目的地目录的图片来源','حقوق صور دليل الوجهات الحالي'],
['Fotografías de Wikimedia Commons. Optimizadas en varios tamaños, sin recortes ni ampliación; conservan la licencia indicada.','Photos from Wikimedia Commons. Optimized in several sizes without cropping or upscaling; the stated licenses apply.','Fotos von Wikimedia Commons. In mehreren Größen optimiert, ohne Zuschnitt oder Vergrößerung; die angegebenen Lizenzen gelten.','Photos de Wikimedia Commons. Optimisées en plusieurs tailles, sans recadrage ni agrandissement ; les licences indiquées s’appliquent.','Foto da Wikimedia Commons. Ottimizzate in più dimensioni, senza ritagli né ingrandimenti; valgono le licenze indicate.','Fotos do Wikimedia Commons. Otimizadas em vários tamanhos, sem cortes nem ampliação; mantêm as licenças indicadas.','Wikimedia Commonsの写真。切り抜きや拡大をせず複数サイズに最適化し、記載のライセンスを保持しています。','Wikimedia Commons 사진입니다. 자르거나 확대하지 않고 여러 크기로 최적화했으며 명시된 라이선스가 적용됩니다.','图片来自维基共享资源，已优化为多个尺寸，未裁剪或放大，保留所注明的许可。','صور من ويكيميديا كومنز، محسّنة بأحجام متعددة دون قص أو تكبير، وتحتفظ بالتراخيص المذكورة.'],
['Transporte, seguro y experiencias se añaden solo si los necesitas.','Add transport, insurance and experiences only as needed.','Füge Transport, Versicherung und Erlebnisse nur bei Bedarf hinzu.','Ajoutez transport, assurance et expériences selon vos besoins.','Aggiungi trasporto, assicurazione ed esperienze solo se necessari.','Adicione transporte, seguro e experiências apenas se precisar.','移動、保険、体験は必要なものだけ追加できます。','교통편, 보험, 체험은 필요한 경우에만 추가하세요.','按需添加交通、保险和体验。','أضف النقل والتأمين والتجارب فقط عند الحاجة.'],
['Explora la colección, guarda tus favoritos y revisa tu compra desde el carrito. La tienda se gestiona por separado de las reservas del viaje.','Browse the collection, save favorites and review your purchase in the cart. The store is separate from travel bookings.','Entdecke die Kollektion, speichere Favoriten und prüfe deinen Einkauf im Warenkorb. Der Shop ist von Reisebuchungen getrennt.','Parcourez la collection, gardez vos favoris et vérifiez vos achats dans le panier. La boutique est indépendante des réservations de voyage.','Esplora la collezione, salva i preferiti e rivedi l’acquisto dal carrello. Il negozio è separato dalle prenotazioni di viaggio.','Explore a coleção, salve favoritos e revise sua compra no carrinho. A loja é separada das reservas de viagem.','商品を探し、お気に入りに保存して、カートで購入内容を確認できます。ショップは旅行予約とは別です。','상품을 둘러보고 즐겨찾기에 저장한 뒤 장바구니에서 구매를 검토하세요. 스토어는 여행 예약과 별개입니다.','浏览商品、收藏喜欢的商品并在购物车中查看购买内容。商店与旅行预订分开管理。','تصفح المجموعة واحفظ المفضلة وراجع مشترياتك في السلة. المتجر مستقل عن حجوزات السفر.'],
['En Mi viaje encontrarás vuelos, hospedaje y servicios, con su total y resumen descargable. Los productos tienen su propio carrito y pago en la tienda.','My trip contains flights, accommodation and services, with a total and downloadable summary. Products have a separate cart and payment in the store.','Meine Reise enthält Flüge, Unterkunft und Services mit Gesamtsumme und herunterladbarer Übersicht. Produkte haben einen eigenen Warenkorb und eine eigene Zahlung im Shop.','Mon voyage réunit les vols, l’hébergement et les services, avec un total et un récapitulatif téléchargeable. Les produits ont leur propre panier et paiement dans la boutique.','Il mio viaggio contiene voli, alloggi e servizi, con totale e riepilogo scaricabile. I prodotti hanno carrello e pagamento separati nel negozio.','Minha viagem reúne voos, hospedagem e serviços, com total e resumo para baixar. Os produtos têm carrinho e pagamento próprios na loja.','マイトリップでフライト、宿泊、サービスの合計とダウンロード可能な概要を確認できます。商品はショップ専用のカートと決済で管理します。','내 여행에서 항공편, 숙소, 서비스의 합계와 다운로드 가능한 요약을 확인할 수 있습니다. 상품은 스토어의 별도 장바구니와 결제로 관리됩니다.','“我的旅行”汇总航班、住宿和服务，并提供总额及可下载的摘要。商品使用商店独立的购物车和付款流程。','تجد في رحلتي الرحلات الجوية والإقامة والخدمات مع الإجمالي وملخص قابل للتنزيل. للمنتجات سلة ودفع مستقلان في المتجر.'],
['Reúne destinos, fechas y servicios en un solo plan. La tienda tiene su propio carrito y proceso de compra.','Keep destinations, dates and services in one plan. The store has its own cart and checkout.','Plane Reiseziele, Daten und Services gemeinsam. Der Shop hat einen eigenen Warenkorb und Kaufabschluss.','Réunissez destinations, dates et services dans un seul plan. La boutique dispose de son propre panier et paiement.','Riunisci destinazioni, date e servizi in un piano. Il negozio ha carrello e procedura d’acquisto propri.','Reúna destinos, datas e serviços em um plano. A loja tem carrinho e processo de compra próprios.','目的地、日程、サービスをひとつのプランにまとめます。ショップには専用のカートと購入手続きがあります。','여행지, 날짜, 서비스를 하나의 계획에 모으세요. 스토어는 별도의 장바구니와 구매 절차를 사용합니다.','将目的地、日期和服务汇总为一个计划。商店有独立的购物车和购买流程。','اجمع الوجهات والتواريخ والخدمات في خطة واحدة. للمتجر سلته وعملية الشراء الخاصة به.'],
['En Mi viaje puedes eliminar vuelos, hospedaje y servicios, o vaciar el viaje completo. También puedes deshacer la última eliminación. Los productos se gestionan por separado en el carrito de la tienda.','In My trip, remove flights, accommodation and services, or clear the entire trip. You can undo the last removal. Products are managed separately in the store cart.','Unter Meine Reise kannst du Flüge, Unterkunft und Services entfernen oder die ganze Reise leeren. Die letzte Löschung lässt sich rückgängig machen. Produkte werden separat im Shop-Warenkorb verwaltet.','Dans Mon voyage, supprimez vols, hébergement et services, ou videz tout le voyage. Vous pouvez annuler la dernière suppression. Les produits sont gérés séparément dans le panier de la boutique.','In Il mio viaggio puoi eliminare voli, alloggi e servizi o svuotare il viaggio. Puoi annullare l’ultima eliminazione. I prodotti si gestiscono separatamente nel carrello del negozio.','Em Minha viagem, remova voos, hospedagem e serviços ou limpe a viagem inteira. Você pode desfazer a última remoção. Os produtos são gerenciados separadamente no carrinho da loja.','マイトリップではフライト、宿泊、サービスの削除やプラン全体の消去ができます。直前の削除は取り消せます。商品はショップのカートで別に管理します。','내 여행에서 항공편, 숙소, 서비스를 삭제하거나 전체 여행을 비울 수 있습니다. 마지막 삭제는 취소할 수 있습니다. 상품은 스토어 장바구니에서 별도로 관리합니다.','在“我的旅行”中可删除航班、住宿和服务，或清空整个行程，并撤销上次删除。商品在商店购物车中单独管理。','يمكنك حذف الرحلات الجوية والإقامة والخدمات أو إفراغ الرحلة كاملة من رحلتي، والتراجع عن آخر حذف. تُدار المنتجات بشكل منفصل في سلة المتجر.']
];
languages.forEach((language,index)=>rows.forEach(row=>window.RumboTranslations[language][row[0]]=row[index]));
})();
// Mensajes de búsqueda vacía y ejemplos: no son valores del formulario.
(()=>{
 const langs=['es','en','de','fr','it','pt','ja','ko','zh','ar'];
  const rows=[['Completa los datos de tu viaje para ver opciones y precios.','Enter your trip details to see options and prices.','Gib deine Reisedaten ein, um Optionen und Preise zu sehen.','Renseignez votre voyage pour voir les options et les prix.','Inserisci i dettagli del viaggio per vedere opzioni e prezzi.','Preencha os dados da viagem para ver opções e preços.','旅行の詳細を入力すると、プランと料金が表示されます。','여행 정보를 입력하면 옵션과 요금을 볼 수 있습니다.','填写旅行信息以查看选项和价格。','أدخل تفاصيل رحلتك لعرض الخيارات والأسعار.']];
  for(const n of [1,2,3])rows.push([`Ej.: ${n}`,`E.g. ${n}`,`Z. B. ${n}`,`Ex. : ${n}`,`Es.: ${n}`,`Ex.: ${n}`,`例：${n}`,`예: ${n}`,`例如：${n}`,`مثال: ${n}`]);
  langs.forEach((lang,i)=>rows.forEach(row=>window.RumboTranslations[lang][row[0]]=row[i]));
})();
