const express = require('express');
const app = express();
const input = require("input");
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.set('trust proxy', 1);
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
////PORTA//////  
const PORT = process.env.PORT || 3000;
////

const Grupos = [
	{ chat: "FAMILIACNXCONTINENCIAOFC", bot: "MkBuscasRobot" },
];

const apiId = "25057134"; //https://my.telegram.org/auth
const apiHash = "5c799e82f514aa2adefc8eb4403cfb9c"; //https://my.telegram.org/auth
const stringSession = new StringSession("1AQAOMTQ5LjE1NC4xNzUuNTIBuwJFHqgTEhekd7ZRsHKuOrCyOb6rNaCjPF+rzU2N7+vAw9vUgG7hJ5jr4apqWbDLY7VVMAkHbqjxovM/AWSV2vCAr+ObmUA8yUD2sDgsRZ8p7571VSQqcRTJtY2I8SmBso67OkV4jKzPgDCeKRIZjY32M9+DbwwoPTInaWWdGx392OFD7MIG9jgjH48V+3JKBj6VWAxuOvSio2wWWW9I6GRe7GVMqFaZdsZ72lkiLBVOXeMqIOcxzevv10l4MylYrCikIKrUAzUgcbt45pSB4Dy1q1HdjMZ5e34iE+dlGPAhlIOr6xylElDkCGptolFeDzoLnJTufuUsn0QyDEJh+hM=")

const telegram = new TelegramClient(stringSession, apiId, apiHash, {
	connectionRetries: 5
});

(async () => {
	await telegram.start({
		phoneNumber: "5511934607147", //numero tel
		password: async () => await input.text("insira sua senha: "),
		phoneCode: async () =>
			await input.text("Insira o codigo recebido no seu telegram: "),
		onError: (err) => console.log(err)
	});
	console.log("TELEGRAM: Conectado com sucesso!");
	console.log(telegram.session.save());
	await telegram.sendMessage("me", { message: "To Online!" });
})();


 

app.get("/:type/:q/", async (req, res) => {
	var db = JSON.parse(fs.readFileSync("db.json"));
    var achou2 = false;
	const type = req.params.type.toLowerCase() || '';
	const query = req.params.q.toLowerCase() || '';
 if (!query) return res.json({
                 status: true,
                 
               "resultado": { 
               "str": "[❌] Ensira o tipo de consulta [❌]"
               }
             })
 if (type.search(/cpf1|cpf2|cpf3|cpf4|tel1|tel2|tel3|cnpj|score|nome|parentes|beneficios|placa1|vizinhos|site|ip|cep|bin|email/) === -1) return res.send('Tipo de consulta invalida');
	console.log(`[CONSULTA] : ${type} = ${query}`);
	if (db && db[type] && db[type][query]) return res.send(db[type][query]);
	
	const Consultar = {
		nego() {
			if (query.length != 11) return res.json({err:'O CPF deve conter 11 digitos!'})

			telegram.sendMessage(Grupos[0].chat, {
				message: `/cpf2 ${query}`
			})
				.catch((e) => res.json({
                 status: true,
                 
               "resultado": { 
               "str": "[❌] Não foi possível fazer consulta.[❌]"
               }
             })
				);
		}
	}
	if (Consultar[type]) Consultar[type]();
	else await telegram.sendMessage(Grupos[0].chat, {
		message: `/${type} ${query}`
	})
		.catch((e) =>{
			res.json({
                 status: true,
                 
               "resultado": { 
               "str": "[❌] Não foi possível fazer consulta.[❌]"
               }
             })
			
			console.log("DEBUG NO CÓDIGO:",e)
		});
	async function OnMsg(event) {
		const message = event.message;
		const textPure =
			message && message.text ?
			message.text :
			message && message.message ?
			message.message : '';
		const text =
			message && message.text ?
			message.text.toLowerCase() :
			message && message.message ?
			message.message.toLowerCase() : '';
		const msgMarked = await message.getReplyMessage();
		const msgMarkedText =
			msgMarked && msgMarked.text ?
			msgMarked.text.toLowerCase() :
			msgMarked && msgMarked.message ?
			msgMarked.message.toLowerCase() : '';
		const sender = await message.getSender();
		const senderId = sender && sender.username ? sender.username : '';
		const chat = await message.getChat();
		const chatId = chat && chat.username ? chat.username : '';
		msgggveri = msgMarkedText.replace(/\/|-|\.|\`|\*/g, '').toLowerCase()
				queryverii = query.replace(/\/|-|\.|\`|\*/g, '').toLowerCase()
				txtuuuveri = text.replace(/\/|-|\.|\`|\*/g, '').toLowerCase()
		for (let i of Grupos) {
			try {
				if ((chatId == i.chat && senderId == i.bot) && (msgggveri.includes(queryverii) || txtuuuveri.includes(queryverii) )) {
					achou2 = true;
					await telegram.markAsRead(chat);
					//console.log(`text: ${textPure}, msgMarked: ${msgMarkedText}`)
					if (text.includes("⚠️"))return res.json({
                 status: true,
                 
               "resultado": { 
               "str": "[⚠️] INVALIDO! [⚠️]"
               }
             })
					if (text.includes("Inválido") || text.includes("INVÁLIDO"))
						res.json({
                 status: true,
                 
               "resultado": { 
               "str": "[⚠️] INVALIDO! [⚠️]"
               }
             })
					
				}
				
				if ((chatId == i.chat && senderId == i.bot) && (msgggveri.includes(queryverii) || txtuuuveri.includes(queryverii) )) {
					achou2 = true;
					await telegram.markAsRead(chat);
					let str = textPure;
					str = str.replace(/\*/gi, "");
					str = str.replace(/\`/gi, "");
					str = str.replace(/\+/gi, "");
					str = str.replace(/\[/gi, "");
					str = str.replace(/\]/gi, "");
					str = str.replace(/\(/gi, "");
					str = str.replace(/\)/gi, "");	
					str = str.replace(/\•/gi, "");	
					str = str.replace(/\n\n\n/gi, "\n\n");
					str = str.replace(/CONSULTA DE CPF 2 \n\n/gi, "CONSULTA DE CPF ");
					str = str.replace(/🔍 CONSULTA DE CPF1 COMPLETA 🔍/gi, "CONSULTA DE CPF ");
					str = str.replace(/🔍 CONSULTA DE CPF3 COMPLETA 🔍/gi, "CONSULTA DE CPF ");
					str = str.replace(/🔍 CONSULTA DE CPF 4 🔍/gi, "CONSULTA DE CPF ");
                    str = str.replace(/BY: @MkBuscasRobot/gi, "");
					str = str.replace(/\n\nUSUÁRIO: matheus/gi, '');
					str = str.replace(/USUÁRIO: matheus\n\n/gi, '');
					str = str.replace(/ USUÁRIO: matheus/gi, '');
					str = str.replace(/🔍|V1|V2/gi, '');
					str = str.replace(/COMPLETA/gi, '');
					str = str.replace(/CONSULTA DE CPF 2/gi, 'CONSULTA DE CPF');
					str = str.replace(/\n\nBY: @MkBuscasRobot/gi, "");
					str = str.replace(/\n\nREF: @refmkbuscas/gi, '');
					str = str.replace(/\nREF: @refmkbuscas/gi, '');
					str = str.replace(/REF: @refmkbuscas/gi, '');
					str = str.replace(/EMPTY/gi, "");
					str = str.replace(/\n\n\n\n/gi, "\n\n");
					str = str.replace(/USUÁRIO: matheus/gi, '');
					str = str.replace(/COMPLETA/gi, '');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗖𝗣𝗙\n\n/gi, '');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗣𝗟𝗔𝗖𝗔\n\n/gi, '');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗧𝗘𝗟𝗘𝗙𝗢𝗡𝗘\n\n/gi, '');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗡𝗢𝗠𝗘\n\n/gi, '');					
			

				

					let json = {};
					const linhas = str.split("\n");
					for (const t of linhas) {
						const key = t.split(": ");
						key[0] = key[0]
							.replace(/\//g, " ")
							.toLowerCase()
							.replace(/(?:^|\s)\S/g, function (a) {
								return a.toUpperCase();
							})
							.replace(/ |•|-|•|/g, "");
						json[key[0]] = key[1];
					}
					if (db && db[type]) db[type][query] = str;
					else db[type] = {}, db[type][query] = str;
					fs.writeFileSync("db.json", JSON.stringify(db, null, "\t"));
					
					
					res.json({
                 status: true,
                 
               "resultado": { 
               str
               }
             })
				} 
				return;
			} catch (e) {
				if (achou2) return;
				res.json({
                 status: true,
                 
               "resultado": { 
               "str": "[❌]error no servidor, não foi possivel fazer a consulta[❌]"
               }
             })
				console.log(e);
			}
		}
	}
	telegram.addEventHandler(OnMsg, new NewMessage({}));
	setTimeout(() => {
		if (achou2) return;
		res.json({
                 status: true,
                 
               "resultado": { 
               "str": "[⏳]servidor demorou muito para responder[⏳]"
               }
             })
	}, 5000);
});	

app.get('/', async(req, res, next) => {
   return res.status(200).send({
    status: false,
    MENSAGEM: 'APIS ONLINE, E O PAULO NE VIDA KS'
  });
  })

app.listen(PORT, () => {
    console.log(`Aplicativo rodando na url: http://localhost:${PORT}`);
  });

  let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(`Arquivo Atualizado ${__filename}`)
    delete require.cache[file]
    require(file)
})