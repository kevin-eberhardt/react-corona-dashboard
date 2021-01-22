import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import Footer from './Footer';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    content: {
        padding: theme.spacing(2)
    }
}));
export default function Impressum(props) {
    const classes = useStyles();
    return (
        <>
            <Header />
                <Grid container className={classes.content}>
                <Grid item className={classes.content}>
                    <Typography variant="h4">
                        Impressum
                    </Typography>
                        <Typography variant="h5">
                            Angaben gemäß § 5 TMG
                        </Typography>
                        <Typography>
                            Kevin Eberhardt<br />
                            Bönnigheimer Straße 2<br />
                            71634 Ludwigsburg
                        </Typography>
                        <Typography variant="h6">
                            Kontakt
                        </Typography>
                        <Typography>
                            Telefon: <a href="tel:+491732960173">01732960173</a><br />
                            E-Mail: <a href="mailto:kevin96e@outlook.de">kevin96e@outlook.de</a><br />
                        </Typography>
                </Grid>
                <Grid item className={classes.content}>
                    <Typography variant="h4">
                        Datenschutzerklärung
                    </Typography>
                        <Typography>
                            Diese Website nutzt den Dienst „Google Analytics“, welcher von der Google Inc. (1600 Amphitheatre Parkway Mountain View, CA 94043, USA) angeboten wird, zur Analyse der Websitebenutzung durch Nutzer. <br />
                            Der Dienst verwendet „Cookies“ – Textdateien, welche auf Ihrem Endgerät gespeichert werden. <br />
                            Die durch die Cookies gesammelten Informationen werden im Regelfall an einen Google-Server in den USA gesandt und dort gespeichert.<br  />
                            Auf dieser Website greift die IP-Anonymisierung. Die IP-Adresse der Nutzer wird innerhalb der Mitgliedsstaaten der EU und des Europäischen Wirtschaftsraum gekürzt. <br />
                            Durch diese Kürzung entfällt der Personenbezug Ihrer IP-Adresse. Im Rahmen der Vereinbarung zur Auftragsdatenvereinbarung, welche die Websitebetreiber mit der Google Inc. geschlossen haben, <br />erstellt diese mithilfe der gesammelten Informationen eine Auswertung der Websitenutzung und der Websiteaktivität und erbringt mit der Internetnutzung verbundene Dienstleistungen.<br  />
                            Sie haben die Möglichkeit, die Speicherung des Cookies auf Ihrem Gerät zu verhindern, indem Sie in Ihrem Browser entsprechende Einstellungen vornehmen. <br />Es ist nicht gewährleistet, dass Sie auf alle Funktionen dieser Website ohne Einschränkungen zugreifen können, wenn Ihr Browser keine Cookies zulässt.<br />
                            Weiterhin können Sie durch ein Browser-Plugin verhindern, dass die durch Cookies gesammelten Informationen (inklusive Ihrer IP-Adresse) an die Google Inc. gesendet und von der Google Inc. genutzt werden. <br />Folgender Link führt Sie zu dem entsprechenden Plugin: https://tools.google.com/dlpage/gaoptout?hl=de<br />
                            Hier finden Sie weitere Informationen zur Datennutzung durch die Google Inc.: https://support.google.com/analytics/answer/6004245?hl=de
                        </Typography>
            </Grid>
            </Grid>
            <Footer />
        </>
    )
}