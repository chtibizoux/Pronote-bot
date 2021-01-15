const pronote = require('pronote-api');

async function main() {
    const session = await pronote.login("http://pronote.lyc-touchard-72.ac-nantes.fr/pronote/", "clement.songis", "clement1", "ac-nantes");
    // const absences = await session.absences();
    // console.log(absences);
    // {
    //     absences: [],
    //     delays: [],
    //     punishments: [],
    //     other: [],
    //     totals: [
    //         { subject: 'Matière', hoursAssisted: 21, hoursMissed: 0 },
    //     ]
    // }
    // const infos = await session.infos();
    // console.log(infos);
    // {
    //     date: 2020-11-16T23:00:00.000Z,
    //     title: 'Titre',
    //     author: 'Autheur',
    //     content: 'Message',
    //     htmlContent: '<div style="font-family: arial,helvetica,sans-serif; font-size: 13px;">bonjour,</div>\n' +
    //       '<div style="font-family: arial,helvetica,sans-serif; font-size: 13px;">&nbsp;</div>',
    //     files: []
    // }
    const evaluations = await session.evaluations();
    console.log(evaluations);
    const menu = await session.menu();
    console.log(menu);
}
console.log("Starting main ...");
main();
