/*
* This file was created with significant AI assistance (e.g., Claude)
* to handle the texts of the legal pages (Impressum and AGB from the old website, Datenschutz).
*
* It has been reviewed, tested, and approved by a human developer
* to ensure quality and correctness.
*/
export type LegalDoc = {
  title: string
  intro?: string
  sections: { heading?: string; paragraphs: string[] }[]
  footnote?: string
}

export const impressum: LegalDoc = {
  title: 'Impressum',
  sections: [
    {
      heading: 'Angaben gemäß § 5 DDG',
      paragraphs: ['Harmine de Vries<br>Pogumer Straße 19<br>26844 Jemgum-Pogum'],
    },
    {
      heading: 'Kontakt',
      paragraphs: ['Telefon: <a href="tel:+494902447">04902 447</a><br>E-Mail: <a href="mailto:kontakt@huus-windroos.de">kontakt@huus-windroos.de</a>'],
    },
    {
      heading: 'Verbraucherstreitbeilegung',
      paragraphs: ['Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'],
    },
    {
      heading: 'Bildquellen',
      paragraphs: ['23776631 – © whfisch<br>105998102 – © travelpeter<br>25283307 – © Makuba<br>87542956 – © Stephan Sühling<br>105904687 – © travelpeter'],
    },
  ],
}

// Note: please have it checked before going live – naming the hosting provider is common practice
export const datenschutz: LegalDoc = {
  title: 'Datenschutz',
  intro: 'Wir freuen uns über Ihr Interesse an unseren Unterkünften. Der Schutz Ihrer persönlichen Daten ist uns wichtig. Nachfolgend informieren wir Sie darüber, welche Daten beim Besuch dieser Website verarbeitet werden.',
  sections: [
    {
      heading: '1. Verantwortliche',
      paragraphs: ['Harmine de Vries, Pogumer Straße 19, 26844 Jemgum-Pogum<br>Telefon: 04902 447, E-Mail: <a href="mailto:kontakt@huus-windroos.de">kontakt@huus-windroos.de</a>'],
    },
    {
      heading: '2. Hosting und Server-Logfiles',
      paragraphs: [
        'Diese Website wird bei einem externen Hosting-Dienstleister betrieben. Beim Aufruf der Seiten werden technisch notwendige Daten (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browser und Betriebssystem) in Server-Logfiles gespeichert. Die Verarbeitung erfolgt zur Sicherstellung eines störungsfreien Betriebs auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO). Die Logfiles werden gelöscht, sobald sie für diesen Zweck nicht mehr erforderlich sind.',
      ],
    },
    {
      heading: '3. Anfrageformular und Kontakt per E-Mail oder Telefon',
      paragraphs: [
        'Wenn Sie uns über das Anfrageformular, per E-Mail oder telefonisch kontaktieren, verarbeiten wir Ihre Angaben (Name, E-Mail-Adresse, Telefonnummer, Reisezeitraum, Personenzahl, Nachricht) ausschließlich zur Bearbeitung Ihrer Anfrage und zur Durchführung einer möglichen Buchung (Art. 6 Abs. 1 lit. b DSGVO). Die Daten werden gelöscht, sobald sie für diesen Zweck nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.',
      ],
    },
    {
      heading: '4. Cookies, Schriften und externe Inhalte',
      paragraphs: [
        'Diese Website setzt keine Cookies und verwendet keine Analyse- oder Trackingdienste. Die verwendeten Schriftarten sind lokal auf unserem Server eingebunden; beim Seitenaufruf wird keine Verbindung zu Servern Dritter aufgebaut.',
        'Der Link „So finden Sie uns“ führt zu OpenStreetMap. Erst beim Anklicken werden Daten an die OpenStreetMap Foundation übertragen; es gilt deren Datenschutzerklärung.',
      ],
    },
    {
      heading: '5. Ihre Rechte',
      paragraphs: [
        'Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten, auf Datenübertragbarkeit sowie auf Widerspruch gegen die Verarbeitung (Art. 15–21 DSGVO). Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Landesbeauftragten für den Datenschutz Niedersachsen.',
      ],
    },
  ],
  footnote: 'Stand: November 2026',
}

export const agb: LegalDoc = {
  title: 'Allgemeine Geschäftsbedingungen',
  intro: 'Eheleute Alfred und Harmine de Vries – im Folgenden auch „Vermieter“<br>Pogumer Str. 19, 26844 Jemgum<br>Tel.: 04902 447 · <a href="mailto:kontakt@huus-windroos.de">kontakt@huus-windroos.de</a>',
  sections: [
    {
      heading: '1. Geltungsbereich',
      paragraphs: [
        '1.1 Die Allgemeinen Geschäftsbedingungen gelten für Verträge über die mietweise Überlassung der Ferienwohnung/des Apartments zur Beherbergung sowie alle für den Mieter erbrachten weiteren Leistungen und Lieferungen des Vermieters.',
        '1.2 Die Unter- oder Weitervermietung der überlassenen Ferienwohnung/des Apartments sowie deren Nutzung zu anderen als Wohnzwecken bedürfen der vorherigen schriftlichen Zustimmung des Vermieters.',
      ],
    },
    {
      heading: '2. Buchung/Buchungsbestätigung',
      paragraphs: [
        '2.1 Buchungen der Ferienwohnung/des Apartments können per E-Mail oder telefonisch erfolgen. Die Reservierung für die Ferienwohnung/das Apartment ist mit Abschluss des Buchungsprozesses und Erhalt der Buchungsbestätigung bzw. nach erfolgter Zahlung rechtskräftig.',
        '2.2 Der Mieter erklärt sich mit der Buchung mit den Allgemeinen Geschäftsbedingungen sowie der Hausordnung des Vermieters einverstanden.',
      ],
    },
    {
      heading: '3. Zahlungsbedingungen',
      paragraphs: [
        '3.1 Die Anzahlung in Höhe von 50 % der Gesamtsumme ist innerhalb von 14 Tagen nach Rechnungserhalt auf das Konto des Vermieters zu überweisen. Die Restzahlung ist bis spätestens 14 Tage vor Anreise zu überweisen. Bei kurzfristigen Buchungen ist der Gesamtpreis sofort nach Rechnungserhalt/Buchungsbestätigung zu überweisen.',
        '3.2 Bei Zahlungsverzug erhält der Gast zunächst eine Zahlungserinnerung. Es werden ausschließlich Zahlungen per Überweisung akzeptiert. Nach vorheriger Absprache sind Bargeldzahlungen vor Ort möglich. Zahlungen per EC- oder Kreditkarte bzw. Scheck werden nicht akzeptiert.',
      ],
    },
    {
      heading: '4. An-/Abreise',
      paragraphs: [
        '4.1 Die Ferienwohnung/das Apartment steht am Anreisetag ab 15:00 Uhr bzw. nach Absprache zur Verfügung. Die Schlüsselübergabe erfolgt persönlich durch den Vermieter oder über einen Schlüsseltresor.',
        '4.2 Am Abreisetag ist die Ferienwohnung bis 10:00 Uhr zu räumen.',
        '4.3 Der Vermieter behält sich vor, eine mehr als 60 Minuten verspätete Abreise entsprechend in Rechnung zu stellen.',
      ],
    },
    {
      heading: '5. Aufenthalt',
      paragraphs: [
        '5.1 Die Nutzung der Ferienwohnung/des Apartments ist den bei Buchung dem Vermieter mitgeteilten Gästen vorbehalten. Sollte das Objekt von mehr Personen als vereinbart benutzt werden, ist für diese ein gesondertes Entgelt gemäß Preisliste zu zahlen.',
        '5.2 Eine Untervermietung und Überlassung der Wohnung an Dritte ist nicht erlaubt. Der Mietvertrag darf nicht an dritte Personen weitergegeben werden.',
        '5.3 Bei Verstößen gegen die AGB oder die Hausordnung ist der Vermieter berechtigt, das Mietverhältnis sofort und fristlos zu kündigen. Ein Rechtsanspruch auf Rückzahlung der Miete oder eine Entschädigung besteht nicht.',
      ],
    },
    {
      heading: '6. Sachzustand',
      paragraphs: [
        '6.1 Die Ferienwohnung wird vom Vermieter in einem gereinigten Zustand übergeben. Sollten Mängel bestehen oder während der Mietzeit auftreten, ist der Vermieter hiervon unverzüglich in Kenntnis zu setzen.',
        '6.2 Der Mieter haftet für die von ihm verursachten Schäden am Mietobjekt sowie dem Inventar. Bei Verlust des Objekt-Schlüssels behält sich der Vermieter das Recht vor, die Schließanlage auszutauschen und dem Mieter die anfallenden Kosten in Rechnung zu stellen.',
        '6.3 Das Inventar ist angemessen zu behandeln und nur für den Verbleib in den Ferienwohnungen vorgesehen. Das Umstellen von Einrichtungsgegenständen, insbesondere Betten, ist untersagt. Bei vertragswidrigem Gebrauch der Ferienwohnung, wie Untervermietung, Überbelegung, Störung des Hausfriedens sowie bei Nichtzahlung des vollen Mietpreises kann der Vertrag fristlos durch den Vermieter gekündigt werden. Eventuell bereits geleistete Zahlungen durch den Mieter bleiben in diesem Fall beim Vermieter.',
        'Sollte der Mieter für eine eventuelle Schadensregulierung seine Haftpflichtversicherung in Anspruch nehmen wollen, ist dies dem Vermieter unter Nennung von Namen und Anschrift sowie der Versicherungsnummer der Versicherung mitzuteilen.',
      ],
    },
    {
      heading: '7. Rauchverbot',
      paragraphs: [
        'In allen Ferienobjekten gilt allgemeines Rauchverbot. Bei Zuwiderhandlungen kann der Vermieter eine Reinigungspauschale in Höhe von bis zu 200,00 € (zzgl. MwSt.) sowie die gegebenenfalls anfallenden Mietausfälle und Kosten nachfolgender Gäste in Rechnung stellen, die auf die Missachtung des Rauchverbots zurückzuführen sind.',
      ],
    },
    {
      heading: '8. Haustiere',
      paragraphs: [
        'Die Unterbringung von Haustieren jedweder Art ist strengstens untersagt. Bei Missachtung behält sich der Vermieter das Recht vor, den Mietvertrag fristlos zu kündigen und eine professionelle Reinigung auf Kosten des Mieters durchführen zu lassen.',
      ],
    },
    {
      heading: '9. Reiserücktritt',
      paragraphs: [
        '9.1 Bei einem Rücktritt vom Mietvertrag ist der Mieter verpflichtet, einen Teil des vereinbarten Preises als Entschädigung zu zahlen. Eine Stornierung hat schriftlich zu erfolgen. Die Höhe der Entschädigung richtet sich nach der Zeit bis zum Anreisetag und ergibt sich wie folgt:',
        '7–28 Tage vor dem Anreisetag: 50 % des vereinbarten Mietpreises<br>0–6 Tage vor dem Anreisetag oder bei Nichtanreise: 100 % des vereinbarten Mietpreises',
        '9.2 Im Falle der vorzeitigen Abreise des Mieters ist der vollständige Mietpreis zu zahlen, soweit die vorzeitige Abreise nicht durch den Vermieter verschuldet ist.',
      ],
    },
    {
      heading: '10. Rücktritt durch den Vermieter',
      paragraphs: [
        'Der Vermieter behält sich das Recht vor, in Fällen von höherer Gewalt oder anderer unvorhersehbarer Umstände, die die Erfüllung des Mietvertrages unmöglich machen, vom Mietvertrag zurückzutreten. In diesem Fall beschränkt sich die Haftung auf die Rückerstattung des Mietpreises. Bei berechtigtem Rücktritt entsteht kein Anspruch des Mieters auf Schadensersatz. Eine Haftung für Reise- und Hotelkosten ist ausgeschlossen.',
      ],
    },
    {
      heading: '11. Haftung des Vermieters',
      paragraphs: [
        'Der Vermieter haftet im Rahmen der Sorgfaltspflicht eines ordentlichen Kaufmanns für die ordentliche Bereitstellung des Mietobjekts. Eine Haftung für eventuelle Ausfälle bzw. Störungen in Wasser- oder Stromversorgung sowie Ereignisse und Folgen durch höhere Gewalt sind hiermit ausgeschlossen.',
        'Für vom Gast eingebrachte Sachen haftet der Vermieter nur im Rahmen der gesetzlichen Bestimmungen.',
      ],
    },
    {
      heading: '12. Erhebung des Gästebeitrages in der Gemeinde Jemgum',
      paragraphs: ['Der Gästebeitrag wird für die Dauer des vorgesehenen Aufenthalts berechnet. Die Weiterleitung an die Gemeinde Jemgum erfolgt durch den Vermieter.'],
    },
    {
      heading: '13. WLAN-Nutzung',
      paragraphs: [
        '13.1 Der Vermieter unterhält in seinem Ferienobjekt einen Internetzugang über WLAN. Die Zugangsinformationen erhält der Mieter bei Anreise vom Vermieter. Er gestattet dem Mieter für die Dauer seines Aufenthaltes im Mietobjekt eine Mitbenutzung des WLAN-Zugangs.',
        '13.2 Sollte der Vermieter Kenntnis über die rechtswidrige Nutzung des WLAN-Zugangs (Filesharing, Pornografie o. ä.) durch den Mieter erlangen, wird er die Mitnutzung des Mieters umgehend ausschließen und die Behörden über den Missbrauch informieren.',
        '13.3 Der Vermieter haftet dem Mieter gegenüber für Störungen des WLAN-Zugangs nicht. Der Vermieter ist berechtigt, den Nutzungsumfang des WLAN-Zugangs des Mieters jederzeit einzuschränken.',
        '13.4 Der Vermieter übernimmt keine Haftung für eventuelle Schäden (Malware o. ä.), die durch die Nutzung des WLAN-Zugangs entstehen. Der Mieter hat eigenständig für die Sicherheit seiner Daten zu sorgen.',
        '13.5 Werden durch den Mieter über das WLAN kostenpflichtige Dienstleistungen o. ä. in Anspruch genommen, übernimmt er hierfür vollumfänglich die anfallenden Kosten.',
      ],
    },
    {
      heading: '14. Schriftform',
      paragraphs: ['Von den AGB abweichende Absprachen bedürfen der Schriftform. Mündliche Absprachen wurden nicht getroffen.'],
    },
    {
      heading: '15. Salvatorische Klausel',
      paragraphs: [
        'Sollte eine oder mehrere Bestimmungen dieser AGB unwirksam werden, so wird die Wirksamkeit der übrigen Bestimmungen hiervon nicht berührt. Die unwirksame Bestimmung ist durch eine wirksame zu ersetzen, die dem mit der unwirksamen Bestimmung verfolgten wirtschaftlichen Zweck am nächsten kommt.',
      ],
    },
    {
      heading: '16. Gerichtsstand',
      paragraphs: ['Ausschließlicher Gerichtsstand für sämtliche Streitigkeiten aus und im Zusammenhang mit diesen Mietbedingungen und dem Mietvertrag ist der Wohnsitz des Vermieters.'],
    },
  ],
  footnote: 'Pogum, im Mai 2023',
}
