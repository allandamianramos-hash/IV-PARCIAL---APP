import {readFileSync,writeFileSync} from 'node:fs';
const langs=['es','en','de','fr','it','pt','ja','ko','zh','ar'];
const rows=[
 ['2. Confirmar','2. Confirm','2. Bestätigen','2. Confirmer','2. Conferma','2. Confirmar','2. 確認','2. 확인','2. 确认','2. تأكيد'],
 ['Catálogo','Catalog','Katalog','Catalogue','Catalogo','Catálogo','カタログ','카탈로그','目录','الكتالوج'],
 ['Comprobante','Receipt','Beleg','Reçu','Ricevuta','Comprovativo','明細書','내역서','凭证','إيصال'],
 ['Confirmar pago','Confirm payment','Zahlung bestätigen','Confirmer le paiement','Conferma pagamento','Confirmar pagamento','支払いを確認','결제 확인','确认付款','تأكيد الدفع'],
 ['Consulta tus viajes, servicios y productos.','View your trips, services and products.','Sieh dir deine Reisen, Leistungen und Produkte an.','Consultez vos voyages, services et produits.','Consulta i tuoi viaggi, servizi e prodotti.','Consulte as suas viagens, serviços e produtos.','旅行、サービス、商品を確認できます。','여행, 서비스 및 상품을 확인하세요.','查看您的旅行、服务和商品。','اطّلع على رحلاتك وخدماتك ومنتجاتك.'],
 ['Continuar a {1} →','Continue to {1} →','Weiter zu {1} →','Continuer vers {1} →','Continua a {1} →','Continuar para {1} →','{1}へ進む →','{1}(으)로 계속 →','继续前往{1} →','المتابعة إلى {1} →'],
 ['Cuando completes una operación, encontrarás aquí su comprobante.','Once you complete a transaction, its receipt will appear here.','Nach Abschluss eines Vorgangs findest du hier den Beleg.','Une fois une opération terminée, son reçu apparaîtra ici.','Una volta completata un’operazione, troverai qui la ricevuta.','Ao concluir uma operação, encontrará aqui o comprovativo.','操作が完了すると、ここに明細が表示されます。','처리가 완료되면 여기에서 내역서를 확인할 수 있습니다.','完成操作后，您可以在这里查看凭证。','عند إتمام العملية، ستجد إيصالها هنا.'],
 ['DEMOSTRACIÓN: no se ha realizado ningún cobro ni se han contratado servicios.','DEMONSTRATION: no money has been charged and no services have been booked.','DEMONSTRATION: Es wurde kein Geld abgebucht und es wurden keine Leistungen gebucht.','DÉMONSTRATION : aucun montant n’a été débité et aucun service n’a été réservé.','DIMOSTRAZIONE: nessun addebito e nessun servizio prenotato.','DEMONSTRAÇÃO: não foi efetuada qualquer cobrança nem contratados serviços.','デモンストレーション：請求やサービスの予約は行われていません。','시연: 실제 청구나 서비스 예약이 이루어지지 않았습니다.','演示：未扣款，也未预订任何服务。','عرض توضيحي: لم يتم تحصيل أي مبلغ أو حجز أي خدمات.'],
 ['Eliminar {6}','Remove {6}','{6} entfernen','Supprimer {6}','Rimuovi {6}','Remover {6}','{6}を削除','{6} 삭제','删除{6}','حذف {6}'],
 ['No es una reserva, póliza, factura ni confirmación de envío.','This is not a booking, insurance policy, invoice or shipping confirmation.','Dies ist keine Buchung, Versicherungspolice, Rechnung oder Versandbestätigung.','Ceci ne constitue ni une réservation, ni une police d’assurance, ni une facture, ni une confirmation d’expédition.','Non costituisce una prenotazione, polizza, fattura o conferma di spedizione.','Não é uma reserva, apólice, fatura ou confirmação de envio.','予約、保険契約、請求書、発送確認ではありません。','예약, 보험 증권, 청구서 또는 배송 확인이 아닙니다.','这不是预订、保单、发票或发货确认。','هذا ليس حجزًا أو وثيقة تأمين أو فاتورة أو تأكيد شحن.'],
 ['Operación de demostración; no se realiza ningún cobro.','Demonstration transaction; no money is charged.','Demonstrationsvorgang; es wird kein Geld abgebucht.','Opération de démonstration ; aucun montant n’est débité.','Operazione dimostrativa; non viene addebitato alcun importo.','Operação de demonstração; não é efetuada qualquer cobrança.','デモンストレーションです。実際の請求は行われません。','시연용 거래이며 실제로 청구되지 않습니다.','演示操作，不会实际扣款。','عملية توضيحية؛ لا يتم تحصيل أي مبلغ.'],
 ['Pago','Payment','Zahlung','Paiement','Pagamento','Pagamento','支払い','결제','付款','الدفع'],
 ['Pago realizado correctamente','Payment completed successfully','Zahlung erfolgreich abgeschlossen','Paiement effectué avec succès','Pagamento completato correttamente','Pagamento efetuado com sucesso','支払いが正常に完了しました','결제가 완료되었습니다','付款成功','تم الدفع بنجاح'],
 ['Productos de tu compra','Your purchase items','Deine gekauften Produkte','Produits de votre achat','Prodotti del tuo acquisto','Produtos da sua compra','購入商品','구매 상품','购买的商品','منتجات مشترياتك'],
 ['Revisa tu selección y acepta los términos y condiciones.','Review your selection and accept the terms and conditions.','Prüfe deine Auswahl und akzeptiere die Geschäftsbedingungen.','Vérifiez votre sélection et acceptez les conditions générales.','Controlla la selezione e accetta i termini e le condizioni.','Reveja a sua seleção e aceite os termos e condições.','選択内容を確認し、利用規約に同意してください。','선택 사항을 확인하고 이용 약관에 동의하세요.','请检查您的选择并同意条款和条件。','راجع اختياراتك ووافق على الشروط والأحكام.'],
 ['Total · {5}','Total · {5}','Gesamt · {5}','Total · {5}','Totale · {5}','Total · {5}','合計 · {5}','합계 · {5}','总计 · {5}','الإجمالي · {5}'],
 ['Tu tienda','Your shop','Dein Shop','Votre boutique','Il tuo negozio','A sua loja','ショップ','내 상점','您的商店','متجرك'],
 ['Tu viaje está listo para continuar.','Your trip is ready to continue.','Deine Reise ist bereit für den nächsten Schritt.','Votre voyage est prêt pour la suite.','Il tuo viaggio è pronto per proseguire.','A sua viagem está pronta para continuar.','旅行の次のステップに進めます。','여행의 다음 단계로 진행할 수 있습니다.','您的行程已准备好，可以继续。','رحلتك جاهزة للمتابعة.'],
 ['términos y condiciones','terms and conditions','Geschäftsbedingungen','conditions générales','termini e condizioni','termos e condições','利用規約','이용 약관','条款和条件','الشروط والأحكام'],
 ['COMPLETADO','COMPLETED','ABGESCHLOSSEN','TERMINÉ','COMPLETATO','CONCLUÍDO','完了','완료','已完成','مكتمل']
];
const reviewedPath='scripts/i18n/launch-reviewed.json';
const reviewed=JSON.parse(readFileSync(reviewedPath,'utf8'));
for(const [i,lang] of langs.entries()){
 const path='public/locales/'+lang+'.json',messages=JSON.parse(readFileSync(path,'utf8'));
 for(const row of rows){messages[row[0]]=row[i];(reviewed[lang]??={})[row[0]]=row[i];}
 writeFileSync(path,JSON.stringify(messages,null,2)+'\n');
}
writeFileSync(reviewedPath,JSON.stringify(reviewed,null,2)+'\n');
console.log('Mensajes de pago actualizados en diez idiomas.');
