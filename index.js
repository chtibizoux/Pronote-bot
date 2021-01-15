const fs = require("fs");
const pronote = require('pronote-api');
const discord = require("discord.js");
const { createCanvas, loadImage } = require('canvas');
// Admins
var admins = ["605304691227885599"];
// Maintenance
var maintenance = false;
// Users Logins
var users = JSON.parse(fs.readFileSync("./users.json", "utf8"));
// Discord
const bot = new discord.Client();
if (!fs.existsSync("config.json")) {
    console.error("Please create config.json file config.json.exemple is an exemple");
}
var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

bot.on('ready', () => {
  console.log("This Bot is online!");
  bot.user.setActivity("type +help");
});
var noconnection = ":slight_frown: Désoler tu ne t'est pas connecté à pronote\nPour te connecter envoie moi un message privé ou tape `+login`!";
var noconnection2 = ":slight_frown: Désoler tu ne t'est pas connecté à pronote\n**Les commandes ont été désactiver à ceux qui ne sont pas connecter pour éviter les abus...**\nPour te connecter envoie moi un message privé ou tape `+login`!";
bot.on("message", (message) => {
    if (maintenance) {
        var admin = false;
        for (var i = 0; i < admins.length; i++) {
            if (message.author.id === admins[i]) {
                admin = true;
                break;
            }
        }
        if (!admin) return;
    }
    if (message.channel.type === "dm") {
        if (message.author.id !== bot.user.id) {
            dm(message);
        }
    } else {
        var noUser = true;
        if (message.content.startsWith("+help")) {
            message.channel.send("**Attention ce bot est lent!!!**\nPour te connecter ou te déconnecter envoie moi un message privé ou tape `+login`!\n`+timetable @user` Afficher l'emploie du temps de *user*\n`+info @user` affiche les informations de *user*\n`+saverage` affiche ta moyenne\n`+caverage` affiche la moyenne de ta classe\n`+all` affiche le contenu de tes cours et tes devoirs pour cette semaine (Pour le confinement)\n`+homeworks 17/05/2020 20/05/2020` affiche tes devoirs du `17/05/2020` au `20/05/2020`\n`+contents 17/05/2020 20/05/2020` affiche le contenu de tes cours du `17/05/2020` au `20/05/2020`\n`+marks` affiche tes notes\n`+evaluations` **bientôt disponible** ~~affiche tes compétences~~");
        }else if (message.content.startsWith("+login")) {
            message.react("👍");
            dm(message);
        }else if (message.content.startsWith("+timetable")) {
            if (message.content.includes("<@") && message.content.includes(">")) {
                var id = message.content.slice(message.content.indexOf("<@") + 2,message.content.indexOf(">"));
                for (var i = 0; i < users.length; i++) {
                    if (users[i].discordID === id) {
                        noUser = false;
                        // Security
                        var noUser2 = true;
                        for (var y = 0; y < users.length; y++) {
                            if (users[y].discordID === message.author.id) {
                                noUser2 = false;
                                timetable(users[i].url, users[i].username, users[i].password, users[i].cas, message, id);
                            }
                        }
                        if (noUser2 === true) {
                            message.reply(noconnection2);
                        }
                    }
                }
                if (noUser === true) {
                    message.channel.send(message.content.slice(message.content.indexOf("<@"),message.content.indexOf(">") + 1) + " ne c'est pas connecter à pronote :slight_frown:");
                }
            }else {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].discordID === message.author.id) {
                        noUser = false;
                        timetable(users[i].url, users[i].username, users[i].password, users[i].cas, message, message.author.id);
                    }
                }
                if (noUser === true) {
                    message.reply(noconnection);
                }
            }
        }else if (message.content.startsWith("+info")) {
            if (message.content.includes("<@") && message.content.includes(">")) {
                var id = message.content.slice(message.content.indexOf("<@") + 2,message.content.indexOf(">"));
                for (var i = 0; i < users.length; i++) {
                    if (users[i].discordID === id) {
                        noUser = false;
                        // Security
                        var noUser2 = true;
                        for (var y = 0; y < users.length; y++) {
                            if (users[y].discordID === message.author.id) {
                                noUser2 = false;
                                info(users[i].url, users[i].username, users[i].password, users[i].cas, message, id);
                            }
                        }
                        if (noUser2 === true) {
                            message.reply(noconnection2);
                        }
                    }
                }
                if (noUser === true) {
                    message.channel.send(message.content.slice(message.content.indexOf("<@"),message.content.indexOf(">") + 1) + " ne c'est pas connecter à pronote :slight_frown:");
                }
            }else {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].discordID === message.author.id) {
                        noUser = false;
                        info(users[i].url, users[i].username, users[i].password, users[i].cas, message, message.author.id);
                    }
                }
                if (noUser === true) {
                    message.reply(noconnection);
                }
            }
        }else if (message.content.startsWith("+saverage")) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].discordID === message.author.id) {
                    noUser = false;
                    saverage(users[i].url, users[i].username, users[i].password, users[i].cas, message);
                }
            }
            if (noUser === true) {
                message.reply(noconnection);
            }
        }else if (message.content.startsWith("+caverage")) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].discordID === message.author.id) {
                    noUser = false;
                    caverage(users[i].url, users[i].username, users[i].password, users[i].cas, message);
                }
            }
            if (noUser === true) {
                message.reply(noconnection);
            }
        }else if (message.content.startsWith("+marks")) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].discordID === message.author.id) {
                    noUser = false;
                    marks(users[i].url, users[i].username, users[i].password, users[i].cas, message);
                }
            }
            if (noUser === true) {
                message.reply(noconnection);
            }
        }else if (message.content.startsWith("+homeworks")) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].discordID === message.author.id) {
                    noUser = false;
                    homeworks(users[i].url, users[i].username, users[i].password, users[i].cas, message);
                }
            }
            if (noUser === true) {
                message.reply(noconnection);
            }
        }else if (message.content.startsWith("+contents")) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].discordID === message.author.id) {
                    noUser = false;
                    contents(users[i].url, users[i].username, users[i].password, users[i].cas, message);
                }
            }
            if (noUser === true) {
                message.reply(noconnection);
            }
        }else if (message.content.startsWith("+all")) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].discordID === message.author.id) {
                    noUser = false;
                    all(users[i].url, users[i].username, users[i].password, users[i].cas, message);
                }
            }
            if (noUser === true) {
                message.reply(noconnection);
            }
        }else if (message.content.startsWith("+test")) {
            message.channel.send("test");
        }
    }
});
var loginforms = [];
function dm(message) {
    noUser = true;
    for (var i = 0; i < users.length; i++) {
        if (users[i].discordID === message.author.id) {
            noUser = false;
            message.author.send("Voulez vous vous déconnecter ?").then((sent) => {
                sent.react('✅');
                sent.react('🚫');
            });
        }
    }
    if (noUser === true) {
        var inForm = false;
        for (var i = 0; i < loginforms.length; i++) {
            if (loginforms[i].id === message.author.id) {
                inForm = true;
                if (loginforms[i].step === 0) {
                    loginforms[i].url = message.content.slice(0, message.content.indexOf("/pronote/") + 9);
                    message.author.send("2. De quelle accadémie (CAS) est tu ? (Ex: ac-nantes)\n__**Académies disponibles :**__ ||Académie d'Orleans-Tours (CAS : ac-orleans-tours)\nAcadémie de Besançon (CAS : ac-besancon)\nAcadémie de Bordeaux (CAS : ac-bordeaux)\nAcadémie de Caen (CAS : ac-caen)\nAcadémie de Clermont-Ferrand (CAS : ac-clermont)\nAcadémie de Dijon (CAS : ac-dijon)\nAcadémie de Grenoble (CAS : ac-grenoble)\nAcadémie de Lille (CAS : ac-lille)\nAcadémie de Limoges (CAS : ac-limoges)\nAcadémie de Lyon (CAS : ac-lyon)\nAcadémie de Montpellier (CAS : ac-montpellier)\nAcadémie de Nancy-Metz (CAS : ac-nancy-metz)\nAcadémie de Nantes (CAS : ac-nantes)\nAcadémie de Poitiers (CAS : ac-poitiers)\nAcadémie de Reims (CAS : ac-reims)\nAcadémie de Rouen (Arsene76) (CAS : arsene76)\nAcadémie de Rouen (CAS : ac-rouen)\nAcadémie de Strasbourg (CAS : ac-strasbourg)\nAcadémie de Toulouse (CAS : ac-toulouse)\nENT \"Agora 06\" (Nice) (CAS : agora06)\nENT \"Haute-Garonne\" (CAS : haute-garonne)\nENT \"Hauts-de-France\" (CAS : hdf)\nENT \"La Classe\" (Lyon) (CAS : laclasse)\nENT \"Lycee Connecte\" (Nouvelle-Aquitaine) (CAS : lyceeconnecte)\nENT \"Seine-et-Marne\" (CAS : seine-et-marne)\nENT \"Somme\" (CAS : somme)\nENT \"Toutatice\" (Rennes) (CAS : toutatice)\nENT \"Île de France\" (CAS : iledefrance)||");
                    loginforms[i].step = 1;
                }else if (loginforms[i].step === 1){
                    loginforms[i].cas = message.content;
                    message.author.send("3. Nom d'utilisateur (prenom.nom)");
                    loginforms[i].step = 2;
                }else if (loginforms[i].step === 2) {
                    loginforms[i].username = message.content;
                    message.author.send("4. Mot de passe");
                    loginforms[i].step = 3;
                }else if (loginforms[i].step === 3) {
                    loginforms[i].password = message.content;
                    login(loginforms[i].url, loginforms[i].username, loginforms[i].password, loginforms[i].cas, message);
                    loginforms.splice(i, 1);
                }
            }
        }
        if (inForm === false) {
            message.author.send("1. Envoie moi l'url du site pronote de ton établissement !", {files: ["./images/tuto1.jpg"]});
            loginforms.push({id: message.author.id, step: 0});
        }
    }
}

async function timetable(url, username, password, cas, message, id)
{
    const session = await pronote.login(url, username, password, cas);
    var timetableDate = new Date();
    timetableDate.setHours(0);
    const timetable = await session.timetable(timetableDate);
    // Date
    if (timetable[0]) {
        var date = new Date(timetable[0].from);
    }else {
        var date = new Date();
    }
    showTimetable(timetable, date, message, id);
}

async function updateTimetable(message, direction)
{
    var id = message.content.slice(message.content.indexOf("<@") + 2,message.content.indexOf(">"));
    for (var x = 0; x < users.length; x++) {
        if (users[x].discordID === id) {
            const session = await pronote.login(users[x].url, users[x].username, users[x].password, users[x].cas);
            var messageDate = message.content.slice(message.content.indexOf("Date: ") + 6);
            var timetableDate = new Date();
            var splitDate = messageDate.split("/");

            timetableDate.setHours(0);
            timetableDate.setFullYear(parseInt(splitDate[2]));
            timetableDate.setMonth(parseInt(splitDate[1]) - 1);
            timetableDate.setDate(parseInt(splitDate[0]) + direction);
            const timetable = await session.timetable(timetableDate);
            // Date
            if (timetable[0]) {
                var date = new Date(timetable[0].from);
            }else {
                var date = timetableDate;
            }
            showTimetable(timetable, date, message, id);
        }
    }
}
async function showTimetable(timetable, date, message, id)
{
    var timetableDate = "\nDate: " + date.getDate() + "/" + (parseInt(date.getMonth()) + 1) + "/" + date.getFullYear();

    var border = 20;
    var height = 100;
    var width = 300;
    var fontSize = 14;
    var canvas = createCanvas(width + 20 + (border * 2), height * 10 + fontSize + (border * 2));
    var ctx = canvas.getContext('2d');
    ctx.font = fontSize + 'px Arial';

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Cadriage
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = 'rgba(0,0,0,1)'
    for (var i = 0; i < 11; i++) {
        ctx.fillText(8 + i + "h", border, fontSize + (height * i) + border)
        ctx.beginPath()
        ctx.lineTo(30 + border, (fontSize / 2) + (height * i) + border)
        ctx.lineTo(canvas.width - border, (fontSize / 2) + (height * i) + border)
        ctx.stroke()
    }
    ctx.beginPath()
    ctx.lineTo(30 + border, (fontSize / 2) + border)
    ctx.lineTo(30 + border, canvas.height - (fontSize / 2) - border)
    ctx.stroke()
    ctx.beginPath()
    ctx.lineTo(canvas.width - 1 - border, (fontSize / 2) + border)
    ctx.lineTo(canvas.width - 1 - border, canvas.height - (fontSize / 2) - border)
    ctx.stroke()

    ctx.textAlign = "center";
    for (var i = 0; i < timetable.length; i++) {
        // Create background color
        var from = new Date(timetable[i].from);
        var to = new Date(timetable[i].to);

        var squareY = ((from.getHours() - 8) + (from.getMinutes() / 60)) * height + (fontSize / 2);
        var squareHeight = ((to.getHours() - from.getHours()) + ((to.getMinutes() - from.getMinutes()) / 60)) * height;

        ctx.fillStyle = timetable[i].color;
        ctx.fillRect(30 + 1 + border, squareY + border, width - 3 - (border / 2), squareHeight);

        // Create text
        ctx.fillStyle = "#000000";

        if (timetable[i].isCancelled) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(30 + 1 + border, squareY + border, width - 3, fontSize);
            ctx.fillStyle = "#000000";
            ctx.fillText("Supprimer", width / 2 + 30 + border, squareY + fontSize + border);
        }
        if (timetable[i].isAway) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(30 + 1 + border, squareY + border, width - 3, fontSize);
            ctx.fillStyle = "#000000";
            ctx.fillText("Professeur absent", width / 2 + 30 + border, squareY + fontSize + border);
        }
        if (timetable[i].isDetention) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(30 + 1 + border, squareY + border, width - 3, fontSize);
            ctx.fillStyle = "#000000";
            ctx.fillText("Retenu", width / 2 + 30 + border, squareY + fontSize + border);
        }
        if (timetable[i].hasDuplicate) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(30 + 1 + border, squareY + border, width - 3, fontSize);
            ctx.fillStyle = "#000000";
            ctx.fillText("Dupliquer", width / 2 + 30 + border, squareY + fontSize + border);
        }
        ctx.fillText(timetable[i].subject, width / 2 + 30 + border, squareY + (squareHeight / 2) + fontSize * -1 + border);
        ctx.fillText(timetable[i].teacher, width / 2 + 30 + border, squareY + (squareHeight / 2) + fontSize * 0 + border);
        if (timetable[i].room !== null) {
            ctx.fillText(timetable[i].room, width / 2 + 30 + border, squareY + (squareHeight / 2) + fontSize * 1 + border);
        }
    }
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./images/timetable.jpg', buffer);
    // create image
    message.channel.send("Emploie du temps de <@" + id + ">:" + timetableDate, {files: ["./images/timetable.jpg"]}).then((sent) => {
        sent.react("⬅️");
        sent.react("➡️");
    });
}

async function info(url, username, password, cas, message, id)
{
    const session = await pronote.login(url, username, password, cas);
    var groups = "";
    for (var i = 0; i < session.user.groups.length; i++) {
        groups += "\n" + session.user.groups[i].name;
    }
    message.channel.send("Information de <@" + id + ">:\nNom pronote: " + session.user.name + "\nClasse: " + session.user.studentClass.name + "\nGroupes:```" + groups + "\n```Information de l'établissement:\n" + session.user.establishmentsInfo[0].name + "\n" + session.user.establishmentsInfo[0].website + "\n" + session.user.establishmentsInfo[0].address + "\n" + session.user.establishmentsInfo[0].postalCode + "\n" + session.user.establishmentsInfo[0].city + "\n" + session.user.establishmentsInfo[0].country);
}

async function saverage(url, username, password, cas, message)
{
    const session = await pronote.login(url, username, password, cas);
    const marks = await session.marks();
    var average = Math.round(marks.averages.student * 100) / 100;
    message.channel.send("Tu a " + average + " de moyenne.");
}
async function caverage(url, username, password, cas, message)
{
    const session = await pronote.login(url, username, password, cas);
    const marks = await session.marks();
    var average = Math.round(marks.averages.studentClass * 100) / 100;
    message.channel.send("Tu a " + average + " de moyenne.");
    message.channel.send("Ta classe a " + average + " de moyenne.");
}

async function marks(url, username, password, cas, message)
{
    const session = await pronote.login(url, username, password, cas);
    const marks = await session.marks();
    for (var i = 0; i < marks.subjects.length; i++) {
        var marksText = "";
        marksText += "\n" + marks.subjects[i].name + ":\nMoyenne: " + marks.subjects[i].averages.student + "\nMoyenne de la classe: " + marks.subjects[i].averages.studentClass + "\nMeilleur note: " + marks.subjects[i].averages.max + "\nMoins bonne note: " + marks.subjects[i].averages.min + "\n";
        for (var y = 0; y < marks.subjects[i].marks.length; y++) {
            marksText += marks.subjects[i].marks[y].title + ":```\nNote: " + marks.subjects[i].marks[y].value + "/" + marks.subjects[i].marks[y].scale + "\nMoyenne de la classe: " + marks.subjects[i].marks[y].average + "\nMeilleur note: " + marks.subjects[i].marks[y].max + "\nMoins bonne note: " + marks.subjects[i].marks[y].min + "\n```";
        }
        if (marksText !== "") {
            message.channel.send(marksText);
        }
    }
}

async function homeworks(url, username, password, cas, message)
{
    const session = await pronote.login(url, username, password, cas);
    var messageDate = message.content.slice(11);
    var splitDates = messageDate.split(" ");
    var homeworksFrom = new Date();
    homeworksFrom.setHours(0);
    if (splitDates.length !== 0) {
        var splitFrom = splitDates[0].split("/");
        if (splitFrom.length === 3) {
            homeworksFrom.setFullYear(parseInt(splitFrom[2]));
            homeworksFrom.setMonth(parseInt(splitFrom[1])-1);
            homeworksFrom.setDate(parseInt(splitFrom[0]));
        }
    }
    var homeworksTo = null;
    if (splitDates.length === 2) {
        var splitTo = splitDates[1].split("/");
        if (splitTo.length === 3) {
            var homeworksTo = new Date();
            homeworksTo.setHours(0);
            homeworksTo.setFullYear(parseInt(splitTo[2]));
            homeworksTo.setMonth(parseInt(splitTo[1])-1);
            homeworksTo.setDate(parseInt(splitTo[0]));
        }
    }
    const homeworks = await session.homeworks(homeworksFrom, homeworksTo);
    for (var i = 0; i < homeworks.length; i++) {
        var givenAt = new Date(homeworks[i].givenAt);
        var homeworksFor = new Date(homeworks[i].for);
        var homeworksText = "\n__**" + homeworks[i].subject + "**__\n" + homeworks[i].description + "\nDonner le: " + givenAt.getDate() + "/" + (parseInt(givenAt.getMonth()) + 1) + "/" + givenAt.getFullYear() + "\nPour le: " + homeworksFor.getDate() + "/" + (parseInt(homeworksFor.getMonth()) + 1) + "/" + homeworksFor.getFullYear() + "\n";
        if (homeworks[i].done) {
            homeworksText += "Fait\n";
        } else {
            homeworksText += "Pas encore fait\n";
        }
        if (homeworks[i].files.length > 0) {
            homeworksText += "Documents: ";
            for (var y = 0; y < homeworks[i].files.length; y++) {
                homeworksText += "\n" + homeworks[i].files[y].name + ": " + homeworks[i].files[y].url;
            }
        }
        if (homeworksText !== "") {
            message.channel.send(homeworksText);
        }
    }
    if (homeworks.length === 0) {
        if (homeworksTo) {
            message.channel.send("Tu n'a pas de devoirs entre le " + homeworksFrom.getDate() + "/" + (parseInt(homeworksFrom.getMonth()) + 1) + "/" + homeworksFrom.getFullYear() + " et le " + homeworksTo.getDate() + "/" + (parseInt(homeworksTo.getMonth()) + 1) + "/" + homeworksTo.getFullYear());
        }else{
            message.channel.send("Tu n'a pas de devoirs le " + homeworksFrom.getDate() + "/" + (parseInt(homeworksFrom.getMonth()) + 1) + "/" + homeworksFrom.getFullYear());
        }
    }
}

async function contents(url, username, password, cas, message)
{
    const session = await pronote.login(url, username, password, cas);
    var messageDate = message.content.slice(10);
    var splitDates = messageDate.split(" ");
    var contentsFrom = new Date();
    contentsFrom.setHours(0);
    if (splitDates.length !== 0) {
        var splitFrom = splitDates[0].split("/");
        if (splitFrom.length === 3) {
            contentsFrom.setFullYear(parseInt(splitFrom[2]));
            contentsFrom.setMonth(parseInt(splitFrom[1])-1);
            contentsFrom.setDate(parseInt(splitFrom[0]));
        }
    }
    var contentsTo = null;
    if (splitDates.length === 2) {
        var splitTo = splitDates[1].split("/");
        if (splitTo.length === 3) {
            var contentsTo = new Date();
            contentsTo.setHours(0);
            contentsTo.setFullYear(parseInt(splitTo[2]));
            contentsTo.setMonth(parseInt(splitTo[1])-1);
            contentsTo.setDate(parseInt(splitTo[0]));
        }
    }
    const contents = await session.contents(contentsFrom, contentsTo);
    for (var i = 0; i < contents.length; i++) {
        var from = new Date(contents[i].from);
        var to = new Date(contents[i].to);
        var contentsText = "\n__**" + contents[i].subject + "**__\nProfesseurs: ";
        for (var y = 0; y < contents[i].teachers.length; y++) {
            contentsText += contents[i].teachers[y] + ", ";
        }
        contentsText = contentsText.slice(0, contentsText.length - 2);
        if (contents[i].title) {
            contentsText += "\n__" + contents[i].title + "__";
        }
        contentsText += "\n" + contents[i].description + "\nLe: " + from.getDate() + "/" + (parseInt(from.getMonth()) + 1) + "/" + from.getFullYear() + " De: " + from.getHours() + ":" + from.getMinutes() + " À: " + to.getHours() + ":" + to.getMinutes() + "\n";
        if (contents[i].files.length > 0) {
            contentsText += "Documents: ";
            for (var y = 0; y < contents[i].files.length; y++) {
                contentsText += "\n" + contents[i].files[y].name + ": " + contents[i].files[y].url;
            }
        }
        if (contentsText !== "") {
            message.channel.send(contentsText);
        }
    }
    if (contents.length === 0) {
        if (homeworksTo) {
            message.channel.send("Tu n'a pas de contenu de cours entre le " + contentsFrom.getDate() + "/" + (parseInt(contentsFrom.getMonth()) + 1) + "/" + contentsFrom.getFullYear() + " et le " + contentsTo.getDate() + "/" + (parseInt(contentsTo.getMonth()) + 1) + "/" + contentsTo.getFullYear());
        }else{
            message.channel.send("Tu n'a pas de contenu de cours le " + contentsFrom.getDate() + "/" + (parseInt(contentsFrom.getMonth()) + 1) + "/" + contentsFrom.getFullYear());
        }
    }
}

async function all(url, username, password, cas, message)
{
    const session = await pronote.login(url, username, password, cas);
    var allFrom = new Date();
    allFrom.setDate(allFrom.getDate() - allFrom.getDay() + (allFrom.getDay() == 0 ? -6:1));
    allFrom.setHours(0);
    var allTo = new Date();
    allTo.setDate(allTo.getDate() + (6 - allTo.getDay() + (allTo.getDay() == 0 ? -6:1)));
    allTo.setHours(0);
    const homeworks = await session.homeworks(allFrom, allTo);
    const contents = await session.contents(allFrom, allTo);
    for (var i = 0; i < contents.length; i++) {
        var from = new Date(contents[i].from);
        var to = new Date(contents[i].to);
        var allText = "\n__**" + contents[i].subject + "**__\n" + contents[i].description + "\nLe: " + from.getDate() + "/" + (parseInt(from.getMonth()) + 1) + "/" + from.getFullYear() + " De: " + from.getHours() + ":" + from.getMinutes() + " À: " + from.getHours() + ":" + from.getMinutes() + "\n";
        if (contents[i].files.length > 0) {
            allText += "Documents: ";
            for (var y = 0; y < contents[i].files.length; y++) {
                allText += "\n" + contents[i].files[y].name + ": " + contents[i].files[y].url;
            }
        }
        if (allText !== "") {
            message.channel.send(allText);
        }
    }
    for (var i = 0; i < homeworks.length; i++) {
        var givenAt = new Date(homeworks[i].givenAt);
        var homeworksFor = new Date(homeworks[i].for);
        var allText = "\n__**" + homeworks[i].subject + "**__\n" + homeworks[i].description + "\nDonner le: " + givenAt.getDate() + "/" + (parseInt(givenAt.getMonth()) + 1) + "/" + givenAt.getFullYear() + "\nPour le: " + homeworksFor.getDate() + "/" + (parseInt(homeworksFor.getMonth()) + 1) + "/" + homeworksFor.getFullYear() + "\n";
        if (homeworks[i].done) {
            allText += "Fait\n";
        } else {
            allText += "Pas encore fait\n";
        }
        if (homeworks[i].files.length > 0) {
            allText += "Documents: ";
            for (var y = 0; y < homeworks[i].files.length; y++) {
                allText += "\n" + homeworks[i].files[y].name + ": " + homeworks[i].files[y].url;
            }
        }
        if (allText !== "") {
            message.channel.send(allText);
        }
    }
    if (homeworks.length === 0 && contents.length === 0) {
        message.channel.send("Tu n'a pas de devoirs entre le " + allFrom.getDate() + "/" + (parseInt(allFrom.getMonth()) + 1) + "/" + allFrom.getFullYear() + " et le " + allTo.getDate() + "/" + (parseInt(allTo.getMonth()) + 1) + "/" + allTo.getFullYear());
    }
}

async function login(url, username, password, cas, message)
{
    const session = await pronote.login(url, username, password, cas);
    users.push({
        discordID: message.author.id,
        url: url,
        username: username,
        password: password,
        cas: cas
    });
    fs.writeFileSync('./users.json', JSON.stringify(users));
    message.author.send("Tu as bien été connecter");

    // const timetable = await session.timetable(); // Récupérer l'emploi du temps d'aujourd'hui
    // console.log(`L'élève a ${timetable.length} cours aujourd'hui`);
    // const marks = await session.marks(); // Récupérer les notes du trimestre
    // console.log(`et a pour l'instant une moyenne de ${marks.averages.student} ce trimestre.`);

    // champs: 'user' et 'params'
    // fonctions: 'timetable', 'marks', 'contents', 'evaluations', 'absences', 'infos' et 'menu'

    // console.log(session.user);
    // console.log(session.params);

    // const timetable = await session.timetable();
    // console.log(timetable);
    // const marks = await session.marks();
    // console.log(marks);
    // const contents = await session.contents();
    // console.log(contents);
    // const evaluations = await session.evaluations();
    // console.log(evaluations);
    // const absences = await session.absences();
    // console.log(absences);
    // const infos = await session.infos();
    // console.log(infos);
    // const homeworks = await session.homeworks();
    // console.log(homeworks);
    // const menu = await session.menu();
    // console.log(menu);
}
login().catch(err => {
    if (err.code === pronote.errors.WRONG_CREDENTIALS.code) {
        console.error('Mauvais identifiants');
    } else {
        console.error(err);
    }
});

bot.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channel.type === "dm") {
        if (reaction.message.author.id === bot.user.id) {
            if (user.id != bot.user.id) {
                if (reaction.emoji.name === "✅") {
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].discordID === user.id) {
                            users.splice(i, 1);
                            fs.writeFileSync('./users.json', JSON.stringify(users));
                        }
                    }
                    reaction.message.channel.send("Vous avez été déconnecter");
                }else if (reaction.emoji.name === "🚫") {
                    reaction.message.channel.send("Votre compte à été garder de justesse !");
                }
            }
        }
    }else {
        if (reaction.message.author.id === bot.user.id) {
            if (user.id != bot.user.id) {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].discordID === user.id) {
                        if (reaction.emoji.name === "⬅️") {
                            reaction.message.delete();
                            updateTimetable(reaction.message, -1);
                        }else if (reaction.emoji.name === "➡️") {
                            reaction.message.delete();
                            updateTimetable(reaction.message, 1);
                        }
                    }
                }
            }
        }
    }
});

bot.login(config.token);
